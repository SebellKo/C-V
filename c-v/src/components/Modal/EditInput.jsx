import styled from 'styled-components';

const StyledEditInput = styled.input`
  width: 125px;
  height: 13px;
  border: 0.3px solid #414141;
  border-radius: 3px;
  padding: 2px 0 2px 5px;
  font-size: 10px;
`;

const EditInput = ({ value }) => {
  const handleChangeInput = (event) => {};

  return (
    <StyledEditInput
      onChange={handleChangeInput}
      type="text"
      value={value}
    ></StyledEditInput>
  );
};

export default EditInput;
