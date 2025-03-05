// DOM Elements and State Management
let settings = {
  general: {
    theme: 'dark',
    accentColor: 'blue',
    compactMode: false,
    language: 'en',
    currency: 'usd',
    dateFormat: 'mdy',
    startOnBoot: true,
    minimizeToTray: true,
    updateInterval: 'daily'
  },
  mining: {
    defaultAlgorithm: 'sha256',
    defaultPool: 'pool1',
    defaultThreads: 8,
    defaultIntensity: 8,
    autoStartMining: true,
    pauseWhenIdle: false,
    pauseOnBattery: true,
    temperatureLimit: 85,
    powerLimits: true,
    powerCost: 0.12,
    powerMode: 'balanced'
  },
  wallet: {
    payoutThreshold: 0.001,
    payoutMethod: 'pool',
    autoConvert: true,
    addresses: {
      btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      eth: '0x7F5EB35d27d1B3d7B98d63e0c5D7C59BCe76e5a9',
      xmr: '48edfHu7V9Z84YzzMa6fUueoELZ9ZRXq9VetWzYGzKt52XU5xvqgzYnDK9URnRoJMk1j8nLwEVsaSWJ4fhdUyZijBGUicoD',
      rvn: 'RVNcYrM2iKLiF3bCc8qYqfW9Eu3AxccDnM'
    }
  },
  notifications: {
    enabled: true,
    soundAlerts: true,
    miningStatus: true,
    shareAccepted: false,
    shareRejected: true,
    temperature: true,
    payout: true,
    withdrawal: true,
    price: true
  },
  security: {
    requirePassword: true,
    twoFactor: false,
    withdrawalConfirmation: true,
    whitelistAddresses: true
  },
  advanced: {
    miningBackend: 'auto',
    openclPlatform: 'auto',
    enableCuda: true,
    enableOpencl: true,
    workSize: 8,
    threadMultiplier: 1,
    hardwareAcceleration: true,
    memoryTweak: false,
    connectionTimeout: 30,
    retryPause: 10,
    useTls: true,
    apiPort: 4067
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
  initializeInputs();
});

function setupEventListeners() {
  // Settings navigation
  document.querySelectorAll('.settings-nav li').forEach(item => {
    item.addEventListener('click', () => {
      switchSection(item.dataset.section);
    });
  });
  
  // Save button
  document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
  
  // Theme select
  document.getElementById('theme').addEventListener('change', updateTheme);
  
  // Accent color select
  document.getElementById('accent-color').addEventListener('change', updateAccentColor);
  
  // Slider inputs
  document.querySelectorAll('input[type="range"]').forEach(slider => {
    const valueDisplay = document.getElementById(`${slider.id}-value`);
    if (valueDisplay) {
      slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.id === 'temperature-limit' ? 
          `${slider.value}°C` : slider.value;
      });
    }
  });
  
  // Password change button
  document.querySelector('#security-section .secondary-btn').addEventListener('click', showPasswordModal);
  
  // Password modal
  const passwordModal = document.getElementById('password-modal');
  document.querySelector('#password-modal .close-btn').addEventListener('click', () => {
    passwordModal.style.display = 'none';
  });
  
  document.getElementById('cancel-password').addEventListener('click', () => {
    passwordModal.style.display = 'none';
  });
  
  document.getElementById('save-password').addEventListener('click', changePassword);
}

function loadSettings() {
  const savedSettings = localStorage.getItem('settings');
  if (savedSettings) {
    settings = JSON.parse(savedSettings);
  }
}

function initializeInputs() {
  // General Settings
  document.getElementById('theme').value = settings.general.theme;
  document.getElementById('accent-color').value = settings.general.accentColor;
  document.getElementById('compact-mode').checked = settings.general.compactMode;
  document.getElementById('language').value = settings.general.language;
  document.getElementById('currency').value = settings.general.currency;
  document.getElementById('date-format').value = settings.general.dateFormat;
  document.getElementById('start-on-boot').checked = settings.general.startOnBoot;
  document.getElementById('minimize-to-tray').checked = settings.general.minimizeToTray;
  document.getElementById('update-interval').value = settings.general.updateInterval;
  
  // Mining Settings
  document.getElementById('default-algorithm').value = settings.mining.defaultAlgorithm;
  document.getElementById('default-pool').value = settings.mining.defaultPool;
  document.getElementById('default-threads').value = settings.mining.defaultThreads;
  document.getElementById('default-threads-value').textContent = settings.mining.defaultThreads;
  document.getElementById('default-intensity').value = settings.mining.defaultIntensity;
  document.getElementById('default-intensity-value').textContent = settings.mining.defaultIntensity;
  document.getElementById('auto-start-mining').checked = settings.mining.autoStartMining;
  document.getElementById('pause-when-idle').checked = settings.mining.pauseWhenIdle;
  document.getElementById('pause-on-battery').checked = settings.mining.pauseOnBattery;
  document.getElementById('temperature-limit').value = settings.mining.temperatureLimit;
  document.getElementById('temperature-limit-value').textContent = `${settings.mining.temperatureLimit}°C`;
  document.getElementById('enable-power-limits').checked = settings.mining.powerLimits;
  document.getElementById('power-cost').value = settings.mining.powerCost;
  document.getElementById('power-mode').value = settings.mining.powerMode;
  
  // Wallet Settings
  document.getElementById('payout-threshold').value = settings.wallet.payoutThreshold;
  document.getElementById('payout-method').value = settings.wallet.payoutMethod;
  document.getElementById('auto-convert').checked = settings.wallet.autoConvert;
  document.getElementById('btc-address').value = settings.wallet.addresses.btc;
  document.getElementById('eth-address').value = settings.wallet.addresses.eth;
  document.getElementById('xmr-address').value = settings.wallet.addresses.xmr;
  document.getElementById('rvn-address').value = settings.wallet.addresses.rvn;
  
  // Notification Settings
  document.getElementById('enable-notifications').checked = settings.notifications.enabled;
  document.getElementById('sound-alerts').checked = settings.notifications.soundAlerts;
  document.getElementById('notify-mining-status').checked = settings.notifications.miningStatus;
  document.getElementById('notify-share-accepted').checked = settings.notifications.shareAccepted;
  document.getElementById('notify-share-rejected').checked = settings.notifications.shareRejected;
  document.getElementById('notify-temperature').checked = settings.notifications.temperature;
  document.getElementById('notify-payout').checked = settings.notifications.payout;
  document.getElementById('notify-withdrawal').checked = settings.notifications.withdrawal;
  document.getElementById('notify-price').checked = settings.notifications.price;
  
  // Security Settings
  document.getElementById('require-password').checked = settings.security.requirePassword;
  document.getElementById('two-factor').checked = settings.security.twoFactor;
  document.getElementById('withdrawal-confirmation').checked = settings.security.withdrawalConfirmation;
  document.getElementById('whitelist-addresses').checked = settings.security.whitelistAddresses;
  
  // Advanced Settings
  document.getElementById('mining-backend').value = settings.advanced.miningBackend;
  document.getElementById('opencl-platform').value = settings.advanced.openclPlatform;
  document.getElementById('enable-cuda').checked = settings.advanced.enableCuda;
  document.getElementById('enable-opencl').checked = settings.advanced.enableOpencl;
  document.getElementById('work-size').value = settings.advanced.workSize;
  document.getElementById('thread-multiplier').value = settings.advanced.threadMultiplier;
  document.getElementById('hardware-acceleration').checked = settings.advanced.hardwareAcceleration;
  document.getElementById('memory-tweak').checked = settings.advanced.memoryTweak;
  document.getElementById('connection-timeout').value = settings.advanced.connectionTimeout;
  document.getElementById('retry-pause').value = settings.advanced.retryPause;
  document.getElementById('use-tls').checked = settings.advanced.useTls;
  document.getElementById('api-port').value = settings.advanced.apiPort;
}

function switchSection(section) {
  // Update navigation
  document.querySelectorAll('.settings-nav li').forEach(item => {
    item.classList.toggle('active', item.dataset.section === section);
  });
  
  // Update content
  document.querySelectorAll('.settings-section').forEach(content => {
    content.classList.toggle('active', content.id === `${section}-section`);
  });
}

function saveSettings() {
  // General Settings
  settings.general.theme = document.getElementById('theme').value;
  settings.general.accentColor = document.getElementById('accent-color').value;
  settings.general.compactMode = document.getElementById('compact-mode').checked;
  settings.general.language = document.getElementById('language').value;
  settings.general.currency = document.getElementById('currency').value;
  settings.general.dateFormat = document.getElementById('date-format').value;
  settings.general.startOnBoot = document.getElementById('start-on-boot').checked;
  settings.general.minimizeToTray = document.getElementById('minimize-to-tray').checked;
  settings.general.updateInterval = document.getElementById('update-interval').value;
  
  // Mining Settings
  settings.mining.defaultAlgorithm = document.getElementById('default-algorithm').value;
  settings.mining.defaultPool = document.getElementById('default-pool').value;
  settings.mining.defaultThreads = parseInt(document.getElementById('default-threads').value);
  settings.mining.defaultIntensity = parseInt(document.getElementById('default-intensity').value);
  settings.mining.autoStartMining = document.getElementById('auto-start-mining').checked;
  settings.mining.pauseWhenIdle = document.getElementById('pause-when-idle').checked;
  settings.mining.pauseOnBattery = document.getElementById('pause-on-battery').checked;
  settings.mining.temperatureLimit = parseInt(document.getElementById('temperature-limit').value);
  settings.mining.powerLimits = document.getElementById('enable-power-limits').checked;
  settings.mining.powerCost = parseFloat(document.getElementById('power-cost').value);
  settings.mining.powerMode = document.getElementById('power-mode').value;
  
  // Wallet Settings
  settings.wallet.payoutThreshold = parseFloat(document.getElementById('payout-threshold').value);
  settings.wallet.payoutMethod = document.getElementById('payout-method').value;
  settings.wallet.autoConvert = document.getElementById('auto-convert').checked;
  settings.wallet.addresses.btc = document.getElementById('btc-address').value;
  settings.wallet.addresses.eth = document.getElementById('eth-address').value;
  settings.wallet.addresses.xmr = document.getElementById('xmr-address').value;
  settings.wallet.addresses.rvn = document.getElementById('rvn-address').value;
  
  // Notification Settings
  settings.notifications.enabled = document.getElementById('enable-notifications').checked;
  settings.notifications.soundAlerts = document.getElementById('sound-alerts').checked;
  settings.notifications.miningStatus = document.getElementById('notify-mining-status').checked;
  settings.notifications.shareAccepted = document.getElementById('notify-share-accepted').checked;
  settings.notifications.shareRejected = document.getElementById('notify-share-rejected').checked;
  settings.notifications.temperature = document.getElementById('notify-temperature').checked;
  settings.notifications.payout = document.getElementById('notify-payout').checked;
  settings.notifications.withdrawal = document.getElementById('notify-withdrawal').checked;
  settings.notifications.price = document.getElementById('notify-price').checked;
  
  // Security Settings
  settings.security.requirePassword = document.getElementById('require-password').checked;
  settings.security.twoFactor = document.getElementById('two-factor').checked;
  settings.security.withdrawalConfirmation = document.getElementById('withdrawal-confirmation').checked;
  settings.security.whitelistAddresses = document.getElementById('whitelist-addresses').checked;
  
  // Advanced Settings
  settings.advanced.miningBackend = document.getElementById('mining-backend').value;
  settings.advanced.openclPlatform = document.getElementById('opencl-platform').value;
  settings.advanced.enableCuda = document.getElementById('enable-cuda').checked;
  settings.advanced.enableOpencl = document.getElementById('enable-opencl').checked;
  settings.advanced.workSize = parseInt(document.getElementById('work-size').value);
  settings.advanced.threadMultiplier = parseFloat(document.getElementById('thread-multiplier').value);
  settings.advanced.hardwareAcceleration = document.getElementById('hardware-acceleration').checked;
  settings.advanced.memoryTweak = document.getElementById('memory-tweak').checked;
  settings.advanced.connectionTimeout = parseInt(document.getElementById('connection-timeout').value);
  settings.advanced.retryPause = parseInt(document.getElementById('retry-pause').value);
  settings.advanced.useTls = document.getElementById('use-tls').checked;
  settings.advanced.apiPort = parseInt(document.getElementById('api-port').value);
  
  // Save to localStorage
  localStorage.setItem('settings', JSON.stringify(settings));
  
  // Show success message
  alert('Settings saved successfully!');
  
  // Apply theme and accent color
  updateTheme();
  updateAccentColor();
}

function updateTheme() {
  const theme = document.getElementById('theme').value;
  document.body.className = theme;
}

function updateAccentColor() {
  const color = document.getElementById('accent-color').value;
  document.documentElement.style.setProperty('--accent-color', `var(--${color})`);
}

function showPasswordModal() {
  document.getElementById('password-modal').style.display = 'flex';
}

function changePassword() {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('Please fill in all password fields');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    alert('New passwords do not match');
    return;
  }
  
  // In a real app, you would verify the current password and update it securely
  alert('Password changed successfully!');
  document.getElementById('password-modal').style.display = 'none';
}