export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          return option;
        }),
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action && action.name === "clear") {
      const fieldName = action.dataset.field;
      const wrapper = action.closest(".filter__control, .filter-control, div");
      const input = wrapper.querySelector(`[name="${fieldName}"]`);

      if (input) {
        input.value = "";
      }

      if (fieldName in state) {
        state[fieldName] = "";
      }
    }

    const filter = {};

    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (!el) return;

      if (["INPUT", "SELECT"].includes(el.tagName) && el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
