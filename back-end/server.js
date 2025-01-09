const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to search for books
app.get('/api/books', async (req, res) => {
    const { q, title, author } = req.query;

    let apiUrl = 'http://openlibrary.org/search.json?';
    if (q) {
        apiUrl += `q=${encodeURIComponent(q)}`;
    } else if (title) {
        apiUrl += `title=${encodeURIComponent(title)}`;
    } else if (author) {
        apiUrl += `author=${encodeURIComponent(author)}`;
    } else {
        return res.status(400).json({ error: 'No search query provided' });
    }

    try {
        const response = await axios.get(apiUrl);
        const books = response.data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            firstPublishedYear: book.first_publish_year || 'Unknown Year'
        }));

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
