document.getElementById('accompagnement-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const loader = document.getElementById('loader');
    const responseDiv = document.getElementById('response');

    loader.hidden = false;
    responseDiv.textContent = '';

    fetch('/accompagnement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        //body: JSON.stringify({ question })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            loader.hidden = true;
            for (var key in data.result.accompagnements) {
                if (data.result.accompagnements.hasOwnProperty(key)) {
                    var item = data.result.accompagnements[key];

                    // Créez une nouvelle div pour chaque objet
                    var newDiv = document.createElement("li");

                    // Ajoutez une classe à la nouvelle div
                    newDiv.classList.add("list-group-item");

                    // Ajoutez le contenu de l'objet à la div
                    newDiv.innerHTML = item.name + " : " + item.description;

                    // Ajoutez la nouvelle div à votre conteneur
                    responseDiv.appendChild(newDiv);
                }
            }
            //responseDiv.textContent = data.result.accompagnements; 
        })
        .catch(error => {
            loader.hidden = true;
            responseDiv.textContent = 'Erreur: Impossible de récupérer la réponse';
            console.error('Erreur:', error);
        });
});