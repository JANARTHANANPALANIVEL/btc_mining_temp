// Mining simulator variables
let mining = false;
let hashRate = 0;
let totalHashes = 0;
let shares = 0;
let acceptedShares = 0;
let rejectedShares = 0;
let difficulty = 34.25;
let blockHeight = 793421;
let startTime = null;
let updateInterval = null;
let logUpdateInterval = null;

// Hardware simulation variables
let cpuUsage = 0;
let cpuTemp = 0;
let gpuUsage = 0;
let gpuTemp = 0;
let ramUsage = 0;
let networkUp = 0;
let networkDown = 0;

// DOM Elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const threadsSlider = document.getElementById('threads');
const threadsValue = document.getElementById('threads-value');
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const algorithmSelect = document.getElementById('algorithm');
const poolSelect = document.getElementById('pool');
const logContainer = document.getElementById('log-container');

// Stats elements
const hashRateElement = document.getElementById('hash-rate');
const hashChangeElement = document.getElementById('hash-change');
const earningsElement = document.getElementById('earnings');
const earningsUsdElement = document.getElementById('earnings-usd');
const workersElement = document.getElementById('workers');
const workerEfficiencyElement = document.getElementById('worker-efficiency');
const powerElement = document.getElementById('power');
const powerCostElement = document.getElementById('power-cost');
const difficultyElement = document.getElementById('difficulty');
const blockHeightElement = document.getElementById('block-height');

// Hardware monitor elements
const cpuUsageBar = document.getElementById('cpu-usage');
const cpuUsageValue = document.getElementById('cpu-usage-value');
const cpuTempBar = document.getElementById('cpu-temp');
const cpuTempValue = document.getElementById('cpu-temp-value');
const gpuUsageBar = document.getElementById('gpu-usage');
const gpuUsageValue = document.getElementById('gpu-usage-value');
const gpuTempBar = document.getElementById('gpu-temp');
const gpuTempValue = document.getElementById('gpu-temp-value');
const ramUsageBar = document.getElementById('ram-usage');
const ramUsageValue = document.getElementById('ram-usage-value');
const networkUpBar = document.getElementById('network-up');
const networkUpValue = document.getElementById('network-up-value');
const networkDownBar = document.getElementById('network-down');
const networkDownValue = document.getElementById('network-down-value');

// Initialize the UI
function initializeUI() {
  // Set initial values
  difficultyElement.textContent = difficulty.toFixed(2) + ' TH';
  blockHeightElement.textContent = blockHeight.toLocaleString();
  
  // Set up event listeners
  startBtn.addEventListener('click', startMining);
  stopBtn.addEventListener('click', stopMining);
  
  threadsSlider.addEventListener('input', () => {
    threadsValue.textContent = threadsSlider.value;
  });
  
  intensitySlider.addEventListener('input', () => {
    intensityValue.textContent = intensitySlider.value;
  });
  
  // Add initial log entry
  addLogEntry('System initialized. Ready to mine.', 'system');
  
  // Simulate network activity
  simulateNetworkActivity();
  
  // Simulate block height increases
  setInterval(updateBlockHeight, 60000);
}

// Start mining
function startMining() {
  if (mining) return;
  
  mining = true;
  startTime = new Date();
  shares = 0;
  acceptedShares = 0;
  rejectedShares = 0;
  totalHashes = 0;
  
  // Update UI
  startBtn.disabled = true;
  stopBtn.disabled = false;
  
  // Get mining parameters
  const threads = parseInt(threadsSlider.value);
  const intensity = parseInt(intensitySlider.value);
  const algorithm = algorithmSelect.value;
  const pool = poolSelect.value;
  
  // Calculate base hash rate based on algorithm and hardware
  let baseHashRate = 0;
  switch (algorithm) {
    case 'sha256':
      baseHashRate = 45 * intensity * threads; // MH/s
      break;
    case 'ethash':
      baseHashRate = 65 * intensity * threads; // MH/s
      break;
    case 'randomx':
      baseHashRate = 12 * intensity * threads; // kH/s
      break;
    case 'kawpow':
      baseHashRate = 25 * intensity * threads; // MH/s
      break;
  }
  
  // Log mining start
  addLogEntry(`Starting miner with ${threads} threads at intensity ${intensity}`, 'info');
  addLogEntry(`Algorithm: ${getAlgorithmName(algorithm)}`, 'info');
  addLogEntry(`Mining pool: ${getPoolName(pool)}`, 'info');
  addLogEntry('Connecting to pool...', 'info');
  
  // Simulate connection delay
  setTimeout(() => {
    addLogEntry('Connected to pool successfully', 'success');
    addLogEntry('Receiving work from pool...', 'info');
    
    // Simulate work received
    setTimeout(() => {
      addLogEntry('Received new work: block #' + blockHeight, 'info');
      addLogEntry('Mining started', 'success');
      
      // Start mining simulation
      updateInterval = setInterval(() => updateMiningStats(baseHashRate), 1000);
      
      // Start log updates
      logUpdateInterval = setInterval(updateMiningLog, getRandomInt(2000, 5000));
      
      // Start hardware simulation
      simulateHardware(threads, intensity);
    }, 1500);
  }, 2000);
}

// Stop mining
function stopMining() {
  if (!mining) return;
  
  mining = false;
  
  // Update UI
  startBtn.disabled = false;
  stopBtn.disabled = true;
  
  // Clear intervals
  clearInterval(updateInterval);
  clearInterval(logUpdateInterval);
  
  // Log mining stop
  addLogEntry('Mining stopped by user', 'warning');
  
  // Reset hardware stats gradually
  const resetInterval = setInterval(() => {
    let allZero = true;
    
    // Decrease CPU stats
    if (cpuUsage > 0) {
      cpuUsage = Math.max(0, cpuUsage - 5);
      cpuUsageBar.style.width = cpuUsage + '%';
      cpuUsageValue.textContent = cpuUsage + '%';
      allZero = false;
    }
    
    if (cpuTemp > 40) {
      cpuTemp = Math.max(40, cpuTemp - 2);
      cpuTempBar.style.width = (cpuTemp / 100) * 100 + '%';
      cpuTempValue.textContent = cpuTemp + '°C';
      allZero = false;
    }
    
    // Decrease GPU stats
    if (gpuUsage > 0) {
      gpuUsage = Math.max(0, gpuUsage - 5);
      gpuUsageBar.style.width = gpuUsage + '%';
      gpuUsageValue.textContent = gpuUsage + '%';
      allZero = false;
    }
    
    if (gpuTemp > 40) {
      gpuTemp = Math.max(40, gpuTemp - 2);
      gpuTempBar.style.width = (gpuTemp / 100) * 100 + '%';
      gpuTempValue.textContent = gpuTemp + '°C';
      allZero = false;
    }
    
    // Decrease RAM usage
    if (ramUsage > 20) {
      ramUsage = Math.max(20, ramUsage - 5);
      ramUsageBar.style.width = ramUsage + '%';
      ramUsageValue.textContent = ramUsage + '%';
      allZero = false;
    }
    
    if (allZero) {
      clearInterval(resetInterval);
    }
  }, 200);
}

// Update mining statistics
function updateMiningStats(baseHashRate) {
  if (!mining) return;
  
  // Calculate current hash rate with some randomness
  const variance = getRandomInt(-5, 5) / 100; // -5% to +5%
  hashRate = baseHashRate * (1 + variance);
  
  // Update total hashes
  totalHashes += hashRate * 1000; // Convert to H/s
  
  // Calculate earnings based on hash rate and algorithm
  const algorithm = algorithmSelect.value;
  let btcPerDay = 0;
  
  switch (algorithm) {
    case 'sha256':
      btcPerDay = (hashRate * 86400) / (difficulty * 1e12) * 6.25;
      break;
    case 'ethash':
      btcPerDay = (hashRate * 86400) / (difficulty * 1e12) * 0.1;
      break;
    case 'randomx':
      btcPerDay = (hashRate * 0.001 * 86400) / (difficulty * 1e12) * 0.5;
      break;
    case 'kawpow':
      btcPerDay = (hashRate * 86400) / (difficulty * 1e12) * 0.2;
      break;
  }
  
  // Calculate USD value (assuming 1 BTC = $60,000)
  const usdPerDay = btcPerDay * 60000;
  
  // Calculate power consumption
  const threads = parseInt(threadsSlider.value);
  const intensity = parseInt(intensitySlider.value);
  const powerConsumption = (threads * 15) + (intensity * 25);
  const powerCost = (powerConsumption / 1000) * 24 * 0.12; // Assuming $0.12 per kWh
  
  // Update UI
  updateHashRateDisplay(hashRate);
  earningsElement.textContent = btcPerDay.toFixed(8) + ' BTC';
  earningsUsdElement.textContent = '$' + usdPerDay.toFixed(2);
  workersElement.textContent = '1/1';
  workerEfficiencyElement.textContent = (acceptedShares / Math.max(1, shares) * 100).toFixed(1) + '%';
  powerElement.textContent = powerConsumption + ' W';
  powerCostElement.textContent = '$' + powerCost.toFixed(2);
  
  // Random hash rate change indicator
  if (Math.random() < 0.1) {
    const change = getRandomInt(-3, 5);
    hashChangeElement.textContent = (change >= 0 ? '+' : '') + change + '%';
    hashChangeElement.className = change >= 0 ? 'positive' : 'negative';
  }
}

// Update hash rate display with appropriate units
function updateHashRateDisplay(rate) {
  let displayRate;
  let unit;
  
  const algorithm = algorithmSelect.value;
  
  if (algorithm === 'randomx') {
    // For RandomX, display in H/s, kH/s, or MH/s
    if (rate < 1) {
      displayRate = (rate * 1000).toFixed(2);
      unit = 'H/s';
    } else if (rate < 1000) {
      displayRate = rate.toFixed(2);
      unit = 'kH/s';
    } else {
      displayRate = (rate / 1000).toFixed(2);
      unit = 'MH/s';
    }
  } else {
    // For other algorithms, display in MH/s, GH/s, or TH/s
    if (rate < 1000) {
      displayRate = rate.toFixed(2);
      unit = 'MH/s';
    } else if (rate < 1000000) {
      displayRate = (rate / 1000).toFixed(2);
      unit = 'GH/s';
    } else {
      displayRate = (rate / 1000000).toFixed(2);
      unit = 'TH/s';
    }
  }
  
  hashRateElement.textContent = displayRate + ' ' + unit;
}

// Update mining log with realistic entries
function updateMiningLog() {
  if (!mining) return;
  
  const algorithm = algorithmSelect.value;
  const rand = Math.random();
  
  if (rand < 0.6) {
    // Share found
    shares++;
    const accepted = Math.random() < 0.95;
    if (accepted) {
      acceptedShares++;
      const difficulty = getRandomInt(1, 64);
      addLogEntry(`Share accepted (${difficulty}) - ${formatHashesShort(totalHashes)} total`, 'success');
    } else {
      rejectedShares++;
      addLogEntry('Share rejected (low difficulty) - job not found', 'error');
    }
  } else if (rand < 0.8) {
    // Hardware info
    const temp = algorithm === 'ethash' || algorithm === 'kawpow' ? gpuTemp : cpuTemp;
    addLogEntry(`Temperature: ${temp}°C, ${formatHashRate(hashRate)}`, 'info');
  } else if (rand < 0.9) {
    // New job
    blockHeight++;
    blockHeightElement.textContent = blockHeight.toLocaleString();
    addLogEntry(`New job received: block #${blockHeight}`, 'info');
  } else {
    // Network info
    const ping = getRandomInt(15, 120);
    addLogEntry(`Network: ping ${ping}ms, ${acceptedShares} shares, ${rejectedShares} rejects`, 'info');
  }
}

// Simulate hardware metrics
function simulateHardware(threads, intensity) {
  // Calculate target values based on mining parameters
  const targetCpuUsage = algorithm === 'randomx' ? threads * (100 / 16) : 10;
  const targetGpuUsage = (algorithm === 'ethash' || algorithm === 'kawpow') ? intensity * 10 : 5;
  const targetCpuTemp = 40 + (threads * 3);
  const targetGpuTemp = 40 + (intensity * 5);
  const targetRamUsage = 20 + (threads * 5);
  
  // Update hardware stats gradually
  const hardwareInterval = setInterval(() => {
    if (!mining) {
      clearInterval(hardwareInterval);
      return;
    }
    
    // Update CPU stats
    if (cpuUsage < targetCpuUsage) {
      cpuUsage = Math.min(targetCpuUsage, cpuUsage + 5);
    } else if (cpuUsage > targetCpuUsage) {
      cpuUsage = Math.max(targetCpuUsage, cpuUsage - 5);
    } else {
      // Add small fluctuations
      cpuUsage = Math.max(5, Math.min(100, cpuUsage + getRandomInt(-2, 2)));
    }
    
    cpuUsageBar.style.width = cpuUsage + '%';
    cpuUsageValue.textContent = cpuUsage + '%';
    
    // Update CPU temperature
    if (cpuTemp < targetCpuTemp) {
      cpuTemp = Math.min(targetCpuTemp, cpuTemp + 2);
    } else if (cpuTemp > targetCpuTemp) {
      cpuTemp = Math.max(targetCpuTemp, cpuTemp - 2);
    } else {
      // Add small fluctuations
      cpuTemp = Math.max(40, Math.min(95, cpuTemp + getRandomInt(-1, 1)));
    }
    
    cpuTempBar.style.width = (cpuTemp / 100) * 100 + '%';
    cpuTempValue.textContent = cpuTemp + '°C';
    
    // Update temperature bar color
    if (cpuTemp > 80) {
      cpuTempBar.className = 'progress danger';
    } else if (cpuTemp > 70) {
      cpuTempBar.className = 'progress warning';
    } else {
      cpuTempBar.className = 'progress';
    }
    
    // Update GPU stats
    if (gpuUsage < targetGpuUsage) {
      gpuUsage = Math.min(targetGpuUsage, gpuUsage + 5);
    } else if (gpuUsage > targetGpuUsage) {
      gpuUsage = Math.max(targetGpuUsage, gpuUsage - 5);
    } else {
      // Add small fluctuations
      gpuUsage = Math.max(5, Math.min(100, gpuUsage + getRandomInt(-2, 2)));
    }
    
    gpuUsageBar.style.width = gpuUsage + '%';
    gpuUsageValue.textContent = gpuUsage + '%';
    
    // Update GPU temperature
    if (gpuTemp < targetGpuTemp) {
      gpuTemp = Math.min(targetGpuTemp, gpuTemp + 2);
    } else if (gpuTemp > targetGpuTemp) {
      gpuTemp = Math.max(targetGpuTemp, gpuTemp - 2);
    } else {
      // Add small fluctuations
      gpuTemp = Math.max(40, Math.min(95, gpuTemp + getRandomInt(-1, 1)));
    }
    
    gpuTempBar.style.width = (gpuTemp / 100) * 100 + '%';
    gpuTempValue.textContent = gpuTemp + '°C';
    
    // Update temperature bar color
    if (gpuTemp > 80) {
      gpuTempBar.className = 'progress danger';
    } else if (gpuTemp > 70) {
      gpuTempBar.className = 'progress warning';
    } else {
      gpuTempBar.className = 'progress';
    }
    
    // Update RAM usage
    if (ramUsage < targetRamUsage) {
      ramUsage = Math.min(targetRamUsage, ramUsage + 5);
    } else if (ramUsage > targetRamUsage) {
      ramUsage = Math.max(targetRamUsage, ramUsage - 5);
    } else {
      // Add small fluctuations
      ramUsage = Math.max(20, Math.min(100, ramUsage + getRandomInt(-1, 1)));
    }
    
    ramUsageBar.style.width = ramUsage + '%';
    ramUsageValue.textContent = ramUsage + '%';
  }, 1000);
}

// Simulate network activity
function simulateNetworkActivity() {
  setInterval(() => {
    if (mining) {
      // Higher network activity when mining
      networkUp = getRandomInt(5, 20);
      networkDown = getRandomInt(10, 50);
    } else {
      // Lower network activity when idle
      networkUp = getRandomInt(0, 2);
      networkDown = getRandomInt(0, 5);
    }
    
    networkUpBar.style.width = (networkUp / 100) * 100 + '%';
    networkUpValue.textContent = networkUp + ' KB/s';
    
    networkDownBar.style.width = (networkDown / 100) * 100 + '%';
    networkDownValue.textContent = networkDown + ' KB/s';
  }, 2000);
}

// Update block height periodically
function updateBlockHeight() {
  if (Math.random() < 0.7) {
    blockHeight++;
    blockHeightElement.textContent = blockHeight.toLocaleString();
    
    if (mining) {
      addLogEntry(`New block found: #${blockHeight}`, 'info');
    }
  }
}

// Add entry to the mining log
function addLogEntry(message, type = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  
  // Add timestamp
  const now = new Date();
  const timestamp = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}] `;
  
  entry.textContent = timestamp + message;
  logContainer.appendChild(entry);
  
  // Auto-scroll to bottom
  logContainer.scrollTop = logContainer.scrollHeight;
  
  // Limit log entries
  while (logContainer.children.length > 100) {
    logContainer.removeChild(logContainer.children[0]);
  }
}

// Format hash rate with appropriate units
function formatHashRate(rate) {
  const algorithm = algorithmSelect.value;
  
  if (algorithm === 'randomx') {
    if (rate < 1) {
      return (rate * 1000).toFixed(2) + ' H/s';
    } else if (rate < 1000) {
      return rate.toFixed(2) + ' kH/s';
    } else {
      return (rate / 1000).toFixed(2) + ' MH/s';
    }
  } else {
    if (rate < 1000) {
      return rate.toFixed(2) + ' MH/s';
    } else if (rate < 1000000) {
      return (rate / 1000).toFixed(2) + ' GH/s';
    } else {
      return (rate / 1000000).toFixed(2) + ' TH/s';
    }
  }
}

// Format total hashes in short form
function formatHashesShort(hashes) {
  if (hashes < 1000000) {
    return Math.floor(hashes / 1000) + 'K';
  } else if (hashes < 1000000000) {
    return Math.floor(hashes / 1000000) + 'M';
  } else if (hashes < 1000000000000) {
    return Math.floor(hashes / 1000000000) + 'G';
  } else {
    return Math.floor(hashes / 1000000000000) + 'T';
  }
}

// Get algorithm full name
function getAlgorithmName(algorithm) {
  switch (algorithm) {
    case 'sha256': return 'SHA-256 (Bitcoin)';
    case 'ethash': return 'Ethash (Ethereum)';
    case 'randomx': return 'RandomX (Monero)';
    case 'kawpow': return 'KawPoW (Ravencoin)';
    default: return algorithm;
  }
}

// Get pool full name
function getPoolName(pool) {
  switch (pool) {
    case 'pool1': return 'CryptoPool.io';
    case 'pool2': return 'MiningHeaven.com';
    case 'pool3': return 'HashPower.net';
    case 'custom': return 'Custom Pool';
    default: return pool;
  }
}

// Generate random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUI);