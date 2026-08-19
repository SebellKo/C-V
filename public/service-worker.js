import openDatabase from './modules/openDatabase.js';

import editList from './modules/service/editList.js';
import getList from './modules/service/getList.js';
import getCurrentListByName from './modules/service/getCurrentListByName.js';
import editCommands from './modules/service/editCommands.js';
import editCommand from './modules/service/editCommand.js';
import deleteCommands from './modules/service/deleteCommands.js';
import deleteCommand from './modules/service/deleteCommand.js';
import addList from './modules/service/addList.js';
import addCommand from './modules/service/addCommand.js';
import getCurrentListName from './modules/service/getCurrentListName.js';
import setCurrentListName from './modules/service/setCurrentListName.js';
import setCommandByIndex from './modules/service/setCommandByIndex.js';
import getCommandByIndex from './modules/service/getCommandByIndex.js';
import { createMessageListener, createRpcDispatcher } from './rpc.js';

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const db = await openDatabase();
    console.log('IndexedDB opened successfully:', db);
  } catch (error) {
    console.log(error);
  }
});

const dispatch = createRpcDispatcher({
  addList,
  getList,
  editList,
  getCurrentListByName,
  addCommand,
  editCommands,
  deleteCommand,
  editCommand,
  deleteCommands,
  getCurrentListName,
  setCurrentListName,
  setCommandByIndex,
  getCommandByIndex,
});

chrome.runtime.onMessage.addListener(createMessageListener(dispatch));
