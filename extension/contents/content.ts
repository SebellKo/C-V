import type {
  GetCurrentCommandResponse,
  GetCurrentListNameResponse,
  RuntimeResponse,
} from '../../src/types/messages';
import type {
  CommandText,
  ListName,
  ShortcutIndex,
} from '../../src/types/domain';

let currentSelection = '';

const getShortcutIndex = (pressedKeyCode: string): ShortcutIndex => {
  return pressedKeyCode === 'Digit0'
    ? 9
    : (Number(pressedKeyCode.split('')[5]) - 1 as ShortcutIndex);
};

const getCurrentListName =
  async (): Promise<GetCurrentListNameResponse> => {
    return chrome.runtime.sendMessage({
      type: 'get-current-list-name',
    });
  };

const sendCopiedText = async (
  currentListName: ListName,
  newCommand: CommandText,
  index: ShortcutIndex,
): Promise<RuntimeResponse<'set-command-by-index'>> => {
  return chrome.runtime.sendMessage({
    type: 'set-command-by-index',
    message: {
      currentListName,
      newCommand,
      index,
    },
  });
};

const setCopyText = async (pressedKeyCode: string) => {
  const index = getShortcutIndex(pressedKeyCode);
  const currentList = await getCurrentListName();

  await sendCopiedText(currentList.currentListName, currentSelection, index);
};

const setCurrentListName = async (
  pressedKeyCode: string,
): Promise<RuntimeResponse<'set-current-list-name'>> => {
  const index = getShortcutIndex(pressedKeyCode);

  return chrome.runtime.sendMessage({
    type: 'set-current-list-name',
    message: { index },
  });
};

const getCurrentCommand = async (
  currentListName: ListName,
  index: ShortcutIndex,
): Promise<GetCurrentCommandResponse> => {
  return chrome.runtime.sendMessage({
    type: 'get-current-command',
    message: { currentListName, index },
  });
};

const setCurrentCommand = async (pressedKeyCode: string) => {
  const index = getShortcutIndex(pressedKeyCode);
  const currentList = await getCurrentListName();
  const command = await getCurrentCommand(currentList.currentListName, index);

  if (command.command) {
    await navigator.clipboard.writeText(command.command);
  }
};

document.addEventListener('keydown', async (event) => {
  const isAltKeyDown = event.altKey;
  const isShiftKeyDown = event.shiftKey;
  const pressedKeyCode = event.code;
  const isPressedNum = pressedKeyCode.includes('Digit');

  if (isAltKeyDown && isShiftKeyDown && isPressedNum)
    return setCopyText(pressedKeyCode);

  if (isShiftKeyDown && isPressedNum)
    return setCurrentListName(pressedKeyCode);

  if (isAltKeyDown && isPressedNum)
    return setCurrentCommand(pressedKeyCode);
});

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection()?.toString().trim();

  if (selection) currentSelection = selection;
});
