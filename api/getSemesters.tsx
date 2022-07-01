import sortFilterCourses from '../utils/sortFilterCourses'
export default async function getSemesters(
  course: string,
  prof: string,
  setSemesterInfo: any,
  setCurrentSemester: any
): Promise<any> {
  return await fetch(
    `https://profesy.herokuapp.com/courseAndProf?course=${course}&prof=${prof}`
  )
    .then((result) => result.json())
    .then((result) => {
      const sortedCourses = sortFilterCourses(course, result.message.courses)
      setSemesterInfo(sortedCourses)
      setCurrentSemester(sortedCourses[0])
      return sortedCourses
    })
    .catch((err) => {
      console.log(err)
    })
}
