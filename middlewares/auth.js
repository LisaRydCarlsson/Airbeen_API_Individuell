const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findUsers } = require("../utilities/users.js");

// Autentiserar användaren och genererar token
async function authenticateAdmin(username, password) {
   const [user] = await findUsers("username", username);
   if (user && user.role === "admin" && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ username: user.username, role: user.role }, "your-secret-key", {
         expiresIn: "1h",
      });
      return token;
   }
   return null;
}

// Middleware för att kolla om användare är admin.
function isAdmin(req, res, next) {
   const token = req.header("Authorization");
   if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
   }

   try {
      const decoded = jwt.verify(token, "your-secret-key");
      if (decoded.role === "admin") {
         next();
      } else {
         return res.status(403).json({ message: "Access denied. Not an admin." });
      }
   } catch (error) {
      return res.status(401).json({ message: "Invalid token." });
   }
}

module.exports = { authenticateAdmin, isAdmin };
