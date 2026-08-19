const errorResponse = (code, message) => ({
  ok: false,
  error: { code, message },
});

const isString = (value) => typeof value === 'string';
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
    'get-list-by-name': {
      validate: hasPayload({ name: isString }),
      run: async ({ name }) => ({
        listData: await services.getCurrentListByName(name),
      }),
    },
    'add-new-command': {
      validate: hasPayload({
        newCommand: isString,
        currentListName: isString,
      }),
      run: async ({ newCommand, currentListName }) =>
        mutationResult(
          await services.addCommand(newCommand, currentListName),
        ),
    },
    'edit-commands': {
      validate: hasPayload({
        currentListName: isString,
        updatedCommands: Array.isArray,
      }),
      run: ({ currentListName, updatedCommands }) =>
        success(() =>
          services.editCommands(currentListName, updatedCommands),
        ),
    },
    'delete-command': {
      validate: hasPayload({
        currentListName: isString,
        targetCommand: isString,
      }),
      run: ({ currentListName, targetCommand }) =>
        success(() =>
          services.deleteCommand(currentListName, targetCommand),
        ),
    },
    'edit-command': {
      validate: hasPayload({
        currentListName: isString,
        targetCommand: isString,
        newCommand: isString,
      }),
      run: async ({ currentListName, targetCommand, newCommand }) =>
        mutationResult(
          await services.editCommand(
            currentListName,
            targetCommand,
            newCommand,
          ),
        ),
    },
    'delete-commands': {
      validate: hasPayload({ currentListName: isString }),
      run: ({ currentListName }) =>
        success(() => services.deleteCommands(currentListName)),
    },
    'get-current-list-name': {
      run: async () => ({
        currentListName: requiredResult(
          await services.getCurrentListName(),
        ),
      }),
    },
    'set-current-list-name': {
      validate: hasPayload({ index: isIndex }),
      run: ({ index }) =>
        success(() => services.setCurrentListName(index)),
    },
    'set-command-by-index': {
      validate: hasPayload({
        currentListName: isString,
        newCommand: isString,
        index: isIndex,
      }),
      run: ({ currentListName, newCommand, index }) =>
        success(() =>
          services.setCommandByIndex(currentListName, newCommand, index),
        ),
    },
    'get-current-command': {
      validate: hasPayload({
        currentListName: isString,
        index: isIndex,
      }),
      run: async ({ currentListName, index }) => ({
        command: await services.getCommandByIndex(currentListName, index),
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
