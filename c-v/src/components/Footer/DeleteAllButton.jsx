import { styled } from 'styled-components';

const StyledDeleteAllButton = styled.button`
  background: none;
  color: #dd959a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: #d5525b;
  }
`;

const DeleteAllButton = () => {
  return <StyledDeleteAllButton>Delete All</StyledDeleteAllButton>;
};

export default DeleteAllButton;
