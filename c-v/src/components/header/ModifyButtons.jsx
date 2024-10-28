import styled from 'styled-components';

const ModifyButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  > button,
  span {
    font-size: 12px;
    font-weight: 600;
    color: #adadad;
  }
  > button {
    background: none;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      color: #414141;
    }
  }
`;

const ModifyButtons = () => {
  const handleAddClick = () => {};

  const handleEditClick = () => {};

  return (
    <ModifyButtonContainer>
      <button onClick={handleAddClick}>Add</button>
      <span> / </span>
      <button onClick={handleEditClick}>Edit</button>
    </ModifyButtonContainer>
  );
};

export default ModifyButtons;
