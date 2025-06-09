import "./lushu.js";
export class TrafficRouteMap {
    /**
     * 交通路线地图管理器
     * @param {string} containerId - 地图容器ID
     * @param {Object} options - 配置选项
     * @param {BMap.Point} options.centerPoint - 地图中心点坐标
     * @param {number} options.zoomLevel - 初始缩放级别
     * @param {string} options.carIconUrl - 路书车辆图标路径
     * @param {string} options.markerIconUrl - 标注点图标路径
     * @param {string} options.trailStartUrl - 路径起点图标路径
     * @param {string} options.trailEndUrl - 路径终点图标路径
     */
    constructor(containerId, options = {}) {
        // 地图实例
        this.map = new BMap.Map(containerId, {
            minZoom: 5,
            maxZoom: 20,
        });
        // 配置参数
        this.options = Object.assign({
            centerPoint: new BMap.Point(116.404, 39.915),
            zoomLevel: 12,
            carIconUrl: "/static/images/trafficMap/car.png",
            trailStartUrl: "/static/images/trafficMap/start.png",
            trailEndUrl: "/static/images/trafficMap/end.png",
        }, options);

        // 初始化地图
        this._initMap();
        // 核心组件
        this.lushu = null;          // 路书实例
        this.activeLabel = null;    // 当前激活的标签
        this.activeLabelData = null;
        this.currentInfoBox = null; // 当前信息窗口
        this.markers = [];          // 存储所有标注点
        this.pois = [];             // 存储路径点
        this.labelArr = [
            {
                key: 1,
                labelBg: '/static/images/trafficMap/wz.png',
                labelBgActive: '/static/images/trafficMap/wz_active.png',
                labelText: '违章',
            },
            {
                key: 2,
                labelBg: '/static/images/trafficMap/jy.png',
                labelBgActive: '/static/images/trafficMap/jy_active.png',
                labelText: '加油',
            },
            {
                key: 3,
                labelBg: '/static/images/trafficMap/cd.png',
                labelBgActive: '/static/images/trafficMap/cd_active.png',
                labelText: '充电',
            },
            {
                key: 4,
                labelBg: '/static/images/trafficMap/sgcc.png',
                labelBgActive: '/static/images/trafficMap/sgcc_active.png',
                labelText: '事故出厂',
            },
            {
                key: 5,
                labelBg: '/static/images/trafficMap/wbcc.png',
                labelBgActive: '/static/images/trafficMap/wbcc_active.png',
                labelText: '维保出厂',
            },
        ];
    }

    // ==================== 私有方法 ====================
    _initMap() {
        this.map.enableScrollWheelZoom();
        this.map.centerAndZoom(this.options.centerPoint, this.options.zoomLevel);
    }
    // ==================== 路径管理 ====================
    /**
     * 绘制分段颜色路径
     * @param {Array} pathData - 路径数据数组
     */
    drawPath(pathData, clickFn) {
        // 1. 转换数据结构
        const points = pathData.map(item => {
            const [lng, lat] = item.path.split(',').map(Number);
            return {
                point: new BMap.Point(lng, lat),
                color: item.color,
                pointData: item,
            };
        });
        // 2. 自动颜色分段
        let segments = [];
        let currentColor = points[0].color;
        let startIdx = 0;
        for (let i = 1; i < points.length; i++) {
            if (points[i].color !== currentColor) {
                segments.push({
                    start: startIdx,
                    end: i,
                    color: currentColor,
                    pointData: points[i].pointData,
                });
                currentColor = points[i].color;
                startIdx = i;
            }
        }
        segments.push({
            start: startIdx,
            end: points.length - 1,
            color: currentColor,
            pointData: points[points.length - 1].pointData,
        });
        // 3. 绘制各段路径
        this.pois = [];
        segments.forEach(seg => {
            const subPoints = points.slice(seg.start, seg.end + 1).map(p => p.point);
            this.pois.push(...subPoints);
            if (subPoints.length >= 2) {
                const polyline = new BMap.Polyline(subPoints, {
                    strokeColor: seg.color,
                    strokeWeight: 10,
                    strokeOpacity: 1,
                    enableClicking: true,
                });
                // 存储分段颜色用于点击事件
                polyline.segmentColor = seg.color;
                // 绑定点击事件
                polyline.addEventListener('click', (e) => {
                    this.resetLabelStyle();
                    clickFn && clickFn(e.point, seg.pointData);
                    // this.openInfoBox(e.point, infoContent);
                });
                this.map.addOverlay(polyline);
            }
        });
        return this.pois;
    }
    // 根据颜色获取状态描述
    _getStatusByColor(color) {
        const statusMap = {
            '#67C23A': '正常运行',
            '#409EFF': '停车状态',
            '#F56C6C': '异常状态'
        };
        return statusMap[color] || '未知状态';
    }
    // ==================== 路书管理 ====================
    /**
     * 初始化路书轨迹
     * @param {Object} options - 路书配置
     */
    initLushu(options = {}) {
        const defaultOptions = {
            defaultContent: "",
            icon: new BMap.Icon(
                this.options.carIconUrl,
                new BMap.Size(48, 48),
                { imageSize: new BMap.Size(48, 48) }
            ),
            autoView: false,
            speed: 50,
            enableRotation: true,
            landmarkPois: [],
        };

        this.lushu = new MapLuShu.LuShu(
            this.map,
            this.pois,
            Object.assign(defaultOptions, options)
        );
        
        // 重写路书移动方法（添加进度条支持）
        if (this.lushu) {
            const originalMove = MapLuShu.LuShu.prototype._move;
            const sliderFn = this.options.sliderFn || null;
            MapLuShu.LuShu.prototype._move = function(initPos, targetPos, effect) {
                // 进度条更新逻辑
                sliderFn && sliderFn(this.i);
                originalMove.call(this, initPos, targetPos, effect);
            };
        }
    }
    // 路书控制方法
    startLushu() { this.lushu && this.lushu.start(); }
    pauseLushu() { this.lushu && this.lushu.pause(); }
    resumeLushu() { this.lushu && this.lushu.start(); }
    stopLushu() { this.lushu && this.lushu.stop(); }
    setLushuSpeed(speed) {
        if (this.lushu) this.lushu._opts.speed = speed;
    }
    // ==================== marker管理 ====================
    // 绘制起点和终点标注
    drawStartEndMarkers(markers) {
        const start = markers[0].path.split(',').map(Number);
        const end = markers[markers.length - 1].path.split(',').map(Number);
        const startPoi = new BMap.Point(start[0], start[1]);
        const endPoi = new BMap.Point(end[0], end[1]);
        const startIcon = new BMap.Icon(this.options.trailStartUrl, new BMap.Size(36, 36), {
            imageSize: new BMap.Size(36, 36), // 引用图片实际大小
            anchor: new BMap.Size(16, 36),
        });
        const endIcon = new BMap.Icon(this.options.trailEndUrl, new BMap.Size(36, 36), {
            imageSize: new BMap.Size(36, 36), // 引用图片实际大小
            anchor: new BMap.Size(16, 36),
        });
        const startMarker = new BMap.Marker(startPoi, {
            icon: startIcon,
        });
        const endMarker = new BMap.Marker(endPoi, {
            icon: endIcon,
        });
        this.map.addOverlay(startMarker);
        this.map.addOverlay(endMarker);
    }
    // 绘制标注点
    drawMarkers(markers, markerIconUrl) {
        markers.forEach(data => {
            const [lng, lat] = data.path.split(',').map(Number);
            const point = new BMap.Point(lng, lat);
            const icon = new BMap.Icon(markerIconUrl, new BMap.Size(36, 36), {
                imageSize: new BMap.Size(36, 36), // 引用图片实际大小
                anchor: new BMap.Size(16, 36),
            });
            const marker = new BMap.Marker(point, { icon: icon });
            this.map.addOverlay(marker);
            this.markers.push(marker);
        });
    }
    // 绘制聚合点
    drawMarkerClusterer(markers, markerIconUrl, fn, centerPoint, zoomLevel) {
        let markersList = [];
        markers.forEach(data => {
            const [lng, lat] = data.path.split(',').map(Number);
            const point = new BMap.Point(lng, lat);
            const icon = new BMap.Icon(markerIconUrl, new BMap.Size(48, 48), {
                imageSize: new BMap.Size(48, 48), // 引用图片实际大小
                anchor: new BMap.Size(16, 48),
            });
            const marker = new BMap.Marker(point, { icon: icon });
            marker.addEventListener("click", (e) => {
                fn(data.path);
            });
            markersList.push(marker);
        });
        //调用API聚合函数将标记数组显示在地图上
        let markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers: markersList});
        let [lng, lat] = markers[0].path.split(',').map(Number);
        this.map.centerAndZoom(new BMap.Point(centerPoint.lng || lng, centerPoint.lat || lat), zoomLevel || 12);
    }
    /**
     * 清除所有标注
    */
    clearAllMarkers() {
        this.markers.forEach(marker => this.map.removeOverlay(marker));
        this.markers = [];
    }
    // ==================== label标注管理 ====================
    /**
     * 添加标注点
     * @param {Array} points - 标注点数据
     */
    drawLabel(points, clickFn) {
        // 筛选需要添加标注的点
        points.forEach(pointData => {
            const [lng, lat] = pointData.path.split(',').map(Number);
            const point = new BMap.Point(lng, lat);
            let labelData = this.labelArr.find(item => item.key == pointData.type);
            if (!labelData) return;
            // 创建标签
            const customHTML =
            `<div class="labelBox">
                <div class="text">${labelData.labelText}</div>
            </div>`;
            const label = new BMap.Label(pointData.labelText, { position: point });
            label.setStyle({
                border: 'none',
                background: 'none',
                color: '#333',
                transform: 'translateX(-87%) translateY(-95%)',
                backgroundImage: `url(${labelData.labelBg})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right',
            });
            label.setContent(customHTML);
            // 绑定点击事件
            label.addEventListener("click", (e) => {
                this.activeLabelData = labelData;
                this.setLabelStyle(labelData.labelBgActive, "#fff", e.target);
                clickFn && clickFn(point, labelData);
                // this.openInfoBox(point, infoContent);
            });
            this.map.addOverlay(label);
        });
    }
    /**
     * 设置标签高亮样式
     * @param {string} backgroundImage - 背景图片路径
     * @param {string} color - 文字颜色
     * @param {BMap.Label} label - 标签实例
     */
    setLabelStyle(backgroundImage, color, label) {
        if (label) {
            this.activeLabel = label;
            this.activeLabel.setStyle({
                backgroundImage: `url(${backgroundImage})`,
                color: color,
            });
        }
    }
    /**
     * 重置标签样式
     */
    resetLabelStyle() {
        if (this.activeLabel) {
            let labelBg = this.activeLabelData.labelBg;
            this.activeLabel.setStyle({
                backgroundImage: `url(${labelBg})`,
                color: "#333",
            });
            this.activeLabelData = null;
            this.activeLabel = null;
        }
    }
    // ==================== 信息窗口管理 ====================
    /**
     * 打开信息窗口
     * @param {BMap.Point} position - 信息窗口位置
     * @param {string} content - HTML内容
     */
    openInfoBox(position, content) {
        var infoWindow = new BMap.InfoWindow(content, {
            offset: new BMap.Size(-15, -15),
        });
        infoWindow.addEventListener("open", () => {
            const pop = document.querySelector('.BMap_pop:last-child');
            pop && pop.classList.add('TrafficRouteMap_infoWindow');
            const shadowEl = document.querySelector('.BMap_shadow');
            if (shadowEl) shadowEl.style.display = 'none';
            const close = document.querySelector('.close_infoWindow');
            close && close.addEventListener('click', () => {
                this.map && this.map.closeInfoWindow();
            });
        });
        infoWindow.addEventListener("close", () => {
            const pop = document.querySelector('.BMap_pop:last-child');
            pop && pop.classList.remove('TrafficRouteMap_infoWindow');
            this.resetLabelStyle();
        });
        // marker添加点击事件
        let point = new BMap.Point(position.lng, position.lat);
        this.map.openInfoWindow(infoWindow, point);
    }
    // ==================== 销毁方法 ====================
    destroy() {
        this.stopLushu();
        this.clearAllMarkers();
        this.activeLabel = null;
        this.activeLabelData = null;
        this.map = null;
    }
}
