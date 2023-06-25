const express = require("express");
const bcrypt = require("bcrypt");
const { findUsers, createUser, deleteUser } = require("../utilities/users.js");
const { checkProperty } = require("../utilities/order.js");
const { authenticateAdmin } = require("../middlewares/auth.js");
const { isAdmin } = require("../middlewares/auth.js");
const router = express.Router();

// Skapa konto - FUNKAR
router.post("/api/user/signup", checkProperty("username"), checkProperty("password"), async (req, res) => {
   const newUser = {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
      orders: [],
   };
   let responseObj = {
      success: true,
      message: "Signup ok.",
   };

   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
   newUser.password = hashedPassword;

   const users = await findUsers();

   users.forEach((user) => {
      if (user.username === newUser.username) {
         responseObj.success = false;
         responseObj.message = "User already exists.";
      }
   });

   if (responseObj.success) {
      await createUser(newUser);
   }

   return res.json(responseObj);
});

router.post("/api/user/login", checkProperty("username"), checkProperty("password"), async (req, res) => {
   const { username, password } = req.body;
   const token = await authenticateAdmin(username, password);
   if (token) {
      return res.json({ success: true, message: "Login successful.", token });
   } else {
      return res.status(401).json({ success: false, message: "Authentication failed." });
   }
});

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

// Ta bort användare - endast för admin
router.delete("/api/user/:id", isAdmin, async (req, res) => {
   try {
      const id = req.params.id;

      // Raderar användaren från databasen
      const result = await deleteUser(id);

      if (!result) {
         return res.status(404).json({ message: "User not found." });
      }

      return res.json({ message: "User deleted successfully." });
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
