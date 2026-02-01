const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");

dotenv.config();

// const Construction = require("");
// const Paint = require("./models/Paint");

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
  res.render("construction");
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

//   const tiles = await Tile.find();
//   const paints = await Paint.find();

  res.render("admin-dashboard");
});

/* TILE */
// app.post("/add-tile", upload.single("image"), async (req, res) => {
//   try {
//     await Tile.create({
//       name: req.body.name,
//       category: req.body.category,
//       size: req.body.size,
//       price: req.body.price,
//       mobile: req.body.mobile, // ✅
//       location: req.body.location, // ✅
//       image: "/uploads/" + req.file.filename,
//     });

//     res.redirect("/dashboard");
//   } catch (err) {
//     console.log(err);
//     res.redirect("/dashboard");
//   }
// });

// app.post("/delete-tile/:id", async (req, res) => {
//   try {
//     const tile = await Tile.findById(req.params.id);

//     if (tile?.image) {
//       const imagePath = path.join(__dirname, "public", tile.image);

//       fs.unlink(imagePath, (err) => {
//         if (err) console.log("Tile image delete error:", err.message);
//       });
//     }

//     await Tile.findByIdAndDelete(req.params.id);
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error(err);
//     res.redirect("/dashboard");
//   }
// });

/* PAINT */
// app.post("/add-paint", upload.single("image"), async (req, res) => {
//   await Paint.create({
//     name: req.body.name,
//     category: req.body.category,
//     litter: req.body.size,
//     price: req.body.price,
//     mobile: req.body.mobile,
//     location: req.body.location,
//     image: "/uploads/" + req.file.filename,
//   });

//   res.redirect("/dashboard");
// });

// app.post("/delete-paint/:id", async (req, res) => {
//   try {
//     const paint = await Paint.findById(req.params.id);

//     if (paint?.image) {
//       const imagePath = path.join(__dirname, "public", paint.image);

//       fs.unlink(imagePath, (err) => {
//         if (err) console.log("Paint image delete error:", err.message);
//       });
//     }

//     await Paint.findByIdAndDelete(req.params.id);
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error(err);
//     res.redirect("/dashboard");
//   }
// });

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT} 🚀`);
});
