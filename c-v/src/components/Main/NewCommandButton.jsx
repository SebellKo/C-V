import styled from 'styled-components';

const StyledNewCommandButton = styled.button`
  background: none;
  color: #c6c6c6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: #6a6a6a;
  }
`;

const NewCommandButton = () => {
  return <StyledNewCommandButton>New Command</StyledNewCommandButton>;
};

export default NewCommandButton;
