import React, { useState } from 'react';
import styled from "styled-components"
import Game2 from './STS/Game2';

const boxes = [
  "red",
  "yellow",
  "blue",
  "green",
  "orange",
  "pink",
  "brown"
]

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  
  @media(max-width: 1280px) {
    max-width: 900px;
  }
`

const Button = styled.button`
  background: blue;
  color: white;
  padding: 10px;
  cursor: pointer;
  border: none;
  border-radius: 23px;
  text-decoration: none;

  :hover, :active {
    background: gray;
  }
  :focus {
    outline: none;
  }
`

function App() {
  const [toggled, setToggled] = useState(false)

  return (
    // <Wrapper>
    //   <h1>Hello World!</h1>
    //   <Button onClick={()=>setToggled(!toggled)} >CLICK!</Button>
    //   <div className="flex-box" style={{ flexDirection: toggled? "row-reverse" : "row" }}>
    //     {boxes.map((color, key)=>(
    //       <div key={key} style={{ background: color }} />
    //     ))}
    //   </div>
    // </Wrapper> 
    <Game2 />
  );
}

export default App;
