import React from 'react';
import styled from "styled-components"

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`

const Button = styled.button`
  background: blue;
  color: white;
  padding: 10px;
  cursor: pointer;

  :hover, :active {
    background: white;
    color: black;
  }
  :focus {
    outline: none;
  }
`

function App() {
  return (
    <Wrapper>
      <h1>Hello World!</h1>
      <Button>CLICK!</Button>
      <div className="flex-box">
        <div/>
        <div/>
        <div/>
      </div>
    </Wrapper> 
  );
}

export default App;
