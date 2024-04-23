
export default {
    bind(el) {
        let isMouseDown = false;
        let startCell = null;
        let endCell = null;
        let tableRect;
        const table = el;
        // 储存选中单元格的数据
        let selectedData = [];
        el.handleMouseDown = (event) => {
            isMouseDown = true;
            tableRect = table.getBoundingClientRect()
            const targetCell = getTargetCell(event.target);
            startCell = targetCell;
            endCell = targetCell;
            table.style.cssText = `   
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;`
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
            // clearHighlight()
            table.style.cssText = ``
            isMouseDown = false;
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
            selectedData = []
            if (!startCell || !endCell) {
                return; // 如果没有开始和结束单元格，则不执行任何操作  
            }
            const startRowIndex = startCell.parentNode.rowIndex;
            const startCellIndex = startCell.cellIndex;
            const endRowIndex = endCell.parentNode.rowIndex;
            const endCellIndex = endCell.cellIndex;
            const minRowIndex = Math.min(startRowIndex, endRowIndex);
            const maxRowIndex = Math.max(startRowIndex, endRowIndex);
            const minCellIndex = Math.min(startCellIndex, endCellIndex);
            const maxCellIndex = Math.max(startCellIndex, endCellIndex);
            // 清除之前的高亮div  
            const existingHighlight = table.querySelector('.cell-highlight-wrapper');
            if (existingHighlight) {
                existingHighlight.parentNode.removeChild(existingHighlight);
            }
            // 创建新的高亮div  
            const highlightWrapper = document.createElement('div');
            highlightWrapper.className = 'cell-highlight-wrapper';
            highlightWrapper.style.position = 'absolute';
            highlightWrapper.style.border = '4px solid #67C23A'; // 红色边框  
            highlightWrapper.style.boxSizing = 'border-box'; // 包含边框和内边距在尺寸内 
            highlightWrapper.style.pointerEvents = 'none'; // 避免干扰鼠标事件  
            highlightWrapper.style.zIndex = 1; // 确保高亮显示在单元格内容之上  
            // 将高亮div添加到tbody中  
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.getElementsByTagName('tr'));
            const fristCells = Array.from(rows[minRowIndex].getElementsByTagName('td'));
            const lastCells = Array.from(rows[maxCellIndex].getElementsByTagName('td'));
            const firstCellRect = fristCells[minCellIndex].getBoundingClientRect();
            const lastCellRect = lastCells[maxCellIndex].getBoundingClientRect();
            // 计算并设置高亮div的位置和大小  
            highlightWrapper.style.left = `${firstCellRect.left - tableRect.left - 1}px`;
            highlightWrapper.style.top = `${firstCellRect.top - tableRect.top - 1}px`;
            highlightWrapper.style.width = `${lastCellRect.right - firstCellRect.left - 1}px`;
            highlightWrapper.style.height = `${rows[maxRowIndex].getBoundingClientRect().bottom - firstCellRect.top - 1}px`;
            table.appendChild(highlightWrapper);
            // 存储高亮div的引用，以便之后可以清除它  
            // 遍历并设置选中单元格的样式和获取数据
            for (let i = minRowIndex; i <= maxRowIndex; i++) {
                const row = rows[i];
                if (row) {
                    const cells = Array.from(row.getElementsByTagName('td'));
                    for (let j = minCellIndex; j <= maxCellIndex; j++) {
                        const cell = cells[j];
                        if (cell) {
                            // 获取单元格的数据以及相关信息，并将其存入 selectedData 数组
                            const rowIndex = i;
                            const columnIndex = j;
                            const cellData = {
                                prop: '',
                                name: '',
                                row: rowIndex,
                                column: columnIndex,
                                value: cell.textContent
                            };
                            selectedData.push(cellData);
                        }
                    }
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

