export function initFiltering(elements) {
    // Функция для заполнения выпадающих списков опциями
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            if (!select) return;
            
            // Очищаем select
            select.innerHTML = '';
            
            // Добавляем пустую опцию
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Все продавцы';
            select.appendChild(emptyOption);
            
            // Добавляем опции из индексов
            if (indexes[elementName] && typeof indexes[elementName] === 'object') {
                Object.values(indexes[elementName]).forEach(name => {
                    if (name) {
                        const el = document.createElement('option');
                        el.textContent = name;
                        el.value = name;
                        select.appendChild(el);
                    }
                });
            }
        });
    };

    // Функция для применения фильтрации к запросу (ТОЧНО ПО ЗАДАНИЮ)
    const applyFiltering = (query, state, action) => {
        // Обработка очистки полей
        if (action && action.name === 'clear') {
            const fieldToClear = action.dataset.field;
            
            if (fieldToClear === 'date' && elements.searchByDate) {
                elements.searchByDate.value = '';
            } else if (fieldToClear === 'customer' && elements.searchByCustomer) {
                elements.searchByCustomer.value = '';
            } else if (fieldToClear === 'seller' && elements.searchBySeller) {
                elements.searchBySeller.value = '';
            } else if (fieldToClear === 'total') {
                if (elements.totalFrom) elements.totalFrom.value = '';
                if (elements.totalTo) elements.totalTo.value = '';
            }
        }

        // Собираем параметры фильтрации (ТОЧНО КАК В ЗАДАНИИ)
        const filter = {};
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && ['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
                // В задании указан именно такой формат: filter[${element.name}]
                filter[`filter[${element.name}]`] = element.value;
            }
        });
        
        console.log('Filter params (exactly as in task):', filter);
        
        // Если есть параметры фильтрации, добавляем их к query
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}