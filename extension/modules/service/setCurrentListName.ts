import getCurrentListStore from '../getCurrentListStore';
import getList from './getList';

const setCurrentListName = async (index) => {
  try {
    const listArr = await getList();
    const currentListStore = await getCurrentListStore('readwrite');

    const currentListName = listArr[index].name;
    const newCurrentListName = { name: currentListName };

    await currentListStore.put(newCurrentListName, 1);
  } catch (error) {
    console.log(error);
  }
};

export default setCurrentListName;
