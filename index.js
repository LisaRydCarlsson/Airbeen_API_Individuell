const express = require("express");

const menuRoutes = require("./routes/menuRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();
const PORT = 1337;

app.use(express.json());
app.use(menuRoutes);
app.use(orderRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
   console.log("Listening on port", PORT);
});
