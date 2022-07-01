// loginAPI - Params(username:string, password:string) => {message:{}, loggedIn:bool}
export default async function loginAPI(username: string, password: string) {
  return fetch(
    `https://profesy.herokuapp.com/login?username=${username}&password=${password}`
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.error(err)
    })
}
