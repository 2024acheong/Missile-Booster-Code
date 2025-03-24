import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const missileDiameter = 1;
  const propulsionStackLength = 10;
  var isp = 1;
  const payload = 250;
  const g = 9.81;

  var propellantMass = 1;
  var structureMass = 1;
  const finalMass = payload;
  const initialMass = payload + propellantMass + structureMass;
  const exitVelocity = isp * g;
  const deltaV = (iMass, fMass) => {
    return exitVelocity * Math.log(iMass / fMass);
  }
  
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
