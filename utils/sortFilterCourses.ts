import { Course } from '../RootStackParams'

// Seasons object for sorting
const seasons: {
  SPRING: number
  SUMMER: number
  FALL: number
  WINTER: number
} = {
  SPRING: 3,
  SUMMER: 2,
  FALL: 1,
  WINTER: 0,
}

export default function sortFilterCourses(
  courseName: string,
  courses: Course[]
) {
  return courses
    .sort((a, b) => {
      const aY = parseInt(
        a.semester.substring(a.semester.length - 4, a.semester.length)
      )
      const bY = parseInt(
        b.semester.substring(b.semester.length - 4, b.semester.length)
      )
      const aS = a.semester.substring(0, a.semester.length - 5)
      const bS = b.semester.substring(0, b.semester.length - 5)

      return aY !== bY ? aY - bY : seasons[bS] - seasons[aS]
    })
    .filter((c: Course) => {
      console.log(c)
      return c.course === courseName && c.semester.length > 0
    })
}
