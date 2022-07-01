export default async function getProfsByCourse(
  course: string,
  setProfList: any,
  setOriginalProfList: any
): Promise<any> {
  // return await fetch(`https://profesy.herokuapp.com/?name=${name}`)
  return await fetch(
    `https://profesy.herokuapp.com/profsByCourse?course=${course}`
  )
    .then((result) => result.json())
    .then((result) => {
      setProfList(result.courses)
      setOriginalProfList(result.courses) //save prof list for if search is empty
      return result
    })
    .catch((err) => {
      console.error(err)
    })
}
