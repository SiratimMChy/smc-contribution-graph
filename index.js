require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();

async function getContributionData() {
  const TOKEN = process.env.GITHUB_TOKEN;
  const USERNAME = process.env.USERNAME || "SiratimMChy";

  const headers = {
    Authorization: `token ${TOKEN}`,
    "User-Agent": "smc-commit-graph"
  };

  const query = {
    query: `
    {
      user(login: "${USERNAME}") {
        name
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }`
  };

  const res = await axios.post(
    "https://api.github.com/graphql",
    query,
    { headers }
  );

  if (res.data.errors) {
    throw new Error("GraphQL Error");
  }

  const name = res.data.data.user.name || USERNAME;
  const weeks = res.data.data.user.contributionsCollection.contributionCalendar.weeks;
  return { name, weeks };
}

function getLast31Days(weeks) {
  const days = [];
  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      days.push(day);
    });
  });
  return days.slice(-31);
}

function getSmoothPath(points, startY) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x},${points[0].y} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 === points.length ? i + 1 : i + 2];

    let cp1x = p1.x + (p2.x - p0.x) / 6;
    let cp1y = p1.y + (p2.y - p0.y) / 6;

    let cp2x = p2.x - (p3.x - p1.x) / 6;
    let cp2y = p2.y - (p3.y - p1.y) / 6;

    // Prevent overshoot below 0
    if (cp1y > startY) cp1y = startY;
    if (cp2y > startY) cp2y = startY;

    d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
  }
  return d;
}

function createGraph(days, fullName) {
  const actualMax = Math.max(...days.map(d => d.contributionCount)) || 1;
  const maxLabel = Math.max(Math.ceil(actualMax / 2) * 2, 10);

  const startX = 100;
  const startY = 340;
  const chartWidth = 840;
  const chartHeight = 220;
  const spacing = chartWidth / (days.length - 1);

  let gridAndAxes = "";
  
  // Y-axis ticks and horizontal grid lines
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const val = Math.round((maxLabel / steps) * i);
    const y = startY - (val / maxLabel) * chartHeight;
    gridAndAxes += `<text x="${startX - 15}" y="${y + 4}" font-size="12" fill="#9CA3AF" font-weight="600" text-anchor="end">${val}</text>\n`;
    gridAndAxes += `<line x1="${startX}" y1="${y}" x2="${startX + chartWidth}" y2="${y}" stroke="#1F2937" stroke-width="1" stroke-dasharray="4,4" />\n`;
  }

  // X-axis ticks and vertical grid lines
  days.forEach((day, i) => {
    const x = startX + i * spacing;
    const date = new Date(day.date);
    const formatted = date.getDate();
    
    // Vertical grid line
    gridAndAxes += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY - chartHeight}" stroke="#1F2937" stroke-width="1" stroke-dasharray="4,4" />\n`;
    
    // X-axis text
    gridAndAxes += `<text x="${x}" y="${startY + 25}" font-size="12" fill="#9CA3AF" font-weight="600" text-anchor="middle">${formatted}</text>\n`;
  });

  const points = days.map((day, i) => ({
    x: startX + i * spacing,
    y: startY - (day.contributionCount / maxLabel) * chartHeight
  }));

  const smoothPath = getSmoothPath(points, startY);

  const areaPath = `${smoothPath} L ${startX + chartWidth},${startY} L ${startX},${startY} Z`;
  
  let area = `<path d="${areaPath}" fill="url(#areaGradient)" class="area" />\n`;
  let line = `<path d="${smoothPath}" fill="none" stroke="url(#lineGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="line" />\n`;

  let dots = "";
  points.forEach((p, i) => {
    const delay = (i * 0.03).toFixed(2);
    dots += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#0A0F1C" stroke="url(#lineGradient)" stroke-width="2.5" class="dot" style="animation-delay: ${delay}s">\n`;
    dots += `  <title>${days[i].contributionCount} commits on ${days[i].date}</title>\n`;
    dots += `</circle>\n`;
  });

  return { gridAndAxes, area, line, dots };
}

app.get("/commits", async (req, res) => {
  try {
    const data = await getContributionData();
    const days = getLast31Days(data.weeks);
    const chart = createGraph(days, data.name);

    const svgWidth = 1000;
    const svgHeight = 400;

    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${svgWidth} ${svgHeight}' width='${svgWidth}px' height='${svgHeight}px'>
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0A0F1C" />
          <stop offset="100%" stop-color="#12182B" />
        </linearGradient>
        
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00FFA3" />
          <stop offset="100%" stop-color="#00B8FF" />
        </linearGradient>

        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#00B8FF" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <style>
        text { font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .chart-title { font-weight: 600; font-size: 20px; fill: url(#lineGradient); }
        .axis-title { font-weight: 600; font-size: 14px; fill: url(#lineGradient); }
        
        @keyframes drawLine {
          from { stroke-dasharray: 2000; stroke-dashoffset: 2000; }
          to { stroke-dasharray: 2000; stroke-dashoffset: 0; }
        }
        @keyframes fadeArea {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popDot {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }

        .line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawLine 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .area {
          opacity: 0;
          animation: fadeArea 1.5s ease-out forwards;
        }
        .dot {
          opacity: 0;
          transform-origin: center;
          transform-box: fill-box;
          animation: popDot 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      </style>

      <!-- Main Card Background -->
      <rect fill="url(#bgGradient)" width="${svgWidth}" height="${svgHeight}" rx="10" />
      <rect fill="none" stroke="#1F2937" stroke-width="1.5" width="${svgWidth}" height="${svgHeight}" rx="10" />

      <!-- Chart Title -->
      <text x="500" y="45" class="chart-title" text-anchor="middle">${data.name}'s Contribution Graph</text>

      <!-- Y Axis Title (Rotated) -->
      <text x="-230" y="45" class="axis-title" transform="rotate(-90)" text-anchor="middle">Contributions</text>

      <!-- X Axis Title -->
      <text x="500" y="385" class="axis-title" text-anchor="middle">Days</text>

      <!-- Chart Elements -->
      ${chart.gridAndAxes}
      ${chart.area}
      ${chart.line}
      ${chart.dots}
    </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate");
    res.send(svg);

  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).send("Error generating graph");
  }
});

app.get("/", (req, res) => {
  res.send("Commit Graph API Running 🚀");
});

module.exports = app;