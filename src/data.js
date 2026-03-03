import {makeIndex} from "./lib/utils.js";

const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData(sourceData) {
    // переменные для кеширования данных
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    // функция для приведения строк в тот вид, который нужен нашей таблице
    const mapRecords = (data) => {
        if (!data || !Array.isArray(data)) {
            console.error('mapRecords: data is not an array', data);
            return [];
        }
        
        return data.map(item => ({
            id: item.receipt_id,
            date: item.date,
            seller: sellers ? sellers[item.seller_id] : 'Unknown',
            customer: customers ? customers[item.customer_id] : 'Unknown',
            total: item.total_amount
        }));
    };

    // функция получения индексов
    const getIndexes = async () => {
        if (!sellers || !customers) {
            try {
                const [sellersRes, customersRes] = await Promise.all([
                    fetch(`${BASE_URL}/sellers`),
                    fetch(`${BASE_URL}/customers`)
                ]);
                
                sellers = await sellersRes.json();
                customers = await customersRes.json();
                
                console.log('Sellers loaded:', Object.keys(sellers).length);
                console.log('Customers loaded:', Object.keys(customers).length);
            } catch (error) {
                console.error('Error loading indexes:', error);
                sellers = {};
                customers = {};
            }
        }

        return { sellers, customers };
    };

    // функция получения записей о продажах с сервера
    const getRecords = async (query, isUpdated = false) => {
        try {
            console.log('getRecords called with query:', query);
            
            // Преобразуем объект параметров в SearchParams
            const qs = new URLSearchParams(query);
            const nextQuery = qs.toString();
            
            console.log('Query string:', nextQuery);

            // Проверка кеша
            if (lastQuery === nextQuery && !isUpdated) {
                console.log('Returning cached result');
                return lastResult;
            }

            // Делаем запрос к серверу
            const url = `${BASE_URL}/records${nextQuery ? '?' + nextQuery : ''}`;
            console.log('Fetching URL:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const records = await response.json();
            console.log('Server response:', records);

            // Определяем структуру ответа
            let items = [];
            let total = 0;
            
            if (records.data && Array.isArray(records.data)) {
                items = records.data;
                total = records.total || records.data.length;
            } else if (records.items && Array.isArray(records.items)) {
                items = records.items;
                total = records.total || records.items.length;
            } else if (Array.isArray(records)) {
                items = records;
                total = records.length;
            } else {
                console.error('Unexpected response format:', records);
                items = [];
                total = 0;
            }

            lastQuery = nextQuery;
            lastResult = {
                total: total,
                items: mapRecords(items)
            };

            console.log(`Returning ${lastResult.items.length} items out of ${total}`);
            return lastResult;
            
        } catch (error) {
            console.error('Error in getRecords:', error);
            return {
                total: 0,
                items: []
            };
        }
    };

    return {
        getIndexes,
        getRecords
    };
}