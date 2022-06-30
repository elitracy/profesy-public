// IMPORTS
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoUtil = require("./connect");
const bodyParser = require("body-parser");
const emailUtil = require("./email");
const { Db } = require("mongodb");

const SEARCH_LIMIT = 10;

// FZF Function
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Connect to MongoDB
mongoUtil.connectToServer((err, client) => {
  if (err) console.log("Profesy server: 🛑 Error Connecting to Server");
  console.log("Profesy server: ✅ Server Connected");

  const profs = mongoUtil.getDb().collection("professors");
  const users = mongoUtil.getDb().collection("Users");
  const Courses = mongoUtil.getDb().collection("Courses");

  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // SEARCH PROFESSORS
  app.get("/professors", function (req, res) {
    let name = req.query.name;
    const regex = new RegExp(escapeRegex(name), "gi");

    profs
      .find({
        name: regex,
      })
      .limit(SEARCH_LIMIT)
      .toArray((err, results) => {
        if (err) console.error(err);
        res.send({
          professors: results,
        });
      });
  });

  // ROOT
  app.get("/", (req, res) => {
    res.send("Hello from Profesy server!");
  });

  // CHECK USER LOGIN
  app.get("/login", (req, res) => {
    let user = req.query.username;
    let pw = req.query.password;
    users.findOne(
      {
        username: user,
      },
      (err, results) => {
        res.send({
          message: results,
          loggedIn: results !== null && results.password === pw,
        });
      }
    );
  });

  // CREATE USER (SIGNUP)
  app.get("/signup", (req, res) => {
    //add new users
    let user = req.query.username;
    let pw = req.query.password;
    let email = req.query.email;
    let name = req.query.name;
    let emailExists = false;
    let usernameExists = false;

    // see if user exists
    users.findOne(
      {
        $or: [
          {
            username: user,
          },
          {
            email: email,
          },
        ],
      },
      (err, results) => {
        if (results) {
          if (results.email === email) emailExists = true;
          if (results.username === user) usernameExists = true;
        }

        // check for existing email and username
        if (!emailExists && !usernameExists) {
          users.insertOne(
            {
              username: user,
              password: pw,
              email: email,
              name: name,
              favProfs: [],
            },
            (err, data) => {
              res.status(200).send({
                userInsert: 1,
                name: name,
                username: user,
                email: email,
              });

              return;
            }
          );
        } else {
          res.status(400).send({
            userInsert: 0,
            emailExists: emailExists,
            usernameExists: usernameExists,
          });
        }
      }
    );
  });

  // RESET USER PASSWORD (NOT IMPLEMENTED)
  app.get("/resetPass", (req, res) => {
    const emailAddress = req.query.email;
    const code = emailUtil.sendEmail(emailAddress);
    res.status(200).send({
      code: code,
    });
  });

  // CHANGE USER PASSWORD (NOT IMPLEMENTED)
  app.get("/changePass", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    users.updateOne(
      {
        username: username,
      },
      {
        $set: {
          password: password,
        },
      },
      (err, data) => {
        if (err)
          res.status(400).send({
            message: "error",
          });
        else
          res.status(200).send({
            message: "Password successfully updated!",
          });
      }
    );
  });

  // SEARCH BY COURSE
  app.get("/profsByCourse", (req, res) => {
    const course = req.query.course;

    Courses.find({
      course: course,
    }).toArray((error, results) => {
      if (err) console.error(err);
      else
        res.status(200).send({
          courses: results[0].professors,
        });
    });
  });

  // SEARCH FOR COURSES
  app.get("/courses", (req, res) => {
    const course = req.query.course;
    // const regex = new RegExp(escapeRegex(course.toLowerCase()), "gi");

    profs
      .aggregate([
        {
          $unwind: "$courses",
        },
        {
          $match: {
            "courses.course": {
              $in: [new RegExp(`${course.toUpperCase()}*`)],
            },
          },
        },
        {
          $group: {
            _id: null,
            courseList: {
              $addToSet: "$courses.course",
            },
          },
        },
      ])
      .toArray((err, results) => {
        if (err) console.error(err);
        else if (results.length > 0)
          res.status(200).send({
            message: results[0].courseList,
          });
        else
          res.status(400).send({
            message: [],
          });
      });
  });

  app.get("/courseAndProf", (req, res) => {
    const course = req.query.course;
    const prof = req.query.prof;

    profs.findOne(
      {
        $and: [
          {
            name: prof,
          },
          {
            "courses.course": {
              $in: [course],
            },
          },
        ],
      },
      (err, result) => {
        if (err) console.error(err);
        else
          res.status(200).send({
            message: result,
          });
      }
    );
  });

  app.get("/terms", (req, res) => {
    res.sendFile(__dirname + "/termsOfService.html");
    console.log(__dirname);
  });

  app.listen(PORT, () => {
    console.log(`Profesy server: 🦧 started on http://localhost:${PORT}`);
  });
});
