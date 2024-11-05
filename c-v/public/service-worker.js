import openDatabase from './modules/openDatabase.js';

import modifyList from './modules/service/modifyList.js';
import getList from './modules/service/getList.js';
import getCurrentListByName from './modules/service/getCurrentListByName.js';
import editCommands from './modules/service/editCommands.js';
import editCommand from './modules/service/editCommand.js';
import deleteCommands from './modules/service/deleteCommands.js';
import deleteCommand from './modules/service/deleteCommand.js';
import addList from './modules/service/addList.js';
import addCommand from './modules/service/addCommand.js';

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const db = await openDatabase();
    console.log('IndexedDB opened successfully:', db);
  } catch (error) {
    console.log(error);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'add-list')
    (async () => {
      await addList(request.message.listName, request.message.id);
      sendResponse({ success: true });
    })();

  if (request.type === 'get-list') {
    (async () => {
      const listData = await getList();
      sendResponse({ listData: listData });
    })();
  }

  if (request.type === 'edit-list') {
    (async () => {
      await modifyList(request.message.newList);
      sendResponse({ success: true });
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
      await addCommand(
        request.message.newCommand,
        request.message.currentListName,
      );
      sendResponse({ success: true });
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
      await editCommand(
        request.message.currentListName,
        request.message.targetCommand,
        request.message.newCommand,
      );
      sendResponse({ success: true });
    })();
  }

  if (request.type === 'delete-commands') {
    (async () => {
      await deleteCommands(request.message.currentListName);
      sendResponse({ success: true });
    })();
  }

  return true;
});
