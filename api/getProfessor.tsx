import API_URL from '../config/env'

// getProfessor - Params(name: string, setFilteredData: function) => Promise
export default async function getProfessor(
  name: string,
  setFilteredData: any
): Promise<any> {
  return await fetch(`${API_URL}/professors?name=${name.toUpperCase()}`)
    .then((result) => result.json())
    .then((result) => {
      setFilteredData(result.professors)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}
