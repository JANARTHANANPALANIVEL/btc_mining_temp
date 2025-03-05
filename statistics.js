// DOM Elements and State Management
let statsData = {
  hashRate: [],
  earnings: [],
  shares: {
    accepted: 0,
    rejected: 0
  },
  power: [],
  temperature: []
};

let currentPeriod = '24h';
let chartInstances = {};

document.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
  setupEventListeners();
  startDataSimulation();
});

function setupEventListeners() {
  // Time period filter buttons
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const period = button.getAttribute('data-period');
      updateTimePeriod(period);
    });
  });
  
  // Export buttons
  document.querySelectorAll('.export-btn').forEach(button => {
    button.addEventListener('click', () => {
      const format = button.textContent.trim().toLowerCase();
      exportData(format);
    });
  });
  
  // Date range modal
  const dateRangeModal = document.getElementById('date-range-modal');
  
  document.querySelector('.filter-btn[data-period="custom"]').addEventListener('click', () => {
    dateRangeModal.style.display = 'flex';
  });
  
  document.querySelector('#date-range-modal .close-btn').addEventListener('click', () => {
    dateRangeModal.style.display = 'none';
  });
  
  document.getElementById('apply-date-range').addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (validateDateRange(startDate, endDate)) {
      updateTimePeriod('custom', { startDate, endDate });
      dateRangeModal.style.display = 'none';
    }
  });
}

function initializeCharts() {
  // Initialize Chart.js instances
  const ctx = document.createElement('canvas').getContext('2d');
  
  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ddd'
        }
      }
    }
  };
  
  // Hash Rate Chart
  chartInstances.hashRate = new Chart(ctx, {
    type: 'line',
    data: {
      labels: generateTimeLabels(24),
      datasets: [{
        label: 'Hash Rate (MH/s)',
        data: [],
        borderColor: '#00b4d8',
        backgroundColor: 'rgba(0, 180, 216, 0.1)',
        fill: true
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          beginAtZero: true
        }
      }
    }
  });
  
  // Earnings Chart
  chartInstances.earnings = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: generateTimeLabels(24),
      datasets: [{
        label: 'Daily Earnings (BTC)',
        data: [],
        backgroundColor: '#4caf50'
      }]
    },
    options: commonOptions
  });
  
  // Shares Chart
  chartInstances.shares = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Accepted', 'Rejected'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ddd'
          }
        }
      }
    }
  });
  
  // Power Efficiency Chart
  chartInstances.power = new Chart(ctx, {
    type: 'line',
    data: {
      labels: generateTimeLabels(24),
      datasets: [{
        label: 'Power (W)',
        data: [],
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true
      }]
    },
    options: commonOptions
  });
  
  // Temperature Chart
  chartInstances.temperature = new Chart(ctx, {
    type: 'line',
    data: {
      labels: generateTimeLabels(24),
      datasets: [{
        label: 'Temperature (°C)',
        data: [],
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        fill: true
      }]
    },
    options: {
      ...commonOptions,
      scales: {
        ...commonOptions.scales,
        y: {
          ...commonOptions.scales.y,
          min: 30,
          max: 100
        }
      }
    }
  });
}

function startDataSimulation() {
  // Simulate real-time data updates
  setInterval(() => {
    // Update hash rate
    const hashRate = 245.32 + (Math.random() - 0.5) * 10;
    statsData.hashRate.push(hashRate);
    if (statsData.hashRate.length > 24) statsData.hashRate.shift();
    
    // Update earnings
    const earnings = hashRate * 0.00000132;
    statsData.earnings.push(earnings);
    if (statsData.earnings.length > 24) statsData.earnings.shift();
    
    // Update shares
    if (Math.random() < 0.8) {
      statsData.shares.accepted++;
    } else {
      statsData.shares.rejected++;
    }
    
    // Update power consumption
    const power = 320 + (Math.random() - 0.5) * 20;
    statsData.power.push(power);
    if (statsData.power.length > 24) statsData.power.shift();
    
    // Update temperature
    const temp = 72 + (Math.random() - 0.5) * 5;
    statsData.temperature.push(temp);
    if (statsData.temperature.length > 24) statsData.temperature.shift();
    
    updateCharts();
    updateSummaryCards();
  }, 5000);
}

function updateCharts() {
  // Update Hash Rate Chart
  chartInstances.hashRate.data.datasets[0].data = statsData.hashRate;
  chartInstances.hashRate.update();
  
  // Update Earnings Chart
  chartInstances.earnings.data.datasets[0].data = statsData.earnings;
  chartInstances.earnings.update();
  
  // Update Shares Chart
  chartInstances.shares.data.datasets[0].data = [
    statsData.shares.accepted,
    statsData.shares.rejected
  ];
  chartInstances.shares.update();
  
  // Update Power Chart
  chartInstances.power.data.datasets[0].data = statsData.power;
  chartInstances.power.update();
  
  // Update Temperature Chart
  chartInstances.temperature.data.datasets[0].data = statsData.temperature;
  chartInstances.temperature.update();
}

function updateSummaryCards() {
  const avgHashRate = statsData.hashRate.reduce((a, b) => a + b, 0) / statsData.hashRate.length;
  const totalEarnings = statsData.earnings.reduce((a, b) => a + b, 0);
  const avgPower = statsData.power.reduce((a, b) => a + b, 0) / statsData.power.length;
  const powerCost = (avgPower * 24 / 1000) * 0.12; // Assuming $0.12 per kWh
  
  document.querySelector('.summary-card:nth-child(1) .summary-value').textContent = 
    `${avgHashRate.toFixed(2)} MH/s`;
  
  document.querySelector('.summary-card:nth-child(2) .summary-value').textContent = 
    `${totalEarnings.toFixed(8)} BTC`;
  document.querySelector('.summary-card:nth-child(2) .summary-change').textContent = 
    `$${(totalEarnings * 60000).toFixed(2)}`;
  
  document.querySelector('.summary-card:nth-child(3) .summary-value').textContent = 
    `${statsData.shares.accepted + statsData.shares.rejected}`;
  document.querySelector('.summary-card:nth-child(3) .summary-change').textContent = 
    `${((statsData.shares.accepted / (statsData.shares.accepted + statsData.shares.rejected)) * 100).toFixed(1)}% acceptance rate`;
  
  document.querySelector('.summary-card:nth-child(4) .summary-value').textContent = 
    `${(avgPower * 24 / 1000).toFixed(2)} kWh`;
  document.querySelector('.summary-card:nth-child(4) .summary-change').textContent = 
    `$${powerCost.toFixed(2)} cost`;
}

function updateTimePeriod(period, customRange = null) {
  currentPeriod = period;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-period') === period);
  });
  
  // Update chart data based on period
  const dataPoints = getPeriodDataPoints(period);
  updateChartsForPeriod(dataPoints, customRange);
}

function getPeriodDataPoints(period) {
  switch (period) {
    case '24h': return 24;
    case '7d': return 168;
    case '30d': return 720;
    case 'all': return 2160;
    default: return 24;
  }
}

function updateChartsForPeriod(dataPoints, customRange = null) {
  // Update chart labels
  const labels = generateTimeLabels(dataPoints, customRange);
  
  Object.values(chartInstances).forEach(chart => {
    chart.data.labels = labels;
    chart.update();
  });
  
  // Simulate different data for different periods
  simulateHistoricalData(dataPoints);
}

function generateTimeLabels(count, customRange = null) {
  const labels = [];
  const now = new Date();
  
  if (customRange) {
    const start = new Date(customRange.startDate);
    const end = new Date(customRange.endDate);
    const interval = (end - start) / (count - 1);
    
    for (let i = 0; i < count; i++) {
      const date = new Date(start.getTime() + interval * i);
      labels.push(formatDate(date));
    }
  } else {
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now - i * 3600000);
      labels.push(formatDate(date));
    }
  }
  
  return labels;
}

function formatDate(date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return false;
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    alert('Start date must be before end date');
    return false;
  }
  
  return true;
}

function simulateHistoricalData(dataPoints) {
  // Clear existing data
  statsData.hashRate = [];
  statsData.earnings = [];
  statsData.power = [];
  statsData.temperature = [];
  
  // Generate simulated historical data
  for (let i = 0; i < dataPoints; i++) {
    const hashRate = 245.32 + (Math.random() - 0.5) * 20;
    const earnings = hashRate * 0.00000132;
    const power = 320 + (Math.random() - 0.5) * 30;
    const temp = 72 + (Math.random() - 0.5) * 8;
    
    statsData.hashRate.push(hashRate);
    statsData.earnings.push(earnings);
    statsData.power.push(power);
    statsData.temperature.push(temp);
  }
  
  updateCharts();
}

function exportData(format) {
  const data = {
    hashRate: statsData.hashRate,
    earnings: statsData.earnings,
    shares: statsData.shares,
    power: statsData.power,
    temperature: statsData.temperature,
    period: currentPeriod
  };
  
  let exportData;
  let mimeType;
  let fileName;
  
  switch (format) {
    case 'csv':
      exportData = convertToCSV(data);
      mimeType = 'text/csv';
      fileName = 'mining-stats.csv';
      break;
    case 'excel':
      exportData = convertToExcel(data);
      mimeType = 'application/vnd.ms-excel';
      fileName = 'mining-stats.xlsx';
      break;
    case 'pdf':
      exportData = convertToPDF(data);
      mimeType = 'application/pdf';
      fileName = 'mining-stats.pdf';
      break;
    case 'json':
      exportData = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileName = 'mining-stats.json';
      break;
    default:
      alert('Unsupported export format');
      return;
  }
  
  // Create download link
  const blob = new Blob([exportData], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCSV(data) {
  // Convert data to CSV format
  const headers = ['Timestamp', 'Hash Rate', 'Earnings', 'Power', 'Temperature'];
  const rows = [headers];
  
  for (let i = 0; i < data.hashRate.length; i++) {
    rows.push([
      new Date(Date.now() - (data .hashRate.length - 1 - i) * 3600000).toISOString(),
      data.hashRate[i].toFixed(2),
      data.earnings[i].toFixed(8),
      data.power[i].toFixed(2),
      data.temperature[i].toFixed(2)
    ]);
  }
  
  return rows.map(row => row.join(',')).join('\n');
}

function convertToExcel(data) {
  // In a real app, you would use a library like xlsx
  // For this demo, we'll just use CSV
  return convertToCSV(data);
}

function convertToPDF(data) {
  // In a real app, you would use a library like pdfmake
  // For this demo, we'll just use a placeholder
  return 'PDF data placeholder';
}