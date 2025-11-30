// Spare parts data (default/fallback)
let sparePartsData = {
  'Priming': {
    title: 'Self Priming Mini Monoblock Pump Spares',
    table: {
      headers: ['Model', 'Casing', 'Impeller', 'Mech. Sea', 'Adaptor', 'NRV'],
      rows: [
        ['S1', 'MSPX1', 'MSPK6', 'MSPD7', 'MSPD1', 'MSPD7'],
        ['S2', 'MSPD2', 'MSPS8', 'MSPY1', 'MSPY3', 'MSPY4'],
        ['SAGAR1', 'MSPX1', 'MSPN2', 'MSPP3', 'MSPP1', 'MSPP6'],
        ['SAGAR2', 'MSPG4', 'MSPP4', 'MSPS4', 'MSPS5', 'MSPS7'],
        ['HVLO1', 'MSPT1', 'MSPJ1', 'MSPF6', 'MSPF3', 'MSPF4'],
        ['JOY1 ULTRA', 'MSPH6', 'MSPK6', 'MSPK4', 'MSPK5', 'MSPK7'],
        ['JOY2 ULTRA', 'MSPH7', 'MSPP7', 'MSPP5', 'MSPP8', 'MSPP2']
      ]
    },
    image: 'assets/Self-Priming-Pump1.png',
    partImages: {
      'Casing': 'Spares_Parts/Casing.png',
      'Impeller': 'Spares_Parts/Impeller.png',
      'Mech. Sea': 'Spares_Parts/Mech seal.png',
      'Adaptor': 'Spares_Parts/Adaptor.png',
      'NRV': 'Spares_Parts/NRV.jpg'
    },
    // Unit prices for each part code (in rupees)
    prices: {
      'MSPX1': 500, 'MSPK6': 300, 'MSPD7': 400, 'MSPD1': 350, 'MSPD2': 450,
      'MSPS8': 320, 'MSPY1': 380, 'MSPY3': 420, 'MSPY4': 360, 'MSPN2': 310,
      'MSPP3': 390, 'MSPP1': 340, 'MSPP6': 370, 'MSPG4': 480, 'MSPP4': 330,
      'MSPS4': 410, 'MSPS5': 440, 'MSPS7': 400, 'MSPT1': 520, 'MSPJ1': 290,
      'MSPF6': 380, 'MSPF3': 350, 'MSPF4': 360, 'MSPH6': 550, 'MSPK4': 370,
      'MSPK5': 430, 'MSPK7': 390, 'MSPH7': 580, 'MSPP7': 340, 'MSPP5': 400,
      'MSPP8': 450, 'MSPP2': 320
    }
  }
  // Add more pump types here as needed
};

// Load spare parts data from database file if assigned
async function loadSparePartsData() {
  try {
    if (typeof pumpDB !== 'undefined' && pumpDB) {
      await pumpDB.init();
      const sparesFile = await pumpDB.getDatabaseFileForSpares();
      
      if (sparesFile && sparesFile.fileData) {
        // Parse and use the database file assigned for spares
        const fileData = JSON.parse(sparesFile.fileData);
        console.log('Using database file for spares:', sparesFile.fileName);
        
        // Replace sparePartsData with data from file
        // Assuming the file structure matches sparePartsData format
        if (fileData && typeof fileData === 'object') {
          sparePartsData = fileData;
        }
      }
    }
  } catch (error) {
    console.warn('Could not load database file for spares, using default data:', error);
  }
}

// Load data when page loads (before other code runs)
(async () => {
  await loadSparePartsData();
})();

// Get modal elements
const sparesModal = document.getElementById('sparesModal');
const orderModal = document.getElementById('orderModal');
const closeBtn = document.querySelector('.close');
const closeOrderBtn = document.getElementById('closeOrderModal');
const sparesContent = document.getElementById('sparesContent');
const modalTitle = document.getElementById('modalTitle');

// Track selected parts and current pump type
let selectedParts = [];
let currentPumpType = '';
let currentPumpName = '';

// Open modal when pump is clicked
document.querySelectorAll('.pump-type-item').forEach(item => {
  item.addEventListener('click', () => {
    const pumpType = item.dataset.value;
    const pumpName = item.querySelector('.pump-name') ? item.querySelector('.pump-name').textContent : '';
    currentPumpName = pumpName;
    openSparesModal(pumpType);
  });
});

// Close modal when X is clicked
closeBtn.addEventListener('click', () => {
  sparesModal.style.display = 'none';
  selectedParts = [];
});

closeOrderBtn.addEventListener('click', () => {
  orderModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === sparesModal) {
    sparesModal.style.display = 'none';
    selectedParts = [];
  }
  if (event.target === orderModal) {
    orderModal.style.display = 'none';
  }
});

function openSparesModal(pumpType) {
  const data = sparePartsData[pumpType];
  
  if (!data) {
    alert('Spare parts information for this pump type is coming soon!');
    return;
  }

  currentPumpType = pumpType;
  selectedParts = []; // Reset selected parts
  modalTitle.textContent = data.title;
  
  // Create table with images above column headers
  let tableHTML = '<table class="spares-table"><thead>';
  
  // First row: Images above headers (except Model column)
  tableHTML += '<tr class="image-row">';
  data.table.headers.forEach(header => {
    if (header === 'Model') {
      tableHTML += `<th class="image-header"></th>`;
    } else {
      const imagePath = data.partImages[header] || '';
      tableHTML += `<th class="image-header">
        <img src="${imagePath}" alt="${header}" class="part-image"
             onerror="this.style.display='none'">
      </th>`;
    }
  });
  tableHTML += '</tr>';
  
  // Second row: Column headers
  tableHTML += '<tr class="header-row">';
  data.table.headers.forEach(header => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += '</tr></thead><tbody>';

  data.table.rows.forEach(row => {
    tableHTML += '<tr>';
    row.forEach((cell, index) => {
      if (index === 0) {
        // Model name column - not selectable
        tableHTML += `<td class="model-name">${cell}</td>`;
      } else {
        // Other columns - selectable
        tableHTML += `<td class="selectable" data-part="${data.table.headers[index]}" data-code="${cell}">${cell}</td>`;
      }
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody></table>';

  // Add spare image
  tableHTML += `<img src="${data.image}" alt="Spare Parts Diagram" class="spare-image" onerror="this.style.display='none'">`;

  // Add to Basket button
  tableHTML += '<button class="order-button" id="addToBasketBtn" disabled>Add to Basket</button>';

  sparesContent.innerHTML = tableHTML;

  // Add click handlers for selectable cells
  document.querySelectorAll('.spares-table td.selectable').forEach(cell => {
    cell.addEventListener('click', () => {
      toggleCellSelection(cell);
    });
  });

  // Add to Basket button handler
  document.getElementById('addToBasketBtn').addEventListener('click', () => {
    openOrderModal();
  });

  sparesModal.style.display = 'block';
}

function toggleCellSelection(cell) {
  const partType = cell.dataset.part;
  const partCode = cell.dataset.code;
  const rowData = cell.parentElement;
  const modelName = rowData.querySelector('.model-name').textContent;

  if (cell.classList.contains('selected')) {
    // Deselect
    cell.classList.remove('selected');
    selectedParts = selectedParts.filter(p => !(p.type === partType && p.code === partCode && p.model === modelName));
  } else {
    // Select this cell (no restrictions - allow multiple selections)
    cell.classList.add('selected');
    const data = sparePartsData[currentPumpType];
    const unitPrice = data && data.prices && data.prices[partCode] ? data.prices[partCode] : 0;
    selectedParts.push({ type: partType, code: partCode, model: modelName, quantity: 1, unitPrice: unitPrice });
  }

  // Enable/disable Add to Basket button
  const addToBasketBtn = document.getElementById('addToBasketBtn');
  if (addToBasketBtn) {
    if (selectedParts.length > 0) {
      addToBasketBtn.disabled = false;
    } else {
      addToBasketBtn.disabled = true;
    }
  }
}

function openOrderModal() {
  const data = sparePartsData[currentPumpType];
  if (!data) return;

  let orderHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h3 style="color: #003366; margin-bottom: 15px;">Order Summary</h3>
      <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #003366;">
        <p style="color: #003366; font-size: 1.1em; font-weight: bold; margin: 0;">
          Pump Type: <span style="color: #28a745;">${currentPumpName || data.title}</span>
        </p>
      </div>
      <p style="color: #666; font-size: 0.9em;">Review your selected spare parts below</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h4 style="color: #003366; margin-bottom: 15px;">Selected Parts:</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #003366; color: white;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Model</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Part Type</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Part Code</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Unit Price</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Total Price</th>
          </tr>
        </thead>
        <tbody>
  `;

  selectedParts.forEach((part, index) => {
    const partId = `part-${index}`;
    const unitPrice = part.unitPrice || 0;
    const quantity = part.quantity || 1;
    const totalPrice = unitPrice * quantity;
    orderHTML += `
      <tr style="background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};" data-part-id="${partId}">
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #003366;">${part.model || ''}</td>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #003366;">${part.type}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #28a745; font-weight: bold;">${part.code}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #003366;">
          ₹${unitPrice.toLocaleString('en-IN')}
        </td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
          <div class="quantity-controls">
            <button class="qty-btn qty-decrease" onclick="changeQuantity(${index}, -1)" type="button">−</button>
            <input type="number" class="qty-input" id="qty-${index}" value="${quantity}" min="1" 
                   onchange="updateQuantity(${index}, this.value)">
            <button class="qty-btn qty-increase" onclick="changeQuantity(${index}, 1)" type="button">+</button>
          </div>
        </td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #28a745;">
          ₹<span id="total-${index}">${totalPrice.toLocaleString('en-IN')}</span>
        </td>
      </tr>
    `;
  });

  orderHTML += `
        </tbody>
      </table>
    </div>
  `;

  // Add spare part images
  if (data.partImages) {
    const diagramTitle = currentPumpName ? `${currentPumpName} Diagram` : 'Spare Parts Diagram';
    orderHTML += `
      <div style="margin-top: 30px;">
        <h4 style="color: #003366; margin-bottom: 15px; text-align: center;">${diagramTitle}</h4>
        <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
          <img src="${data.image}" alt="${diagramTitle}" 
               style="max-width: 100%; max-height: 400px; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
               onerror="this.style.display='none'">
        </div>
      </div>
    `;
  }

  // Add contact information and order button
  orderHTML += `
    <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
      <h4 style="color: #003366; margin-bottom: 10px;">Contact for Order</h4>
      <p style="font-size: 1.1em; color: #cc5500; font-weight: bold; margin: 10px 0;">
        📞 Service Support: <a href="tel:9873441650" style="color: #cc5500; text-decoration: none;">9873441650</a>
      </p>
      <p style="color: #666; font-size: 0.9em; margin-top: 10px;">
        Please contact us with the part codes and quantities listed above to place your order.
      </p>
      <button class="order-button" onclick="window.location.href='tel:9873441650'" 
              style="margin-top: 15px; background-color: #28a745;">
        📞 Place Order
      </button>
    </div>
  `;

  document.getElementById('orderContent').innerHTML = orderHTML;
  orderModal.style.display = 'block';
}

// Quantity control functions
function changeQuantity(index, change) {
  if (selectedParts[index]) {
    const currentQty = selectedParts[index].quantity || 1;
    const newQty = Math.max(1, currentQty + change);
    selectedParts[index].quantity = newQty;
    
    const qtyInput = document.getElementById(`qty-${index}`);
    if (qtyInput) {
      qtyInput.value = newQty;
    }
    
    // Update total price
    updateTotalPrice(index);
  }
}

function updateQuantity(index, value) {
  if (selectedParts[index]) {
    const qty = Math.max(1, parseInt(value) || 1);
    selectedParts[index].quantity = qty;
    
    const qtyInput = document.getElementById(`qty-${index}`);
    if (qtyInput) {
      qtyInput.value = qty;
    }
    
    // Update total price
    updateTotalPrice(index);
  }
}

function updateTotalPrice(index) {
  if (selectedParts[index]) {
    const part = selectedParts[index];
    const unitPrice = part.unitPrice || 0;
    const quantity = part.quantity || 1;
    const totalPrice = unitPrice * quantity;
    
    const totalElement = document.getElementById(`total-${index}`);
    if (totalElement) {
      totalElement.textContent = totalPrice.toLocaleString('en-IN');
    }
  }
}

