const express = require("express");
const { checkProperty } = require("../utilities/order.js");
const { getMenu, addMenuItem, updateMenuItem, updateMenuItems } = require("../menu/menu.js");
const { getCampaigns, addCampaignItem, updateCampaignItem, updateCampaignItems } = require("../menu/campaigns.js");
const { isAdmin } = require("../middlewares/auth.js");
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

      if (!item) {
         return res.status(404).json({ success: false, message: "Product not found." });
      }

      return res.json(item);
   } catch (error) {
      return res.status(500).json({ message: "Server error." });
   }
});

// Ta bort en produkt från menyn
router.delete("/api/admin/menu/:id", isAdmin, async (req, res) => {
   try {
      const id = req.params.id;
      const menu = await getMenu();
      const menuItem = menu.find((item) => item._id === id);

      if (!menuItem) {
         return res.status(404).json({ success: false, message: "Product not found." });
      }

      const updatedMenu = menu.filter((item) => item._id !== id);
      await updateMenuItems(updatedMenu);

      return res.json({
         success: true,
         message: "Product removed successfully.",
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error." });
   }
});

// Lägg till en kampanj i menyn
router.post("/api/admin/addcampaign", isAdmin, checkProperty("item"), async (req, res) => {
   try {
      const newItem = req.body.item;
      const item = await addCampaignItem(newItem);
      return res.json(item);
   } catch (error) {
      return res.status(500).json({ message: "Server error." });
   }
});

// Uppdatera en kampanj
router.put("/api/admin/changecampaign/:id", isAdmin, checkProperty("item"), async (req, res) => {
   try {
      const id = req.params.id;
      const updatedItem = req.body.item;
      const item = await updateCampaignItem(id, updatedItem);

      if (!item) {
         return res.status(404).json({ success: false, message: "Campaign not found." });
      }

      return res.json(item);
   } catch (error) {
      return res.status(500).json({ message: "Server error." });
   }
});

// Ta bort en kampanj
router.delete("/api/admin/removecampaign/:id", isAdmin, async (req, res) => {
   try {
      const id = req.params.id;
      const menu = await getCampaigns();
      const campaignItem = menu.find((item) => item._id === id);

      if (!campaignItem) {
         return res.status(404).json({ success: false, message: "Campaign not found." });
      }

      const updatedCampaign = menu.filter((item) => item._id !== id);
      await updateCampaignItems(updatedCampaign);

      return res.json({
         success: true,
         message: "Campaign removed successfully.",
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error." });
   }
});

module.exports = router;
