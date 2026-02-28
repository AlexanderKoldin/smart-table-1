import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  if (Array.isArray(before)) {
    before
      .slice()
      .reverse()
      .forEach((subName) => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
      });
  }

  if (Array.isArray(after)) {
    after.forEach((subName) => {
      root[subName] = cloneTemplate(subName);
      root.container.append(root[subName].container);
    });
  }

  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener("change", () => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (event) => {
    event.preventDefault();
    onAction(event.submitter);
  });

  const render = (data) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (key in row.elements) {
          row.elements[key].textContent = item[key];
        }
      });

      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
