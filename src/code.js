const g = 9.81; // gravity (m/s^2)
const Isp = 250; // Specific Impulse (s)
const d = 1; // diameter (m)
const h = 10; // height (m)
const p = 250; // payload mass (kg)

// Inputs
const omr1 = parseFloat(prompt("First Stage Mass Ratio (Between 0.8 and 1): "));
const omr2 = parseFloat(prompt("Second Stage Mass Ratio (Between 0.8 and 1): "));
const omr3 = parseFloat(prompt("Third Stage Mass Ratio (Between 0.8 and 1): "));

const burntime = parseFloat(prompt("First Stage Burn Time of the Pop-Out Booster (seconds): "));
const pmr1 = Math.exp(-burntime / (2 * Isp));
const pmr2 = parseFloat(prompt("Pop-Out Booster Second Stage Mass Ratio (Between 0.8 and 1): "));
const pmr3 = parseFloat(prompt("Pop-Out Booster Third Stage Mass Ratio (Between 0.8 and 1): "));

// Equations
const Ve = Isp * g;

function vgain(massratio) {
    const vg = Ve * Math.log(1 / massratio);
    return Math.round(vg * 1000) / 1000;
}

function rng(velocity) {
    const r = (velocity ** 2) / g;
    return Math.round(r * 1000) / 1000;
}

const oV = vgain(omr1) + vgain(omr2) + vgain(omr3); // optimized rocket delta V
const pV = g * burntime / 2 + vgain(pmr2) + vgain(pmr3); // pop-out booster rocket delta V

const oR = rng(oV); // optimized range
const pR = rng(pV); // pop-out range

const pEV = 100 * Math.round((pV / oV) * 100000) / 100000;
const pER = 100 * Math.round((pR / oR) * 100000) / 100000;

// Results
console.log("Optimized Delta V = " + oV + " m/s");
console.log("Pop-Out Booster Delta V = " + pV + " m/s");
console.log("Optimized Range = " + oR + " m");
console.log("Pop-Out Booster Range = " + pR + " m");

// Efficiency statements
console.log("The pop-out booster is " + pEV + "% efficient in velocity and " + pER + "% efficient in range.");

// Datasets
const o_massratios = [omr1, omr2, omr3];
const p_massratios = [pmr1, pmr2, pmr3];

// DeltaV
const o_deltavs = [vgain(omr1), vgain(omr1) + vgain(omr2), vgain(omr1) + vgain(omr2) + vgain(omr3)];
const p_deltavs = [vgain(pmr1), vgain(pmr1) + vgain(pmr2), vgain(pmr1) + vgain(pmr2) + vgain(pmr3)];

// Range
const o_ranges = [rng(vgain(omr1)), rng(vgain(omr1) + vgain(omr2)), rng(vgain(omr1) + vgain(omr2) + vgain(omr3))];
const p_ranges = [rng(vgain(pmr1)), rng(vgain(pmr1) + vgain(pmr2)), rng(vgain(pmr1) + vgain(pmr2) + vgain(pmr3))];

// Generate graph
function graphv() {
    const ctx = document.getElementById('velocityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: o_massratios,
            datasets: [{
                label: 'Optimized Booster',
                data: o_deltavs,
                borderColor: 'blue',
                fill: false
            }, {
                label: 'Pop-Out Booster',
                data: p_deltavs,
                borderColor: 'red',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Stage Mass Ratio'
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
}

function graphr() {
    const ctx = document.getElementById('rangeChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: o_massratios,
            datasets: [{
                label: 'Optimized Booster',
                data: o_ranges,
                borderColor: 'blue',
                fill: false
            }, {
                label: 'Pop-Out Booster',
                data: p_ranges,
                borderColor: 'red',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Stage Mass Ratio'
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
}

graphv();
graphr();

// Generate visual
const canvas = document.getElementById('rocketCanvas');
const ctx = canvas.getContext('2d');

function drawRectangle(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawTriangle(ctx, x, y, length, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length / 2, y - Math.sqrt(3) * length / 2);
    ctx.lineTo(x - length / 2, y - Math.sqrt(3) * length / 2);
    ctx.closePath();
    ctx.fill();
}

// Rocket dimensions and colors
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

const optimized_dims = [
    { width: 100, height: oh1, color: 'red' },
    { width: 100, height: oh2, color: 'green' },
    { width: 100, height: oh3, color: 'blue' }
];
const popout_dims = [
    { width: 100, height: ph1, color: 'red' },
    { width: 100, height: ph2, color: 'green' },
    { width: 100, height: ph3, color: 'blue' }
];
const payload_dims = [
    { length: 100, color: 'yellow' }
];

// Rocket drawings
function drawRocket(category, rect_dims, trig_dims, startx, starty) {
    let n = 0;
    rect_dims.forEach(rect => {
        if (n === 0) {
            ctx.font = '12px Arial';
            ctx.fillText("Diameter = " + (rect.width / 100) + " m", startx, starty - 50);
            ctx.fillText(category, startx, starty + 950);
            n++;
        }
        drawRectangle(ctx, startx, starty, rect.width, rect.height, rect.color);
        ctx.fillText("Stack length = " + (Math.round(rect.height * 10 / 800 * 1000) / 1000) + " m", startx + rect.width + 25, starty + rect.height / 2);
        starty += rect.height;
    });
    trig_dims.forEach(trig => {
        drawTriangle(ctx, startx, starty, trig.length, trig.color);
        ctx.fillText("Payload = 250 kg", startx + trig.length + 25, starty + Math.sqrt(3) * trig.length / 2);
    });
}

// Initial position
const O_start_x = 50;
const O_start_y = 50;
const P_start_x = 400;
const P_start_y = 50;

drawRocket("Pop-Out Booster", popout_dims, payload_dims, P_start_x, P_start_y);
drawRocket("Optimized Rocket", optimized_dims, payload_dims, O_start_x, O_start_y);