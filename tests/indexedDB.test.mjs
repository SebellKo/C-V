import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register('./esm-loader.mjs', import.meta.url);

const [
  { default: getPrimaryKey },
  { default: openDatabase },
  { default: requestToPromise },
  { default: transactionDone },
  { default: editList },
  { default: getCurrentListByName },
] = await Promise.all([
  import('../public/modules/getPrimaryKey.js'),
  import('../public/modules/openDatabase.js'),
  import('../public/modules/requestToPromise.js'),
  import('../public/modules/transactionDone.js'),
  import('../public/modules/service/editList.js'),
  import('../public/modules/service/getCurrentListByName.js'),
]);

test('editList는 트랜잭션 커밋이 끝난 뒤에만 완료된다', async () => {
  // 준비
  const database = installIndexedDB([
    { key: 1, value: { name: 'old', commands: ['before'] } },
  ]);
  database.blockCommits = true;
  let settled = false;

  // 실행
  const editing = editList([
    { name: 'first', commands: [] },
    { name: 'second', commands: ['after'] },
  ]).finally(() => {
    settled = true;
  });
  await nextTask();

  // 검증
  assert.equal(settled, false);
  assert.deepEqual(database.listValues(), [
    { name: 'old', commands: ['before'] },
  ]);

  database.releaseCommits();
  assert.deepEqual(await editing, { isDuplicated: false });
  assert.deepEqual(database.listValues(), [
    { name: 'first', commands: [] },
    { name: 'second', commands: ['after'] },
  ]);
  assert.equal(database.closed, true);
});

test('목록 항목 하나의 저장이 실패하면 editList는 실패하고 전체 변경을 롤백한다', async () => {
  // 준비
  const original = [{ key: 1, value: { name: 'old', commands: ['keep'] } }];
  const database = installIndexedDB(original);
  database.failedListName = 'broken';

  // 실행 및 검증
  await assert.rejects(
    editList([
      { name: 'first', commands: [] },
      { name: 'broken', commands: [] },
    ]),
    { name: 'ConstraintError' },
  );
  assert.deepEqual(database.entries, original);
  assert.equal(database.closed, true);
});

test('목록이나 기본 키가 없으면 undefined 대신 오류를 반환한다', async () => {
  // 준비
  const database = installIndexedDB([]);

  // 실행 및 검증
  await assert.rejects(getCurrentListByName('missing'), /List not found/);
  await assert.rejects(
    getPrimaryKey('missing', {
      getKey: () => successfulRequest(undefined),
    }),
    /List key not found/,
  );
  assert.equal(database.closed, true);
});

test('요청과 트랜잭션 실패는 원래 IndexedDB 오류를 유지한다', async () => {
  // 준비
  const requestError = new DOMException('duplicate', 'ConstraintError');
  const request = failedRequest(requestError);
  const transaction = new EventTarget();
  transaction.error = requestError;
  transaction.abort = () => transaction.dispatchEvent(new Event('abort'));

  // 실행 및 검증
  await assert.rejects(requestToPromise(request), requestError);
  const completion = transactionDone(transaction);
  transaction.abort();
  await assert.rejects(completion, requestError);
});

test('데이터베이스 버전이 변경되면 openDatabase 연결을 닫는다', async () => {
  // 준비
  const database = installIndexedDB([]);

  // 실행
  const connection = await openDatabase();
  connection.onversionchange();

  // 검증
  assert.equal(database.closed, true);
});

class FakeDatabase {
  constructor(entries) {
    this.entries = structuredClone(entries);
    this.blockCommits = false;
    this.closed = false;
    this.failedListName = undefined;
    this.transactions = new Set();
  }

  transaction(storeNames, mode) {
    assert.deepEqual(storeNames, ['list']);
    const transaction = new FakeTransaction(this, mode);
    this.transactions.add(transaction);
    return transaction;
  }

  close() {
    this.closed = true;
  }

  listValues() {
    return this.entries.map(({ value }) => structuredClone(value));
  }

  releaseCommits() {
    this.blockCommits = false;
    for (const transaction of this.transactions) transaction.commitIfReady();
  }
}

class FakeTransaction extends EventTarget {
  constructor(database, mode) {
    super();
    this.database = database;
    this.db = database;
    this.mode = mode;
    this.error = null;
    this.active = true;
    this.pending = 0;
    this.entries = structuredClone(database.entries);
    setImmediate(() => this.commitIfReady());
  }

  objectStore(name) {
    assert.equal(name, 'list');
    return new FakeObjectStore(this);
  }

  request(operation) {
    const request = { result: undefined, error: null };
    this.pending += 1;

    queueMicrotask(() => {
      if (!this.active) return;

      try {
        request.result = operation(this.entries);
        request.onsuccess?.({ target: request });
      } catch (error) {
        request.error = error;
        request.onerror?.({ target: request });
        this.fail(error);
      } finally {
        this.pending -= 1;
        setImmediate(() => this.commitIfReady());
      }
    });

    return request;
  }

  abort() {
    if (!this.active) {
      throw new DOMException('Transaction is inactive', 'InvalidStateError');
    }
    this.fail(new DOMException('Transaction aborted', 'AbortError'));
  }

  fail(error) {
    if (!this.active) return;
    this.active = false;
    this.error = error;
    this.database.transactions.delete(this);
    queueMicrotask(() => this.dispatchEvent(new Event('abort')));
  }

  commitIfReady() {
    if (
      !this.active ||
      this.pending !== 0 ||
      this.database.blockCommits
    ) {
      return;
    }

    if (this.mode === 'readwrite') {
      this.database.entries = structuredClone(this.entries);
    }
    this.active = false;
    this.database.transactions.delete(this);
    this.dispatchEvent(new Event('complete'));
  }
}

class FakeObjectStore {
  constructor(transaction) {
    this.transaction = transaction;
  }

  index(name) {
    assert.equal(name, 'name');
    return {
      get: (listName) =>
        this.transaction.request((entries) => {
          const entry = entries.find(({ value }) => value.name === listName);
          return entry && structuredClone(entry.value);
        }),
      getKey: (listName) =>
        this.transaction.request((entries) => {
          return entries.find(({ value }) => value.name === listName)?.key;
        }),
    };
  }

  clear() {
    return this.transaction.request((entries) => {
      entries.length = 0;
    });
  }

  add(value) {
    return this.transaction.request((entries) => {
      if (value.name === this.transaction.database.failedListName) {
        throw new DOMException('List add failed', 'ConstraintError');
      }

      const key = Math.max(0, ...entries.map((entry) => entry.key)) + 1;
      entries.push({ key, value: structuredClone(value) });
      return key;
    });
  }
}

function installIndexedDB(entries) {
  const database = new FakeDatabase(entries);
  globalThis.indexedDB = {
    open: () => successfulRequest(database),
  };
  return database;
}

function successfulRequest(result) {
  const request = { result, error: null };
  queueMicrotask(() => request.onsuccess?.({ target: request }));
  return request;
}

function failedRequest(error) {
  const request = { result: undefined, error };
  queueMicrotask(() => request.onerror?.({ target: request }));
  return request;
}

function nextTask() {
  return new Promise((resolve) => setImmediate(resolve));
}
