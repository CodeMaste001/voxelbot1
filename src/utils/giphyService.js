const fetch = require('node-fetch'); // Assuming node-fetch is installed

const GIPHY_API_KEY = process.env.GIPHY_API_KEY || 'Ma2p6JaiGFYOdMReRzcLKY5FnxCzG4Jg'; // Use environment variable if available, otherwise fallback
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/search';

async function searchGif(query) {
    try {
        const response = await fetch(`${GIPHY_API_URL}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return data.data[0].images.original.url;
        } else {
            return null; // No GIF found
        }
    } catch (error) {
        console.error(`Error al buscar GIF para "${query}":`, error);
        return null; // Indicate error
    }
}

module.exports = {
    searchGif
};