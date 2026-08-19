import sendRuntimeMessage from './sendRuntimeMessage';

describe('런타임 메시지 전송', () => {
  beforeEach(() => {
    global.chrome = {
      runtime: { sendMessage: jest.fn() },
    };
  });

  afterEach(() => {
    delete global.chrome;
  });

  it('성공한 RPC 응답의 데이터를 반환한다', async () => {
    // 준비
    const data = { success: true };
    chrome.runtime.sendMessage.mockResolvedValue({ ok: true, data });

    // 실행 및 검증
    await expect(sendRuntimeMessage({ type: 'test' })).resolves.toBe(data);
  });

  it('실패한 RPC 응답의 서비스 워커 오류 코드를 전달한다', async () => {
    // 준비
    chrome.runtime.sendMessage.mockResolvedValue({
      ok: false,
      error: { code: 'DB_ERROR', message: 'Database operation failed' },
    });

    // 실행
    const request = sendRuntimeMessage({ type: 'test' });

    // 검증
    await expect(request).rejects.toMatchObject({
      code: 'DB_ERROR',
      message: 'Database operation failed',
    });
  });

  it('Chrome 런타임 오류를 API 호출자에게 그대로 전달한다', async () => {
    // 준비
    const runtimeError = new Error('The message port closed');
    chrome.runtime.sendMessage.mockRejectedValue(runtimeError);

    // 실행
    const request = sendRuntimeMessage({ type: 'test' });

    // 검증
    await expect(request).rejects.toBe(runtimeError);
  });
});
