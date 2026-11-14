import assert from 'node:assert/strict';
import test from 'node:test';
import { handleMessage } from '../src/background/dispatcher.ts';
import { getShortcut } from '../src/content/shortcut.ts';

test('matches platform shortcuts and preserves other key input', () => {
  // Given
  const numberKey = {
    code: 'Digit1',
    getModifierState: () => false,
  };
  const cases = [
    [{ ctrlKey: true, shiftKey: true }, false, false, 'selectList'],
    [{ ctrlKey: true, altKey: true }, false, true, 'selectCommand'],
    [{ ctrlKey: true, altKey: true }, true, false, 'selectCommand'],
    [{ altKey: true }, false, true, 'copy'],
    [{ ctrlKey: true }, true, false, 'copy'],
    [{ ctrlKey: true }, false, false, undefined],
    [{ altKey: true }, false, false, undefined],
    [{ shiftKey: true }, true, false, undefined],
    [{ shiftKey: true }, false, false, undefined],
    [
      { ctrlKey: true, altKey: true, getModifierState: () => true },
      false,
      false,
      undefined,
    ],
    [{ getModifierState: () => true }, false, true, 'selectCommand'],
    [{ shiftKey: true, getModifierState: () => true }, false, true, undefined],
    [{ ctrlKey: true, isComposing: true }, true, false, undefined],
    [{ ctrlKey: true, defaultPrevented: true }, true, false, undefined],
  ];

  for (const [keys, mac, leftAlt, action] of cases) {
    // When
    const shortcut = getShortcut({ ...numberKey, ...keys }, mac, leftAlt);

    // Then
    assert.deepEqual(shortcut, action ? { action, position: 1 } : undefined);
  }
});

test('supports keypad shortcuts while preserving Windows Alt codes', () => {
  // Given
  const keys = { ctrlKey: true, getModifierState: () => false };

  // When
  const topRow = getShortcut({ ...keys, code: 'Digit0' }, true, false);
  const keypad = { code: 'Numpad0', getModifierState: () => false };

  // Then
  assert.deepEqual(topRow, { action: 'copy', position: 10 });
  assert.deepEqual(getShortcut({ ...keypad, ctrlKey: true }, true, false), {
    action: 'copy',
    position: 10,
  });
  assert.deepEqual(
    getShortcut({ ...keypad, ctrlKey: true, shiftKey: true }, false, false),
    { action: 'selectList', position: 10 },
  );
  assert.deepEqual(
    getShortcut({ ...keypad, altKey: true, shiftKey: true }, false, true),
    { action: 'save', position: 10 },
  );
  assert.equal(getShortcut({ ...keypad, altKey: true }, false, true), undefined);
});

test('copies into the selected list without changing the source or creating gaps', async () => {
  // Given
  let state = {
    schemaVersion: 1,
    currentListId: 'a',
    lists: [
      { id: 'a', name: 'A', commands: [{ id: 'a1', text: 'source' }] },
      { id: 'b', name: 'B', commands: [{ id: 'b1', text: 'old' }] },
    ],
  };
  globalThis.chrome = {
    storage: {
      local: {
        get: async () => ({ cvState: structuredClone(state) }),
        set: async ({ cvState }) => {
          state = structuredClone(cvState);
        },
      },
    },
  };

  // When
  const source = await handleMessage({
    type: 'shortcut.command.get',
    position: 1,
  });
  await handleMessage({ type: 'shortcut.list.select', position: 2 });
  const copy = { type: 'shortcut.command.copy', text: source.data.text };
  const overwrite = await handleMessage({ ...copy, position: 1 });
  const duplicate = await handleMessage({ ...copy, position: 2 });
  const gap = await handleMessage({ ...copy, position: 4 });

  // Then
  assert.equal(state.lists[0].commands[0].text, 'source');
  assert.deepEqual(overwrite.data, {
    commandId: 'b1',
    listId: 'b',
    listName: 'B',
    position: 1,
    text: 'source',
  });
  assert.equal(duplicate.ok, true);
  assert.deepEqual(
    state.lists[1].commands.map(({ text }) => text),
    ['source', 'source'],
  );
  assert.deepEqual(gap, { ok: false, error: 'POSITION_NOT_FOUND' });
  assert.deepEqual(
    await handleMessage({ ...copy, type: 'shortcut.command.set', position: 3 }),
    { ok: false, error: 'COMMAND_DUPLICATED' },
  );
});
