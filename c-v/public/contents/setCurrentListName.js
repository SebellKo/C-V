const setCurrentListName = async (pressedKeyCode) => {
  const index =
    pressedKeyCode === 'Digit0' ? 9 : Number(pressedKeyCode.split('')[5]) - 1;

  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'set-current-list-name',
        message: { index: index },
      })
      .then((response) => resolve(response));
  });
  return result;
};
