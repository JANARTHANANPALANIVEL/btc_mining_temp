// DOM Elements and State Management
let walletData = {
  balances: {
    btc: 0.01245678,
    eth: 0.15432100,
    xmr: 0.75000000,
    rvn: 1250.00000000
  },
  prices: {
    btc: 60000,
    eth: 3000,
    xmr: 150,
    rvn: 0.05
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  startPriceSimulation();
  initializeQRCode();
});

function setupEventListeners() {
  // Currency selector buttons
  document.querySelectorAll('.currency-btn').forEach(button => {
    button.addEventListener('click', () => {
      const currency = button.getAttribute('data-currency');
      updateBalanceDisplay(currency);
    });
  });
  
  // Withdraw modal
  const withdrawModal = document.getElementById('withdraw-modal');
  const withdrawBtns = document.querySelectorAll('[id^="withdraw-btn"], .action-btn:first-child');
  
  withdrawBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      withdrawModal.style.display = 'flex';
    });
  });
  
  document.querySelector('#withdraw-modal .close-btn').addEventListener('click', () => {
    withdrawModal.style.display = 'none';
  });
  
  document.getElementById('cancel-withdraw').addEventListener('click', () => {
    withdrawModal.style.display = 'none';
  });
  
  // Quick amount buttons
  document.querySelectorAll('.amount-btn').forEach(button => {
    button.addEventListener('click', () => {
      const percent = parseInt(button.getAttribute('data-percent'));
      setWithdrawAmount(percent);
    });
  });
  
  // Withdraw amount input
  document.getElementById('withdraw-amount').addEventListener('input', updateWithdrawalSummary);
  
  // Withdraw currency select
  document.getElementById('withdraw-currency').addEventListener('change', () => {
    updateWithdrawCurrency();
  });
  
  // Withdraw fee select
  document.getElementById('withdraw-fee').addEventListener('change', updateWithdrawalSummary);
  
  // Confirm withdrawal
  document.getElementById('confirm-withdraw').addEventListener('click', processWithdrawal);
  
  // Copy address buttons
  document.querySelectorAll('.address-actions .icon-btn:first-child').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      copyAddress(button);
    });
  });
  
  // QR code buttons
  document.querySelectorAll('.address-actions .icon-btn:nth-child(2)').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      showQRCode(button);
    });
  });
}

function startPriceSimulation() {
  setInterval(() => {
    // Simulate price changes
    Object.keys(walletData.prices).forEach(coin => {
      const change = (Math.random() - 0.5) * 0.02; // ±1% change
      walletData.prices[coin] *= (1 + change);
    });
    
    updateBalanceValues();
  }, 5000);
}

function updateBalanceDisplay(currency) {
  const buttons = document.querySelectorAll('.currency-btn');
  const amount = document.querySelector('.balance-amount');
  const currencyLabel = document.querySelector('.currency');
  const value = document.querySelector('.balance-value');
  
  buttons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-currency') === currency));
  
  if (currency === 'btc') {
    amount.textContent = walletData.balances.btc.toFixed(8);
    currencyLabel.textContent = 'BTC';
    value.textContent = `≈ $${(walletData.balances.btc * walletData.prices.btc).toFixed(2)}`;
  } else {
    const usdValue = walletData.balances.btc * walletData.prices.btc;
    amount.textContent = usdValue.toFixed(2);
    currencyLabel.textContent = 'USD';
    value.textContent = `≈ ${walletData.balances.btc.toFixed(8)} BTC`;
  }
}

function updateBalanceValues() {
  // Update main balance
  const activeCurrency = document.querySelector('.currency-btn.active').getAttribute('data-currency');
  updateBalanceDisplay(activeCurrency);
  
  // Update asset list
  const assets = [
    { symbol: 'btc', name: 'Bitcoin' },
    { symbol: 'eth', name: 'Ethereum' },
    { symbol: 'xmr', name: 'Monero' },
    { symbol: 'rvn', name: 'Ravencoin' }
  ];
  
  assets.forEach(asset => {
    const balance = walletData.balances[asset.symbol];
    const price = walletData.prices[asset.symbol];
    const usdValue = balance * price;
    
    const assetItem = document.querySelector(`.asset-item:has(.${asset.symbol})`);
    assetItem.querySelector('.balance-amount').textContent = balance.toFixed(8);
    assetItem.querySelector('.balance-value').textContent = `$${usdValue.toFixed(2)}`;
    
    // Update 24h change
    const change = (Math.random() - 0.45) * 10; // Simulate price change
    const changeElement = assetItem.querySelector('.asset-change');
    changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    changeElement.className = `asset-change ${change >= 0 ? 'positive' : 'negative'}`;
  });
}

function setWithdrawAmount(percent) {
  const currency = document.getElementById('withdraw-currency').value;
  const balance = walletData.balances[currency];
  const amount = (balance * percent / 100).toFixed(8);
  
  document.getElementById('withdraw-amount').value = amount;
  updateWithdrawalSummary();
}

function updateWithdrawCurrency() {
  const currency = document.getElementById('withdraw-currency').value;
  const currencyLabel = document.querySelector('.currency-label');
  const availableBalance = document.querySelector('.available-balance');
  
  currencyLabel.textContent = currency.toUpperCase();
  availableBalance.textContent = `${walletData.balances[currency].toFixed(8)} ${currency.toUpperCase()}`;
  
  updateWithdrawalFee();
  updateWithdrawalSummary();
}

function updateWithdrawalFee() {
  const currency = document.getElementById('withdraw-currency').value;
  const feeOption = document.getElementById('withdraw-fee').value;
  
  const fees = {
    btc: { slow: 0.00001, medium: 0.00002, fast: 0.00005 },
    eth: { slow: 0.0005, medium: 0.001, fast: 0.002 },
    xmr: { slow: 0.0001, medium: 0.0002, fast: 0.0005 },
    rvn: { slow: 0.1, medium: 0.2, fast: 0.5 }
  };
  
  const fee = fees[currency][feeOption];
  document.getElementById('summary-fee').textContent = `${fee} ${currency.toUpperCase()}`;
}

function updateWithdrawalSummary() {
  const currency = document.getElementById('withdraw-currency').value.toUpperCase();
  const amount = parseFloat(document.getElementById('withdraw-amount').value) || 0;
  const fee = parseFloat(document.getElementById('summary-fee').textContent.split(' ')[0]);
  
  document.getElementById('summary-amount').textContent = `${amount.toFixed(8)} ${currency}`;
  document.getElementById('summary-total').textContent = `${(amount + fee).toFixed(8)} ${currency}`;
  
  // Update USD value
  const usdValue = amount * walletData.prices[currency.toLowerCase()];
  document.querySelector('.amount-value').textContent = `≈ $${usdValue.toFixed(2)}`;
}

function processWithdrawal() {
  const currency = document.getElementById('withdraw-currency').value;
  const amount = parseFloat(document.getElementById('withdraw-amount').value);
  const address = document.getElementById('withdraw-address').value;
  
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  if (!address) {
    alert('Please enter a destination address');
    return;
  }
  
  const balance = walletData.balances[currency];
  const fee = parseFloat(document.getElementById('summary-fee').textContent.split(' ')[0]);
  
  if (amount + fee > balance) {
    alert('Insufficient balance');
    return;
  }
  
  // Process withdrawal
  walletData.balances[currency] -= (amount + fee);
  
  // Hide modal
  document.getElementById('withdraw-modal').style.display = 'none';
  
  // Show success message
  alert(`Withdrawal of ${amount} ${currency.toUpperCase()} initiated!`);
  
  // Update balances
  updateBalanceValues();
}

function copyAddress(button) {
  const addressValue = button.closest('.address-item').querySelector('.address-value').textContent;
  
  navigator.clipboard.writeText(addressValue)
    .then(() => {
      const originalTitle = button.getAttribute('title');
      button.setAttribute('title', 'Copied!');
      button.innerHTML = '<i class="fas fa-check"></i>';
      
      setTimeout(() => {
        button.setAttribute('title', originalTitle);
        button.innerHTML = '<i class="fas fa-copy"></i>';
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy address:', err);
      alert('Failed to copy address');
    });
}

function showQRCode(button) {
  const addressItem = button.closest('.address-item');
  const currencyName = addressItem.querySelector('.address-name').textContent;
  const addressValue = addressItem.querySelector('.address-value').textContent;
  
  const qrModal = document.getElementById('qr-modal');
  qrModal.querySelector('.modal-header h3').textContent = currencyName;
  qrModal.querySelector('.address-value').textContent = addressValue;
  
  // Generate QR code
  generateQRCode(addressValue);
  
  qrModal.style.display = 'flex';
}

function initializeQRCode() {
  // Set up QR code modal close button
  document.querySelector('#qr-modal .close-btn').addEventListener('click', () => {
    document.getElementById('qr-modal').style.display = 'none';
  });
  
  // Set up copy button in QR modal
  document.querySelector('#qr-modal .icon-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const addressValue = document.querySelector('#qr-modal .address-value').textContent;
    
    navigator.clipboard.writeText(addressValue)
      .then(() => {
        const button = e.currentTarget;
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
      })
      .catch(() => {
        alert('Failed to copy address');
      });
  });
}

function generateQRCode(address) {
  // In a real app, you would use a QR code library
  // For this demo, we'll just show a placeholder
  const qrPlaceholder = document.querySelector('.qr-placeholder');
  qrPlaceholder.style.backgroundColor = '#fff';
  qrPlaceholder.style.padding = '20px';
  qrPlaceholder.innerHTML = `
    <div style="width: 200px; height: 200px; background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px">
    </div>
  `;
}