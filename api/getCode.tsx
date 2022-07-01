// getCode - Params(email:string, setPassCode: function) => Promise
export default async function getCode(
  setPassCode: any,
  email: string
): Promise<any> {
  return await fetch(`https://profesy.herokuapp.com/resetPass?email=${email}`)
    .then((result) => result.json())
    .then((result) => {
      setPassCode(result.code)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}
