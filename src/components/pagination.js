import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount ?? page, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          if (pageCount) {
            page = pageCount;
          }
          break;
      }
    }

    return Object.assign({}, query, {
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    fromRow.textContent = from;
    toRow.textContent = to;
    totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
};
