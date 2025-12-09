const express = require('express');
const app = express();
const port = 3000;

// IMPORTANT: Enable JSON parsing
app.use(express.json());

// Routes
const routes = require("./routes");
app.use("/", routes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});