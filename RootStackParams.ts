export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Signup: undefined
  Account: undefined
  Professor: { profName: string; courses: Course[] }
  Course: {
    course: string
    prof: string
  }
  Courses: { courseName: string }
}

export type Course = {
  A: string
  B: string
  C: string
  D: string
  F: string
  Q: string
  CourseTotal: string
  course: string
  numSections: string
  semGPA: string
  semester: string
  totalGPA: string
}
