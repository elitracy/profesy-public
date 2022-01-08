import fetch from "node-fetch"

fetch("http://localhost:8080/login?username=elitracy&password=Password")
.then(res => res.json())
.then(data => console.log(data.message))


