const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const zod = require("zod");
const port = 3001;
const { User } = require("./db/db");
///////////////////////////////////////////////////////////////////////////
app.use(bodyparser.json());
app.use(express.json());
app.use(express.static("uploads"));
///////////////////////////////////////////////////////////////////////////
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
let upload = multer({ storage: storage });
///////////////////////////////////////////////////////////////////////////
app.post("/upload", upload.single("fileData"), async (req, res) => {
  const file = req.file;
  const email = req.headers.email;

  if (req.file) {
    User.findOne({ email }).then((response) => {
      if (response.photos.length < 5) {
        User.findOneAndUpdate(
          { email: email },
          {
            $push: {
              photos: file.filename,
            },
          }
        ).then((data) => {
          if (data) {
            return res.status(200).send("Photo uploaded successfully");
          }
          return res.status(400).send("error");
        });
      } else {
        res.status(201).send("Maximum photo limit reached");
      }
    });
  }
});

app.post("/des", async (req, res) => {
  const { description, email } = req.body;

  console.log(description, email);
  User.findOne({ email }).then((data) => {
    if (data.status == true) {
      return res.send({ status: 201 });
    } else {
      User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            description: description,
            status: true,
          },
        }
      ).then((suc) => {
        if (!suc) {
          return res.send({ status: 403, data: "network error" });
        }
        return res.send({ status: 200, data: "description updated" });
      });
    }
  });
});
const nameSchema = zod.string();
const emailSchema = zod.string().email();
const genderSchema = zod.string();
const ageSchema = zod.number();
const passwordSchema = zod.string().min(6);
const date = new Date();
app.post("/signup", async (req, res) => {
  const { name, email, age, gender, password } = req.body;
  const user_age = Number(age);
  const nameRes = nameSchema.safeParse(name);
  const emailRes = emailSchema.safeParse(email);
  const genderRes = genderSchema.safeParse(gender);
  const ageRes = ageSchema.safeParse(user_age);
  const passwordRes = passwordSchema.safeParse(password);
  if (
    !nameRes.success ||
    !emailRes.success ||
    !passwordRes.success ||
    !genderRes.success ||
    !ageRes.success
  ) {
    return res.send({ status: 400, data: "invalid input" });
  } else {
    try {
      const check_email = await User.findOne({ email: email });
      if (check_email) {
        return res.send({ status: 403, data: "email is already in use" });
      }
      const user_signup = await User.create({
        name: name,
        email: email,
        age: age,
        gender: gender,
        password: password,
        status: false,
        acc_create_time: date,
      });
      if (!user_signup) {
        return res.send({ status: 409, data: "signup failed" });
      }
      return res.send({ status: 200, data: "signup successful" });
    } catch (error) {
      console.log(error);
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const success = await User.findOne({ email: email, password: password });
  if (!success) {
    return res.send({ status: 403, data: "wrong email or password" });
  }
  return res.send({ status: 200, data: email });
});
app.post("/reports", async (req, res) => {
  const { email } = req.body;

  const response = await User.findOne({ email });
  if (!response) {
    return res.send({ status: 404 });
  }
  return res.send({
    status: 200,
    data: response.status,
    reports: response.reports,
  });
});

app.get("/img", (req, res) => {
  const imgName = req.query.img;
  let filename = imgName.toString();
  const imagePath = path.join(__dirname, "uploads", filename);
  res.sendFile(imagePath);
  console.log(imagePath);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
