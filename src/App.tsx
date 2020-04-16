import React, { useState } from 'react';
import styled from "styled-components"

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

  :hover, :active {
    background: white;
    color: black;
  }
  :focus {
    outline: none;
  }
`

function App() {
  const [toggled, setToggled] = useState(false)

  return (
    <Wrapper>
      <h1>Hello World!</h1>
      <Button onClick={()=>setToggled(!toggled)} >CLICK!</Button>
      <div className="flex-box" style={{ flexDirection: toggled? "row-reverse" : "row" }}>
        {boxes.map((color, key)=>(
          <div key={key} style={{ background: color }} />
        ))}
      </div>
    </Wrapper> 
  );
}

export default App;
