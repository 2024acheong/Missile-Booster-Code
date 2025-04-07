import React from "react";
import Plot from "react-plotly.js";

// Constants
const g0 = 9.81; // Gravity (m/s²)
const Isp = { stage1: 250, stage2: 300, stage3: 350, booster: 200 };
const massRatios = Array.from({ length: 21 }, (_, i) => 0.8 + i * 0.01); // 0.8 to 1.0

// Function to compute ΔV
const deltaV = (Isp, massRatio) => Isp * g0 * Math.log(massRatio);

// Compute heatmap data (Stage 1 vs. Stage 2)
const zData = massRatios.map((m1) =>
  massRatios.map((m2) =>
    deltaV(Isp.stage1, m1) + deltaV(Isp.stage2, m2) + deltaV(Isp.stage3, 0.9)
  )
);

const HeatmapChart = () => {
  return (
    <Plot
      data={[
        {
          z: zData,
          x: massRatios,
          y: massRatios,
          type: "heatmap",
          colorscale: "Viridis",
        },
      ]}
      layout={{
        title: "ΔV Heatmap (Stage 1 vs. Stage 2 Mass Ratio)",
        xaxis: { title: "Stage 1 Mass Ratio" },
        yaxis: { title: "Stage 2 Mass Ratio" },
      }}
    />
  );
};

export default HeatmapChart;
