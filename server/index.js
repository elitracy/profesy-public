const express = require("express")
const app = express()
const PORT = 8080
const mongoUtil = require("./connect")
const bodyParser = require("body-parser")

const PROF_SEARCH_LIMIT = 5

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

mongoUtil.connectToServer((err,client) => {
  if(err) console.log("Profesy server: 🛑 Error Connecting to Server")  
  console.log("Profesy server: ✅ Server Connected") 
  const profs = mongoUtil.getDb().collection("professors")
  const users = mongoUtil.getDb().collection("Users")
  
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get("/professors", function (req, res) {
    let name = req.query.name
    const regex = new RegExp(escapeRegex(req.query.name), 'gi');

    profs.find({"name": regex}).limit(PROF_SEARCH_LIMIT).toArray((err,results) => {
      res.send({"professors" : results}) 
    })
  })
  app.get("/", (req,res) => {
    res.send("Hello from Profesi server!")
  })
  
  app.get("/login", (req,res) => {
    let user = req.query.username 
    let pw = req.query.password
    users.findOne({username:user, password:pw}, (err,results) => {
      if(err){
          res.status.send(400)
      }else{
        console.log(results)
        res.status(results === null ? 400 : 200)
        res.send({"message": results})
      }
      
    })
  })
  
  app.listen(PORT, () => {
    console.log(`Profesy server: 🦧 started on http://localhost:${PORT}`)
  })
})




