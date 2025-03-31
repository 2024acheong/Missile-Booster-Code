import { useState, useEffect } from 'react'
import './App.css'

// Constants
const DIAMETER = 1.0  // meters
const TOTAL_LENGTH = 10.0  // meters
const PAYLOAD_MASS = 250.0  // kg
const ISP = 250.0  // seconds (typical for solid rocket motors)
const G0 = 9.81  // m/s²
const FIRST_STAGE_BURN_TIME = 10.0  // seconds

function App() {
  const [optimizationResults, setOptimizationResults] = useState(null)
  const [massRatio, setMassRatio] = useState(0.9) // Default mass ratio

  const calculateStageMassFraction = (stageNumber) => {
    // Higher stages have better mass fractions
    const baseFraction = 0.85
    const improvement = 0.02 * (stageNumber - 1)
    return Math.min(0.95, baseFraction + improvement)
  }

  const calculateDeltaV = (massRatios, propellantMasses) => {
    let totalDv = 0
    let currentMass = PAYLOAD_MASS
    
    for (let i = 0; i < massRatios.length; i++) {
      const stageMass = propellantMasses[i] / massRatios[i]
      const initialMass = currentMass + stageMass
      const finalMass = currentMass + (stageMass * (1 - massRatios[i]))
      const stageDv = ISP * G0 * Math.log(initialMass / finalMass)
      totalDv += stageDv
      currentMass = finalMass
    }
    
    return totalDv
  }

  const optimizePropulsionStack = () => {
    const nStages = 3
    const massRatios = Array(nStages).fill(massRatio)
    const propellantMasses = Array(nStages).fill(1000) // Initial guess of 1000kg per stage

    // Calculate total mass
    let totalMass = PAYLOAD_MASS
    for (let i = 0; i < nStages; i++) {
      const stageMass = propellantMasses[i] / massRatios[i]
      totalMass += stageMass
    }

    // Calculate total length
    let totalLength = 0
    for (let i = 0; i < nStages; i++) {
      // Assuming cylindrical stages
      const stageLength = propellantMasses[i] / (Math.PI * Math.pow(DIAMETER/2, 2) * 1800) // 1800 kg/m³ propellant density
      totalLength += stageLength
    }

    // Check constraints
    if (totalLength > TOTAL_LENGTH || totalMass > 5000) {
      return null
    }

    // Calculate delta-v
    const dv = calculateDeltaV(massRatios, propellantMasses)

    return {
      massRatios,
      propellantMasses,
      totalDv: dv,
      totalMass,
      totalLength
    }
  }

  useEffect(() => {
    const results = optimizePropulsionStack()
    setOptimizationResults(results)
  }, [massRatio])

  const handleMassRatioChange = (event) => {
    setMassRatio(parseFloat(event.target.value))
  }

  return (
    <div className="container">
      <h1>Propulsion Stack Optimizer</h1>
      
      <div className="controls">
        <label>
          Mass Ratio (0.8 - 1.0):
          <input
            type="range"
            min="0.8"
            max="1.0"
            step="0.01"
            value={massRatio}
            onChange={handleMassRatioChange}
          />
          {massRatio.toFixed(3)}
        </label>
      </div>

      {optimizationResults && (
        <div className="results">
          <h2>Optimization Results</h2>
          
          {[0, 1, 2].map((stageIndex) => (
            <div key={stageIndex} className="stage">
              <h3>Stage {stageIndex + 1}</h3>
              <p>Mass Ratio: {optimizationResults.massRatios[stageIndex].toFixed(3)}</p>
              <p>Propellant Mass: {optimizationResults.propellantMasses[stageIndex].toFixed(1)} kg</p>
              <p>Stage Mass: {(optimizationResults.propellantMasses[stageIndex] / optimizationResults.massRatios[stageIndex]).toFixed(1)} kg</p>
            </div>
          ))}

          <div className="summary">
            <h3>Summary</h3>
            <p>Total Delta-V: {optimizationResults.totalDv.toFixed(1)} m/s</p>
            <p>Total Mass: {optimizationResults.totalMass.toFixed(1)} kg</p>
            <p>Total Length: {optimizationResults.totalLength.toFixed(2)} m</p>
            
            {/* Calculate first stage thrust */}
            <p>First Stage Thrust: {(optimizationResults.propellantMasses[0] * ISP * G0 / FIRST_STAGE_BURN_TIME / 1000).toFixed(1)} kN</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
