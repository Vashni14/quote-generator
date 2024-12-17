document.getElementById('generate-quote').addEventListener('click', () => {
    fetch('/api/quote')
      .then(response => response.json())
      .then(data => {
        document.getElementById('quote').innerText = data.quote;
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
        document.getElementById('quote').innerText = "Couldn't fetch a quote. Please try again!";
      });
  });
  