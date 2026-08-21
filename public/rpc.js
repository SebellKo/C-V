const errorResponse = (code, message) => ({
  ok: false,
  error: { code, message },
});

const isString = (value) => typeof value === 'string';
const isNullableString = (value) => value === null || isString(value);
const isIndex = (value) => Number.isInteger(value) && value >= 0;

const hasPayload = (shape) => (message) =>
  message !== null &&
  typeof message === 'object' &&
  !Array.isArray(message) &&
  Object.entries(shape).every(([key, isValid]) => isValid(message[key]));

const mutationResult = (result) => {
  if (!result) throw new Error('Database operation returned no result');
  if (result.isDuplicated) return { isDuplicated: true };
  if (result.isFull) return { isFull: true };
  return { success: true };
};

const requiredResult = (result) => {
  if (result === undefined) {
    throw new Error('Database operation returned no result');
  }
  return result;
};

const success = async (operation) => {
  await operation();
  return { success: true };
};

export const createRpcDispatcher = (services) => {
  const handlers = {
    'add-list': {
      validate: hasPayload({ listName: isString, id: isString }),
      run: async ({ listName, id }) =>
        mutationResult(await services.addList(listName, id)),
    },
    'get-list': {
      run: async () => ({
        listData: requiredResult(await services.getList()),
      }),
    },
    'edit-list': {
      validate: hasPayload({ newList: Array.isArray }),
      run: async ({ newList }) =>
        mutationResult(await services.editList(newList)),
    },
    'get-list-by-id': {
      validate: hasPayload({ listId: isString }),
      run: async ({ listId }) => ({
        listData: await services.getListById(listId),
      }),
    },
    'add-new-command': {
      validate: hasPayload({
        newCommand: isString,
        listId: isString,
      }),
      run: async ({ newCommand, listId }) =>
        mutationResult(await services.addCommand(newCommand, listId)),
    },
    'edit-commands': {
      validate: hasPayload({
        listId: isString,
        updatedCommands: Array.isArray,
      }),
      run: ({ listId, updatedCommands }) =>
        success(() => services.editCommands(listId, updatedCommands)),
    },
    'delete-command': {
      validate: hasPayload({
        listId: isString,
        targetCommand: isString,
      }),
      run: ({ listId, targetCommand }) =>
        success(() => services.deleteCommand(listId, targetCommand)),
    },
    'edit-command': {
      validate: hasPayload({
        listId: isString,
        targetCommand: isString,
        newCommand: isString,
      }),
      run: async ({ listId, targetCommand, newCommand }) =>
        mutationResult(
          await services.editCommand(listId, targetCommand, newCommand),
        ),
    },
    'delete-commands': {
      validate: hasPayload({ listId: isString }),
      run: ({ listId }) =>
        success(() => services.deleteCommands(listId)),
    },
    'get-current-list-id': {
      run: async () => ({
        currentListId: requiredResult(
          await services.getCurrentListId(),
        ),
      }),
    },
    'set-current-list-id': {
      validate: hasPayload({ listId: isNullableString }),
      run: ({ listId }) =>
        success(() => services.setCurrentListId(listId)),
    },
    'set-current-list-by-index': {
      validate: hasPayload({ index: isIndex }),
      run: ({ index }) =>
        success(() => services.setCurrentListByIndex(index)),
    },
    'set-command-by-index': {
      validate: hasPayload({
        listId: isString,
        newCommand: isString,
        index: isIndex,
      }),
      run: ({ listId, newCommand, index }) =>
        success(() =>
          services.setCommandByIndex(listId, newCommand, index),
        ),
    },
    'get-current-command': {
      validate: hasPayload({
        listId: isString,
        index: isIndex,
      }),
      run: async ({ listId, index }) => ({
        command: await services.getCommandByIndex(listId, index),
      }),
    },
  };

  return async (request) => {
    const type = request?.type;

    if (!Object.prototype.hasOwnProperty.call(handlers, type)) {
      return errorResponse('UNKNOWN_TYPE', 'Unknown request type');
    }

    const handler = handlers[type];
    if (handler.validate && !handler.validate(request.message)) {
      return errorResponse('INVALID_PAYLOAD', 'Invalid request payload');
    }

    try {
      return { ok: true, data: await handler.run(request.message) };
    } catch {
      return errorResponse('DB_ERROR', 'Database operation failed');
    }
  };
};

export const createMessageListener = (dispatch) =>
  (request, sender, sendResponse) => {
    void sender;
    dispatch(request).then(sendResponse);
    return true;
  };
