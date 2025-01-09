document.getElementById('searchButton').addEventListener('click', async function () {
    const query = document.getElementById('searchInput').value;
    const resultsList = document.getElementById('results');
    const imgContainer = document.querySelector('.img-container');
    resultsList.innerHTML = '';  // Clear previous results

    if (!query) {
        alert('Please enter a search term');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/books?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('No books found or an error occurred');
        }
        const books = await response.json();
        books.forEach(book => {
            const listItem = document.createElement('li');
            listItem.classList.add('result-item');
            listItem.innerHTML = `
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>First Published:</strong> ${book.firstPublishedYear}</p>`;
            resultsList.appendChild(listItem);
        });

        // Hide the image after displaying results
        imgContainer.style.display = 'none';
    } catch (error) {
        alert(error.message);
    }
});
