import { v4 as uuidv4 } from 'uuid';
import { generateUser } from './user';
export const generateMessage = (options) => ({
  id: uuidv4(),
  text: uuidv4(),
  type: 'regular',
  html: '<p>regular</p>',
  attachments: [],
  created_at: new Date().toString(),
  updated_at: new Date().toString(),
  user: generateUser(),
  ...options,
});
