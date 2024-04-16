// directives/dragSelect.js

export default {
    bind(el){
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
            isMouseDown = false;
        };
        const getTargetCell = (target) => {
            if(!target) return
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
        const highlightCells = (event) => {
            // 检查是否按住了 Shift 键
            const isShiftPressed = event.shiftKey;
            // 重置所有单元格的样式
            const cells = table.querySelectorAll('td');
            cells.forEach(cell => {
                // 如果按住了 Shift 键且单元格已经有样式，则跳过设置样式
                if (!isShiftPressed) {
                    cell.style.backgroundColor = '';
                    selectedData = []
                }
            });
            if (startCell && endCell) {
                // 获取选中的单元格范围
                const startRowIndex = startCell.parentNode.rowIndex + 1;
                const startCellIndex = startCell.cellIndex;
                const endRowIndex = endCell.parentNode.rowIndex + 1;
                const endCellIndex = endCell.cellIndex;
                // 获取表格的所有行
                const rows = Array.from(table.getElementsByTagName('tr'));
                // 计算矩形选中区域的范围
                const minRowIndex = Math.min(startRowIndex, endRowIndex);
                const maxRowIndex = Math.max(startRowIndex, endRowIndex);
                const minCellIndex = Math.min(startCellIndex, endCellIndex);
                const maxCellIndex = Math.max(startCellIndex, endCellIndex);
                
                // 遍历并设置选中单元格的样式和获取数据
                for (let i = minRowIndex; i <= maxRowIndex; i++) {
                    const row = rows[i];
                    if (row) {
                        const cells = Array.from(row.getElementsByTagName('td'));
                        for (let j = minCellIndex; j <= maxCellIndex; j++) {
                            const cell = cells[j];
                            if (cell) {
                                // 如果按住了 Shift 键且单元格已经有样式，则跳过设置样式
                                if (isShiftPressed && cell.style.backgroundColor !== '') {
                                    continue;
                                }
                                cell.style.backgroundColor = 'rgba(0, 0, 255, 0.4)';
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
                console.log(selectedData);
            }
        };
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