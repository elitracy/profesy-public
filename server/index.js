const express = require("express")
const users = require("./users.json")
const app = express()
const PORT = 8080
const mongoUtil = require("./connect")
const bodyParser = require("body-parser")

mongoUtil.connectToServer((err,client) => {
  if(err) console.log("Profesy server: 🛑 Error Connecting to Server")  
  console.log("Profesy server: ✅ Server Connected") 
  const profs = mongoUtil.getDb().collection("professors")
  
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get("/professors", function (req, res) {
    let name = req.query.name
    profs.find({"name":`${req.query.name}`}).toArray((err,results) => {
      res.send({"professors" : results}) 
    })
  })

  //app.use("/static", express.static(require("path").join(__dirname, "../public")))
  //
  app.get("/", (req,res) => {
    res.send("Hello from Profesi server!")
  })
  //
  //app.get("/login", (req,res) => {
  //  if(users.users.hasOwnProperty(req.query.username) && users.users[req.query.username].password === req.query.password){
  //    res.send({"message":`${users.users[req.query.username].name} successfully logged in`}) 
  //    console.log(`${users.users[req.query.username].name} successfully logged in!`) 
  //  }else{
  //    console.log("Failed login attempt")
  //    res.status(400).send({"message": "Failed Login Attempt"})
  //  } 
  //})
  //
  app.listen(PORT, () => {
    console.log(`Profesy server: 🦧 started on http://localhost:${PORT}`)
  })
})




