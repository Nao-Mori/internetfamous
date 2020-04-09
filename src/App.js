import React from 'react';
import styled from "styled-components"

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`

function App() {
  return (
    <Wrapper>
      <h1>Hello World!</h1>
    </Wrapper> 
  );
}

export default App;
