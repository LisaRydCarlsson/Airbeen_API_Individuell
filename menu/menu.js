const nedb = require("nedb-promise");
const menuDB = new nedb({ filename: "databases/menu.db", autoload: true });
const { createDB } = require("../createDB.js");

// createDB('/menu/menu.json', menuDB);

async function getMenu() {
   const menu = await menuDB.find({});
   return menu;
}

async function findMenuItem(id) {
   return await menuDB.findOne({ id: id });
}

async function addMenuItem(item) {
   item.createdAt = new Date().toLocaleString();
   return await menuDB.insert(item);
}

// Uppdaterar enskilda produkter i menu.db med id.
async function updateMenuItem(id, updatedItem) {
   updatedItem.modifiedAt = new Date().toLocaleString();
   return await menuDB.update({ id: id }, updatedItem);
}

// Uppdaterar hela menu.db
async function updateMenuItems(updatedMenu) {
   await menuDB.remove({}, { multi: true });
   await menuDB.insert(updatedMenu);
}

async function removeMenuItem(id) {
   return await menuDB.remove({ id: id });
}

module.exports = {
   getMenu,
   findMenuItem,
   addMenuItem,
   updateMenuItem,
   updateMenuItems,
   removeMenuItem,
};
