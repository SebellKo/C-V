import styled from 'styled-components';

const ListWrapper = styled.ul`
  position: absolute;
  top: 33px;
  list-style: none;
  background-color: #45454d;
  border-radius: 5px;
  overflow-x: hidden;

  > li {
    padding: 3px 8px 4px 8px;
    border-bottom: 1px solid #ededed;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }
`;

const List = () => {
  return (
    <ListWrapper>
      <li>apple</li>
      <li>pear</li>
      <li>peach</li>
      <li>pine apple pen</li>
    </ListWrapper>
  );
};

export default List;
