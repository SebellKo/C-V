const setCurrentCommand = async (pressedKeyCode) => {
  const index =
    pressedKeyCode === 'Digit0' ? 9 : Number(pressedKeyCode.split('')[5]) - 1;

  const currentListId = await getCurrentListId();

  if (currentListId === null) return;

  const command = await getCurrentCommand(currentListId, index);

  if (typeof command === 'string') {
    await navigator.clipboard.writeText(command);
  }
};

const getCurrentCommand = async (listId, index) => {
  const response = await chrome.runtime.sendMessage({
    type: 'get-current-command',
    message: { listId, index },
  });

  if (!response.ok) {
    throw new Error(response.error.message);
  }

  return response.data.command;
};
