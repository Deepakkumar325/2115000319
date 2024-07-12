
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const API_URL = 'http://20.244.56.144/test';
const apiKey = 'eyJhbGc101JIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXB0bGFpbXMi0nsiZXhwIjoxNzIwNzc0OTgxLC3pYXQ10jE3MjA3NzQ2ODEsImlzcyI6IkFmZm9yZG1lZCIsImp@aSI6ImZiY2JmYzBjLTAZYTItNDcyMC@5ZDIOLWZKO TI1MmZMzdiMiIsInN1Y1I6ImRlZXBhay5ndXB0YV9jczIxQGdsYS5hYy5pbiJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiZmJjYmZjMGMtMDNhMi00Nz IwLT1kMjQtZmQ5MjUyZmMzN2IyIiwiY2xpZW50U2VjcmV0IjoiR1NDS2t1SkNNeWx2eX12VCIsIm93bmVyTmFtZSI6IkRIZXBhayIsIm93bmVyRW1haWw101JkZWVwYWsuZ3V wdGFLY3MyMUBnbGFuYWMuaw41LCJyb2xsTm8101IyMTE1MDAwMzE5In0.UGx7rI_am48KJNJnhXwSDdwuwXUF21PUdux3Lh--K6U';
const config = {
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
};
 
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
        const response = await axios.get(urlMap[type], { timeout: 500, ...config });
        return response.data.numbers || [];
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
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// "companyName": "goMart", 
// "clientID": "fbcbfc0c-03a2-4720-9d24-fd9252fc37b2"
// , "clientSecret": "GSCKkuJCMylvyyvT", 
// "ownerName": "Deepak", 
// "ownerEmail": "deepak.gupta_cs21@gla.ac.in",
//  "rollNo": "2115000319"