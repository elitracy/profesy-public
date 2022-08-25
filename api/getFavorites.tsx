import API_URL from '../config/env'

export const getFavorites = async (
  method: string,
  params: {
    username: string
    professor?: string
    course?: string
    gpa?: string
  }
) => {
  if (method === 'PUT') {
    return await fetch(
      `${API_URL}/favorites?username=${params.username}&professor=${params.professor}&course=${params.course}&gpa=${params.gpa}`,
      { method: method }
    ).then(result => result.json())
  } else if (method === 'DELETE') {
    return await fetch(
      `${API_URL}/favorites?username=${params.username}&professor=${params.professor}&course=${params.course}`,
      { method: method }
    )
  } else {
    return await fetch(`${API_URL}/favorites?username=${params.username}`).then(
      result => result.json()
    )
  }
}
