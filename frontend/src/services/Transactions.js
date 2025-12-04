import DJANGO_PORT from './setting.js';

const fetchTransactionById = async (transactionId) => {
    try {
        const response = await fetch(`${DJANGO_PORT}/api/transactions/${transactionId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transaction by ID:', error);
        return null;
    }
};

export { fetchTransactionById };