
export default {
    bind(el, binding) {
        let isMouseDown = false;
        let startCell = null;
        let endCell = null;
        let tableRect;
        const callBack = binding.value
        const table = el;
        // 储存选中单元格的数据
        let selectedData = [];
        let startCellPos;
        el.handleMouseDown = (event) => {
            isMouseDown = true;
            tableRect = table.getBoundingClientRect()
            const targetCell = getTargetCell(event.target);
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
            if (selectedData.length > 1) {
                callBack(selectedData, startCellPos)
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
            highlightWrapper.style.width = `${firstCellRect.width}px`;
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

