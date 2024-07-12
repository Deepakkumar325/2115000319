const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const API_URL = 'http://20.244.56.144/test';


let numbersWindow = [];

const fetchNumbers = async (type) => {
    const urlMap = {
        'p': `${API_URL}/primes`,
        'f': `${API_URL}/Fibo`,
        'e': `${API_URL}/even`,
        'r': `${API_URL}/rand`
    };

    if (!urlMap[type]) {
        throw new Error('Invalid type');
    }

    try {
        const response = await axios.get(urlMap[type], { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        return [];
    }
};

const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return numbers.length ? (sum / numbers.length).toFixed(2) : '0.00';
};

app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;

    try {
        const newNumbers = await fetchNumbers(type);

        const windowPrevState = [...numbersWindow];

        newNumbers.forEach(num => {
            if (!numbersWindow.includes(num)) {
                if (numbersWindow.length >= WINDOW_SIZE) {
                    numbersWindow.shift(); 
                }
                numbersWindow.push(num);
            }
        });

        const avg = calculateAverage(numbersWindow);

        res.json({
            windowPrevState,
            windowCurrState: numbersWindow,
            numbers: newNumbers,
            avg
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
