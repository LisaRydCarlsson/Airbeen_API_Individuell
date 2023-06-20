const jwt = require("jsonwebtoken");

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

module.exports = { isAdmin };
