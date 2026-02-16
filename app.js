const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");

dotenv.config();

const constructionModel = require("./models/construction");
const tradersModel = require("./models/traders");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

/* IMAGE UPLOAD */
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ROUTES */
app.get("/", (req, res) => res.render("home"));

app.get("/construction", async (req, res) => {
  const constructions = await constructionModel.find();
  res.render("construction", { constructions });
});

app.get("/traders", async (req, res) => {
  res.render("traders");
});

app.get("/contacts", async (req, res) => {
  res.render("contacts");
});

app.get("/admin", (req, res) => res.render("admin-login"));

app.post("/admin", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.admin = true;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid Login");
  }
});

/* DASHBOARD */
app.get("/dashboard", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin");
  const constructions = await constructionModel.find();

  res.render("admin-dashboard",  { constructions });
});

app.post(
  "/add-construction",
  upload.fields([
    { name: "fullImage", maxCount: 1 },
    { name: "elevation", maxCount: 1 },
    { name: "bedRoom", maxCount: 1 },
    { name: "kitchen", maxCount: 1 },
    { name: "bathRoom", maxCount: 1 },
    { name: "otherImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/admin");

      const construction = new constructionModel({
        customerName: req.body.customerName,
        customerNumber: req.body.customerNumber,

        cityName: req.body.cityName,
        location: req.body.location,


        fullImage: req.files.fullImage
          ? "/uploads/" + req.files.fullImage[0].filename
          : "",

        elevation: req.files.elevation
          ? "/uploads/" + req.files.elevation[0].filename
          : "",

        bedRoom: req.files.bedRoom
          ? "/uploads/" + req.files.bedRoom[0].filename
          : "",

        kitchen: req.files.kitchen
          ? "/uploads/" + req.files.kitchen[0].filename
          : "",

        bathRoom: req.files.bathRoom
          ? "/uploads/" + req.files.bathRoom[0].filename
          : "",

        otherImage: req.files.otherImage
          ? "/uploads/" + req.files.otherImage[0].filename
          : "",
      });

      await construction.save();
      res.redirect("/dashboard");

    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding construction project");
    }
  }
);

app.post("/delete-construction/:id", async (req, res) => {
  try {
    if (!req.session.admin) return res.redirect("/admin");

    const construction = await constructionModel.findById(req.params.id);
    if (!construction) return res.redirect("/dashboard");

    const deleteFile = (filePath) => {
      try {
        if (!filePath) return;

        const cleanPath = filePath.startsWith("/")
          ? filePath.substring(1)
          : filePath;

        const fullPath = path.join(__dirname, "public", cleanPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.error("File delete error:", err);
      }
    };

    deleteFile(construction.fullImage);
    deleteFile(construction.elevation);
    deleteFile(construction.bedRoom);
    deleteFile(construction.kitchen);
    deleteFile(construction.bathRoom);
    deleteFile(construction.otherImage);

    await constructionModel.findByIdAndDelete(req.params.id);

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting construction project");
  }
});







app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT} 🚀`);
});
