import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import 'fake-indexeddb/auto';

import openDatabase from '../public/modules/openDatabase.js';
import requestToPromise from '../public/modules/requestToPromise.js';
import addCommand from '../public/modules/service/addCommand.js';
import editList from '../public/modules/service/editList.js';
import getCurrentListName from '../public/modules/service/getCurrentListName.js';
import setCurrentListName from '../public/modules/service/setCurrentListName.js';

const DATABASE_NAME = 'CVStore';

afterEach(async () => {
  await deleteDatabase();
});

test('v1 데이터는 목록과 명령 순서를 보존하며 고유 id와 현재 선택을 마이그레이션한다', async () => {
  // 준비
  await createVersionOneDatabase({
    lists: [
      { id: 'existing-id', name: 'Work', commands: ['first', 'second'] },
      { name: 'Personal', commands: ['third'] },
    ],
    currentList: { name: 'Personal' },
  });

  // 실행
  const db = await openDatabase();
  const snapshot = await readDatabase(db);

  // 검증
  assert.equal(db.version, 2);
  assert.equal(
    db.transaction('list').objectStore('list').index('id').unique,
    true,
  );
  assert.deepEqual(
    snapshot.lists.map(({ name, commands }) => ({ name, commands })),
    [
      { name: 'Work', commands: ['first', 'second'] },
      { name: 'Personal', commands: ['third'] },
    ],
  );
  assert.equal(snapshot.lists[0].id, 'existing-id');
  assert.match(snapshot.lists[1].id, /^[0-9a-f-]{36}$/i);
  assert.deepEqual(snapshot.currentList, [
    { listId: snapshot.lists[1].id },
  ]);

  db.close();
});

test('v1의 현재 선택 목록이 이미 사라졌다면 미선택 상태로 마이그레이션한다', async () => {
  // 준비
  await createVersionOneDatabase({
    lists: [{ name: 'Work', commands: ['first'] }],
    currentList: { name: 'Deleted list' },
  });

  // 실행
  const db = await openDatabase();
  const snapshot = await readDatabase(db);

  // 검증
  assert.equal(snapshot.lists.length, 1);
  assert.deepEqual(snapshot.currentList, []);

  db.close();
});

test('목록 이름을 바꿔도 같은 id의 선택과 명령을 유지하고 삭제하면 선택을 비운다', async () => {
  // 준비
  const db = await openDatabase();
  await writeLists(db, [
    { id: 'work-id', name: 'Work', commands: ['first'] },
    { id: 'other-id', name: 'Other', commands: [] },
  ]);
  db.close();
  await setCurrentListName(0);

  // 실행
  await editList([
    { id: 'work-id', name: 'Renamed', commands: ['first'] },
    { id: 'other-id', name: 'Other', commands: [] },
  ]);
  await addCommand('second', 'Renamed');

  // 검증
  assert.equal(await getCurrentListName(), 'Renamed');
  const renamedSnapshot = await openAndReadDatabase();
  assert.deepEqual(renamedSnapshot.lists[0], {
    id: 'work-id',
    name: 'Renamed',
    commands: ['first', 'second'],
  });

  // 실행
  await editList([
    { id: 'other-id', name: 'Other', commands: [] },
  ]);

  // 검증
  assert.equal(await getCurrentListName(), '');
  const deletedSnapshot = await openAndReadDatabase();
  assert.deepEqual(deletedSnapshot.currentList, []);
});

test('id 생성 중 실패하면 v1 데이터와 스키마를 그대로 롤백한다', async () => {
  // 준비
  const originalRandomUUID = crypto.randomUUID;
  await createVersionOneDatabase({
    lists: [{ name: 'Legacy', commands: ['first'] }],
    currentList: { name: 'Legacy' },
  });
  Object.defineProperty(crypto, 'randomUUID', {
    configurable: true,
    value: () => {
      throw new Error('forced migration failure');
    },
  });

  try {
    // 실행 및 검증
    await assert.rejects(openDatabase());
  } finally {
    Object.defineProperty(crypto, 'randomUUID', {
      configurable: true,
      value: originalRandomUUID,
    });
  }

  const db = await openVersionOneDatabase();
  const snapshot = await readDatabase(db);
  const listStore = db.transaction('list').objectStore('list');

  assert.equal(db.version, 1);
  assert.equal(listStore.indexNames.contains('id'), false);
  assert.deepEqual(snapshot.lists, [
    { name: 'Legacy', commands: ['first'] },
  ]);
  assert.deepEqual(snapshot.currentList, [{ name: 'Legacy' }]);

  db.close();
});

function createVersionOneDatabase({ lists, currentList }) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      const listStore = db.createObjectStore('list', { autoIncrement: true });
      listStore.createIndex('name', 'name', { unique: false });
      db.createObjectStore('currentList', { autoIncrement: true });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(
        ['list', 'currentList'],
        'readwrite',
      );
      const listStore = transaction.objectStore('list');

      lists.forEach((list) => listStore.add(list));
      if (currentList) {
        transaction.objectStore('currentList').put(currentList, 1);
      }

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    };
  });
}

function openVersionOneDatabase() {
  return requestToPromise(indexedDB.open(DATABASE_NAME, 1));
}

async function openAndReadDatabase() {
  const db = await openDatabase();

  try {
    return await readDatabase(db);
  } finally {
    db.close();
  }
}

async function readDatabase(db) {
  const transaction = db.transaction(['list', 'currentList'], 'readonly');
  const done = waitForTransaction(transaction);
  const listsRequest = transaction.objectStore('list').getAll();
  const currentListRequest = transaction.objectStore('currentList').getAll();
  const [lists, currentList] = await Promise.all([
    requestToPromise(listsRequest),
    requestToPromise(currentListRequest),
  ]);

  await done;

  return { lists, currentList };
}

async function writeLists(db, lists) {
  const transaction = db.transaction('list', 'readwrite');
  const done = waitForTransaction(transaction);
  const store = transaction.objectStore('list');

  await Promise.all(lists.map((list) => requestToPromise(store.add(list))));
  await done;
}

function waitForTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
  });
}

function deleteDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Database deletion blocked'));
  });
}
