import express from "express";
import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";
import configureMiddleware from "../config/middleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
configureMiddleware(app);
const router = express.Router();

router.post("/registration", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const saltRound = 10;
    const hash = await bcrypt.hash(password, saltRound);

    const { data, error } = await supabase
      .from("users")
      .insert({ username: username, email: email, password: hash })
      .select("*");

    if (error) {
      return res.json(error.message);
    }

    return res.json({ data, message: "Registration Successfully!" });
  } catch (error) {
    return res.json(error);
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      return res.json({ error: error.message });
    }

    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (error, response) => {
        if (error) {
          return res.json({ error: error.message });
        }

        if (response) {
          const user = data[0];
          const getToken = process.env.JWT_TOKEN;
          const token = jwt.sign(
            { id: user.id, name: user.username, email: user.email },
            getToken,
            { expiresIn: "24h" }
          );

          res.cookie("cookiesToken", token, {
            httpOnly: false,
            secure: "secret",
            sameSite: "strict",
          });

          return res.json({
            message: `Welcome to Cupu ML University, ${user.username}`,
            token: token,
            dataUser: user,
          });
        } else {
          return res.json({
            message: "Wrong username/email or password combination!",
          });
        }
      });
    } else {
      return res.json({ message: "User doesn't exist" });
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.delete("/logout", async (req, res) => {
    res.clearCookie("cookiesToken");
  
    return res.json({ message: "Logout successfully!" });
  });

export default router;