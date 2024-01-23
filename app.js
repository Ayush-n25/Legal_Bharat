const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port_server = 5000;
const { user_modal, lawyer_modal } = require("./mongoDBcon.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const transportor=require('./NodeMailer.js');

// cookie-parser
app.use(cookieParser());

// Use express-session middleware with MongoDB as the session store
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      httpOnly: true,
    },
  })
);

// Allowing body parsing
app.use(bodyParser.urlencoded({ extended: true }));

// set the template engine
app.set("view engine", "ejs");

// for serving static content
app.use(express.static("./public"));

// Running a server
app.listen(port_server, () => {
  console.log(`Server running on port ${port_server} ! `);
});

// get for home page
app.get("/", (q, r) => {
  r.render("index");
});
// get for home page
app.get("/index", (q, r) => {
  r.render("index");
});

// get for login
app.get("/login", (q, r) => {
  console.log("into login");
  try {
    if (jwt.verify(q.cookies.jwt, "your-secret-key")) {
      r.redirect("Find_lawyer");
    }
  } catch (error) {
    console.log("Coookie not found or incorrect JWT token");
    r.render("login");
  }
});

// get for contact_us
app.get("/contact_us", (q, r) => {
  r.render("contact_us");
});

// get for Find_lawyer
app.get("/Find_lawyer", async (q, r) => {
  console.log("\t\t\tinto Find_lawyer\n\n");
  console.log(`\t\t\t The cookie is  ${q.cookies._id} \n\n`);

  try {
    const lawyers=await lawyer_modal.find({});
    console.log(lawyers);
    await jwt.verify(q.cookies.jwt, "your-secret-key");
    r.render("Find_lawyer",{lawyers});
  } catch (error) {
    console.log(error);
    r.redirect("login");
  }
});

// get for signup
app.get("/signup", (q, r) => {
  r.render("signup");
});

// get for workspace
app.get("/connection_req", async (q, r) => {
  try {
    console.log("\t\t\tWS_page\n\n");
    console.log(q.cookies._id);
    if (q.cookies && q.cookies.jwt) {
      console.log("Cookies:", q.cookies.jwt);
    }
    console.log(q.cookies.jwt);
    await jwt.verify(q.cookies.jwt, "your-secret-key");
    //const properties = await property_modal.find({});
    r.render("connection_req", {  });
  } catch (error) {
    console.log(error);
    r.redirect("login");
  }
  //r.render('connection_req');
});

// get for logout
app.get("/logout", (q, r) => {
  q.session.destroy((err) => {
    if (err) {
      console.error(err);
      r.status(500).send("Internal Server Error");
    } else {
      r.clearCookie("jwt");
      r.redirect("/");
    }
  });
});

// POST for Login
app.post("/login_post", async (q, r) => {
  const email_check = q.body.email;
  const pass_check = q.body.password;
  const user = await user_modal.findOne({ email_user: email_check });
  try {
    if (user.password === pass_check) {
      // Create a JWT token
      const token = await jwt.sign({ email: user.email }, "your-secret-key", {
        expiresIn: "24h",
      });
      await r.cookie("jwt", token, { httpOnly: true });
      await r.cookie("_id", email_check);
      r.redirect("connection_req");
    } else {
      console.log("\t\t\tProblem in login");
      r.status(404);
      r.render("login");
    }
  } catch (err) {
    console.log(err.message);
    r.redirect('/login')
  }
});

// POST for signup
app.post("/connection_req", async (q, r) => {
  console.log("\t\t\tInto signup\n");
  //fteching data
  const email = await q.body.email;
  const first_name = await q.body.first_name;
  const last_name = await q.body.last_name;
  const pass = await q.body.password;
  console.log(email, first_name, last_name, pass);
  const res = await user_modal.insertMany({
    first_user_name: first_name,
    last_user_name: last_name,
    password: pass,
    email_user: email,
  });
  r.redirect("login");
});

// POST for nodemailer
app.post('/sendBookEmail',(q,r)=>{
  const { lawyerEmail, name, email, phoneNumber } = q.body;
  const mailOptions={
    from: 'ancloudskill@gmail.com',
    to: lawyerEmail,
    subject: 'Request for Booking',
    html:`
        <p>Hello ${name},</p>
        <p>We from Legal Bharat are hereby dropping this mail regrading a booking request with following detail:</p>
        <p>Name : ${name}<p>
        <p><p>
        <p><p>
        `
  }
});

// Page or resource not found
app.get("*", (q, r) => {
  r.status(404).send("<h1>404 Not Found</h1>");
});
