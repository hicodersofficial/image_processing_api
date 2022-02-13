const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const app = express();
const { v4 } = require("uuid");

// custom logger (Alt: morgan)
app.use((req, res, next) => {
  console.log(req.ip, req.method, req.path, req.headers["user-agent"]);
  next();
});

app.use(express.json());

app.use("/public/:filename", async (req, res, next) => {
  try {
    const { filename } = req.params;
    let { w, h, q, fit, bg, s } = req.query;

    if (s) {
      s = parseInt(s);
      if (s > 10000) {
        return res.status(400).json({
          message: "Invalid size parameter. size must be <=10000",
        });
      }
    }

    if (w) {
      w = parseInt(w);
      if (w > 10000) {
        return res.status(400).json({
          message: "Invalid width parameter. width must be <=10000",
        });
      }
    }

    if (h) {
      h = parseInt(h);
      if (h > 10000) {
        return res.status(400).json({
          message: "Invalid height parameter. height must be <=10000",
        });
      }
    }

    if (q) {
      q = parseInt(q);
      if (q > 100) {
        return res.status(400).json({
          message: "Invalid quality parameter. quality must be <=10000",
        });
      }
    }

    res.setHeader("content-type", "image/jpg");
    const image = sharp(`./public/${filename}`).toFormat("jpeg", {
      quality: q ? parseInt(q) : 60,
    });

    res.send(
      await image
        .resize(
          s
            ? s
            : h && !w
            ? (
                await image.metadata()
              ).width
            : w
            ? parseInt(w)
            : null,
          s
            ? s
            : w && !h
            ? (
                await image.metadata()
              ).height
            : h
            ? parseInt(h)
            : null,
          { fit, background: bg ? "#" + bg : null }
        )
        .withMetadata()
        .toBuffer()
    );
  } catch (error) {
    console.log(error);
    res.setHeader("content-type", "application/json");
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, success: false });
  }
});

app.get("/all-images", async (req, res, next) => {
  const files = fs
    .readdirSync("./public")
    .map((file) => ({ url: `http://localhost:5000/public/${file}` }));
  const response =
    files.length > 0
      ? files
      : {
          message:
            "No images found in public directory. Navigate to /upload to upload images images.",
          url: "http://localhost:5000/upload",
        };
  res.json(response);
});

const uploadMiddleware = multer({
  limits: 10_000_000,
  storage: multer.diskStorage({
    destination: "./public",
    filename: function (req, file, cb) {
      cb(null, v4() + path.extname(file.originalname));
    },
  }),
}).single("file");

app.post("/upload", uploadMiddleware, (req, res, next) => {
  console.log(req.files);
  res.json({
    url: `http://localhost:5000/public/${req.file.filename}`,
    message: "success",
  });
});

app.get("/upload", uploadMiddleware, (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/", async (req, res, next) => {
  res.sendFile(path.join(__dirname, "./docs/docs.html"));
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
