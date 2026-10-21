import { describe, expect, it } from 'vitest';
import { applyStateMutation, createInitialState, parseAppState } from '../src/background/stateRules.ts';
import { sampleState } from './chrome.ts';

describe('saved data contracts', () => {
  it('preserves text verbatim, appends only the next position and rejects duplicates', () => {
    const state = sampleState();
    const skipped = applyStateMutation(state, { type: 'command.setAt', listId: 'mail', index: 5, newCommandId: 'skip', text: 'skip' });
    expect(skipped).toBe(state);
    const text = '  첫 줄\n\n둘째 줄  ';
    const next = applyStateMutation(state, { type: 'command.setAt', listId: 'mail', index: 3, newCommandId: 'new', text });
    expect(next.lists[0]?.commands[3]).toEqual({ id: 'new', text });
    expect(() => applyStateMutation(next, { type: 'command.create', listId: 'mail', commandId: 'duplicate', text })).toThrow(expect.objectContaining({ code: 'COMMAND_DUPLICATED' }));
    expect(state.lists[0]?.commands).toHaveLength(3);
  });

  it('swaps only the two commands and compacts positions after deletion', () => {
    const state = sampleState();
    const swapped = applyStateMutation(state, { type: 'command.swap', listId: 'mail', sourceId: 'intro', targetId: 'thanks' });
    expect(swapped.lists[0]?.commands.map(({ id }) => id)).toEqual(['thanks', 'review', 'intro']);
    const deleted = applyStateMutation(swapped, { type: 'command.delete', listId: 'mail', commandId: 'review' });
    expect(deleted.lists[0]?.commands.map(({ id }) => id)).toEqual(['thanks', 'intro']);
    expect(state.lists[0]?.commands.map(({ id }) => id)).toEqual(['intro', 'review', 'thanks']);
    expect(applyStateMutation(state, { type: 'command.swap', listId: 'mail', sourceId: 'intro', targetId: 'missing' })).toBe(state);
  });

  it('preserves concurrent commands when applying metadata and refuses a stale list snapshot', () => {
    const state = sampleState();
    const expectedLists = state.lists.map(({ id, name }) => ({ id, name }));
    const edited = applyStateMutation(state, { type: 'command.update', listId: 'mail', commandId: 'intro', text: '새 문장' });
    const renamed = applyStateMutation(edited, { type: 'lists.updateMetadata', expectedLists, lists: [{ id: 'support', name: '지원' }, { id: 'mail', name: '메일' }] });
    expect(renamed.lists[1]?.commands[0]?.text).toBe('새 문장');
    expect(() => applyStateMutation(renamed, { type: 'lists.updateMetadata', expectedLists, lists: expectedLists })).toThrow(expect.objectContaining({ code: 'LIST_METADATA_CONFLICT' }));
    const deleted = applyStateMutation(state, { type: 'lists.updateMetadata', expectedLists, lists: expectedLists.slice(1) });
    expect(deleted.currentListId).toBeNull();
  });

  it('enforces ten lists, ten commands and nonempty unique names', () => {
    let state = createInitialState();
    for (let i = 0; i < 10; i++) state = applyStateMutation(state, { type: 'list.create', listId: `list-${i}`, name: `목록 ${i}` });
    expect(() => applyStateMutation(state, { type: 'list.create', listId: 'extra', name: '추가' })).toThrow(expect.objectContaining({ code: 'LIST_LIMIT_REACHED' }));
    for (let i = 0; i < 10; i++) state = applyStateMutation(state, { type: 'command.create', listId: 'list-0', commandId: `command-${i}`, text: `문장 ${i}` });
    expect(() => applyStateMutation(state, { type: 'command.create', listId: 'list-0', commandId: 'extra', text: '추가' })).toThrow(expect.objectContaining({ code: 'COMMAND_LIMIT_REACHED' }));
    expect(() => applyStateMutation(sampleState(), { type: 'list.create', listId: 'new', name: ' 업무 메일 ' })).toThrow(expect.objectContaining({ code: 'LIST_NAME_DUPLICATED' }));
    expect(() => applyStateMutation(createInitialState(), { type: 'list.create', listId: 'empty', name: '  ' })).toThrow(expect.objectContaining({ code: 'LIST_NAME_REQUIRED' }));
  });

  it('rejects unsupported or malformed storage instead of inventing empty data', () => {
    expect(() => parseAppState({ ...sampleState(), schemaVersion: 2 })).toThrow(expect.objectContaining({ code: 'UNSUPPORTED_SCHEMA_VERSION' }));
    expect(() => parseAppState({ ...sampleState(), lists: [null] })).toThrow(expect.objectContaining({ code: 'INVALID_STATE' }));
    expect(parseAppState({ ...sampleState(), currentListId: 'deleted' }).currentListId).toBeNull();
  });
});
