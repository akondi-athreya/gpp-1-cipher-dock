const express = require('express');
const app = express();
const port = 8080;

// IMPORTANT: Enable JSON parsing
app.use(express.json());

// Routes
const routes = require("./routes");
app.use("/", routes);

const healthRoutes = require("./routes/health.routes");

app.use("/health", healthRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});