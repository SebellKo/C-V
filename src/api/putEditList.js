import sendRuntimeMessage from './sendRuntimeMessage';

const putEditList = async (updatedList) => {
  return sendRuntimeMessage({
    type: 'edit-list',
    message: { newList: updatedList },
  });
};

export default putEditList;
