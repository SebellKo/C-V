import { MAX_LIST_NAME_LENGTH } from '../constants/list.js';

const isValidListName = (name) =>
  typeof name === 'string' &&
  name.trim().length > 0 &&
  name.length <= MAX_LIST_NAME_LENGTH;

export default isValidListName;
