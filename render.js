const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Path to your EJS template
const inputFile = path.join(__dirname, 'moderation.ejs');

// Path where you want the HTML file to be saved
const outputFile = path.join(__dirname, 'moderation.html');

// Example of posts data (you can replace this with actual data if available)
const posts = [
  { username: 'john_doe', post: 'This is a random post content.' },
  { username: 'jane_smith', post: 'Another random post here!' }
];

// Render EJS to HTML
ejs.renderFile(inputFile, { posts }, (err, str) => {
  if (err) {
    console.error('Error rendering EJS:', err);
  } else {
    // Write rendered HTML to a file
    fs.writeFileSync(outputFile, str);
    console.log('EJS file has been converted to HTML');
  }
});

