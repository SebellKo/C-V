import { readState } from './modules/appState.js';

import editList from './modules/service/editList.js';
import getList from './modules/service/getList.js';
import getListById from './modules/service/getListById.js';
import editCommands from './modules/service/editCommands.js';
import editCommand from './modules/service/editCommand.js';
import deleteCommands from './modules/service/deleteCommands.js';
import deleteCommand from './modules/service/deleteCommand.js';
import addList from './modules/service/addList.js';
import addCommand from './modules/service/addCommand.js';
import getCurrentListId from './modules/service/getCurrentListId.js';
import setCurrentListId from './modules/service/setCurrentListId.js';
import setCurrentListByIndex from './modules/service/setCurrentListByIndex.js';
import setCommandByIndex from './modules/service/setCommandByIndex.js';
import getCommandByIndex from './modules/service/getCommandByIndex.js';
import { createMessageListener, createRpcDispatcher } from './rpc.js';

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await readState();
  } catch (error) {
    console.error('Failed to initialize app state', error);
  }
});

const dispatch = createRpcDispatcher({
  addList,
  getList,
  editList,
  getListById,
  addCommand,
  editCommands,
  deleteCommand,
  editCommand,
  deleteCommands,
  getCurrentListId,
  setCurrentListId,
  setCurrentListByIndex,
  setCommandByIndex,
  getCommandByIndex,
});

chrome.runtime.onMessage.addListener(createMessageListener(dispatch));
