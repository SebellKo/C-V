import { vi } from 'vitest';
import { handleMessage } from '../src/background/dispatcher.ts';
import type { AppState } from '../src/shared/type.d.ts';

export function sampleState(): AppState {
  return {
    schemaVersion: 1, currentListId: 'mail',
    lists: [
      { id: 'mail', name: '업무 메일', commands: [
        { id: 'intro', text: '  안녕하세요.\n요청하신 자료를 전달드립니다.  ' },
        { id: 'review', text: '검토 후 의견을 부탁드립니다.' },
        { id: 'thanks', text: '확인해 주셔서 감사합니다.' },
      ] },
      { id: 'support', name: '고객 응대', commands: [] },
    ],
  };
}

// Replace only Chrome's storage and transport boundaries; all product rules stay real.
export function installChrome(data: Record<string, unknown> = { cvState: sampleState() }) {
  const storage = {
    data: structuredClone(data),
    readError: null as Error | null,
    writeError: null as Error | null,
    beforeWrite: undefined as (() => Promise<void>) | undefined,
    loseNextReply: false,
  };
  const get = vi.fn(async () => {
    if (storage.readError) throw storage.readError;
    return structuredClone(storage.data);
  });
  const set = vi.fn(async (values: Record<string, unknown>) => {
    await storage.beforeWrite?.();
    if (storage.writeError) throw storage.writeError;
    Object.assign(storage.data, structuredClone(values));
  });
  const sendMessage = vi.fn(async (request: unknown) => {
    const response = await handleMessage(request);
    if (storage.loseNextReply) {
      storage.loseNextReply = false;
      throw new Error('Response lost after commit');
    }
    return response;
  });
  vi.stubGlobal('chrome', { storage: { local: { get, set } }, runtime: { sendMessage } });
  return { storage, get, set, sendMessage, state: () => structuredClone(storage.data.cvState) as AppState };
}
