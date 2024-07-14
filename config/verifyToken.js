import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const getToken = process.env.JWT_TOKEN;

  jwt.verify(token, getToken, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    // Jika token valid, simpan informasi pengguna ke dalam request
    req.userId = decoded.id;
    req.userName = decoded.username;
    req.userEmail = decoded.email;
    next();
  });
};