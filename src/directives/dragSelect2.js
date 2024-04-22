
export default {
    bind(el) {
        let isMouseDown = false;
        let startCell = null;
        let endCell = null;
        const table = el;
        // 储存选中单元格的数据
        let selectedData = [];
        el.handleMouseDown = (event) => {
            isMouseDown = true;
            const targetCell = getTargetCell(event.target);
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
            if (!startCell || !endCell) {
                return; // 如果没有开始和结束单元格，则不执行任何操作  
            }
            const startRowIndex = startCell.parentNode.rowIndex;
            const startCellIndex = startCell.cellIndex;
            const endRowIndex = endCell.parentNode.rowIndex;
            const endCellIndex = endCell.cellIndex;
            const minRowIndex = Math.min(startRowIndex, endRowIndex) - 1;
            const maxRowIndex = Math.max(startRowIndex, endRowIndex) - 1;
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
            highlightWrapper.style.border = '4px solid red'; // 红色边框  
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
            highlightWrapper.style.left = `${firstCellRect.left - 10}px`;
            highlightWrapper.style.top = `${firstCellRect.top + 8}px`;
            highlightWrapper.style.width = `${lastCellRect.right - firstCellRect.left}px`;
            highlightWrapper.style.height = `${rows[maxRowIndex].getBoundingClientRect().bottom - firstCellRect.top}px`;

            tbody.appendChild(highlightWrapper);
            // 存储高亮div的引用，以便之后可以清除它  
            selectedData.push({
                wrapper: highlightWrapper // 存储高亮div的引用  
            });
        };

        // 清除高亮的函数  
        const clearHighlight = () => {
            const existingHighlight = table.querySelector('.cell-highlight-wrapper');
            if (existingHighlight) {
                existingHighlight.parentNode.removeChild(existingHighlight);
            }
        };
        // 使用时调用 highlightCells 函数来高亮选中的单元格  
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