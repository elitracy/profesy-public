import { removeWS } from '../utils/stringHelpers'
import API_URL from '../config/env'

export default async function getCourses(
  course: string,
  setFilteredData: any
): Promise<any> {
  return await fetch(`${API_URL}/courses?course=${removeWS(course)}`)
    .then((result) => result.json())
    .then((result) => {
      setFilteredData(result.message)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}
