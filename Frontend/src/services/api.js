// quoteService.js

const API_URL = "https://localhost:7263/api/quote"; // sửa nếu khác port

export const getQuotes = async () => {
    const res = await fetch(API_URL);
    return await res.json();
};

export const createQuote = async (data) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
};