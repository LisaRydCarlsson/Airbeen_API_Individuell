const express = require("express");

const beansRoutes = require("./routes/beansRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const menuRoutes = require("./routes/menuRoutes.js");

const app = express();
const PORT = 1337;

app.use(express.json());
app.use(beansRoutes);
app.use(userRoutes);
app.use(menuRoutes);

app.listen(PORT, () => {
   console.log("Listening on port", PORT);
});