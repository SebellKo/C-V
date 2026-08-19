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

describe('service worker RPC dispatcher', () => {
  it.each(supportedRequests)(
    '%s request runs one handler and responds exactly once',
    async (type, request, serviceName) => {
      // Given
      const services = createServices();
      const listener = createMessageListener(createRpcDispatcher(services));
      let sendResponse;
      const response = new Promise((resolve) => {
        sendResponse = jest.fn(resolve);
      });

      // When
      const keepsChannelOpen = listener(request, {}, sendResponse);

      // Then
      await expect(response).resolves.toMatchObject({ ok: true });
      expect(keepsChannelOpen).toBe(true);
      expect(sendResponse).toHaveBeenCalledTimes(1);
      expect(services[serviceName]).toHaveBeenCalledTimes(1);
      expect(totalServiceCalls(services)).toBe(1);
    },
  );

  it('unknown type returns UNKNOWN_TYPE without running a handler', async () => {
    // Given
    const services = createServices();
    const dispatch = createRpcDispatcher(services);

    // When
    const response = await dispatch({ type: 'missing-handler' });

    // Then
    expect(response).toEqual({
      ok: false,
      error: { code: 'UNKNOWN_TYPE', message: 'Unknown request type' },
    });
    expect(totalServiceCalls(services)).toBe(0);
  });

  it('missing or mistyped required payload returns INVALID_PAYLOAD', async () => {
    // Given
    const services = createServices();
    const dispatch = createRpcDispatcher(services);

    // When
    const response = await dispatch({
      type: 'add-new-command',
      message: { newCommand: 'Copy me', currentListName: 1 },
    });

    // Then
    expect(response).toEqual({
      ok: false,
      error: { code: 'INVALID_PAYLOAD', message: 'Invalid request payload' },
    });
    expect(totalServiceCalls(services)).toBe(0);
  });

  it.each([
    ['duplicate', { isDuplicated: true }, { isDuplicated: true }],
    ['full', { isFull: true }, { isFull: true }],
  ])('%s remains a successful domain result', async (name, result, data) => {
    // Given
    const services = createServices();
    services.addCommand.mockResolvedValue(result);
    const dispatch = createRpcDispatcher(services);

    // When
    const response = await dispatch({
      type: 'add-new-command',
      message: { newCommand: 'Copy me', currentListName: 'Work' },
    });

    // Then
    expect(response).toEqual({ ok: true, data });
  });

  it('database rejection returns DB_ERROR without exposing command text', async () => {
    // Given
    const command = 'private command text';
    const services = createServices();
    services.addCommand.mockRejectedValue(
      new Error(`Failed to save ${command}`),
    );
    const dispatch = createRpcDispatcher(services);

    // When
    const response = await dispatch({
      type: 'add-new-command',
      message: { newCommand: command, currentListName: 'Work' },
    });

    // Then
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
