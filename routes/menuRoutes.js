const express = require("express");
const { checkProperty } = require("../utils.js");
const { getMenu, addMenuItem, updateMenuItem } = require("../menu/menu.js");
const { isAdmin } = require("../middlewares/auth.js");
const { removeMenuItem } = require("../menu/menu.js");

const router = express.Router();

// Lägg till en produkt i menyn
router.post("/api/admin/menu", isAdmin, checkProperty("item"), async (req, res) => {
   try {
      const newItem = req.body.item;
      const item = await addMenuItem(newItem);
      return res.json(item);
   } catch (error) {
      return res.status(500).json({ message: "Server error." });
   }
});

// Uppdatera en produkt
router.put("/api/admin/menu/:id", isAdmin, checkProperty("item"), async (req, res) => {
   try {
      const id = req.params.id;
      const updatedItem = req.body.item;
      const item = await updateMenuItem(id, updatedItem);
      return res.json(item);
   } catch (error) {
      return res.status(500).json({ message: "Server error." });
   }
});

module.exports = router;
