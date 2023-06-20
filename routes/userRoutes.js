const express = require("express");
const { findUsers, createUser, updateUser } = require("../users/users.js");
const { checkProperty } = require("../utils.js");
const { isAdmin } = require("../middlewares/auth.js");
const router = express.Router();

// Skapa konto
router.post(
   "/api/user/signup",
   checkProperty("username"),
   checkProperty("password"),
   async (req, res) => {
      const newUser = {
         username: req.body.username,
         password: req.body.password,
         orders: [],
      };
      let responseObj = {
         success: true,
         message: "Signup ok.",
      };

      const users = await findUsers();

      users.forEach((user) => {
         if (user.username === newUser.username) {
            responseObj.success = false;
            responseObj.message = "User already exists.";
         }
      });

      if (responseObj.success) {
         createUser(newUser);
      }

      return res.json(responseObj);
   }
);

// Logga in
router.post(
   "/api/user/login",
   checkProperty("username"),
   checkProperty("password"),
   async (req, res) => {
      const currentUser = req.body;
      let responseObj = {
         success: true,
         message: "Login ok.",
      };

      const [user] = await findUsers("username", currentUser.username);
      if (user) {
         if (currentUser.password !== user.password) {
            responseObj.success = false;
            responseObj.message = "Wrong password.";
         }
      } else {
         responseObj.success = false;
         responseObj.message = "Wrong username.";
      }

      return res.json(responseObj);
   }
);

// Uppdatera användare
router.put("/api/user/:id", isAdmin, checkProperty("user"), async (req, res) => {
   try {
      const id = req.params.id;
      const updatedUser = req.body.user;

      // Kolla om användaren har rätt roll
      if (updatedUser.role !== "customer" && updatedUser.role !== "admin") {
         return res.status(400).json({
            message: 'Invalid role. Must be either "customer" or "admin".',
         });
      }

      // Uppdatera användaren i databasen
      const result = await updateUser(id, updatedUser);

      if (!result) {
         return res.status(404).json({ message: "User not found." });
      }

      return res.json(result);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error." });
   }
});

// Hämta orderhistorik
router.get("/api/user/history", checkProperty("userID"), async (req, res) => {
   const userID = req.body.userID;
   const [user] = await findUsers("_id", userID);
   const responseObj = {
      message: "Previous orders",
   };

   if (user) {
      responseObj.orders = user.orders;
      return res.json(responseObj);
   } else {
      responseObj.message = "Invalid userID.";
      return res.status(400).json(responseObj);
   }
});

module.exports = router;
