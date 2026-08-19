import {
  createMessageListener,
  createRpcDispatcher,
} from '../../public/rpc.js';

const supportedRequests = [
  [
    'add-list',
    { type: 'add-list', message: { listName: 'Work', id: 'list-id' } },
    'addList',
  ],
  ['get-list', { type: 'get-list' }, 'getList'],
  [
    'edit-list',
    { type: 'edit-list', message: { newList: [] } },
    'editList',
  ],
  [
    'get-list-by-name',
    { type: 'get-list-by-name', message: { name: 'Work' } },
    'getCurrentListByName',
  ],
  [
    'add-new-command',
    {
      type: 'add-new-command',
      message: { newCommand: 'Copy me', currentListName: 'Work' },
    },
    'addCommand',
  ],
  [
    'edit-commands',
    {
      type: 'edit-commands',
      message: { currentListName: 'Work', updatedCommands: [] },
    },
    'editCommands',
  ],
  [
    'delete-command',
    {
      type: 'delete-command',
      message: { currentListName: 'Work', targetCommand: 'Copy me' },
    },
    'deleteCommand',
  ],
  [
    'edit-command',
    {
      type: 'edit-command',
      message: {
        currentListName: 'Work',
        targetCommand: 'Old',
        newCommand: 'New',
      },
    },
    'editCommand',
  ],
  [
    'delete-commands',
    {
      type: 'delete-commands',
      message: { currentListName: 'Work' },
    },
    'deleteCommands',
  ],
  [
    'get-current-list-name',
    { type: 'get-current-list-name' },
    'getCurrentListName',
  ],
  [
    'set-current-list-name',
    { type: 'set-current-list-name', message: { index: 0 } },
    'setCurrentListName',
  ],
  [
    'set-command-by-index',
    {
      type: 'set-command-by-index',
      message: { currentListName: 'Work', newCommand: 'New', index: 0 },
    },
    'setCommandByIndex',
  ],
  [
    'get-current-command',
    {
      type: 'get-current-command',
      message: { currentListName: 'Work', index: 0 },
    },
    'getCommandByIndex',
  ],
];

describe('서비스 워커 RPC 요청 처리', () => {
  it.each(supportedRequests)(
    '%s 요청은 하나의 처리기만 실행하고 한 번만 응답한다',
    async (type, request, serviceName) => {
      // 준비
      const services = createServices();
      const listener = createMessageListener(createRpcDispatcher(services));
      let sendResponse;
      const response = new Promise((resolve) => {
        sendResponse = jest.fn(resolve);
      });

      // 실행
      const keepsChannelOpen = listener(request, {}, sendResponse);

      // 검증
      await expect(response).resolves.toMatchObject({ ok: true });
      expect(keepsChannelOpen).toBe(true);
      expect(sendResponse).toHaveBeenCalledTimes(1);
      expect(services[serviceName]).toHaveBeenCalledTimes(1);
      expect(totalServiceCalls(services)).toBe(1);
    },
  );

  it('지원하지 않는 요청은 서비스를 실행하지 않고 UNKNOWN_TYPE 오류를 반환한다', async () => {
    // 준비
    const services = createServices();
    const dispatch = createRpcDispatcher(services);

    // 실행
    const response = await dispatch({ type: 'missing-handler' });

    // 검증
    expect(response).toEqual({
      ok: false,
      error: { code: 'UNKNOWN_TYPE', message: 'Unknown request type' },
    });
    expect(totalServiceCalls(services)).toBe(0);
  });

  it('필수 입력이 없거나 타입이 잘못되면 INVALID_PAYLOAD 오류를 반환한다', async () => {
    // 준비
    const services = createServices();
    const dispatch = createRpcDispatcher(services);

    // 실행
    const response = await dispatch({
      type: 'add-new-command',
      message: { newCommand: 'Copy me', currentListName: 1 },
    });

    // 검증
    expect(response).toEqual({
      ok: false,
      error: { code: 'INVALID_PAYLOAD', message: 'Invalid request payload' },
    });
    expect(totalServiceCalls(services)).toBe(0);
  });

  it.each([
    ['중복', { isDuplicated: true }, { isDuplicated: true }],
    ['용량 초과', { isFull: true }, { isFull: true }],
  ])('%s 결과는 RPC 성공으로 반환한다', async (name, result, data) => {
    // 준비
    const services = createServices();
    services.addCommand.mockResolvedValue(result);
    const dispatch = createRpcDispatcher(services);

    // 실행
    const response = await dispatch({
      type: 'add-new-command',
      message: { newCommand: 'Copy me', currentListName: 'Work' },
    });

    // 검증
    expect(response).toEqual({ ok: true, data });
  });

  it('데이터베이스 작업이 실패하면 명령 내용을 노출하지 않고 DB_ERROR를 반환한다', async () => {
    // 준비
    const command = 'private command text';
    const services = createServices();
    services.addCommand.mockRejectedValue(
      new Error(`Failed to save ${command}`),
    );
    const dispatch = createRpcDispatcher(services);

    // 실행
    const response = await dispatch({
      type: 'add-new-command',
      message: { newCommand: command, currentListName: 'Work' },
    });

    // 검증
    expect(response).toEqual({
      ok: false,
      error: { code: 'DB_ERROR', message: 'Database operation failed' },
    });
    expect(JSON.stringify(response)).not.toContain(command);
  });
});

function createServices() {
  return {
    addList: jest.fn().mockResolvedValue({ isDuplicated: false }),
    getList: jest.fn().mockResolvedValue([]),
    editList: jest.fn().mockResolvedValue({ isDuplicated: false }),
    getCurrentListByName: jest.fn().mockResolvedValue({ name: 'Work' }),
    addCommand: jest.fn().mockResolvedValue({ isDuplicated: false }),
    editCommands: jest.fn().mockResolvedValue(),
    deleteCommand: jest.fn().mockResolvedValue(),
    editCommand: jest.fn().mockResolvedValue({ isDuplicated: false }),
    deleteCommands: jest.fn().mockResolvedValue(),
    getCurrentListName: jest.fn().mockResolvedValue('Work'),
    setCurrentListName: jest.fn().mockResolvedValue(),
    setCommandByIndex: jest.fn().mockResolvedValue(),
    getCommandByIndex: jest.fn().mockResolvedValue('Copy me'),
  };
}

function totalServiceCalls(services) {
  return Object.values(services).reduce(
    (total, service) => total + service.mock.calls.length,
    0,
  );
}
