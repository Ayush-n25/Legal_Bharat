const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port_server = 5000;
const { user_modal, property_modal } = require("./mongoDBcon.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");

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
      r.redirect("workspace_page");
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

app.get("/profiles", (q, r) => {
  r.render("profiles");
});

// get for WS_sell
app.get("/WS_sell", async (q, r) => {
  console.log("\t\t\tinto WS_sell\n\n");
  try {
    await jwt.verify(q.cookies.jwt, "your-secret-key");
    r.render("WS_sell");
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
app.get("/workspace_page", async (q, r) => {
  try {
    console.log("\t\t\tWS_page\n\n");
    console.log(q.cookies._id);
    if (q.cookies && q.cookies.jwt) {
      console.log("Cookies:", q.cookies.jwt);
    }
    console.log(q.cookies.jwt);
    await jwt.verify(q.cookies.jwt, "your-secret-key");
    const properties = await property_modal.find({});
    r.render("workspace_page", { properties });
  } catch (error) {
    console.log(error);
    r.redirect("login");
  }
  //r.render('workspace_page');
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
  const user = await user_modal.findOne({ email: email_check });

  if (user.password === pass_check) {
    // Create a JWT token
    const token = await jwt.sign({ email: user.email }, "your-secret-key", {
      expiresIn: "24h",
    });
    await r.cookie("jwt", token, { httpOnly: true });
    await r.cookie("_id", email_check);
    r.redirect("workspace_page");
  } else {
    console.log("\t\t\tProblem in login");
    r.status(404);
    r.render("login");
  }
});

// POST for signup
app.post("/workspace_page", async (q, r) => {
  console.log("\t\t\tInto signup\n");
  //fteching data
  const email = await q.body.email;
  const first_name = await q.body.first_name;
  const last_name = await q.body.last_name;
  const pass = await q.body.password;
  console.log(email, first_name, last_name, pass);
  const res = await user_modal.insertMany({
    first_name_user: first_name,
    last_name_user: last_name,
    password: pass,
    email: email,
  });
  r.redirect("login");
});

// POST for deletion of property
app.post("/delete_property", async (q, r) => {
  console.log("\t\t\t Into the delete_property");
  const data_for_deletion = await {
    State: q.body.removeState,
    City: q.body.removeCity,
    House_number_and_residency_name: q.body.removeUniqueID,
  };
  try {
    await property_modal.deleteMany({
      State: q.body.removeState,
      City: q.body.removeCity,
      House_number_and_residency_name: q.body.removeUniqueID,
    });
    r.redirect("workspace_page");
  } catch (error) {
    r.status(410).redirect("WS_sell");
  }
});

// POST for WS_sell
app.post("/WS_sell", async (q, r) => {
  // getting data from page
  const data_from_page = await {
    contact_person_full_name: q.body.Name_person,
    State: q.body.State,
    City: q.body.city_name,
    House_number_and_residency_name: q.body.Unique_id,
    Full_address: q.body.Address1 + q.body.Address2 + q.body.Address3,
    Img_url: q.body.Img_url,
    Total_size: q.body.size,
    Additional_info: q.body.additional_info,
    Price: q.body.Price,
    ZIP_code: q.body.zip_code,
    BHK: q.body.BHK,
    phone_number_for_contact: q.body.phoneNumber,
  };
  await property_modal.insertMany(data_from_page);
  r.redirect("/workspace_page");
});

// Page or resource not found
app.get("*", (q, r) => {
  r.status(404).send("<h1>404 Not Found</h1>");
});
