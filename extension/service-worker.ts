import openDatabase from './modules/openDatabase';

import editList from './modules/service/editList';
import getList from './modules/service/getList';
import getCurrentListByName from './modules/service/getCurrentListByName';
import editCommands from './modules/service/editCommands';
import editCommand from './modules/service/editCommand';
import deleteCommands from './modules/service/deleteCommands';
import deleteCommand from './modules/service/deleteCommand';
import addList from './modules/service/addList';
import addCommand from './modules/service/addCommand';
import getCurrentListName from './modules/service/getCurrentListName';
import setCurrentListName from './modules/service/setCurrentListName';
import setCommandByIndex from './modules/service/setCommandByIndex';
import getCommandByIndex from './modules/service/getCommandByIndex';
import type { RuntimeRequest } from '../src/types/messages';

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const db = await openDatabase();
    console.log('IndexedDB opened successfully:', db);
  } catch (error) {
    console.log(error);
  }
});

chrome.runtime.onMessage.addListener((request: RuntimeRequest, sender, sendResponse) => {
  if (request.type === 'add-list') {
    (async () => {
      const result = await addList(
        request.message.listName,
        request.message.id,
      );
      if (result && 'isDuplicated' in result && result.isDuplicated)
        sendResponse({ isDuplicated: true });
      if (result && 'isFull' in result && result.isFull)
        sendResponse({ isFull: true });
      else sendResponse({ success: true });
    })();
  }

  if (request.type === 'get-list') {
    (async () => {
      const listData = await getList();
      sendResponse({ listData: listData });
    })();
  }

  if (request.type === 'edit-list') {
    (async () => {
      const result = await editList(request.message.newList);
      if (result.isDuplicated) sendResponse({ isDuplicated: true });
      else sendResponse({ success: true });
    })();
  }

  if (request.type === 'get-list-by-name') {
    (async () => {
      const listData = await getCurrentListByName(request.message.name);
      sendResponse({ listData: listData });
    })();
  }

  if (request.type === 'add-new-command') {
    (async () => {
      const result = await addCommand(
        request.message.newCommand,
        request.message.currentListName,
      );
      if (result.isDuplicated) sendResponse({ isDuplicated: true });
      if (result.isFull) sendResponse({ isFull: true });
      else sendResponse({ success: true });
    })();
  }

  if (request.type === 'edit-commands') {
    (async () => {
      await editCommands(
        request.message.currentListName,
        request.message.updatedCommands,
      );
      sendResponse({ success: true });
    })();
  }

  if (request.type === 'delete-command') {
    (async () => {
      await deleteCommand(
        request.message.currentListName,
        request.message.targetCommand,
      );
      sendResponse({ success: true });
    })();
  }

  if (request.type === 'edit-command') {
    (async () => {
      const result = await editCommand(
        request.message.currentListName,
        request.message.targetCommand,
        request.message.newCommand,
      );

      if (result.isDuplicated) sendResponse({ isDuplicated: true });
      else sendResponse({ success: true });
    })();
  }

  if (request.type === 'delete-commands') {
    (async () => {
      await deleteCommands(request.message.currentListName);
      sendResponse({ success: true });
    })();
  }

  if (request.type === 'get-current-list-name') {
    (async () => {
      const currentList = await getCurrentListName();
      sendResponse({ currentListName: currentList });
    })();
  }

  if (request.type === 'set-current-list-name') {
    (async () => {
      await setCurrentListName(request.message.index);
      sendResponse({ success: true });
    })();
  }

  if (request.type === 'set-command-by-index') {
    (async () => {
      await setCommandByIndex(
        request.message.currentListName,
        request.message.newCommand,
        request.message.index,
      );
      sendResponse({ success: true });
    })();
  }

  if (request.type === 'get-current-command') {
    (async () => {
      const result = await getCommandByIndex(
        request.message.currentListName,
        request.message.index,
      );
      sendResponse({ command: result });
    })();
  }

  return true;
});
