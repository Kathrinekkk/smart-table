import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        // Создаем опции из значений индекса
        const options = Object.values(indexes[elementName]).map(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            return option;
        });
        
        // Добавляем опции в соответствующий элемент
        elements[elementName].append(...options);
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            // Получаем поле, которое нужно очистить (из data-field кнопки)
            const fieldToClear = action.dataset.field;
            
            // Находим родительский элемент (label.filter-wrapper)
            const parentWrapper = action.closest('.filter-wrapper');
            
            if (parentWrapper) {
                // Находим input внутри этого wrapper
                const input = parentWrapper.querySelector('input');
                
                if (input) {
                    // Очищаем значение input
                    input.value = '';
                    
                    // Очищаем соответствующее поле в state
                    state[fieldToClear] = '';
                }
            }
            
            // Если это select (для seller), то подход другой
            if (fieldToClear === 'seller') {
                const select = document.querySelector('select[name="seller"]');
                if (select) {
                    select.value = '';
                    state.seller = '';
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}