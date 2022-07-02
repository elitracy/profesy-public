import API_URL from '../config/env'

// loginAPI - Params(username:string, password:string) => {message:{}, loggedIn:bool}
export default async function loginAPI(username: string, password: string) {
  return fetch(`${API_URL}/login?username=${username}&password=${password}`)
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
