import { styled } from 'styled-components';
import { createPortal } from 'react-dom';

function Modal({ children, onClose }) {
  const closeModal = (event) => {
    if (event.target === event.currentTarget) onClose();
  };
  return createPortal(
    <ModalContainer onClick={(event) => closeModal(event)}>
      {children}
    </ModalContainer>,
    document.getElementById('root'),
  );
}

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 380px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Modal;
