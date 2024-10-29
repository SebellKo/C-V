import { useState } from 'react';
import styled from 'styled-components';

const StyledEditInput = styled.input`
  width: 125px;
  height: 18px;
  border: 0.3px solid #414141;
  border-radius: 3px;
  padding: 2px 0 2px 5px;
  font-size: 12px;
`;

const EditInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChangeInput = (event) => {
    onChange(event);
    setInputValue(event.target.value);
  };
  return (
    <StyledEditInput
      type="text"
      value={inputValue}
      onChange={(event) => handleChangeInput(event)}
    ></StyledEditInput>
  );
};

export default EditInput;
