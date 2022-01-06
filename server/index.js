const express = require("express")
const users = require("./users.json")
const app = express()
const PORT = 8080

app.use("/static", express.static(require("path").join(__dirname, "../public")))

app.get("/", (req,res) => {
  res.send("Hello from Profesi server!")
})

app.get("/login", (req,res) => {
  if(users.users.hasOwnProperty(req.query.username) && users.users[req.query.username].password === req.query.password){
    res.send({"message":`${users.users[req.query.username].name} successfully logged in`}) 
    console.log(`${users.users[req.query.username].name} successfully logged in!`) 
  }else{
    console.log("Failed login attempt")
    res.status(400).send({"message": "Failed Login Attempt"})
  } 
})

app.listen(PORT, () => {
  console.log(`Profesi server start on http://localhost:${PORT}`)
})


