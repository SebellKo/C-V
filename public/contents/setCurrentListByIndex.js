const setCurrentListByIndex = async (pressedKeyCode) => {
  const index =
    pressedKeyCode === 'Digit0' ? 9 : Number(pressedKeyCode.split('')[5]) - 1;

  return chrome.runtime.sendMessage({
    type: 'set-current-list-by-index',
    message: { index },
  });
};
