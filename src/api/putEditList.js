import sendRuntimeMessage from './sendRuntimeMessage';

const putEditList = async (metadataPatch) => {
  return sendRuntimeMessage({
    type: 'edit-list',
    message: metadataPatch,
  });
};

export default putEditList;
