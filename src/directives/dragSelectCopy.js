
export default {
    bind(el, binding) {
        let isMouseDown = false;
        let startCell = null;
        let endCell = null;
        let tableRect;
        const { callBack, isSelectCopy } = binding.value
        if (!isSelectCopy) return
        const table = el;
        let flag = false //判断必须为可输入元素
        let prop; //判断必须为可输入元素
        // 储存选中单元格的数据
        let selectedData = [];
        let startCellPos;
        el.handleMouseDown = (event) => {
            isMouseDown = true;
            tableRect = table.getBoundingClientRect()
            const targetCell = getTargetCell(event.target);
            flag = targetCell && hasSingleInputInElInputClass(targetCell)
            if (!flag) {
                el.handleMouseUp()
                return
            }
            prop = getElFormItemDataProps(targetCell)
            table.style.cssText = `   
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;`
            startCellPos = [targetCell.parentNode.rowIndex, targetCell.cellIndex]
            startCell = targetCell;
            endCell = targetCell;
            highlightCells(event);
        };
        el.handleMouseMove = (event) => {
            if (isMouseDown) {
                const targetCell = getTargetCell(event.target);
                if (targetCell !== endCell) {
                    endCell = targetCell;
                    highlightCells(event);
                }
            }
        };
        el.handleMouseUp = () => {
            clearHighlight()
            isMouseDown = false;
            table.style.cssText = ``
            if (flag && selectedData.length > 1) {
                callBack(selectedData, startCellPos, prop[0])
            }
        };
        const getTargetCell = (target) => {
            if (!target) return
            if (target.tagName === 'TD') {
                return target;
            } else if (target.tagName === 'TR') {
                return target.firstChild;
            } else if (target.tagName === 'TABLE' || target.tagName === 'TH') {
                return null;
            } else {
                return getTargetCell(target.parentNode);
            }
        };
        const highlightCells = () => {
            selectedData = [];
            if (!startCell || !endCell) {
                return;
            }
            const startRowIndex = startCell.parentNode.rowIndex;
            const endRowIndex = endCell.parentNode.rowIndex;
            const startCellIndex = startCell.cellIndex;

            const existingHighlight = table.querySelector('.cell-highlight-wrapper');
            if (existingHighlight) {
                existingHighlight.parentNode.removeChild(existingHighlight);
            }
            const highlightWrapper = document.createElement('div');
            highlightWrapper.className = 'cell-highlight-wrapper';
            highlightWrapper.style.position = 'absolute';
            highlightWrapper.style.border = '4px solid #67C23A';
            highlightWrapper.style.boxSizing = 'border-box';
            highlightWrapper.style.pointerEvents = 'none';
            highlightWrapper.style.zIndex = 1;

            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.getElementsByTagName('tr'));
            const cells = Array.from(rows[endRowIndex].getElementsByTagName('td'));
            const firstCellRect = startCell.getBoundingClientRect();
            const lastCellRect = cells[startCellIndex].getBoundingClientRect();
            highlightWrapper.style.left = `${firstCellRect.left - tableRect.left - 1}px`;
            const divTop = lastCellRect.top < firstCellRect.top ? lastCellRect.top : firstCellRect.top
            const lastCellHeight = lastCellRect.top < firstCellRect.top ? lastCellRect.top - firstCellRect.bottom : lastCellRect.bottom - firstCellRect.top
            highlightWrapper.style.top = `${divTop - tableRect.top - 1}px`;
            highlightWrapper.style.width = `${firstCellRect.width - 1}px`;
            highlightWrapper.style.height = `${Math.abs(lastCellHeight)}px`;
            table.appendChild(highlightWrapper);
            const minRowIndex = Math.min(startRowIndex, endRowIndex);
            const maxRowIndex = Math.max(startRowIndex, endRowIndex);
            for (let i = minRowIndex; i <= maxRowIndex; i++) {
                const cells = Array.from(rows[i].getElementsByTagName('td'));
                let cell = cells[startCellIndex]
                if (cell) {
                    const columnIndex = startCellIndex;
                    const cellData = {
                        row: i,
                        column: columnIndex,
                    };
                    selectedData.push(cellData);
                }
            }
        };
        const clearHighlight = () => {
            const existingHighlight = table.querySelector('.cell-highlight-wrapper');
            if (existingHighlight) {
                existingHighlight.parentNode.removeChild(existingHighlight);
            }
        };
        // 并在需要时调用 clearHighlight 函数来清除高亮
        table.addEventListener('mousedown', el.handleMouseDown)
        table.addEventListener('mousemove', el.handleMouseMove)
        table.addEventListener('mouseup', el.handleMouseUp)
    },
    unbind(el) {
        // 移除事件监听器
        if (el.handleMouseDown || el.handleMouseMove || el.handleMouseUp) {
            el.removeEventListener('mousedown', el.handleMouseDown);
            el.removeEventListener('mousemove', el.handleMouseMove);
            el.removeEventListener('mouseup', el.handleMouseUp);
            el.handleMouseDown = null; // 清除引用
            el.handleMouseMove = null; // 清除引用
            el.handleMouseUp = null; // 清除引用
        }
    }
};

// 判断cell内部是否包含input
const hasSingleInputInElInputClass = (parentElement) => {
    // 获取parentElement内部所有类名包含'el-input'的元素
    const elInputElements = parentElement.querySelectorAll('[class*=el-input]');
    // 遍历这些元素
    for (let i = 0; i < elInputElements.length; i++) {
        const elInputElement = elInputElements[i];
        // 获取elInputElement内部的input元素
        const inputElements = elInputElement.querySelectorAll('input');
        // 如果找到了一个input元素
        if (inputElements.length === 1) {
            // 返回true，因为找到了一个匹配的元素
            return true;
        }
    }
    // 如果没有找到匹配的元素，返回false
    return false;
}
const getElFormItemDataProps = (parentElement) => {
    // 获取parentElement内部所有类名包含'el-form-item'的元素
    const elFormItems = parentElement.querySelectorAll('.el-form-item');
    // 初始化一个数组来存储data-prop值
    const dataProps = [];
    // 遍历所有el-form-item元素
    elFormItems.forEach(elFormItem => {
        // 获取data-prop属性值
        const dataProp = elFormItem.getAttribute('data-prop');
        // 如果data-prop存在，则添加到数组中
        if (dataProp) {
            dataProps.push(dataProp);
        }
    });
    // 返回所有data-prop值数组
    return dataProps;
}