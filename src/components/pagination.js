import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    // Переменная для хранения количества страниц (нужна для кнопки "last")
    let pageCount;

    // Функция для применения параметров пагинации к query
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // @todo: #2.6 — обработать действия (предыдущая, следующая, первая, последняя страницы)
        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;
            case 'next': page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last': page = pageCount; break;
        }

        // Возвращаем новый объект с параметрами пагинации (не изменяя исходный query)
        return Object.assign({}, query, {
            limit,
            page
        });
    };

    // Функция для обновления отображения пагинатора после получения данных
    const updatePagination = (total, { page, limit }) => {
        // @todo: #2.1 — посчитать количество страниц
        pageCount = Math.ceil(total / limit);

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min((page * limit), total);
        totalRows.textContent = total;
    };

    // Возвращаем обе функции
    return {
        applyPagination,
        updatePagination
    };
};