const express = require("express");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { verifyToken, verifyAdmin, secretKey } = require("./authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- File Helpers ---------- */
const ensureDataFile = () => {
  if (!fs.existsSync("data.json")) {
    fs.writeFileSync(
      "data.json",
      JSON.stringify(
        {
          users: [],
          planedetails: [],
          bookings: [],
        },
        null,
        2
      )
    );
  }
};

const readData = () => {
  ensureDataFile();
  return JSON.parse(fs.readFileSync("data.json"));
};

const writeData = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
};

/* ---------------- USERS ---------------- */
app.post("/api/signup", (req, res) => {
  const { name, address, username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send({ message: "Passwords do not match" });
  }

  let data = readData();
  if (data.users.find((u) => u.username === username)) {
    return res.status(400).send({ message: "Username exists" });
  }

  const hashed = bcrypt.hashSync(password, 8);
  const newUser = {
    id: Date.now(),
    name,
    address,
    username,
    password: hashed,
    role: "user",
  };
  data.users.push(newUser);
  writeData(data);
  res.send({ message: "Signup successful" });
});

app.post("/api/signin", (req, res) => {
  const { username, password } = req.body;
  let data = readData();
  const user = data.users.find((u) => u.username === username);
  if (!user) return res.status(400).send({ message: "User not found" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(400).send({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    secretKey,
    { expiresIn: "5h" }
  );

  // ✅ Send back id also
  res.send({
    token,
    role: user.role,
    id: user.id,
  });
});

/* ---------------- FLIGHTS ---------------- */
app.get("/api/flights", (req, res) => {
  res.send(readData().planedetails);
});

app.post("/api/flights", verifyToken, verifyAdmin, (req, res) => {
  let data = readData();
  data.planedetails.push(req.body);
  writeData(data);
  res.send({ message: "Flight added" });
});

app.put("/api/flights/:id", verifyToken, verifyAdmin, (req, res) => {
  let data = readData();
  data.planedetails = data.planedetails.map((f) =>
    f.planeid == req.params.id ? req.body : f
  );
  writeData(data);
  res.send({ message: "Flight updated" });
});

app.delete("/api/flights/:id", verifyToken, verifyAdmin, (req, res) => {
  let data = readData();
  data.planedetails = data.planedetails.filter(
    (f) => f.planeid != req.params.id
  );
  writeData(data);
  res.send({ message: "Flight deleted" });
});

/* ---------------- BOOKINGS ---------------- */
app.post("/api/bookings", verifyToken, (req, res) => {
  let data = readData();
  data.bookings.push({
    id: Date.now(),
    userId: req.user.id,
    username: req.user.username,
    ...req.body,
  });
  writeData(data);
  res.send({ message: "Booking successful" });
});

app.get("/api/bookings", verifyToken, (req, res) => {
  let data = readData();
  let bookings = data.bookings;
  if (req.user.role !== "admin") {
    bookings = bookings.filter((b) => b.userId === req.user.id);
  }
  res.send(bookings);
});

app.delete("/api/bookings/:id", verifyToken, (req, res) => {
  let data = readData();
  data.bookings = data.bookings.filter((b) => {
    if (req.user.role === "admin") return b.id != req.params.id;
    return !(b.id == req.params.id && b.userId === req.user.id);
  });
  writeData(data);
  res.send({ message: "Booking canceled" });
});

/* ---------------- ADMIN DATA ---------------- */
app.get("/api/users", verifyToken, verifyAdmin, (req, res) => {
  res.send(readData().users);
});

/* ---------------- START SERVER ---------------- */
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
