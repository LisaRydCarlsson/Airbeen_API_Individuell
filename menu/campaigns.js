const nedb = require("nedb-promise");
const campaignsDB = new nedb({ filename: "databases/campaigns.db", autoload: true });
const { createDB } = require("../utilities/createDB.js");

async function getCampaigns() {
   const menu = await campaignsDB.find({});
   return menu;
}

async function findCampaignItem(id) {
   return await campaignsDB.findOne({ _id: id });
}

async function addCampaignItem(item) {
   item.createdAt = new Date().toLocaleString();
   return await campaignsDB.insert(item);
}

// Uppdaterar enskilda produkter i campaigns.db med id.
async function updateCampaignItem(id, updatedItem) {
   // Find menu item
   const item = await campaignsDB.findOne({ _id: id });
   updatedItem.createdAt = item.createdAt;
   updatedItem.modifiedAt = new Date().toLocaleString();
   const numUpdated = await campaignsDB.update({ _id: id }, updatedItem);
   if (numUpdated === 1) {
      return "Campaign is now updated";
   } else {
      throw new Error("Failed to update campaign");
   }
}

// Uppdaterar hela campaigns.db
async function updateCampaignItems(updatedCampaign) {
   await campaignsDB.remove({}, { multi: true });
   await campaignsDB.insert(updatedCampaign);
}

module.exports = {
   getCampaigns,
   findCampaignItem,
   addCampaignItem,
   updateCampaignItem,
   updateCampaignItems,
};
