export default {
  bind(el, binding) {
    let input = null;
    let startCellPos;
    let prop;
    const handleMouseDown = (event) => {
      input = event.target;
      startCellPos = getRowAndCellIndexes(input);
      prop = getFormItemDataProp(input);
      console.log(prop);
      const isInputElement = hasSingleInputInElInputClass(input);
      if (!isInputElement) {
        console.warn("v-excel-paste should only be used on input elements");
        return;
      }
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    };
    const handleFocus = () => {
      document.addEventListener("paste", handlePaste, false);
    };
    const handleBlur = () => {
      document.removeEventListener("paste", handlePaste, false);
    };
    const handleMouseUp = (event) => {
      const target = event.target;
      const isInputElement = hasSingleInputInElInputClass(target);
      if (isInputElement) {
        target.removeEventListener("focus", handleFocus);
        target.removeEventListener("blur", handleBlur);
        input = null;
      }
    };
    const handlePaste = (e) => {
      e.preventDefault();
      try {
        const text = (e.clipboardData || window.clipboardData).getData(
          "text/plain"
        );
        const lines = text.split("\n");
        const parsedData = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const cells = line.split("\t");
          for (let j = 0; j < cells.length; j++) {
            const cell = cells[j].trim();
            parsedData.push({
              value: cell,
              row: i + 1,
              col: j + 1,
            });
          }
        }
        // 在这里可以进一步处理parsedData，比如显示在页面上或发送到服务器
        if (typeof binding.value === "function") {
          // 如果指令绑定了回调函数，则调用回调函数并传递解析后的数据
          binding.value(parsedData, startCellPos, prop);
        } else if (binding.value instanceof Promise) {
          // 如果指令绑定了 Promise，则将解析后的数据作为 Promise 的解析结果进行返回
          binding.value.resolve(parsedData, startCellPos, prop);
        }
      } catch (error) {
        console.error("Error reading clipboard data:", error);
      }
    };
    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseup", handleMouseUp);
  },
  unbind(el) {
    el.removeEventListener("mousedown", el.handleMouseDown);
  },
};
const hasSingleInputInElInputClass = (element) => {
  return element instanceof HTMLInputElement;
};
function getRowAndCellIndexes(element) {
  let trElement = element.parentNode;
  while (trElement && trElement.tagName !== "TR") {
    trElement = trElement.parentNode;
  }
  let tdElement = element.parentNode;
  while (tdElement && tdElement.tagName !== "TD") {
    tdElement = tdElement.parentNode;
  }
  const rowIndex = trElement ? trElement.rowIndex : -1;
  const cellIndex = tdElement ? tdElement.cellIndex : -1;
  return { rowIndex, cellIndex };
}
function getFormItemDataProp(element) {
  let parentElement = element.parentNode;
  while (parentElement && !parentElement.classList?.contains("el-form-item")) {
    parentElement = parentElement.parentNode;
  }
  if (parentElement) {
    return parentElement.getAttribute("data-prop");
  }
  return null;
}
