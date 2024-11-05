import styled from 'styled-components';

const ModalCard = ({ children }) => {
  return <ModalCardContainer>{children}</ModalCardContainer>;
};

const ModalCardContainer = styled.div`
  width: 230px;
  padding: 25px 0 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border: 1px solid #414141;
  border-radius: 5px;
  background-color: #fff;
`;

export default ModalCard;
