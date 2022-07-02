import API_URL from '../config/env'

// getCode - Params(email:string, setPassCode: function) => Promise
export default async function getCode(
  setPassCode: any,
  email: string
): Promise<any> {
  return await fetch(`${API_URL}/resetPass?email=${email}`)
    .then((result) => result.json())
    .then((result) => {
      setPassCode(result.code)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}
