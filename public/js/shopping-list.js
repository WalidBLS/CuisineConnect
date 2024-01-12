document.getElementById('question-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const questionInput = document.getElementById('question-input');
    const question = questionInput.value;
    const loader = document.getElementById('loader');
    const responseDiv = document.getElementById('response');

    loader.hidden = false; 
    responseDiv.textContent = ''; 

    fetch('/shopping-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => {
        loader.hidden = true; 
        for (var key in data.result.ingredients) {
            if (data.result.ingredients.hasOwnProperty(key)) {
              var item = data.result.ingredients[key];
          
              var newDiv = document.createElement("div");
              newDiv.innerHTML = item.name;
          
              responseDiv.appendChild(newDiv);
            }
        }
    })
    .catch(error => {
        loader.hidden = true;
        responseDiv.textContent = 'Erreur: Impossible de récupérer la réponse';
        console.error('Erreur:', error);
    });
});