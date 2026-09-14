import { useEffect, useRef, useState } from 'react';
import { sendMessage } from '../shared/messageClient.ts';
import type {
  AppState,
  MessageErrorCode,
  MessageRequest,
} from '../shared/type.d.ts';

export type ListMutation = Extract<
  MessageRequest,
  { type: 'list.create' | 'list.select' | 'lists.updateMetadata' }
>;

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; snapshot: AppState }
  | { status: 'error'; error: MessageErrorCode };

export function usePopupState() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: 'loading' });
    void sendMessage({ type: 'state.get' }).then((response) => {
      if (cancelled) return;
      setLoadState(
        response.ok
          ? { status: 'ready', snapshot: response.data }
          : { status: 'error', error: response.error },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  async function save(request: ListMutation) {
    // React가 버튼을 다시 그리기 전 연속 제출도 하나의 요청만 보낸다.
    if (savingRef.current || loadState.status !== 'ready') return;
    savingRef.current = true;
    setSaving(true);
    const response = await sendMessage(request);
    savingRef.current = false;
    if (mounted.current) {
      if (response.ok)
        setLoadState({ status: 'ready', snapshot: response.data });
      setSaving(false);
    }
    return response;
  }

  return {
    loadState,
    saving,
    save,
    reload: () => setLoadAttempt((attempt) => attempt + 1),
  };
}
