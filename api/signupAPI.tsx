import API_URL from '../config/env'

// signupAPI - Params(username:string,password:string,email:string,name:string,setUsernameExists:function,setEmailExists:function)
export default async function signupAPI(
  username: string,
  password: string,
  email: string,
  name: string,
  setUsernameExists: any,
  setEmailExists: any
) {
  return fetch(
    `${API_URL}/signup?username=${username}&password=${password}&email=${email}&name=${name}`
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      if (data.userInsert === 0) {
        setEmailExists(data.emailExists)
        setUsernameExists(data.usernameExists)
      }
      return data
    })
    .catch((err) => {
      console.error(err)
    })
}
