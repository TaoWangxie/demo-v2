//判断对象是否有属性
export function hasOwn(obj, propName) {
	return Object.prototype.hasOwnProperty.call(obj, propName);
}

/**
 * 监听dom自身点击
 * @param id id名
 * @param inCb 不在范围内回调
 * @param outCb 在范围内回调
 */
export function monitorSelfClick(id, inCb, outCb) {
	document.addEventListener('click', (e) => {
		let isSelf = document.getElementById(id)?.contains(e.target)  // 这个是自己的区域
		if (!isSelf) {
			//   console.log('没在区域里面-->>>')
			inCb && inCb()
		} else {
			//   console.log('在区域里--->>>>>')
			outCb && outCb()
		}
	})
}

export function swap(arr, i, j) {
	const temp = arr[i]
	arr[i] = arr[j]
	arr[j] = temp
}

/**
 * 存储sessionStorage
 */
export const setSessionStorage = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getSessionStorage = (name) => {
	if (!name) return;
	let data = window.sessionStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}

//判断dom是否在可视区域
export function isInview(clientRect, viewHeight, viewWidth) {
	return clientRect.bottom < 0 || clientRect.top > viewHeight || clientRect.right < 0 || clientRect.left > viewWidth
}
//判断鼠标移动方向
let lastX = null,
	lastY = null;
export function mouseMoveDirection(e) {
	let curX = e.clientX,
		curY = e.clientY,
		direction = ['中', '中'];
	// 初始化坐标
	if (lastX == null || lastY == null) {
		lastX = curX;
		lastY = curY;
		return;
	}
	if (curX > lastX) {
		direction[0] = '右';
	} else if (curX < lastX) {
		direction[0] = '左';
	} else {
		direction[0] = '中,';
	}
	if (curY > lastY) {
		direction[1] = '下';
	} else if (curY < lastY) {
		direction[1] = '上';
	} else {
		direction[1] = '中';
	}
	lastX = curX;
	lastY = curY;
	return direction
}

export function removeNode(trees, id){
    for (var i = 0; i < trees.length; i++) {
        if (trees[i].id === id) {
            trees.splice(i, 1);
            return;
        } else if (trees[i].children) {
            removeNode(trees[i].children, id);
        }
    }
}
export function isOwnChildren(tree, id){
    function traverse(node) {
        // 如果当前节点符合条件，则返回第一层属性值
        if (node.id === id) {
            return node;
        }
            // 遍历子节点
        if (Array.isArray(node.children)) {
            for (let child of node.children) {
                const result = traverse(child);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        // 没有找到符合条件的节点，返回 undefined
        return undefined;
    }
    // 开始遍历树
    return traverse(tree);
}

//获取鼠标相对于编辑器的位置
export function getEventInCanvasPos(e){
    // 计算菜单相对于编辑器的位移
    let target = e.target
    let ECtop = e.offsetY
    let ECleft = e.offsetX
    while (target instanceof SVGElement) {
        target = target.parentNode
    }
    while (!target.className.includes('canvas')) {
        ECleft += target.offsetLeft
        ECtop += target.offsetTop
        target = target.parentNode
    }
    return {
        top:ECtop,
        left:ECleft
    }
}