import sendRuntimeMessage from './sendRuntimeMessage';

describe('sendRuntimeMessage', () => {
  beforeEach(() => {
    global.chrome = {
      runtime: { sendMessage: jest.fn() },
    };
  });

  afterEach(() => {
    delete global.chrome;
  });

  it('returns data from a successful RPC envelope', async () => {
    // Given
    const data = { success: true };
    chrome.runtime.sendMessage.mockResolvedValue({ ok: true, data });

    // When / Then
    await expect(sendRuntimeMessage({ type: 'test' })).resolves.toBe(data);
  });

  it('rejects with the worker error code from a failed RPC envelope', async () => {
    // Given
    chrome.runtime.sendMessage.mockResolvedValue({
      ok: false,
      error: { code: 'DB_ERROR', message: 'Database operation failed' },
    });

    // When
    const request = sendRuntimeMessage({ type: 'test' });

    // Then
    await expect(request).rejects.toMatchObject({
      code: 'DB_ERROR',
      message: 'Database operation failed',
    });
  });

  it('propagates the original runtime rejection to the API caller', async () => {
    // Given
    const runtimeError = new Error('The message port closed');
    chrome.runtime.sendMessage.mockRejectedValue(runtimeError);

    // When
    const request = sendRuntimeMessage({ type: 'test' });

    // Then
    await expect(request).rejects.toBe(runtimeError);
  });
});
