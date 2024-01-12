document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('.accompagnement-form');

    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const loader = document.getElementById('loader');
            const responseDiv = document.getElementById('response');

            const TitleDiv = document.getElementById('exampleModalLabel');

            loader.hidden = false;
            responseDiv.textContent = '';

            const recipeCard = form.querySelector('.card');

            const recipeName = recipeCard.querySelector('.card-title').innerText;
            const recipeDescription = recipeCard.querySelector('.card-text').innerText;

            const ingredientsListItems = recipeCard.querySelectorAll('.list-group-item');
            const ingredients = Array.from(ingredientsListItems).map(item => {
            return {
                name: item.innerText.trim(),
            };
            });

            const recipe = {
            name: recipeName,
            description: recipeDescription,
            ingredients: ingredients,
            };

            TitleDiv.textContent = recipeName

            fetch('/accompagnement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipe })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                loader.hidden = true;
                for (var key in data.result.accompagnements) {
                    if (data.result.accompagnements.hasOwnProperty(key)) {
                        var item = data.result.accompagnements[key];

                        var newDiv = document.createElement("li");

                        newDiv.classList.add("list-group-item");

                        newDiv.innerHTML = item.name + " : " + item.description;

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
    });
});







document.getElementById('accompagnement-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const loader = document.getElementById('loader');
    const responseDiv = document.getElementById('response');
    const TitleDiv = document.getElementById('exampleModalLabel');

    loader.hidden = false;
    responseDiv.textContent = '';


    const recipeCard = document.querySelector('.card');

    const recipeName = recipeCard.querySelector('.card-title').innerText;
    const recipeDescription = recipeCard.querySelector('.card-text').innerText;

    const ingredientsListItems = recipeCard.querySelectorAll('.list-group-item');
    const ingredients = Array.from(ingredientsListItems).map(item => {
    return {
        name: item.innerText.trim(),
    };
    });

    const recipe = {
    name: recipeName,
    description: recipeDescription,
    ingredients: ingredients,
    };

    TitleDiv.textContent = recipeName

    fetch('/accompagnement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            loader.hidden = true;
            for (var key in data.result.accompagnements) {
                if (data.result.accompagnements.hasOwnProperty(key)) {
                    var item = data.result.accompagnements[key];

                    var newDiv = document.createElement("li");

                    newDiv.classList.add("list-group-item");

                    newDiv.innerHTML = item.name + " : " + item.description;

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