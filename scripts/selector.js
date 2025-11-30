document.addEventListener('DOMContentLoaded', () => {
  console.log('JS Loaded'); // Debug: Confirms script runs

  // 🛠️ Element References (robust selectors with fallbacks and null checks)
  const simpleMode = document.getElementById('simpleMode');
  const advancedMode = document.getElementById('advancedMode');
  const simpleBtn = document.getElementById('simpleBtn');
  const advancedBtn = document.getElementById('advancedBtn');
  const form = document.getElementById('pumpForm');
  const resultBox = document.getElementById('resultBox');
 
  

  const purposeSelect = document.getElementById('purpose') || document.querySelector('select[name="purpose"]');
  const allPurposeSelects = Array.from(document.querySelectorAll('select[name="purpose"], #purpose'));
  const locationSelect = document.querySelector('select[name="location"]');
  const sourceSelect = document.getElementById('sourceSelect') || document.querySelector('select[name="source"]');
  const constructionSourceSelect = document.getElementById('constructionSourceSelect');
  const constructionSourceLabel = document.getElementById('constructionSourceLabel');
  const waterLevelSelect = document.getElementById('waterLevelSelect') || document.querySelector('select[name="waterLevel"]');
  const waterLevelLabel = waterLevelSelect ? waterLevelSelect.previousElementSibling : document.querySelector('label[for="waterLevelSelect"]');
  const deliverySelect = document.getElementById('deliverySelect') || document.querySelector('select[name="delivery"]');
  const deliveryLabel = deliverySelect ? deliverySelect.previousElementSibling : document.querySelector('label[for="deliverySelect"]') || null;
  const heightDropdownBox = document.getElementById('heightDropdownBox');

  // 🎚️ Toggle Pump Stages visibility based on purpose + location
  function togglePumpStages() {
    const borewellOptions = ['3borwp', '4borwp', '5borwp', '6borwp', '7borwp', '8borwp'];
    const isBorewell = borewellOptions.includes(getCurrentPurposeValue());
    const isMultiStage = locationSelect?.value === 'MStage';
    const stageBox = document.getElementById('stageBox');

    if (stageBox) {
      stageBox.style.display = (isBorewell && isMultiStage) ? 'block' : 'none';
    }
  }
  // Helper: get current visible purpose value (handles duplicate selects in Simple/Advanced)
  function getCurrentPurposeValue() {
    const visiblePurpose = allPurposeSelects.find(sel => sel && sel.offsetParent !== null);
    const value = (visiblePurpose || purposeSelect)?.value || '';
    return value.toLowerCase();
  }

  
  
  // Robust usage targeting (for hiding) - Add id="usageSelect" to HTML for best results
  const usageSelect = document.getElementById('usageSelect') || document.querySelector('select[name="usage"]');
  const usageLabel = document.querySelector('label[for="usageSelect"]') || (usageSelect ? usageSelect.previousElementSibling : null);
  
  const phaseSelect = document.querySelector('select[name="phase"]');
  const qualitySelect = document.querySelector('select[name="quality"]');

  // Debug log (remove after testing)
  console.log('Purpose Select Found:', purposeSelect);
  console.log('Source Select Found:', sourceSelect);
  console.log('Water Level Select Found:', waterLevelSelect);
  console.log('Usage Select Found:', usageSelect);

  // 📊 Real Pump Database from JSON
  let pumpDatabase = [];

  // Load pump data from database file assigned for selection
  async function loadPumpData() {
    try {
      let data = null;
      
      // Wait for pumpDB to be available
      let retries = 0;
      while (typeof pumpDB === 'undefined' && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      // Get database file assigned for selection from IndexedDB
      try {
        if (typeof pumpDB !== 'undefined' && pumpDB) {
          console.log('Initializing database...');
          await pumpDB.init();
          console.log('Database initialized, fetching selection file...');
          
          const selectionFile = await pumpDB.getDatabaseFileForSelection();
          console.log('Selection file result:', selectionFile ? 'Found' : 'Not found');
          
          if (selectionFile) {
            console.log('File details:', {
              id: selectionFile.id,
              fileName: selectionFile.fileName,
              hasData: !!selectionFile.fileData,
              forSelection: selectionFile.forSelection,
              dataLength: selectionFile.fileData ? selectionFile.fileData.length : 0
            });
            
            if (selectionFile.fileData) {
              // Use database file assigned for selection
              try {
                data = JSON.parse(selectionFile.fileData);
                console.log('Successfully parsed JSON. Rows:', data ? data.length : 0);
                console.log('Using database file for selection:', selectionFile.fileName);
              } catch (parseError) {
                console.error('Error parsing JSON from file:', parseError);
                throw new Error(`Error parsing database file: ${parseError.message}`);
              }
            } else {
              console.error('File has no data:', selectionFile);
            }
          } else {
            console.warn('No file assigned for selection');
          }
        } else {
          console.error('pumpDB is not available');
        }
      } catch (dbError) {
        console.error('Error loading database file for selection:', dbError);
        console.error('Error details:', {
          message: dbError.message,
          stack: dbError.stack,
          name: dbError.name
        });
      }
      
      // If no file assigned, show error message
      if (!data) {
        console.error('No database file assigned for selection. Please contact admin.');
        if (resultBox) {
          resultBox.innerHTML = `
            <div style="background: linear-gradient(135deg, #ffebee, #ffcdd2); padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #c62828;">
              <h3 style="color: #c62828; margin-bottom: 10px;">⚠️ Database Not Configured</h3>
              <p style="color: #c62828;">No database file has been assigned for pump selection. Please contact the administrator to upload and assign a database file.</p>
              <p style="color: #c62828; font-size: 0.9em; margin-top: 10px;">Admin: Go to Admin Panel → View Database Files → Click "For Selection" on a file.</p>
            </div>
          `;
          resultBox.style.display = 'block';
        }
        // Use empty array - no pumps available
        pumpDatabase = [];
        return;
      }
      
      // Skip the header row and process actual pump data
      pumpDatabase = data.slice(1).map(pump => ({
        model: pump.Column21 || 'Unknown Model',
        productCode: pump.Column20 || 'N/A',
        series: pump.Column15 || 'Unknown Series',
        hp: parseFloat(pump.Column24?.replace('HP', '') || '0'),
        powerKw: pump.Column23 || 'N/A',
        voltage: pump.Column28 || 'N/A',
        headRange: pump.Column25 || 'N/A',
        flowRange: pump.Column27 || 'N/A',
        headMax: parseFloat(pump.Column14 || '0') * 3.28084, // Convert meters to feet
        flowMax: parseFloat(pump.Column19 || '0'), // L/h
        application: pump.Column3 || 'General',
        category: pump.Column12 || 'General',
        phase: pump.Column2 || 'Unknown',
        oilFilled: pump.Column10 || 'Unknown',
        buildingFloor: pump.Column13 || 'N/A'
      })).filter(pump => pump.model !== 'Unknown Model' && pump.hp > 0);
      
      console.log('Loaded pump data:', pumpDatabase.length, 'pumps');
    } catch (error) {
      console.error('Error loading pump data:', error);
      // Show error message
      if (resultBox) {
        resultBox.innerHTML = `
          <div style="background: linear-gradient(135deg, #ffebee, #ffcdd2); padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #c62828;">
            <h3 style="color: #c62828; margin-bottom: 10px;">⚠️ Error Loading Database</h3>
            <p style="color: #c62828;">An error occurred while loading the pump database. Please try again or contact the administrator.</p>
          </div>
        `;
        resultBox.style.display = 'block';
      }
      // Use empty array - no pumps available
      pumpDatabase = [];
    }
  }

  // 🔄 Mode Toggle Function
  window.setMode = function(mode) {
    const isSimple = mode === 'simple';
    if (simpleMode) simpleMode.style.display = isSimple ? 'block' : 'none';
    if (advancedMode) advancedMode.style.display = isSimple ? 'none' : 'block';
    if (simpleBtn) simpleBtn.classList.toggle('active-green', isSimple);
    if (advancedBtn) advancedBtn.classList.toggle('active-green', !isSimple);
    if (form) form.reset();
    if (resultBox) resultBox.style.display = 'none';
    // Re-apply filters after reset
    if (purposeSelect) purposeSelect.dispatchEvent(new Event('change'));
  };

  // Helper: get currently active source select (construction vs default)
  function getActiveSourceSelect() {
    if (constructionSourceSelect && constructionSourceSelect.style.display !== 'none') {
      return constructionSourceSelect;
    }
    return sourceSelect;
  }

  // 💧 Water Level Toggle Based on Source (adapted for select ranges)
  function toggleWaterLevel() {
    const activeSource = getActiveSourceSelect();
    if (!activeSource || !waterLevelSelect || !waterLevelLabel) return;
    const selected = (activeSource.value || '').toLowerCase();
    const depthSources = ['open well', 'borewell', 'underground tank', 'pond', 'river'];
    const showWaterLevel = depthSources.includes(selected);

    waterLevelSelect.disabled = !showWaterLevel;
    waterLevelSelect.style.display = showWaterLevel ? 'block' : 'none';
    if (waterLevelLabel) waterLevelLabel.style.display = showWaterLevel ? 'block' : 'none';
    waterLevelSelect.style.backgroundColor = showWaterLevel ? '#fff' : '#eee';
    if (!showWaterLevel) waterLevelSelect.value = '';
    console.log('Water level toggled for source:', selected, 'Show:', showWaterLevel); // Debug
  }




  //water toggle system for advance mode

function togglePumpStages() {
  const purpose = purposeSelect?.value;
  const pumpType = document.querySelector('select[name="location"]')?.value;
  const stageBox = document.getElementById('stageBox');

  const borewellOptions = ['3borwp', '4borwp', '5borwp', '6borwp', '7borwp', '8borwp'];
  const isBorewell = borewellOptions.includes(purpose);
  const isMultiStage = pumpType === 'MStage';

  if (stageBox) {
    stageBox.style.display = (isBorewell && isMultiStage) ? 'block' : 'none';
  }
}


  // 🔒 Limit source options for Agriculture: show only first 4 options + Pond
  function limitSourcesForAgriculture() {
    if (!sourceSelect) return;
    // Reset visibility first
    Array.from(sourceSelect.options).forEach(option => {
      option.hidden = false;
      option.style.display = '';
    });
    // Collect first 4 non-empty options as allowed
    const nonEmptyOptions = Array.from(sourceSelect.options).filter(o => o.value !== '');
    const firstFour = nonEmptyOptions.slice(0, 4);
    const allowedValues = new Set(firstFour.map(o => o.value.toLowerCase()));
    allowedValues.add('pond');

    Array.from(sourceSelect.options).forEach(option => {
      if (option.value === '') return; // keep placeholder visible
      const isAllowed = allowedValues.has(option.value.toLowerCase());
      option.hidden = !isAllowed;
      option.style.display = isAllowed ? '' : 'none';
    });

    // Reset to default if current selection is invalid or hidden
    const current = sourceSelect.querySelector(`option[value="${sourceSelect.value}"]`);
    if (!current || current.hidden || current.style.display === 'none') {
      // Reset to default empty option instead of auto-selecting
      sourceSelect.value = '';
    }
  }

  // 🔒 Limit source options for Construction: show only first 6 + 'roof-tank'
  function limitSourcesForConstruction() {
    if (!sourceSelect) return;
    // Reset visibility first
    Array.from(sourceSelect.options).forEach(option => {
      option.hidden = false;
      option.style.display = '';
    });

    const options = Array.from(sourceSelect.options);
    if (options.length === 0) return;

    // Determine allowed set: first 6 non-empty + 'roof-tank'
    const nonEmptyOptions = options.filter(o => o.value !== '');
    const firstSix = nonEmptyOptions.slice(0, 6);
    const allowedValues = new Set(firstSix.map(o => o.value.toLowerCase()));
    allowedValues.add('roof-tank');

    Array.from(sourceSelect.options).forEach(option => {
      if (option.value === '') return; // keep placeholder visible
      const isAllowed = allowedValues.has(option.value.toLowerCase());
      option.hidden = !isAllowed;
      option.style.display = isAllowed ? '' : 'none';
    });

    // Reset to default if current selection is invalid or hidden
    const current = sourceSelect.querySelector(`option[value="${sourceSelect.value}"]`);
    if (!current || current.hidden || current.style.display === 'none') {
      // Reset to default empty option instead of auto-selecting
      sourceSelect.value = '';
    }
  }

  // 🚫 Always hide "For hospital sewage" option from source list
  function hideHospitalSourceOption() {
    if (!sourceSelect) return;
    const hospitalOpt = sourceSelect.querySelector('option[value="hospital"]');
    if (hospitalOpt) {
      hospitalOpt.hidden = true;
      hospitalOpt.style.display = 'none';
    }
  }

  // 📦 Custom Height Toggle Based on Delivery (only for non-pressure)
  function toggleCustomHeight() {
    if (!deliverySelect || !heightDropdownBox) return;
    // Only show if not in faucet mode (pressure)
    const isFaucetMode = deliverySelect.querySelector('option[value="1"]') !== null; // Check if options are faucets
    heightDropdownBox.style.display = (!isFaucetMode && deliverySelect.value === 'custom') ? 'block' : 'none';
    if (heightDropdownBox.style.display === 'none') {
      const customHeightSelect = document.querySelector('select[name="customHeight"]');
      if (customHeightSelect) customHeightSelect.value = '';
    }
  }

  // 🚦 Purpose → Location & Source Filtering (hides last 5 sewage for agriculture)
  function filterLocationByPurpose() {
    if (!purposeSelect || !locationSelect) return;
    const selected = getCurrentPurposeValue();
    const locationLabel = locationSelect.previousElementSibling;

    const hideLocation = selected === 'construction';
    if (locationSelect && locationLabel) {
      locationSelect.style.display = hideLocation ? 'none' : 'block';
      locationLabel.style.display = hideLocation ? 'none' : 'block';
      // Reset location value when hidden
      if (hideLocation) {
        locationSelect.value = '';
      }
    }

    // Filter location options (house/mall/building hide farming etc.; agriculture hides sewage/roof/pressure)
    Array.from(locationSelect.options).forEach(option => {
      option.hidden = false;
      option.style.display = '';
      if (selected === 'house' || selected === 'mall' || selected === 'building') {
        const hideIfIndoor = ['farming', 'fountain', 'sprinkler'];
        if (hideIfIndoor.includes(option.value)) {
          option.hidden = true;
          option.style.display = 'none';
        }
      } else if (selected === 'agriculture') {
        const hideIfAgriculture = ['sewage', 'roof', 'pressure'];
        if (hideIfAgriculture.includes(option.value)) {
          option.hidden = true;
          option.style.display = 'none';
        }

        if (option.value === 'fountain') {
          option.hidden = true;
          option.style.display = 'none';
        }
      }
    });

    // Reset to default if current selection is invalid or hidden
    const currentOption = locationSelect.querySelector(`option[value="${locationSelect.value}"]`);
    if ((!currentOption || currentOption.hidden || currentOption.style.display === 'none') && !hideLocation) {
      // Reset to default empty option instead of auto-selecting
      locationSelect.value = '';
    }

    // Filter source options for purpose and toggle construction-specific source UI
    if (sourceSelect) {
      if (selected === 'agriculture') {
        // Use default source select; hide construction one
        if (constructionSourceLabel) constructionSourceLabel.style.display = 'none';
        if (constructionSourceSelect) {
          constructionSourceSelect.style.display = 'none';
          constructionSourceSelect.name = 'constructionSource';
        }
        if (sourceSelect.previousElementSibling) sourceSelect.previousElementSibling.style.display = 'block';
        sourceSelect.style.display = 'block';
        if (sourceSelect.name !== 'source') sourceSelect.name = 'source';
        limitSourcesForAgriculture();
      } else if (selected === 'construction') {
        // Hide default source and show construction-specific select with first 6 + roof-tank
        if (sourceSelect.previousElementSibling) sourceSelect.previousElementSibling.style.display = 'none';
        sourceSelect.style.display = 'none';
        if (constructionSourceLabel) constructionSourceLabel.style.display = 'block';
        if (constructionSourceSelect) {
          constructionSourceSelect.style.display = 'block';
          // build options
          const options = Array.from(sourceSelect.options).filter(o => o.value !== '');
          const firstSix = options.slice(0, 6);
          const roof = options.find(o => o.value.toLowerCase() === 'roof-tank');
          const allowed = [...firstSix];
          if (roof && !firstSix.includes(roof)) allowed.push(roof);
          constructionSourceSelect.innerHTML = '';
          // Add default option first
          const defaultOpt = document.createElement('option');
          defaultOpt.value = '';
          defaultOpt.textContent = 'Select water source (पानी का स्रोत चुनें)';
          constructionSourceSelect.appendChild(defaultOpt);
          // Add other options
          allowed.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.textContent;
            constructionSourceSelect.appendChild(o);
          });
          constructionSourceSelect.name = 'source';
          if (sourceSelect.name === 'source') sourceSelect.name = 'sourceHidden';
          // Keep default option selected (index 0)
          constructionSourceSelect.selectedIndex = 0;
        }
      } else {
        // Reset to default source select; hide construction one
        if (constructionSourceLabel) constructionSourceLabel.style.display = 'none';
        if (constructionSourceSelect) {
          constructionSourceSelect.style.display = 'none';
          constructionSourceSelect.name = 'constructionSource';
        }
        if (sourceSelect.previousElementSibling) sourceSelect.previousElementSibling.style.display = 'block';
        sourceSelect.style.display = 'block';
        if (sourceSelect.name !== 'source') sourceSelect.name = 'source';

        // Reset visibility for non-agriculture purposes
        Array.from(sourceSelect.options).forEach(option => {
          option.hidden = false;
          option.style.display = '';
        });
      }

      // Ensure hospital option stays hidden globally (on default select only)
      hideHospitalSourceOption();

      // Reset to default if current selection is invalid or hidden (for default select)
      const currentSource = sourceSelect.querySelector(`option[value="${sourceSelect.value}"]`);
      if (!currentSource || currentSource.hidden || currentSource.style.display === 'none') {
        // Reset to default empty option instead of auto-selecting
        sourceSelect.value = '';
      }

      // Update water level based on active source
      toggleWaterLevel();
    }

    // Cascade to location change
    if (locationSelect.value) locationSelect.dispatchEvent(new Event('change'));
  }

  // 🚦 Location → Source, Delivery Conversion to Faucet, Usage/Water Level Hiding
  function filterByLocation() {
    if (!locationSelect || !sourceSelect || !deliverySelect || !deliveryLabel) return;
    const selected = locationSelect.value.toLowerCase();
    const sewageSources = ['hospital', 'hotel', 'industry', 'home', 'mall'];

    // Filter source options (reset and re-apply, respecting purpose and location)
    Array.from(sourceSelect.options).forEach(option => {
      const value = option.value.toLowerCase();
      option.hidden = false;
      option.style.display = '';
      if (selected === 'sewage') {
        if (sewageSources.includes(value)) {
          option.style.display = '';
        } else {
          option.hidden = true;
          option.style.display = 'none';
        }
      } else if (selected === 'roof') {
        if (sewageSources.includes(value)) {
          option.hidden = true;
          option.style.display = 'none';
        } else {
          option.style.display = '';
        }
      } else if (selected === 'pressure') {
        if (value === 'roof-tank') {
          option.style.display = '';
        } else {
          option.hidden = true;
          option.style.display = 'none';
        }
      } else {
        // For other locations, reset initially; we'll apply purpose-specific limits below
        option.style.display = '';
      }
    });

    // For pressure mode, roof-tank will be the only visible option, but don't auto-select
    // User must explicitly select it (no defaults policy)

    // Re-apply Agriculture/Construction-specific source limit if applicable and not in restricted locations
    const currentPurpose = getCurrentPurposeValue();
    if (!['sewage', 'roof', 'pressure'].includes(selected)) {
      if (currentPurpose === 'agriculture') {
        limitSourcesForAgriculture();
      } else if (currentPurpose === 'construction') {
        limitSourcesForConstruction();
      }
    }

    // Ensure hospital option stays hidden globally
    hideHospitalSourceOption();

    // Reset to default if current selection is invalid or hidden (for default select only)
    const currentSource = sourceSelect.querySelector(`option[value="${sourceSelect.value}"]`);
    if (!currentSource || currentSource.hidden || currentSource.style.display === 'none') {
      // Reset to default empty option instead of auto-selecting
      sourceSelect.value = '';
    }

    console.log('Location changed - Source re-filtered for:', selected); // Debug

    // Pressure-specific changes
    if (selected === 'pressure') {
      console.log('Pressure selected - Converting delivery to faucets, hiding usage and water level'); // Debug
      // Convert delivery to faucet category
      deliveryLabel.textContent = 'In how many faucets need pressure water (कितने नलों में प्रेशर वाले पानी की आवश्यकता है)';
      deliverySelect.innerHTML = `
        <option value="">Select faucet count (नलों की संख्या चुनें)</option>
        <option value="1">Single faucet (एक नल)</option>
        <option value="2">Two faucets (दो नल)</option>
        <option value="4">Four faucets (चार नल)</option>
        <option value="6">Six faucets (छह नल)</option>
        <option value="8">Eight faucets (आठ नल)</option>
      `;
      deliverySelect.value = '';
      deliverySelect.name = 'faucetCount';

      // Hide usage
      if (usageSelect) usageSelect.style.display = 'none';
      if (usageLabel) usageLabel.style.display = 'none';

      // Hide water level category (from roof tank, no depth needed)
      if (waterLevelSelect) waterLevelSelect.style.display = 'none';
      if (waterLevelLabel) waterLevelLabel.style.display = 'none';

      // Hide custom height
      if (heightDropdownBox) heightDropdownBox.style.display = 'none';
    } else {
      console.log('Non-pressure selected - Restoring delivery, showing usage and water level'); // Debug
      // Restore delivery
      deliveryLabel.textContent = 'Where do you want the water to reach (पानी कहाँ तक पहुंचाना है)';
      deliverySelect.innerHTML = `
        <option value="">Select delivery location (पानी पहुंचाने की जगह चुनें)</option>
        <option value="ground">Ground level (जमीन स्तर)</option>
        <option value="floor1">1st floor (~10 ft) (पहली मंजिल)</option>
        <option value="floor2">2nd floor (~20 ft) (दूसरी मंजिल)</option>
        <option value="floor3">3rd floor (~30 ft) (तीसरी मंजिल)</option>
        <option value="floor4">4th floor (~40 ft) (चौथी मंजिल)</option>
        <option value="custom">Above 4th floor (चौथी मंजिल से ऊपर)</option>
      `;
      deliverySelect.value = '';
      deliverySelect.name = 'delivery';

      // Show usage
      if (usageSelect) usageSelect.style.display = 'block';
      if (usageLabel) usageLabel.style.display = 'block';

      // Show water level category
      if (waterLevelSelect) waterLevelSelect.style.display = 'block';
      if (waterLevelLabel) waterLevelLabel.style.display = 'block';

      // Re-enable custom height toggle
      toggleCustomHeight();
    }

    toggleWaterLevel(); // Toggle based on source
  }

  // 🔍 Optimized Recommendation Engine
  async function getRecommendation(formData) {
    if (!resultBox) return null;
    
    // Show loading animation immediately
    resultBox.innerHTML = `
      <div style="background: linear-gradient(135deg, #e6f7ff, #b3e5fc); padding: 20px; border-radius: 12px; margin-top: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 2em; margin-bottom: 15px;">🔍</div>
          <h2 style="color: #003366; margin-bottom: 10px;">Searching for the Best Pumps...</h2>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
              <div style="width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #003366; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
              <span style="color: #003366; font-weight: bold;">Analyzing ${pumpDatabase.length || '100+'} pump models...</span>
            </div>
            <p style="color: #666; margin: 0;">Please wait while we find the perfect match for your requirements.</p>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    resultBox.style.display = 'block';
    
    // Load pump data if not already loaded
    if (pumpDatabase.length === 0) {
      await loadPumpData();
    }
    
    // Calculate requirements efficiently
    const isSimple = simpleMode && simpleMode.style.display !== 'none';
    const requirements = calculateRequirements(formData, isSimple);
    const { head, flow, hp, voltage } = requirements;
    
    // Debug logging
    console.log('Requirements calculated:', requirements);
    console.log('Pump database size:', pumpDatabase.length);
    
    // Add 2 second delay for loading effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use efficient matching algorithm
    let matches = [];
    try {
      matches = findBestMatches(pumpDatabase, requirements);
      console.log('Matches found:', matches.length);
    } catch (error) {
      console.error('Error finding matches:', error);
      matches = [];
    }

    // Display results efficiently
    let html = '';
    try {
      html = generateResultsHTML(matches, requirements);
    } catch (error) {
      console.error('Error generating HTML:', error);
      html = `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #856404;">⚠️ Error Generating Recommendations</h3>
          <p style="color: #856404;">An error occurred while generating recommendations. Please try again.</p>
        </div>
      `;
    }

    resultBox.innerHTML = html;
    resultBox.style.display = 'block';
    console.log('Recommendation generated:', { head, flow, hp, matches: matches.length });
    
    // Return recommendations data for database storage
    return {
      head: Math.round(head),
      flow: Math.round(flow / 60), // LPM
      hp: hp,
      voltage: voltage,
      matches: matches.map(m => ({
        model: m.model,
        productCode: m.productCode,
        compatibility: m.compatibility
      })),
      timestamp: new Date().toISOString()
    };
  }

  // 🧮 Calculate Requirements (Optimized)
  function calculateRequirements(formData, isSimple) {
    let head = 0, flow = 0, hp = 0;
    const voltage = parseInt(formData.phase || 220, 10);

    if (!isSimple) {
      // Advanced mode: Direct inputs
      head = parseFloat(formData.head || 0);
      flow = parseFloat(formData.flow || 0);
      hp = parseFloat(formData.hp || 0);
      return { head, flow: flow * 60, hp, voltage }; // Convert LPM to L/h
    }

    // Simple mode calculations - optimized with pre-calculated maps
    const WATER_LEVEL_MAP = {
      '0-5': 2.5, '5-20': 12.5, '20-28': 24, '28-50': 39, '50-100': 75,
      '100-200': 150, '200-350': 275, '350-500': 425, '500-700': 600
    };
    
    const HEIGHT_MAP = {
      ground: 0, floor1: 10, floor2: 20, floor3: 30, floor4: 40
    };
    
    const USAGE_MAP = {
      '500L-30min': 278, '1000L-30min': 556, '1500L-30min': 833,
      '2000L-60min': 333, '3000L-60min': 500,
      '1bigha-60min': 1000, '3bigha-60min': 3000, '6bigha-60min': 6000
    };
    
    const FAUCET_MAP = { 1: 20, 2: 40, 4: 80, 6: 120, 8: 160 };

    // Calculate depth
    head += WATER_LEVEL_MAP[formData.waterLevel] || 0;

    // Check if in faucet mode (pressure)
    const isFaucetMode = formData.faucetCount || (formData.delivery && ['1','2','4','6','8'].includes(formData.delivery));
    if (isFaucetMode) {
      head += 15; // Default pressure head
      flow = FAUCET_MAP[formData.faucetCount || formData.delivery] || 40;
    } else {
      // Normal delivery head
      head += HEIGHT_MAP[formData.delivery] || parseInt(formData.customHeight || 50, 10);
      flow = USAGE_MAP[formData.usage] || 500;
    }
    
    // Convert flow from LPM to L/h for comparison
    flow = flow * 60;
    
    // Optimized HP calculation
    const flowGpm = (flow / 3.785) / 60; // L/h to GPM
    hp = Math.max(0.5, Math.ceil((head * flowGpm) / 3960 * 1.5));

    return { head, flow, hp, voltage };
  }

  // 🎯 Find Best Matches (Optimized Algorithm)
  function findBestMatches(database, requirements) {
    // Safety check
    if (!database || database.length === 0) {
      console.warn('Pump database is empty or not loaded');
      return [];
    }
    
    const { head, flow, hp, voltage } = requirements;
    const voltageStr = voltage.toString();
    
    // Pre-filter pumps for better performance (early exit conditions)
    // Only consider pumps that meet minimum criteria
    const MIN_COMPATIBILITY = 20;
    const candidates = [];
    const perfectMatches = [];
    
    // Single pass with early optimizations
    for (const pump of database) {
      // Safety check for pump data
      if (!pump || !pump.voltage) {
        continue;
      }
      
      // Quick voltage check (most restrictive)
      const pumpVoltageStr = pump.voltage.toString();
      if (!pumpVoltageStr.includes(voltageStr)) {
        continue; // Skip if voltage doesn't match
      }
      
      // Calculate scores efficiently
      const headScore = pump.headMax >= head ? 100 : Math.max(0, (pump.headMax / head) * 100);
      const flowScore = pump.flowMax >= flow ? 100 : Math.max(0, (pump.flowMax / flow) * 100);
      const hpScore = pump.hp >= hp ? 100 : Math.max(0, (pump.hp / hp) * 100);
      const voltageScore = 100; // Already filtered
      
      // Weighted compatibility
      const compatibility = Math.round(
        headScore * 0.3 + flowScore * 0.3 + hpScore * 0.2 + voltageScore * 0.2
      );
      
      // Early exit for perfect matches
      if (compatibility >= 95) {
        perfectMatches.push({
          ...pump,
          compatibility,
          headScore: Math.round(headScore),
          flowScore: Math.round(flowScore),
          hpScore: Math.round(hpScore),
          voltageScore
        });
        if (perfectMatches.length >= 8) break; // Found enough perfect matches
        continue;
      }
      
      // Only add if meets minimum threshold
      if (compatibility >= MIN_COMPATIBILITY) {
        candidates.push({
          ...pump,
          compatibility,
          headScore: Math.round(headScore),
          flowScore: Math.round(flowScore),
          hpScore: Math.round(hpScore),
          voltageScore
        });
      }
    }
    
    // Combine perfect matches with candidates
    const allMatches = [...perfectMatches, ...candidates];
    
    // Efficient partial sort (only top 8 needed)
    if (allMatches.length <= 8) {
      return allMatches.sort((a, b) => b.compatibility - a.compatibility);
    }
    
    // Partial sort for top 8 (more efficient than full sort)
    return allMatches
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 8);
  }

  // 📄 Generate Results HTML (Optimized)
  function generateResultsHTML(matches, requirements) {
    const { head, flow, hp, voltage } = requirements;
    const flowLPM = Math.round(flow / 60);
    
    let html = `
      <div style="background: linear-gradient(135deg, #e6f7ff, #b3e5fc); padding: 20px; border-radius: 12px; margin-top: 20px;">
        <h2 style="color: #003366; margin-bottom: 15px;">🔍 Pump Recommendations</h2>
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="color: #004080; margin-bottom: 10px;">Your Requirements:</h3>
          <p><strong>Head:</strong> ${Math.round(head)} ft | <strong>Flow:</strong> ${flowLPM} LPM | <strong>HP:</strong> ~${hp} | <strong>Voltage:</strong> ${voltage}V</p>
        </div>
    `;

    if (matches.length > 0) {
      html += '<div style="background: white; padding: 15px; border-radius: 8px;">';
      html += '<h3 style="color: #004080; margin-bottom: 15px;">🎯 Best Matches:</h3>';
      
      // Pre-define compatibility configs
      const compatibilityConfig = (score) => {
        if (score >= 80) return { color: '#2e7d32', badge: '🟢 Excellent Match' };
        if (score >= 60) return { color: '#f57c00', badge: '🟡 Good Match' };
        if (score >= 40) return { color: '#f9a825', badge: '🟠 Fair Match' };
        return { color: '#d32f2f', badge: '🔴 Basic Match' };
      };
      
      // Build HTML efficiently
      matches.forEach((pump, index) => {
        const config = compatibilityConfig(pump.compatibility);
        const isBestMatch = index === 0;
        
        html += `
          <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: ${isBestMatch ? '#f0f8ff' : '#fff'};">
            <h4 style="color: #003366; margin-bottom: 8px;">${index + 1}. ${pump.model}${isBestMatch ? ' ⭐ (Best Match)' : ''}</h4>
            <p><strong>Product Code:</strong> ${pump.productCode}</p>
            <p><strong>Series:</strong> ${pump.series} | <strong>HP:</strong> ${pump.hp} | <strong>Power:</strong> ${pump.powerKw}</p>
            <p><strong>Head:</strong> ${Math.round(pump.headMax)} ft | <strong>Flow:</strong> ${Math.round(pump.flowMax/60)} LPM</p>
            <p><strong>Voltage:</strong> ${pump.voltage} | <strong>Application:</strong> ${pump.application}</p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: ${config.color}; font-weight: bold; font-size: 1.1em;">${config.badge}</span>
                <span style="color: ${config.color}; font-weight: bold;">${pump.compatibility}%</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.9em;">
                <span>Head: ${pump.headScore}%</span>
                <span>Flow: ${pump.flowScore}%</span>
                <span>HP: ${pump.hpScore}%</span>
                <span>Voltage: ${pump.voltageScore}%</span>
              </div>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    } else {
      html += `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px;">
          <h3 style="color: #856404;">⚠️ No Exact Matches Found</h3>
          <p style="color: #856404;">We couldn't find pumps that exactly match your requirements. Consider:</p>
          <ul style="color: #856404;">
            <li>Adjusting your flow or head requirements</li>
            <li>Contacting our technical support for custom solutions</li>
            <li>Using a pump with higher specifications</li>
          </ul>
        </div>
      `;
    }

    html += `
      <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-top: 15px; font-size: 0.9em; color: #666;">
        <p><em>💡 Recommendations based on your inputs and Havells pump specifications.</em></p>
      </div>
    </div>
    `;

    return html;
  }

  // 📝 Event Listeners
  if (simpleBtn) simpleBtn.onclick = () => setMode('simple');
  if (advancedBtn) advancedBtn.onclick = () => setMode('advanced');

  // Add change listeners to remove error indicators when user selects
  function addErrorRemovalListeners() {
    // Use event delegation on the form to handle dynamically created selects
    if (form) {
      form.addEventListener('change', function(e) {
        if (e.target.tagName === 'SELECT' && e.target.value && e.target.value !== '') {
          showFieldError(e.target, false);
        }
      });
      
      form.addEventListener('input', function(e) {
        if (e.target.type === 'number' && e.target.value && e.target.value !== '' && !isNaN(parseFloat(e.target.value))) {
          const existingError = e.target.parentElement.querySelector('.field-error-indicator');
          if (existingError) existingError.remove();
          e.target.style.border = '';
          e.target.style.borderRadius = '';
        }
      });
    }
  }

  if (sourceSelect) sourceSelect.addEventListener('change', toggleWaterLevel);
  if (deliverySelect) deliverySelect.addEventListener('change', toggleCustomHeight);
  
  // Initialize error removal listeners
  addErrorRemovalListeners();

  if (purposeSelect) purposeSelect.addEventListener('change', filterLocationByPurpose);
  if (locationSelect) locationSelect.addEventListener('change', filterByLocation);

  // Function to show/hide error indicator for a select field
  function showFieldError(selectElement, show) {
    if (!selectElement) return;
    
    // Remove existing error indicator
    const existingError = selectElement.parentElement.querySelector('.field-error-indicator');
    if (existingError) {
      existingError.remove();
    }
    
    if (show) {
      // Create error indicator
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error-indicator';
      errorDiv.style.cssText = `
        background-color: #ff4444;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 8px;
        font-size: 0.9em;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      errorDiv.textContent = 'Select option in this field (इस फ़ील्ड में विकल्प चुनें)';
      
      // Insert before the select element
      selectElement.parentElement.insertBefore(errorDiv, selectElement);
      
      // Add red border to select
      selectElement.style.border = '2px solid #ff4444';
      selectElement.style.borderRadius = '4px';
    } else {
      // Remove red border
      selectElement.style.border = '';
      selectElement.style.borderRadius = '';
    }
  }

  // Function to validate all visible required fields
  function validateForm() {
    const errors = [];
    const isSimple = simpleMode && simpleMode.style.display !== 'none';
    
    // Get all visible select elements in the active mode
    const activeMode = isSimple ? simpleMode : advancedMode;
    const allSelects = activeMode ? activeMode.querySelectorAll('select') : form.querySelectorAll('select');
    
    // Clear all previous errors
    document.querySelectorAll('.field-error-indicator').forEach(el => el.remove());
    form.querySelectorAll('select').forEach(sel => {
      sel.style.border = '';
      sel.style.borderRadius = '';
    });
    
    // Check each visible select field
    allSelects.forEach(select => {
      // Skip if hidden
      if (select.offsetParent === null || select.style.display === 'none') {
        return;
      }
      
      // Skip custom height if not shown
      if (select.name === 'customHeight' && (!heightDropdownBox || heightDropdownBox.style.display === 'none')) {
        return;
      }
      
      // Skip construction source if not shown (but check if it IS shown)
      if (select.id === 'constructionSourceSelect') {
        if (!constructionSourceSelect || constructionSourceSelect.style.display === 'none') {
          return;
        }
        // If construction source IS visible, validate it
      }
      
      // Skip water level if hidden (pressure mode)
      if (select.name === 'waterLevel' && (!waterLevelSelect || waterLevelSelect.style.display === 'none')) {
        return;
      }
      
      // Skip usage if hidden (pressure mode)
      if (select.name === 'usage' && (!usageSelect || usageSelect.style.display === 'none')) {
        return;
      }
      
      // Skip location if hidden (construction mode)
      if (select.name === 'location' && (!locationSelect || locationSelect.style.display === 'none')) {
        return;
      }
      
      // Check if field has empty value - read directly from DOM
      const value = select.value || '';
      if (value === '' || value === null || value === undefined) {
        // Get label text
        let labelText = 'Field';
        const label = select.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
          labelText = label.textContent.split('(')[0].trim();
        } else if (select.id) {
          labelText = select.id;
        } else if (select.name) {
          labelText = select.name;
        }
        
        errors.push({ field: select.name || select.id, label: labelText, element: select });
        showFieldError(select, true);
      } else {
        showFieldError(select, false);
      }
    });
    
    // Also validate number inputs in advanced mode
    if (!isSimple && advancedMode) {
      const numberInputs = advancedMode.querySelectorAll('input[type="number"]');
      numberInputs.forEach(input => {
        if (input.offsetParent !== null && input.style.display !== 'none') {
          const value = input.value || '';
          if (value === '' || value === null || value === undefined || isNaN(parseFloat(value))) {
            let labelText = 'Field';
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
              labelText = label.textContent.split('(')[0].trim();
            }
            errors.push({ field: input.name || input.id, label: labelText, element: input });
            
            // Show error for input too
            const existingError = input.parentElement.querySelector('.field-error-indicator');
            if (existingError) existingError.remove();
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error-indicator';
            errorDiv.style.cssText = `
              background-color: #ff4444;
              color: white;
              padding: 8px 12px;
              border-radius: 4px;
              margin-bottom: 8px;
              font-size: 0.9em;
              font-weight: bold;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            errorDiv.textContent = 'Enter value in this field (इस फ़ील्ड में मान दर्ज करें)';
            input.parentElement.insertBefore(errorDiv, input);
            input.style.border = '2px solid #ff4444';
            input.style.borderRadius = '4px';
          }
        }
      });
    }
    
    return errors;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate all fields
      const errors = validateForm();
      
      if (errors.length > 0) {
        // Scroll to first error
        if (errors[0].element) {
          errors[0].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      // Get form data after validation passes
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Also get values directly from DOM to ensure we have all values
      const isSimple = simpleMode && simpleMode.style.display !== 'none';
      const activeMode = isSimple ? simpleMode : advancedMode;
      const allSelects = activeMode ? activeMode.querySelectorAll('select') : form.querySelectorAll('select');
      
      allSelects.forEach(select => {
        if (select.offsetParent !== null && select.style.display !== 'none') {
          if (select.value) {
            data[select.name || select.id] = select.value;
          }
        }
      });
      
      // Also get input values
      const allInputs = activeMode ? activeMode.querySelectorAll('input[type="number"]') : form.querySelectorAll('input[type="number"]');
      allInputs.forEach(input => {
        if (input.offsetParent !== null && input.style.display !== 'none') {
          if (input.value) {
            data[input.name || input.id] = input.value;
          }
        }
      });
      
      // Determine mode for saving
      const currentMode = simpleMode && simpleMode.style.display !== 'none' ? 'simple' : 'advanced';
      
      // Save to database before getting recommendation
      try {
        const selectionId = await pumpDB.saveSelection({
          ...data,
          mode: currentMode,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        
        console.log('Selection saved with ID:', selectionId);
        
        // Get recommendation and save it
        const recommendations = await getRecommendation(data);
        if (recommendations && selectionId) {
          await pumpDB.saveRecommendation(selectionId, recommendations);
        }
      } catch (error) {
        console.error('Error saving to database:', error);
        // Continue with recommendation even if database save fails
        await getRecommendation(data);
      }
    });

    const resetBtn = form.querySelector('button[type="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Allow form.reset() to run first, then blank out all selects/fields
        setTimeout(() => {
          // Clear recommendations
          if (resultBox) {
            resultBox.innerHTML = '';
            resultBox.style.display = 'none';
          }

          // Restore delivery to original (non-faucet)
          if (deliveryLabel) deliveryLabel.textContent = 'Where do you want the water to reach (पानी कहाँ तक पहुंचाना है)';
          if (deliverySelect) {
            deliverySelect.innerHTML = `
              <option value="">Select delivery location (पानी पहुंचाने की जगह चुनें)</option>
              <option value="ground">Ground level (जमीन स्तर)</option>
              <option value="floor1">1st floor (~10 ft) (पहली मंजिल)</option>
              <option value="floor2">2nd floor (~20 ft) (दूसरी मंजिल)</option>
              <option value="floor3">3rd floor (~30 ft) (तीसरी मंजिल)</option>
              <option value="floor4">4th floor (~40 ft) (चौथी मंजिल)</option>
              <option value="custom">Above 4th floor (चौथी मंजिल से ऊपर)</option>
            `;
            deliverySelect.name = 'delivery';
          }

          // Show usage and water level sections
          if (usageSelect) usageSelect.style.display = 'block';
          if (usageLabel) usageLabel.style.display = 'block';
          if (waterLevelSelect) waterLevelSelect.style.display = 'block';
          if (waterLevelLabel) waterLevelLabel.style.display = 'block';
          if (heightDropdownBox) heightDropdownBox.style.display = 'none';

          // Blank out all selects in the form (no selection)
          const allSelects = form.querySelectorAll('select');
          allSelects.forEach(sel => {
            try {
              sel.selectedIndex = -1; // no selection
            } catch (_) {
              sel.value = '';
            }
          });

          console.log('Form reset - all selections cleared without reload');
        }, 10);
      });
    }
  }

  // 🚀 Initial Setup
  if (simpleMode) setMode('simple');
  if (purposeSelect) purposeSelect.dispatchEvent(new Event('change'));
  if (locationSelect) locationSelect.dispatchEvent(new Event('change'));
  if (sourceSelect) sourceSelect.dispatchEvent(new Event('change'));
  if (deliverySelect) deliverySelect.dispatchEvent(new Event('change'));
  console.log('Initial setup complete'); // Debug
  
  // Add event listeners for pump stages toggle
  if (purposeSelect) purposeSelect.addEventListener('change', togglePumpStages);
  if (locationSelect) locationSelect.addEventListener('change', togglePumpStages);
});