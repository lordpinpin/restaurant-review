const express = require('express');
const path = require('path');
const exit = require('exit');

const app = express();
const port = 3000;

app.use(express.static('public'));

// Define an API endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public',  'html', 'index.html'));
});

app.listen(port, () => {
  console.log(`Node.js server listening on port ${port}`);
});

process.on('uncaughtException', (error) => {
  console.error('Unhandled exception:', error);
  exitHook(() => {
    process.exit(1); // Stop nodemon when an uncaught exception occurs
  });
});
