document.getElementById('question-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const questionInput = document.getElementById('question-input');
    const question = questionInput.value;
    const titre = document.getElementById('titre');
    const loader = document.getElementById('loader');
    const responseDiv = document.getElementById('response');

    titre.hidden = true
    loader.hidden = false; 
    responseDiv.textContent = ''; 

    fetch('/shopping-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => {
        titre.hidden = false
        loader.hidden = true; 
        const listGroup = document.getElementById('response');
        listGroup.textContent = '';
    
        // Création de la liste Bootstrap
        const ul = document.createElement('ul');
        ul.classList.add('list-group');
    
        let alternateColor = false;
    
        for (var key in data.result.ingredients) {
            if (data.result.ingredients.hasOwnProperty(key)) {
                var item = data.result.ingredients[key];
    
                var li = document.createElement("li");
                li.classList.add("list-group-item");
                
                // Alterner entre les classes de couleur
                if (alternateColor) {
                    li.classList.add("list-group-item-secondary");
                }
    
                li.innerHTML = item.name;
    
                ul.appendChild(li);
    
                // Inverser la variable alternateColor pour le prochain élément
                alternateColor = !alternateColor;
            }
        }
    
        listGroup.appendChild(ul);
    })
    
    .catch(error => {
        titre.hidden = true;
        loader.hidden = true;
        responseDiv.textContent = 'Erreur: Impossible de récupérer la réponse';
        console.error('Erreur:', error);
    });
});