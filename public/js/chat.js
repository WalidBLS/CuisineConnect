document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const questionInput = document.getElementById('textAreaChat');
    const question = questionInput.value;
    //const loader = document.getElementById('loader');
    const responseDiv = document.getElementById('chat1');

    //loader.hidden = false; 


    var paragraphs = responseDiv.querySelectorAll('p');

    var messages = [];
    var role = "assistant";

    paragraphs.forEach(function(paragraph, index) {

        if (index > 0) {
            var content = paragraph.textContent.trim();
            messages.push({ role: role, content: content });

            role = (role === "assistant") ? "user" : "assistant";
        }

        
    });


    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, question })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        
        function createMessageElement(message) {
            var div = document.createElement("div");
            var img = document.createElement("img");
            var messageDiv = document.createElement("div");
            var p = document.createElement("p");
        
            div.classList.add("d-flex", "flex-row", "mb-4");
            messageDiv.classList.add("p-3", message.role === "assistant" ? "ms-3" : "me-3");
            p.classList.add("small", "mb-0");
        
            if (message.role === "assistant") {
                div.classList.add("justify-content-start");
                img.src = "https://static.vecteezy.com/ti/vecteur-libre/p3/10054157-chat-bot-robot-avatar-en-cercle-forme-ronde-isole-sur-fond-blanc-illustrationle-de-stock-technologie-ai-futuriste-aide-communication-conversation-concept-dans-un-style-plat-vectoriel.jpg";
                messageDiv.style.borderRadius = "15px";
                messageDiv.style.backgroundColor = "rgba(57, 192, 237,.2)";
            } else {
                div.classList.add("justify-content-end", "text-center");
                messageDiv.style.borderRadius = "15px";
                messageDiv.style.backgroundColor = "#fbfbfb";
                img.src = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
            }
        
            img.alt = "avatar";
            img.style.width = "45px";
            img.style.height = "100%";
        
            p.textContent = message.content;
        
            messageDiv.appendChild(p);
            if (message.role === "assistant") {
                div.appendChild(img);
                div.appendChild(messageDiv);
            } else {
                div.appendChild(messageDiv);
                div.appendChild(img);
            }
        
            return div;
        }

        var parentElement = document.querySelector('#card-messages');
        parentElement.innerHTML = "";
        data.messages.forEach(function (message) {
            var messageElement = createMessageElement(message);
            parentElement.appendChild(messageElement);
        });


    })
    .catch(error => {
        //titre.hidden = true;
        //loader.hidden = true;
        responseDiv.textContent = 'Erreur: Impossible de récupérer le chat';
        console.error('Erreur:', error);
    });
    console.log(messages);

});