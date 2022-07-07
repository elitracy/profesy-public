import { NODE_ENV, PROD_URL, DEV_URL } from '@env'

let API_URL = NODE_ENV == 'development' ? DEV_URL : PROD_URL
// console.log(API_URL)
export default API_URL
