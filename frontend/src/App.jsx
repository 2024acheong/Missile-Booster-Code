import React, { useEffect, useRef, useState } from 'react';
import { Paper, Box, Container, Typography, TextField } from '@mui/material';
import Chart from 'chart.js/auto';
import './App.css';

function App() {
  const [parameters, setParameters] = useState({
    omr1: 0.9,
    omr2: 0.9,
    omr3: 0.9,
    burntime: 10,
    pmr2: 0.9,
    pmr3: 0.9
  });

  const velocityChartRef = useRef(null);
  const rangeChartRef = useRef(null);
  const rocketCanvasRef = useRef(null);

  const g = 9.81;
  const Isp = 250;
  const d = 1;
  const h = 10;
  const p = 250;
  const Ve = Isp * g;

  const vgain = (massratio) => {
    const vg = Ve * Math.log(1 / massratio);
    return Math.round(vg * 1000) / 1000;
  };

  const rng = (velocity) => {
    const r = (velocity ** 2) / g;
    return Math.round(r * 1000) / 1000;
  };

  const drawRectangle = (ctx, x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  const drawTriangle = (ctx, x, y, length, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length / 2, y + Math.sqrt(3) * length / 2);
    ctx.lineTo(x - length / 2, y + Math.sqrt(3) * length / 2);
    ctx.closePath();
    ctx.fill();
  };

  const drawRocket = (ctx, category, rect_dims, trig_dims, startx, starty) => {
    let n = 0;
    let currentY = starty;
    
    // Draw the triangle first at the starting position
    trig_dims.forEach(trig => {
      drawTriangle(ctx, startx + 50, currentY, trig.length, trig.color);
      ctx.fillText("Payload = 250 kg", startx + trig.length + 25, currentY + Math.sqrt(3) * trig.length / 4);
    });

    // Adjust starting position for rectangles to be below triangle
    currentY += Math.sqrt(3) * trig_dims[0].length / 2;
    
    // Then draw the rectangles
    rect_dims.forEach(rect => {
      if (n === 0) {
        ctx.font = '12px Arial';
        ctx.fillText("Diameter = " + (rect.width / 100) + " m", startx, starty - 50);
        ctx.fillText(category, startx, starty + 950);
        n++;
      }
      drawRectangle(ctx, startx, currentY, rect.width, rect.height, rect.color);
      ctx.fillText("Stack length = " + (Math.round(rect.height * 10 / 800 * 1000) / 1000) + " m", startx + rect.width + 25, currentY + rect.height / 2);
      currentY += rect.height;
    });
  };

  useEffect(() => {
    const { omr1, omr2, omr3, burntime, pmr2, pmr3 } = parameters;
    const pmr1 = Math.exp(-burntime / (2 * Isp));

    // Calculate rocket dimensions
    const om3 = p / omr3 - p;
    const om2 = p / omr3 / omr2 - (p + om3);
    const om1 = p / omr3 / omr2 / omr1 - (p + om3 + om2);
    const omp = om1 + om2 + om3;

    const pm3 = p / pmr3 - p;
    const pm2 = p / pmr3 / pmr2 - (p + pm3);
    const pm1 = p / pmr3 / pmr2 / pmr1 - (p + pm3 + pm2);
    const pmp = pm1 + pm2 + pm3;

    // Booster stack heights
    const oh1 = (om1 / omp) * 800;
    const oh2 = (om2 / omp) * 800;
    const oh3 = (om3 / omp) * 800;

    const ph1 = (pm1 / pmp) * 800;
    const ph2 = (pm2 / pmp) * 800;
    const ph3 = (pm3 / pmp) * 800;

    // Create velocity chart
    const velocityCtx = velocityChartRef.current.getContext('2d');
    const velocityChart = new Chart(velocityCtx, {
      type: 'line',
      data: {
        labels: ['Stage 1', 'Stage 2', 'Stage 3'],
        datasets: [{
          label: 'Optimized Booster',
          data: [
            vgain(omr1),
            vgain(omr1) + vgain(omr2),
            vgain(omr1) + vgain(omr2) + vgain(omr3)
          ],
          borderColor: 'blue',
          fill: false
        }, {
          label: 'Pop-Out Booster',
          data: [
            vgain(pmr1),
            vgain(pmr1) + vgain(pmr2),
            vgain(pmr1) + vgain(pmr2) + vgain(pmr3)
          ],
          borderColor: 'red',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Stage'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Change in Velocity (m/s)'
            }
          }
        }
      }
    });

    // Create range chart
    const rangeCtx = rangeChartRef.current.getContext('2d');
    const rangeChart = new Chart(rangeCtx, {
      type: 'line',
      data: {
        labels: ['Stage 1', 'Stage 2', 'Stage 3'],
        datasets: [{
          label: 'Optimized Booster',
          data: [
            rng(vgain(omr1)),
            rng(vgain(omr1) + vgain(omr2)),
            rng(vgain(omr1) + vgain(omr2) + vgain(omr3))
          ],
          borderColor: 'blue',
          fill: false
        }, {
          label: 'Pop-Out Booster',
          data: [
            rng(vgain(pmr1)),
            rng(vgain(pmr1) + vgain(pmr2)),
            rng(vgain(pmr1) + vgain(pmr2) + vgain(pmr3))
          ],
          borderColor: 'red',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Stage'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Range (m)'
            }
          }
        }
      }
    });

    // Draw rockets
    const ctx = rocketCanvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 800, 1000);
    
    const optimized_dims = [
      { width: 100, height: oh3, color: 'blue' },
      { width: 100, height: oh2, color: 'green' },
      { width: 100, height: oh1, color: 'red' }
    ];
    const popout_dims = [
      { width: 100, height: ph3, color: 'blue' },
      { width: 100, height: ph2, color: 'green' },
      { width: 100, height: ph1, color: 'red' }
    ];
    const payload_dims = [
      { length: 100, color: 'yellow' }
    ];

    const O_start_x = 50;
    const O_start_y = 50;
    const P_start_x = 400;
    const P_start_y = 50;

    drawRocket(ctx, "Pop-Out Booster", popout_dims, payload_dims, P_start_x, P_start_y);
    drawRocket(ctx, "Optimized Rocket", optimized_dims, payload_dims, O_start_x, O_start_y);

    return () => {
      velocityChart.destroy();
      rangeChart.destroy();
    };
  }, [parameters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameters(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Missile Booster Calculator
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, flex: '1 1 300px' }}>
          <Typography variant="h6" gutterBottom>
            Input Parameters
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Stage Mass Ratio"
              type="number"
              name="omr1"
              value={parameters.omr1}
              onChange={handleChange}
              inputProps={{ 
                step: 0.01,
                min: 0.8,
                max: 1.0
              }}
            />
            <TextField
              label="Second Stage Mass Ratio"
              type="number"
              name="omr2"
              value={parameters.omr2}
              onChange={handleChange}
              inputProps={{ 
                step: 0.01,
                min: 0.8,
                max: 1.0
              }}
            />
            <TextField
              label="Third Stage Mass Ratio"
              type="number"
              name="omr3"
              value={parameters.omr3}
              onChange={handleChange}
              inputProps={{ 
                step: 0.01,
                min: 0.8,
                max: 1.0
              }}
            />
            <TextField
              label="Burn Time (seconds)"
              type="number"
              name="burntime"
              value={parameters.burntime}
              onChange={handleChange}
              inputProps={{ 
                step: 1,
                min: 1
              }}
            />
            <TextField
              label="Pop-Out Second Stage Mass Ratio"
              type="number"
              name="pmr2"
              value={parameters.pmr2}
              onChange={handleChange}
              inputProps={{ 
                step: 0.01,
                min: 0.8,
                max: 1.0
              }}
            />
            <TextField
              label="Pop-Out Third Stage Mass Ratio"
              type="number"
              name="pmr3"
              value={parameters.pmr3}
              onChange={handleChange}
              inputProps={{ 
                step: 0.01,
                min: 0.8,
                max: 1.0
              }}
            />
          </Box>
        </Paper>
        <Paper sx={{ p: 2, flex: '2 1 600px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <canvas ref={velocityChartRef} />
            <canvas ref={rangeChartRef} />
            <canvas ref={rocketCanvasRef} width="800" height="1000" />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;