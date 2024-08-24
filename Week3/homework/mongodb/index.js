// Load environment variables
require('dotenv').config();

// Import MongoDB client
const { MongoClient, ServerApiVersion } = require('mongodb');
const { seedDatabase } = require('./seedDatabase.js');

// Function to create an episode
async function createEpisodeExercise(client) {
  const db = client.db(); // The database is already specified in the URI
  const collection = db.collection('bob_ross_episodes');

  const result = await collection.insertOne({
    episode: 'S09E13',
    title: 'MOUNTAIN HIDE-AWAY',
    elements: [
      'CIRRUS', 'CLOUDS', 'CONIFER', 'DECIDIOUS', 'GRASS', 'MOUNTAIN',
      'MOUNTAINS', 'RIVER', 'SNOWY_MOUNTAIN', 'TREE', 'TREES'
    ],
  });

  console.log(`Created season 9 episode 13 and the document got the id ${result.insertedId}`);
}

// Function to find episodes and display information
async function findEpisodesExercises(client) {
  const db = client.db(); // The database is already specified in the URI
  const collection = db.collection('bob_ross_episodes');

  // Find the title of episode 2 in season 2
  const episode2Season2 = await collection.findOne({ episode: 'S02E02' });
  console.log(`The title of episode 2 in season 2 is ${episode2Season2 ? episode2Season2.title : 'Not found'}`);

  // Find the season and episode number of the episode called "BLACK RIVER"
  const blackRiverEpisode = await collection.findOne({ title: 'BLACK RIVER' });
  console.log(`The season and episode number of the "BLACK RIVER" episode is ${blackRiverEpisode ? blackRiverEpisode.episode : 'Not found'}`);

  // Find all episode titles where Bob Ross painted a CLIFF
  const cliffEpisodes = await collection.find({ elements: 'CLIFF' }).toArray();
  const cliffTitles = cliffEpisodes.map(ep => ep.title);
  console.log(`The episodes that Bob Ross painted a CLIFF are ${cliffTitles.join(', ')}`);

  // Find all episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE
  const cliffAndLighthouseEpisodes = await collection.find({
    elements: { $all: ['CLIFF', 'LIGHTHOUSE'] }
  }).toArray();
  const cliffAndLighthouseTitles = cliffAndLighthouseEpisodes.map(ep => ep.title);
  console.log(`The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${cliffAndLighthouseTitles.join(', ')}`);
}

// Function to update episodes
async function updateEpisodeExercises(client) {
  const db = client.db(); // The database is already specified in the URI
  const collection = db.collection('bob_ross_episodes');

  // Update episode 13 in season 30 from BLUE RIDGE FALLERS to BLUE RIDGE FALLS
  const updateResult = await collection.updateOne(
    { episode: 'S30E13' },
    { $set: { title: 'BLUE RIDGE FALLS' } }
  );
  console.log(`Ran a command to update episode 13 in season 30 and it updated ${updateResult.modifiedCount} episodes`);

  // Update all documents with 'BUSHES' to 'BUSH'
  const updateBushesResult = await collection.updateMany(
    { elements: 'BUSHES' },
    { $set: { 'elements.$[elem]': 'BUSH' } },
    { arrayFilters: [{ 'elem': 'BUSHES' }] }
  );
  console.log(`Ran a command to update all the BUSHES to BUSH and it updated ${updateBushesResult.modifiedCount} episodes`);
}

// Function to delete a specific episode
async function deleteEpisodeExercise(client) {
  const db = client.db(); // The database is already specified in the URI
  const collection = db.collection('bob_ross_episodes');

  // Define the query to find episode 14 in season 31
  const query = { episode: 'S31E14' };

  const deleteResult = await collection.deleteOne(query);
  console.log(`Ran a command to delete episode and it deleted ${deleteResult.deletedCount} episodes`);
}

async function main() {
  if (!process.env.MONGODB_URL) {
    console.error('Environment variable MONGODB_URL is not set up correctly.');
    console.error('MONGODB_URL:', process.env.MONGODB_URL);
    throw new Error('You did not set up the environment variable MONGODB_URL correctly.');
  }

  const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    await seedDatabase(client);
    await createEpisodeExercise(client);
    await findEpisodesExercises(client);
    await updateEpisodeExercises(client);
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
