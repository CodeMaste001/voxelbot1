const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const GIPHY_API_KEY = process.env.GIPHY_API_KEY; // Use environment variable
const GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';

async function fetchGiphyGif(query) {
    try {
        const response = await fetch(`${GIPHY_ENDPOINT}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=5&rating=g`); // Changed limit to 5
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            // Choose a random GIF from the results
            const randomIndex = Math.floor(Math.random() * data.data.length);
            return data.data[randomIndex].images.original.url;
        } else {
            return null; // No GIF found
        }
    } catch (error) {
        console.error(`Error fetching GIF from Giphy for query "${query}":`, error);
        return 'Error al buscar GIF de anime, intenta más tarde.'; // Specific error message for API issues
    }
}

module.exports = { fetchGiphyGif };