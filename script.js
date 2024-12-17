// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-quote');
    const quoteDisplay = document.getElementById('quote');
    const submitForm = document.getElementById('submit-quote-form');
    const userQuoteInput = document.getElementById('user-quote');
    const quoteList = document.getElementById('quote-list');
    
    // Tabs
    const generateTab = document.getElementById('generate-tab');
    const submitTab = document.getElementById('submit-tab');
    const viewTab = document.getElementById('view-tab');
    const generateSection = document.getElementById('generate-section');
    const submitSection = document.getElementById('submit-section');
    const viewSection = document.getElementById('view-section');
  
    // Switch tab visibility
    const switchTab = (activeSection) => {
      generateSection.style.display = activeSection === 'generate' ? 'block' : 'none';
      submitSection.style.display = activeSection === 'submit' ? 'block' : 'none';
      viewSection.style.display = activeSection === 'view' ? 'block' : 'none';
    };
  
    generateTab.addEventListener('click', () => switchTab('generate'));
    submitTab.addEventListener('click', () => switchTab('submit'));
    viewTab.addEventListener('click', () => {
      switchTab('view');
      fetchSubmittedQuotes();
    });
  
    // Fetch a random quote
    generateButton.addEventListener('click', () => {
      fetch('http://localhost:5000/api/quote') // Correct backend URL
        .then(response => response.json())
        .then(data => {
          quoteDisplay.innerText = data.quote; // Display the quote
        })
        .catch(error => {
          console.error('Error fetching quote:', error);
          quoteDisplay.innerText = "Couldn't fetch a quote. Please try again!";
        });
    });
  
    // Submit a new quote
    submitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newQuote = userQuoteInput.value.trim();
  
      if (newQuote) {
        fetch('http://localhost:5000/api/submit', { // Correct backend URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quote: newQuote }),
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
      fetch('http://localhost:5000/api/quotes') // Correct backend URL
        .then(response => response.json())
        .then(data => {
          quoteList.innerHTML = ''; // Clear current list
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
});
