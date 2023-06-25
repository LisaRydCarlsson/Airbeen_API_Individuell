const nedb = require("nedb-promise");
const usersDB = new nedb({ filename: "databases/users.db", autoload: true });

function updateUserOrders(userID, newOrder) {
   usersDB.update({ _id: userID }, { $push: { orders: newOrder } });
}

function createUser(newUser) {
   return usersDB.insert(newUser);
}

async function findUsers(property, value) {
   const query = {};
   if (property && value) {
      query[property] = value;
   }
   const users = await usersDB.find(query);
   return users;
}

async function deleteUser(id) {
   return usersDB.remove({ _id: id });
}

module.exports = {
   updateUserOrders,
   createUser,
   findUsers,
   deleteUser,
};
