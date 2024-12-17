document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-quote');
    const quoteDisplay = document.getElementById('quote');
    const heartIcon = document.getElementById('heart-icon');
    const submitForm = document.getElementById('submit-quote-form');
    const userQuoteInput = document.getElementById('user-quote');
    const quoteList = document.getElementById('quote-list');
    const favouriteList = document.getElementById('favourite-list');
    
    // Tabs
    const generateTab = document.getElementById('generate-tab');
    const submitTab = document.getElementById('submit-tab');
    const viewTab = document.getElementById('view-tab');
    const favouriteTab = document.getElementById('favourite-tab');
    const quoteOfTheDayTab = document.getElementById('quote-of-the-day-tab'); // New Tab
    const generateSection = document.getElementById('generate-section');
    const submitSection = document.getElementById('submit-section');
    const viewSection = document.getElementById('view-section');
    const favouriteSection = document.getElementById('favourite-section');
    const quoteOfTheDaySection = document.getElementById('quote-of-the-day-section'); // New Section
    
    // Switch tab visibility
    const switchTab = (activeSection) => {
      generateSection.style.display = activeSection === 'generate' ? 'block' : 'none';
      submitSection.style.display = activeSection === 'submit' ? 'block' : 'none';
      viewSection.style.display = activeSection === 'view' ? 'block' : 'none';
      favouriteSection.style.display = activeSection === 'favourite' ? 'block' : 'none';
      quoteOfTheDaySection.style.display = activeSection === 'quote-of-the-day' ? 'block' : 'none'; // Show Quote of the Day section
    };
    
    generateTab.addEventListener('click', () => switchTab('generate'));
    submitTab.addEventListener('click', () => switchTab('submit'));
    viewTab.addEventListener('click', () => {
      switchTab('view');
      fetchSubmittedQuotes();
    });
    favouriteTab.addEventListener('click', () => {
      switchTab('favourite');
      fetchFavouriteQuotes();
    });
    quoteOfTheDayTab.addEventListener('click', () => {
      switchTab('quote-of-the-day');
      fetchQuoteOfTheDay(); // Fetch Quote of the Day
    });
  
    // Fetch a random quote
    generateButton.addEventListener('click', () => {
      fetch('http://localhost:8080/api/quote')
        .then(response => response.json())
        .then(data => {
          quoteDisplay.innerText = data.quote;
          heartIcon.dataset.quoteId = data.id;
          heartIcon.style.display = 'inline';
        })
        .catch(error => {
          console.error('Error fetching quote:', error);
          quoteDisplay.innerText = "Couldn't fetch a quote. Please try again!";
        });
    });
  
    // Add the quote to favourites when heart icon is clicked
    heartIcon.addEventListener('click', () => {
      const quoteId = heartIcon.dataset.quoteId;
      if (quoteId) {
        fetch('http://localhost:8080/api/favourite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quote_id: quoteId })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Quote added to favourites!');
          } else {
            alert('Failed to add quote to favourites.');
          }
        })
        .catch(error => {
          console.error('Error adding to favourites:', error);
        });
      }
    });
  
    // Submit a new quote
    submitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newQuote = userQuoteInput.value.trim();
  
      if (newQuote) {
        fetch('http://localhost:8080/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quote: newQuote })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Quote submitted successfully!');
            userQuoteInput.value = ''; // Clear input field
          } else {
            alert('Error submitting quote. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error submitting quote:', error);
        });
      } else {
        alert('Please enter a quote before submitting.');
      }
    });
  
    // Fetch and display submitted quotes
    const fetchSubmittedQuotes = () => {
      fetch('http://localhost:8080/api/quotes')
        .then(response => response.json())
        .then(data => {
          quoteList.innerHTML = '';
          data.quotes.forEach((quote) => {
            const li = document.createElement('li');
            li.textContent = quote.quote;
            quoteList.appendChild(li);
          });
        })
        .catch(error => {
          console.error('Error fetching submitted quotes:', error);
        });
    };
  
    // Fetch and display favourite quotes
    const fetchFavouriteQuotes = () => {
      fetch('http://localhost:8080/api/favourites')
        .then(response => response.json())
        .then(data => {
          favouriteList.innerHTML = '';
          data.favourites.forEach((quote) => {
            const li = document.createElement('li');
            li.textContent = quote.text;
            favouriteList.appendChild(li);
          });
        })
        .catch(error => {
          console.error('Error fetching favourite quotes:', error);
        });
    };
  
    // Fetch the Quote of the Day
    const fetchQuoteOfTheDay = () => {
      fetch('http://localhost:8080/api/quote-of-the-day')
        .then(response => response.json())
        .then(data => {
          document.getElementById('quote-of-the-day-text').innerText = data.quote;
        })
        .catch(error => {
          console.error('Error fetching quote of the day:', error);
          document.getElementById('quote-of-the-day-text').innerText = "Couldn't fetch the Quote of the Day.";
        });
    };
  });
  