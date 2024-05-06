import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

export const generateId = () => {
  const id = crypto.randomBytes(16).toString('hex')
  // const id = uuidv4()

  // console.log('Your UUID is: ' + id)

  return id
}