// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-quote');
    const quoteDisplay = document.getElementById('quote');
  
    // Add click event listener to the button
    generateButton.addEventListener('click', () => {
      fetch('http://localhost:5000/api/quote') // Use your backend URL
        .then(response => response.json())
        .then(data => {
          quoteDisplay.innerText = data.quote; // Display the quote
        })
        .catch(error => {
          console.error('Error fetching quote:', error);
          quoteDisplay.innerText = "Couldn't fetch a quote. Please try again!";
        });
    });
  });
  