require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { User } = require('./models/'); // Importez le modèle User
const bcrypt = require('bcrypt');


const app = express();
app.use(express.static('public'));

app.use(cors({ origin: '*' }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const openai = require('./lib/openai')

function buildAccompagnements(recipe) {
    return `
        Suggérer les accompagnements possible pour cette recête : 
        Nom de la recette est ${recipe.name}
        Description de la recette est ${recipe.description}
        les ingrédients de la recette sont : 
        ${recipe.ingredients.map(ingredient=>`- ${ingredient.name}\n`)}
    `
}
function buildShoppingList(recipe) {
    return `
        donne moi ma liste de courses pour faire ce plat :${recipe},
    `
}

app.post('/accompagnement',  async (req, res) => {

    //const {text} = req.body()

    const recipe = {name: "Spaghetti Bolognese", description: "Classic Italian pasta dish with rich meat sauce.", ingredients: [
        {
          "name": "Spaghetti",
        },
        {
          "name": "Ground Beef",
        },
        {
          "name": "Tomato Sauce",
        }]}
    const recipe2 = {name: "Bœuf bourguignon", description: "Le bœuf bourguignon est une recette de cuisine d'estouffade de bœuf considerée aujourd'hui comme étant traditionnelle de la cuisine bourguignonne", ingredients: [
        {
          "name": "boeuf",
        },
        {
          "name": "lardons",
        },
        {
          "name": "carotte",
        }]}
    const recipe3 = {name: "paella", description: "La paella est une spécialité culinaire traditionnelle espagnole à base de riz rond, originaire de la région de Valence,", ingredients: [
        {
          "name": "filet de poulet",
        },
        {
          "name": "crevettes",
        },
        {
          "name": " riz ",
        }
        ]}

    const completions = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Tu es un chef cuisinier aidant les utilisateurs à récupérer des idées d'accompagnement pour une recette." +
                    "Chaque fois qu'un utilisateur te donne une recette, tu lui fourniras 7 idées d'acompagnements qui vont avec ce plat comme du vin, un dessert, un fromage etc." +
                    "Je veux que ta réponse soit un objet JSON. L'objet JSON devrait être une liste de d'acompagnements : {\"accompagnements\"{\"name\": \" chaîne de caractères\", \"description\": \" chaîne de caractères\"}}"
            },
            {
                role: "user",
                content: buildAccompagnements(recipe3)
            }
        ]
    });


    res.status(200).json({result: JSON.parse(completions.choices[0].message.content)})

})


app.get('/shopping-list',  async (req, res) => {

    const recipe = "spaghetti Bolognese"
    const recipe2 = "bouf bourguignon"
    const recipe3 ="paella"
    const fakeRecipe ="sandale"

    const completions = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Tu es un chef cuisinier, un utilisateur viendra te demander une recette pour un plat qu'il te fournira." +
                    "Chaque fois qu'un utilisateur te donne un plat, tu lui fourniras la liste de courses pour faire ce plat" +
                    "Je veux que ta réponse soit un objet JSON ecrit en francais. L'objet JSON devrait être une liste de d'ingrédients : {\"ingredients\"{\"name\": \"nom de l'ingredient sans quantités\"}} ." +
                    "si la demande de l'utilisateur n'est pas un plat, L'objet JSON devrait être une liste de d'ingrédients : {\"error\"\"Ce n'est pas un plat\"} ."
            },
            {
                role: "user",
                content: buildShoppingList(recipe)
            }
        ]
    });


    res.status(200).json({result: JSON.parse(completions.choices[0].message.content)})

})


app.get('/chat',  async (req, res) => {

    //const {text} = req.body()

    const messages = [{role: "user", content: "Hello how are you ?"}, {role: "system", content: "fine and you ?"}]

    const question = "Fine, give me a good recipe for breakfeast"

    const newMessages = [
        ...messages,
        {
          role: "user",
          content: question
        }
    ];

    const completions = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Tu es un chef cuisinier de 5 ans d'expérience. Chaque fois qu'un utilisateur te pose une question, tu lui répondra simplement. Tu répondra seulement du texte et en francais."
            },
            ...newMessages
        ]
    });

    res.status(200).json({messages: [
        ...newMessages,
        completions.choices[0].message
      ]})

})

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà.' });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur dans la base de données
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
  });
  