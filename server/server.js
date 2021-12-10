const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { faRetweet } = require("@fortawesome/free-solid-svg-icons");
const cookieParser = require("cookieparser");
const connectDB = require("./db/db_user");
const User = require("./model/model_user");
const Book = require("./model/model_books");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "./config.env"),
});
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox789f2766fe984c6a9bfa9978ecc7d9f7.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });
const multer = require("multer");

const app = express();

connectDB();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "./public/"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get("/userinfo", (req, res) => {
  res.send("list of all task");
});

app.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    registration: req.body.registration,
    department: req.body.department,
    session: req.body.session,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      registration: user.registration,
      department: user.department,
      session: user.session,
      password: user.password,
    },
    process.env.JWT_ACC_ACTIVATE,
    { expiresIn: "200m" }
  );
  console.log(token);

  const dataMail = {
    from: "Noreply@Unilib.com",
    to: req.body.email,
    subject: "UNILIB ACCOUNT ACTIVATION",
    html: `
        <h2>Please click on this link to activate your account</h2>
        <p>${process.env.CLIENT_URL}/authentication/activation/${token}</p>
        `,
  };
  mg.messages().send(dataMail, function (error, body) {
    if (error) {
      return res.json({
        message: error.message,
      });
    } else return res.json({ message: "Email has been sent, kindly activate your account" });
    //console.log(body);
  });

  // const result = await user.save()

  // const {password, ...data} = await result.toJSON()

  {
    /* res.send(data)*/
  }
});

app.post("/activateAccount", async (req, res) => {
  const { token } = req.body;
  console.log(token);
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACC_ACTIVATE,
      function (err, decodedToken) {
        if (err) {
          return res.status(400).json({ error: "Incorrect or Expired link" });
        }
        const { name, email, registration, department, session, password } =
          decodedToken;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            return res
              .status(400)
              .json({ error: "User with this email already exists" });
          }
          let newUser = new User({
            name,
            email,
            registration,
            department,
            session,
            password,
          });
          newUser.save((err, success) => {
            if (err) {
              console.log("Error in signup: ", err);
              return res.status(400).json({ error: err });
            }
            res.json({
              message: "Signup success!",
            });
          });
        });
      }
    );
  }
});

app.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  console.log(user);
  if (!user) {
    return res.status(404).send({
      message: "user not found",
    });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "invalid credentials",
    });
  }

  const token = jwt.sign({ _id: user._id, email }, "secret");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.json({ token: token });
});

const checkTokenMiddleware = (req, res, next) => {
  const { headers } = req;
  const token = req.headers["authorization"];
  console.log({ token });
  // const { token } = req.headers;
  try {
    const data = jwt.verify(token, "secret");
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({
      message: "invalid token",
    });
  }
};

app.get("/user", checkTokenMiddleware, async (req, res) => {
  console.log({ user: req.user });
  const data = await User.findOne({ _id: req.user._id });

  res.json({ message: "successful", data });
  /*try {
      const cookie = req.cookies['jwt']

      const claims = jwt.verify(cookie, 'secret')

      if (!claims) {
          return res.status(401).send({
              message: 'unauthenticated'
          })
      }
      
      
      const user = await User.findOne({_id: claims._id})
      console.log("user:"+user)

      const {password, ...data} = await user.toJSON()
      res.json({message: 'successful', user});
     // res.send(user)
  } catch (e) {
      return res.status(401).send({
          message: 'unauthenticated'
      })
  }*/
});

app.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.cookie.Clear();
  res.send({
    message: "success",
  });
});

app.post("/addbook", upload.single("image"), async (req, res) => {
  req.body.image = req.file.path;
  const book = new Book({
    bookName: req.body.bookName,
    writer: req.body.writer,
    pdfLink: req.body.pdfLink,
    image: req.body.image,
    number: req.body.number,
    text: req.body.text,
  });

  const result = await book.save();

  const { bookName, ...data } = await result.toJSON();

  res.send(data);
});

app.listen(4000, () => {
  console.log("running on port 4000");
});

module.exports = app;
