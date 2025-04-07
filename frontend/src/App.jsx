import React from "react";
import Plot from "react-plotly.js";
import SurfacePlot from "./SurfacePlot";

// Constants (you can move these to a separate constants file if desired)
const g0 = 9.81;
const Isp = { stage1: 250, stage2: 300, stage3: 350, booster: 200 };
const massRatios = Array.from({ length: 21 }, (_, i) => 0.8 + i * 0.01);

// Function to compute ΔV
const deltaV = (Isp, massRatio) => Isp * g0 * Math.log(massRatio);

// Compute data for heatmap
const heatmapData = massRatios.map((m1) =>
  massRatios.map((m2) =>
    deltaV(Isp.stage1, m1) + deltaV(Isp.stage2, m2) + deltaV(Isp.stage3, 0.9)
  )
);

function App() {
  return (
    <div className="App">
      <h1>Rocket ΔV Analysis</h1>
      
      {/* Heatmap */}
      <div style={{ margin: "20px" }}>
        <Plot
          data={[
            {
              z: heatmapData,
              x: massRatios,
              y: massRatios,
              type: "heatmap",
              colorscale: "Viridis",
            },
          ]}
          layout={{
            title: "ΔV Heatmap",
            xaxis: { title: "Stage 1 Mass Ratio" },
            yaxis: { title: "Stage 2 Mass Ratio" },
            width: 600,
            height: 500,
          }}
        />
      </div>

      {/* Surface Plot */}
      <div style={{ margin: "20px" }}>
        <SurfacePlot />
      </div>
    </div>
  );
}

export default App;