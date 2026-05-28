import {
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
} from 'react';
import styled from 'styled-components';

interface EditInputProps {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const EditInput = ({ value = '', onChange }: EditInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event);
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

const StyledEditInput = styled.input`
  width: 125px;
  height: 18px;
  border: 0.3px solid #414141;
  border-radius: 3px;
  padding: 2px 0 2px 5px;
  font-size: 12px;
`;

export default EditInput;
