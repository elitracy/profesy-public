import { removeWS } from '../utils/stringHelpers'
export default async function getCourses(
  course: string,
  setFilteredData: any
): Promise<any> {
  return await fetch(
    `https://profesy.herokuapp.com/courses?course=${removeWS(course)}`
  )
    .then((result) => result.json())
    .then((result) => {
      setFilteredData(result.message)
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}
