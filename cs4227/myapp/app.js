const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'FitToGoUsers',
  password: 'coleworld1',
  port: 5433,
});

client.connect();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));  // To parse POST data

// Route to render the main page (only active posts)
app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM user_posts WHERE status = $1', ['Active']);
    res.render('index', { posts: result.rows });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Error fetching posts');
  }
});

// Route to render the moderation page (only under review posts)
app.get('/moderation', async (req, res) => {
    try {
      // Fetch posts where status is 'Under Review'
      const result = await client.query('SELECT * FROM user_posts WHERE status = $1', ['Under Review']);
      res.render('moderation', { posts: result.rows });
    } catch (err) {
      console.error('Error fetching moderation posts:', err);
      res.status(500).send('Error fetching posts');
    }
  });
  

// Route to moderate a post (move to under review)
app.post('/moderate', async (req, res) => {
  const postId = req.body.id;
  try {
    // Update the post status to 'Under Review'
    await client.query('UPDATE user_posts SET status = $1 WHERE id = $2', ['Under Review', postId]);
    res.redirect('/');
  } catch (err) {
    console.error('Error moderating post:', err);
    res.status(500).send('Error moderating post');
  }
});

// Route to ban a user (move to banned_users table and mark post as banned)
app.post('/ban', async (req, res) => {
  const postId = req.body.id;
  try {
    // Move the user to banned_users table
    const postResult = await client.query('SELECT username FROM user_posts WHERE id = $1', [postId]);
    const username = postResult.rows[0].username;

    await client.query('INSERT INTO banned_users (username) VALUES ($1)', [username]);

    // Mark the user’s post as banned
    await client.query('UPDATE user_posts SET status = $1 WHERE id = $2', ['Banned', postId]);

    res.redirect('/');
  } catch (err) {
    console.error('Error banning user:', err);
    res.status(500).send('Error banning user');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
