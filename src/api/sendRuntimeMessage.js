const sendRuntimeMessage = async (request) => {
  const response = await chrome.runtime.sendMessage(request);

  if (!response.ok) {
    const error = new Error(response.error.message);
    error.code = response.error.code;
    throw error;
  }

  return response.data;
};

export default sendRuntimeMessage;
