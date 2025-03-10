const { Client } = require('pg');

// Using the correct import for Faker
const { faker } = require('@faker-js/faker');  // Use this for newer versions of Faker

// Set up the PostgreSQL client
const client = new Client({
  user: 'dara',  // Your PostgreSQL username
  host: 'localhost', // PostgreSQL server host
  database: 'FitToGoUsers', // Your database name
  password: 'coleworld1', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect();

// Function to generate random data
function generateRandomData() {
  return {
    username: faker.internet.userName(),  // Random username
    post: faker.lorem.paragraph(),        // Random post (flavor text)
  };
}

// Function to populate the database with random entries
async function populateDatabase(numEntries) {
  try {
    for (let i = 0; i < numEntries; i++) {
      const { username, post } = generateRandomData();
      
      // Insert random data into the user_posts table
      await client.query(
        'INSERT INTO user_posts (username, post) VALUES ($1, $2)', 
        [username, post]
      );
    }
    
    console.log(`${numEntries} random posts inserted.`);
    client.end();
  } catch (error) {
    console.error('Error inserting data:', error);
    client.end();
  }
}

// Populate the database with 100 random entries
populateDatabase(10);
