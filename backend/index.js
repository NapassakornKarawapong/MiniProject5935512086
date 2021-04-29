const express = require("express"),
  app = express(),
  passport = require("passport"),
  port = process.env.PORT || 80,
  cors = require("cors"),
  cookie = require("cookie");

const bcrypt = require("bcrypt");

const db = require("./database.js");
let users = db.users;

require("./passport.js");

const router = require("express").Router(),
  jwt = require("jsonwebtoken");

app.use("/api", router);
router.use(cors({ origin: "http://localhost:3000", credentials: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("Login: ", req.body, user, err, info);
    let time_exp;
    let time;
    if (err) return next(err);
    if (user) {
        if (req.body.remember == true) {
          time_exp = "7d";
        } else time_exp = "1d";
        const token = jwt.sign(user, db.SECRET, {
          expiresIn: time_exp,
        });
        var decoded = jwt.decode(token);
        time = new Date(decoded.exp * 1000);
        console.log(new Date(decoded.exp * 1000));
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
              maxAge: 60 * 60,
              sameSite: "strict",
              path: "/",
          })
      );
      res.statusCode = 200;
      return res.json({ user, token });
    } else return res.status(422).json(info);
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: -1,
      sameSite: "strict",
      path: "/",
    })
  );
  res.statusCode = 200;
  return res.json({ message: "Logout successful" });
});

/* GET user profile. */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send(req.user);
  }
);
/* GET user foo. */
router.get(
  "/foo",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
      res.status(200).json({ message: "Foo" });
  }
);

router.post("/register", async (req, res) => {
  let hash;
  try {
    const SALT_ROUND = 10;
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ message: "Cannot register with empty string" });
    if (db.checkExistingUser(username) !== db.NOT_FOUND)
      return res.json({ message: "Duplicated user" });

    let id = users.users.length? users.users[users.users.length - 1].id + 1: 1;
    hash = await bcrypt.hash(password, SALT_ROUND);
    users.users.push({ id, username, password: hash, email });
    res.status(200).json({ message: "Register success" });
  } catch {
    res.status(422).json({ message: "Cannot register" });
  }
});

router.get("/alluser", (req, res) => res.json(db.users.users));

router.get("/", (req, res, next) => {
  res.send("Respond without authentication");
});

  let series = {
      list: [
        { "id": 1, "name": "Y-Destiny", "channel": "AIS Play", "day": "Tuesday" , "time": "22:00" },
        { "id": 2, "name": "Fish upon the sky", "channel": "GMM25", "day": "Friday" , "time": "20:30" },
        { "id": 3, "name": "A Chance to Love SS2", "channel": "WeTV", "day": "Wednesday" , "time": "20:00" },
        { "id": 4, "name": "Lovely Writer The Series", "channel": "Ch33", "day": "Wednesday" , "time": "22:50" }]
    }
  
  router
    .route("/series")
    .get((req, res) => {
      res.send(series);
    })
    .post((req, res) => {
      console.log(req.body);
      let newserie = {};
      newserie.id = series.list.length ? series.list[series.list.length - 1].id + 1 : 1;
      newserie.name = req.body.name;
      newserie.channel= req.body.channel;
      newserie.day = req.body.day;
      newserie.time= req.body.time;
      series = { list: [...series.list, newserie] };
      res.json(series);
    });
  
  router
    .route("/series/:serieid")
    .get((req, res) => {
      let id = series.list.findIndex((item) => +item.id == +req.params.serieid)
      res.json(series.list[id]);
    })
    .put((req, res) => {
      let id = series.list.findIndex((item) => item.id == +req.params.serieid);
      series.list[id].name = req.body.name;
      series.list[id].channel = req.body.channel;
      series.list[id].day = req.body.day;
      series.list[id].time = req.body.time;
      res.json(series.list);
    })
    .delete((req, res) => {
      series.list = series.list.filter((item) => +item.id !== +req.params.serieid);
      res.json(series.list);
    });
  
  
  router.route("/purchase/:serieId")
  .post((req,res) => {
    let id = series.list.findIndex((item) => +item.id == +req.params.serieId)
    if (id == -1) {
      res.json({message: "Serie not found"})
    }
    else {
      series.list = series.list.filter((item) => +item.id !== +req.params.serieId);
      res.json(series.list);
    }
  })

// Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`));