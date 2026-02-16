import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
// Используем только defaultRules для строковых полей
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        const options = Object.values(indexes[elementName]).map(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            return option;
        });
        elements[elementName].append(...options);
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldToClear = action.dataset.field;
            
            if (fieldToClear === 'date' && elements.searchByDate) {
                elements.searchByDate.value = '';
                state.date = '';
            } else if (fieldToClear === 'customer' && elements.searchByCustomer) {
                elements.searchByCustomer.value = '';
                state.customer = '';
            } else if (fieldToClear === 'seller' && elements.searchBySeller) {
                elements.searchBySeller.value = '';
                state.seller = '';
            } else if (fieldToClear === 'total') {
                if (elements.totalFrom) {
                    elements.totalFrom.value = '';
                    state.totalFrom = '';
                }
                if (elements.totalTo) {
                    elements.totalTo.value = '';
                    state.totalTo = '';
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        console.log('Filtering with state:', state);
        
        // Сначала применяем строковые фильтры через compare
        let filtered = data.filter(row => compare(row, state));
        
        // Затем применяем числовые фильтры вручную
        filtered = filtered.filter(row => {
            const total = parseFloat(row.total);
            
            // Фильтр по минимальной сумме
            if (state.totalFrom && total < parseFloat(state.totalFrom)) {
                return false;
            }
            
            // Фильтр по максимальной сумме
            if (state.totalTo && total > parseFloat(state.totalTo)) {
                return false;
            }
            
            return true;
        });
        
        console.log('Filtered rows:', filtered.length);
        return filtered;
    };
}