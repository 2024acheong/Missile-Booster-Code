import React from "react";
import Plot from "react-plotly.js";
import SurfacePlot from "./SurfacePlot";

// Constants (you can move these to a separate constants file if desired)
const g0 = 9.81;
const Isp = { stage1: 250, stage2: 300, stage3: 350, booster: 200 };
const massRatios = Array.from({ length: 21 }, (_, i) => 0.8 + i * 0.01);

// Function to compute ΔV
const deltaV = (Isp, massRatio) => Isp * g0 * Math.log(1/massRatio);

// Compute data for heatmap
const heatmapData = massRatios.map((m1) =>
  massRatios.map((m2) =>
    deltaV(Isp.stage1, m1) + deltaV(Isp.stage2, m2) + deltaV(Isp.stage3, 0.9)
  )
);

// ... existing code ...

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
              x: massRatios.map(ratio => `${ratio.toFixed(2)}`),
              y: massRatios.map(ratio => `${ratio.toFixed(2)}`),
              type: "heatmap",
              colorscale: "Viridis",
              colorbar: {
                title: {
                  text: 'Total ΔV (m/s)',
                  side: 'right'
                },
                len: 0.9
              },
            },
          ]}
          layout={{
            title: {
              text: 'Rocket ΔV Heatmap Analysis',
              font: { size: 24 }
            },
            margin: {
              l: 100,  // left margin
              r: 100,  // right margin
              t: 100,  // top margin
              b: 100   // bottom margin
            },
            xaxis: {
              title: {
                text: 'Stage One Mass Ratio (m₁/m₀)',
                font: { size: 14 },
                standoff: 20  // Distance between title and axis
              },
              tickmode: 'array',
              ticktext: massRatios.filter((_, i) => i % 4 === 0).map(ratio => ratio.toFixed(2)),
              tickvals: massRatios.filter((_, i) => i % 4 === 0),
              tickangle: 0
            },
            yaxis: {
              title: {
                text: 'Stage Two Mass Ratio (m₁/m₀)',
                font: { size: 14 },
                standoff: 20  // Distance between title and axis
              },
              tickmode: 'array',
              ticktext: massRatios.filter((_, i) => i % 4 === 0).map(ratio => ratio.toFixed(2)),
              tickvals: massRatios.filter((_, i) => i % 4 === 0)
            },
            annotations: [{
              text: 'Color intensity represents total ΔV (higher values = brighter)',
              showarrow: false,
              x: 0.5,
              y: -0.2,
              xref: 'paper',
              yref: 'paper',
              font: { size: 12 }
            }],
            width: 700,    // Increased width
            height: 600,   // Increased height
            autosize: false
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