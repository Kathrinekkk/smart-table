import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    // Получаем правило поиска
    const searchRule = rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false);
    
    // createComparison может ожидать массив правил
    const compare = createComparison(
        { skipEmptyTargetValues: true },
        [searchRule]  // Передаем как массив
    );

    return (data, state, action) => {
        const searchValue = state[searchField];
        
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        try {
            const filterFn = compare(searchValue);
            return data.filter(item => filterFn(item));
        } catch (error) {
            console.error('Search error:', error);
            // Запасной вариант: ручная фильтрация
            const searchLower = searchValue.toLowerCase();
            return data.filter(item => 
                ['date', 'customer', 'seller'].some(field => 
                    String(item[field] || '').toLowerCase().includes(searchLower)
                )
            );
        }
    };
}