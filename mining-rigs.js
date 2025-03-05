// DOM Elements and State Management
let rigs = [];
let selectedRig = null;

document.addEventListener('DOMContentLoaded', () => {
  initializeRigs();
  setupEventListeners();
  updateRigStats();
});

function initializeRigs() {
  // Load saved rigs from localStorage or use defaults
  const savedRigs = localStorage.getItem('miningRigs');
  rigs = savedRigs ? JSON.parse(savedRigs) : [
    {
      id: 'RIG_001',
      name: 'Main Workstation',
      status: 'active',
      algorithm: 'sha256',
      hashRate: 245.32,
      power: 320,
      hardware: {
        cpu: 'Intel Core i9-12900K',
        gpu: 'NVIDIA RTX 3090'
      },
      uptime: {
        days: 3,
        hours: 7,
        minutes: 22
      }
    }
  ];
  
  renderRigs();
}

function setupEventListeners() {
  // Add Rig Button
  document.getElementById('add-rig-btn').addEventListener('click', showAddRigModal);
  
  // Add Rig Card
  document.querySelector('.add-card').addEventListener('click', showAddRigModal);
  
  // Modal Close Buttons
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', hideModals);
  });
  
  // Cancel Add Rig
  document.getElementById('cancel-add-rig').addEventListener('click', hideModals);
  
  // Confirm Add Rig
  document.getElementById('confirm-add-rig').addEventListener('click', addNewRig);
  
  // Custom Pool Input Toggle
  document.getElementById('new-rig-pool').addEventListener('change', (e) => {
    const customPoolGroup = document.getElementById('custom-pool-group');
    customPoolGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
  });
  
  // Tab Navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function showAddRigModal() {
  document.getElementById('add-rig-modal').style.display = 'flex';
}

function hideModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

function addNewRig() {
  const rigName = document.getElementById('new-rig-name').value;
  const rigType = document.getElementById('rig-type').value;
  const algorithm = document.getElementById('new-rig-algorithm').value;
  const pool = document.getElementById('new-rig-pool').value;
  const wallet = document.getElementById('new-rig-wallet').value;
  const autoStart = document.getElementById('new-auto-start').checked;
  
  if (!rigName) {
    alert('Please enter a rig name');
    return;
  }
  
  const newRig = {
    id: `RIG_${String(rigs.length + 1).padStart(3, '0')}`,
    name: rigName,
    status: autoStart ? 'active' : 'inactive',
    algorithm,
    pool,
    wallet,
    type: rigType,
    hashRate: 0,
    power: 0,
    hardware: getDefaultHardware(rigType),
    uptime: {
      days: 0,
      hours: 0,
      minutes: 0
    }
  };
  
  rigs.push(newRig);
  saveRigs();
  renderRigs();
  hideModals();
  
  // Show success message
  alert(`Rig "${rigName}" added successfully!`);
}

function getDefaultHardware(type) {
  switch (type) {
    case 'local':
      return {
        cpu: 'Intel Core i9-12900K',
        gpu: 'NVIDIA RTX 3090'
      };
    case 'remote':
      return {
        cpu: 'AMD Ryzen 9 5950X',
        gpu: 'AMD Radeon RX 6900 XT'
      };
    case 'cloud':
      return {
        cpu: 'Cloud Instance (8 vCPU)',
        memory: '16 GB RAM'
      };
    default:
      return {
        cpu: 'Unknown CPU',
        gpu: 'Unknown GPU'
      };
  }
}

function renderRigs() {
  const rigsGrid = document.querySelector('.rigs-grid');
  const addCard = rigsGrid.querySelector('.add-card');
  
  // Clear existing rig cards
  Array.from(rigsGrid.children).forEach(child => {
    if (!child.classList.contains('add-card')) {
      child.remove();
    }
  });
  
  // Add rig cards
  rigs.forEach(rig => {
    const rigCard = createRigCard(rig);
    rigsGrid.insertBefore(rigCard, addCard);
  });
}

function createRigCard(rig) {
  const card = document.createElement('div');
  card.className = `rig-card ${rig.status}`;
  card.innerHTML = `
    <div class="rig-header">
      <div class="rig-name">
        <h3>${rig.name}</h3>
        <span class="rig-id">${rig.id}</span>
      </div>
      <div class="rig-status">
        <span class="status-badge ${rig.status}">${rig.status === 'active' ? 'Active' : 'Offline'}</span>
        <div class="rig-menu">
          <button class="menu-btn"><i class="fas fa-ellipsis-v"></i></button>
          <div class="dropdown-menu">
            <a href="#" data-action="edit"><i class="fas fa-edit"></i> Edit</a>
            <a href="#" data-action="${rig.status === 'active' ? 'pause' : 'start'}">
              <i class="fas fa-${rig.status === 'active' ? 'pause' : 'play'}"></i> 
              ${rig.status === 'active' ? 'Pause' : 'Start'}
            </a>
            <a href="#" data-action="restart"><i class="fas fa-sync"></i> Restart</a>
            <a href="#" data-action="delete" class="danger"><i class="fas fa-trash"></i> Delete</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="rig-stats">
      <div class="rig-stat">
        <span class="stat-label">Algorithm</span>
        <span class="stat-value">${getAlgorithmName(rig.algorithm)}</span>
      </div>
      <div class="rig-stat">
        <span class="stat-label">Hash Rate</span>
        <span class="stat-value">${rig.status === 'active' ? formatHashRate(rig.hashRate) : '0 MH/s'}</span>
      </div>
      <div class="rig-stat">
        <span class="stat-label">Power</span>
        <span class="stat-value">${rig.status === 'active' ? `${rig.power} W` : '0 W'}</span>
      </div>
      <div class="rig-stat">
        <span class="stat-label">Efficiency</span>
        <span class="stat-value">${rig.status === 'active' ? `${(rig.hashRate / rig.power).toFixed(2)} MH/W` : '0 MH/W'}</span>
      </div>
    </div>
    
    <div class="rig-hardware">
      ${rig.hardware.cpu ? `
        <div class="hardware-item">
          <i class="fas fa-microchip"></i>
          <span>${rig.hardware.cpu}</span>
        </div>
      ` : ''}
      ${rig.hardware.gpu ? `
        <div class="hardware-item">
          <i class="fas fa-desktop"></i>
          <span>${rig.hardware.gpu}</span>
        </div>
      ` : ''}
      ${rig.hardware.memory ? `
        <div class="hardware-item">
          <i class="fas fa-memory"></i>
          <span>${rig.hardware.memory}</span>
        </div>
      ` : ''}
    </div>
    
    <div class="rig-uptime">
      <span>${formatUptime(rig)}</span>
      <div class="progress-bar">
        <div class="progress" style="width: ${rig.status === 'active' ? '95%' : '0%'}"></div>
      </div>
    </div>
  `;
  
  // Add event listeners
  card.addEventListener('click', () => selectRig(rig));
  
  const menuBtn = card.querySelector('.menu-btn');
  const dropdownMenu = card.querySelector('.dropdown-menu');
  
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });
  
  dropdownMenu.querySelectorAll('a').forEach(action => {
    action.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleRigAction(action.dataset.action, rig);
      dropdownMenu.style.display = 'none';
    });
  });
  
  return card;
}

function selectRig(rig) {
  selectedRig = rig;
  document.querySelector('.rig-details-panel h3').textContent = `Rig Details - ${rig.name} (${rig.id})`;
  document.querySelector('.rig-details-panel').style.display = 'block';
  updateRigDetails();
}

function handleRigAction(action, rig) {
  switch (action) {
    case 'edit':
      // Show edit modal
      break;
    case 'start':
      startRig(rig);
      break;
    case 'pause':
      pauseRig(rig);
      break;
    case 'restart':
      restartRig(rig);
      break;
    case 'delete':
      deleteRig(rig);
      break;
  }
}

function startRig(rig) {
  rig.status = 'active';
  saveRigs();
  renderRigs();
}

function pauseRig(rig) {
  rig.status = 'inactive';
  saveRigs();
  renderRigs();
}

function restartRig(rig) {
  pauseRig(rig);
  setTimeout(() => startRig(rig), 2000);
}

function deleteRig(rig) {
  if (confirm(`Are you sure you want to delete ${rig.name}?`)) {
    rigs = rigs.filter(r => r.id !== rig.id);
    saveRigs();
    renderRigs();
    if (selectedRig && selectedRig.id === rig.id) {
      document.querySelector('.rig-details-panel').style.display = 'none';
    }
  }
}

function saveRigs() {
  localStorage.setItem('miningRigs', JSON.stringify(rigs));
}

function updateRigStats() {
  if (!rigs.length) return;
  
  rigs.forEach(rig => {
    if (rig.status === 'active') {
      // Simulate hash rate fluctuations
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      rig.hashRate = Math.max(0, rig.hashRate * (1 + variance));
      
      // Update uptime
      rig.uptime.minutes++;
      if (rig.uptime.minutes >= 60) {
        rig.uptime.minutes = 0;
        rig.uptime.hours++;
        if (rig.uptime.hours >= 24) {
          rig.uptime.hours = 0;
          rig.uptime.days++;
        }
      }
    }
  });
  
  renderRigs();
  if (selectedRig) {
    updateRigDetails();
  }
  
  // Update every second
  setTimeout(updateRigStats, 1000);
}

function updateRigDetails() {
  if (!selectedRig) return;
  
  // Update performance charts
  updatePerformanceCharts();
  
  // Update performance stats
  updatePerformanceStats();
}

function updatePerformanceCharts() {
  // In a real app, you would update Chart.js instances
  // For this demo, we'll just keep the placeholders
}

function updatePerformanceStats() {
  if (!selectedRig) return;
  
  const stats = {
    acceptedShares: Math.floor(Math.random() * 100) + 1200,
    rejectedShares: Math.floor(Math.random() * 30) + 10,
    avgHashRate: selectedRig.hashRate,
    earnings: selectedRig.hashRate * 0.00000132
  };
  
  document.querySelector('.performance-stats').innerHTML = `
    <div class="stat-box">
      <h4>Accepted Shares</h4>
      <div class="stat-value">${stats.acceptedShares}</div>
      <div class="stat-change positive">+12% from yesterday</div>
    </div>
    
    <div class="stat-box">
      <h4>Rejected Shares</h4>
      <div class="stat-value">${stats.rejectedShares}</div>
      <div class="stat-change negative">+5% from yesterday</div>
    </div>
    
    <div class="stat-box">
      <h4>Average Hash Rate</h4>
      <div class="stat-value">${formatHashRate(stats.avgHashRate)}</div>
      <div class="stat-change positive">+2.3% from yesterday</div>
    </div>
    
    <div class="stat-box">
      <h4>Earnings (24h)</h4>
      <div class="stat-value">${stats.earnings.toFixed(8)} BTC</div>
      <div class="stat-change positive">$${(stats.earnings * 60000).toFixed(2)}</div>
    </div>
  `;
}

// Utility Functions
function getAlgorithmName(algorithm) {
  const algorithms = {
    sha256: 'SHA-256 (Bitcoin)',
    ethash: 'Ethash (Ethereum)',
    randomx: 'RandomX (Monero)',
    kawpow: 'KawPoW (Ravencoin)'
  };
  return algorithms[algorithm] || algorithm;
}

function formatHashRate(rate) {
  if (rate >= 1000) {
    return `${(rate / 1000).toFixed(2)} GH/s`;
  }
  return `${rate.toFixed(2)} MH/s`;
}

function formatUptime(rig) {
  if (rig.status === 'inactive') {
    return 'Last seen: 2 days ago';
  }
  
  const { days, hours, minutes } = rig.uptime;
  return `Uptime: ${days} days, ${hours} hours, ${minutes} minutes`;
}