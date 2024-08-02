import styled from "styled-components";

const Title = styled.p`
  margin-left: 10px;
  color: grey;
`;

function LevelNode({ id, isConnectable }) {
  return (
    <>
      <Title>{id}</Title>
    </>
  );
}

export default LevelNode