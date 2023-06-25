const nedb = require("nedb-promise");
const menuDB = new nedb({ filename: "databases/menu.db", autoload: true });
const { createDB } = require("../utilities/createDB.js");

async function getMenu() {
   const menu = await menuDB.find({});
   return menu;
}

async function findMenuItem(id) {
   return await menuDB.findOne({ _id: id });
}

async function addMenuItem(item) {
   item.createdAt = new Date().toLocaleString();
   return await menuDB.insert(item);
}

// Uppdaterar enskilda produkter i menu.db med id.
async function updateMenuItem(id, updatedItem) {
   // Find menu item
   const item = await menuDB.findOne({ _id: id });
   updatedItem.createdAt = item.createdAt;
   updatedItem.modifiedAt = new Date().toLocaleString();
   const numUpdated = await menuDB.update({ _id: id }, updatedItem);
   if (numUpdated === 1) {
      return "Item is now updated";
   } else {
      throw new Error("Failed to update item");
   }
}

// Uppdaterar hela menu.db
async function updateMenuItems(updatedMenu) {
   await menuDB.remove({}, { multi: true });
   await menuDB.insert(updatedMenu);
}

module.exports = {
   getMenu,
   findMenuItem,
   addMenuItem,
   updateMenuItem,
   updateMenuItems,
};
