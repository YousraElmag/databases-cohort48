const { MongoClient, ObjectId } = require('mongodb');

async function createRecipe() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('recipe_db');
        const recipes = database.collection('recipes');

        const newRecipe = {
            recipe_name: "Pasta Carbonara",
            categories: [
                { category_id: new ObjectId(), category_name: "Italian" },
                { category_id: new ObjectId(), category_name: "Main Course" }
            ],
            ingredients: [
                { ingredient_id: new ObjectId(), ingredient_name: "Pasta", quantity: "200", unit: "grams" },
                { ingredient_id: new ObjectId(), ingredient_name: "Bacon", quantity: "100", unit: "grams" }
            ],
            steps: [
                { step_order: 1, step_description: "Boil pasta." },
                { step_order: 2, step_description: "Fry bacon." },
            ]
        };

        const result = await recipes.insertOne(newRecipe);
        console.log(`Recipe inserted with id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}

createRecipe();

// What are the collections?
// -Recipes Collection
// -Categories Collection
// -Ingredients Collection
// -Steps Collection

// What information will you embed in a document and which will you store normalised?
// This collection will store the main recipe data, and some related data can be embedded
// Embedded Data: categories, ingredients, and steps are embedded because they are often fetched together when retrieving a recipe
// Normalization: The Categories collection can be referenced in the Recipes collection by storing only the category_id within the recipes document.
//  This is useful when categories are reused across recipes.