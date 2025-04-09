import React from "react";
import Plot from "react-plotly.js";

// Constants
const g0 = 9.81;
const Isp = { stage1: 250, stage2: 300, stage3: 350, booster: 200 };
const massRatios = Array.from({ length: 21 }, (_, i) => 0.8 + i * 0.01);

// Function to compute ΔV
const deltaV = (Isp, massRatio) => Isp * g0 * Math.log(massRatio);

// Compute 3D surface data (Stage 1 vs. Stage 2, fixing Stage 3 at 0.9)
const Z_no_booster = massRatios.map((m1) =>
  massRatios.map((m2) =>
    deltaV(Isp.stage1, m1) + deltaV(Isp.stage2, m2) + deltaV(Isp.stage3, 0.9)
  )
);

const boosterEffect = deltaV(Isp.booster, 0.9);
const Z_with_booster = Z_no_booster.map((row) => row.map((value) => value + boosterEffect));

// ... existing code ...

const SurfacePlot = () => {
    return (
      <Plot
        data={[
          {
            z: Z_no_booster,
            x: massRatios,
            y: massRatios,
            type: "surface",
            colorscale: "Viridis",
            name: "Without Booster",
            colorbar: {
              title: {
                text: 'ΔV (m/s)',
                side: 'right'
              }
            },
          },
          {
            z: Z_with_booster,
            x: massRatios,
            y: massRatios,
            type: "surface",
            colorscale: "Hot",
            opacity: 0.7,
            name: "With Booster",
            colorbar: {
              title: {
                text: 'ΔV (m/s)',
                side: 'right'
              }
            },
          },
        ]}
        layout={{
          title: {
            text: 'Rocket ΔV 3D Surface Analysis',
            font: { size: 24 }
          },
          scene: {
            xaxis: {
              title: {
                text: 'Stage 1 Mass Ratio',
                font: { size: 14 }
              }
            },
            yaxis: {
              title: {
                text: 'Stage 2 Mass Ratio',
                font: { size: 14 }
              }
            },
            zaxis: {
              title: {
                text: 'Total ΔV (m/s)',
                font: { size: 14 }
              }
            },
          },
          annotations: [{
            text: 'Compare ΔV with and without booster stage',
            showarrow: false,
            x: 0.5,
            y: -0.15,
            xref: 'paper',
            yref: 'paper',
            font: { size: 12 }
          }],
        }}
      />
    );
  };

export default SurfacePlot;
