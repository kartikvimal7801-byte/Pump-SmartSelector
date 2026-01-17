document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('wealthForm');
  const checkBtn = document.getElementById('checkBtn');
  const videoBtn = document.getElementById('videoBtn');
  const installBtn = document.getElementById('installBtn');
  const problemSection = document.getElementById('problemSection');
  const videoSection = document.getElementById('videoSection');
  const installSection = document.getElementById('installSection');
  const problemSelect = document.getElementById('problemSelect');
  const pumpTypeSelect = document.getElementById('pumpTypeSelect');
  const solutionBox = document.getElementById('solutionBox');
  const resultBox = document.getElementById('resultBox');
  const videoBox = document.getElementById('videoBox');
  const pumpTypeGrid = document.getElementById('pumpTypeGrid');
  const pumpTypeHidden = document.getElementById('pumpTypeDiagnosticSelect');
  const installImageBox = document.getElementById('installImageBox');

  const diagnosticMap = {
    "Pump does not deliver water (पंप पानी नहीं देता)": [1,3,6,16,22,47,48,9,10,49],
    "Low discharge (पंप का डिस्चार्ज कम है)": [6,16,22,47,48,9,49],
    "Insufficient pressure delivered (पानी का प्रेशर कम है)": [29,67,50,55],
    "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)": [2,3,5,10,9,48,47,1],
    "Pump drawing more current (पंप ज़्यादा करंट खींच रहा है)": [50,22,47],
    "Pump is tripping (पंप ट्रिप कर रहा है)": [50,51,17,47,56,57],
    "Motor winding burn (मोटर की वाइंडिंग जल गई है)": [58,59,60,61,62,63,64,65],
    "Pump creates noise (पंप शोर करता है)": [51,52,53,54,55,56,57,68,69],
    "Pump overheats (पंप अधिक गर्म हो जाता है)": [22,16,51,52,53,56,55,68]
  };

  const causeDescriptions = {
    1: "Pump not primed (पंप में पानी नहीं भरा है)", 2: "Suction pipe not filled with water (सक्शन पाइप में पानी नहीं है)", 3: "Suction lift too high (पानी की गहराई ज़मीन से 18 फीट से ज़्यादा है)",
    4: "Low suction pressure margin (कम सक्शन दबाव मार्जिन)", 5: "Leakage in suction line (सक्शन लाइन में लीकेज है)", 6: "Air pocket in suction line (सक्शन लाइन में लीकेज है)",
    7: "Air leaks in suction line (सक्शन लाइन में हवा का लीकेज )", 8: "Air leaks through stuffing box (स्टफिंग बॉक्स के माध्यम से हवा का लीकेज )", 9: "Pump NRV blocked (पंप की एनआरवी ब्लॉक है)",
    10: "Suction pipe not submerged in water (सक्शन पाइप पानी में डूबा नहीं है)", 11: "Water seal pipe plugged (वॉटर सील पाइप बंद)", 12: "Seal cage misaligned (सील केज गलत संरेखित)",
    13: "Pump speed too low (पंप की गति बहुत कम है)", 14: "Pump speed too high (पंप की गति बहुत अधिक है)", 15: "Wrong rotation direction (गलत घूर्णन दिशा)",
    16: "Water delivery too high (वॉटर लेवल से पानी फेंकने की ऊँचाई नेमप्लेट में दी गई हेड रेंज से ज़्यादा है)", 17: "Water delivery too high (पानी फेंकने की ऊँचाई नेम प्लेट की हेड रेंज से ज़्यादा है)", 18: "Liquid density mismatch (तरल घनत्व का मेल नहीं)",
    19: "Liquid viscosity mismatch (तरल चिपचिपाहट का मेल नहीं)", 20: "Very low capacity operation (बहुत कम क्षमता संचालन)", 21: "Unsuitable parallel pump operation (अनुपयुक्त समानांतर पंप संचालन)",
    22: "Pump jam due to dirt or fan not rotating (केसिंग में मिट्टी होने की वजह से या फैन के न घूमने के कारण पंप जाम है)", 23: "Pump misalignment (पंप गलत संरेखण)", 24: "Weak foundation (कमजोर नींव)",
    25: "Bent shaft (मुड़ी हुई शाफ्ट)", 26: "Rubbing parts (रगड़ने वाले भाग)", 27: "Worn bearings (घिसे हुए बेयरिंग)", 28: "Worn wearing rings (घिसे हुए वियरिंग रिंग्स)",
    29: "Damaged impeller (खराब इम्पेलर)", 30: "Leaky casing gasket (लीकी केसिंग गैस्केट)", 31: "Worn shaft sleeves (घिसे हुए शाफ्ट स्लीव्स)",
    32: "Improper packing (अनुचित पैकिंग)", 33: "Wrong packing type (गलत पैकिंग प्रकार)", 34: "Off-center shaft (केंद्र से हटी हुई शाफ्ट)",
    35: "Rotor imbalance (रोटर असंतुलन)", 36: "Overtight gland (अत्यधिक कसा हुआ ग्लैंड)", 37: "No cooling liquid (कोई शीतलन तरल नहीं)",
    38: "Stuffing box clearance too large (स्टफिंग बॉक्स क्लीयरेंस बहुत बड़ा)", 39: "Dirty sealing liquid (गंदा सीलिंग तरल)", 40: "Excessive thrust (अत्यधिक थ्रस्ट)",
    41: "Overgreased or overheated bearings (अत्यधिक ग्रीस या गर्म बेयरिंग)", 42: "Lack of lubrication (स्नेहन की कमी)",
    43: "Improper bearing installation (अनुचित बेयरिंग स्थापना)", 44: "Dirty bearings (गंदे बेयरिंग)", 45: "Rusty bearings (जंग लगे बेयरिंग)",
      46: "Condensation in bearing housing (बेयरिंग हाउसिंग में संघनन)", 47: "Pump RPM too low due to weak capacitor or low voltage (लो वोल्टेज या वीक कैपेसिटर के कारण पंप का आरपीएम कम है)",
      48: "Leakage from Mechanical seal (मैकेनिकल सील से लीकेज है)", 49: "Delivery pipe size more than 1 inch (डिलीवरी पाइप का साइज़ 1 इंच से अधिक है)", 50: ' Pump running with dirty water (पंप गंदे पानी के साथ चल रहा है)', 51: 'Dry running of pump (पंप ड्राई चल रहा है)',
      52: "Damaged bearings (खराब बेयरिंग)", 53: "Pump installed in closed pit or near to wall (पंप बंद गड्ढे में या दीवार के पास लगा है)", 54: "Loose wire connection (ढीला वायर कनेक्शन)", 55: "delivery pipe size less than 1/2 inch (डिलीवरी पाइप का साइज़ आधा इंच से कम है)", 56: "Pump running with hot water (गर्म पानी के साथ पंप चल रहा है)",
       57: "Low or high voltage (180V से कम या 260V से ज़्यादा पर पंप चल रहा है)",
       58: "Motor heat due to pump jam (पंप जाम होने से मोटर गर्म)", 59: "Motor heat due to high voltage (हाई वोल्टेज से मोटर गर्म)", 60: "Motor heat due to dry running (ड्राई रनिंग से मोटर गर्म)", 61: "Motor heat due to hot water (गर्म पानी से मोटर गर्म)", 62: "Motor heat due to dirty water (गंदे पानी से मोटर गर्म)", 63: "Water ingress in motor body from mechanical seal (मैकेनिकल सील से मोटर में पानी घुसा)", 64: "Water ingress in motor body from terminal box (टर्मिनल बॉक्स से मोटर में पानी घुसा)",       65: "Water ingress in motor body due to pump submerged in water (पंप पानी में डूबा होने से मोटर में पानी घुसा)",
      66: "Foot valve was not used in suction line (सक्शन लाइन में फुट वाल्व नहीं लगाया गया)",
      67: "Delivery pipe size is more than the pipe size given in name plate (डिलीवरी पाइप का साइज़ नेम प्लेट में दिए गए पाइप साइज़ से अधिक है)",
      68: "Delivery pipe size is less than the pipe size given in name plate (डिलीवरी पाइप का साइज़ नेम प्लेट में दिए गए पाइप साइज़ से कम है)",
      69: "low voltage or high voltage than name plate specifications (नेम प्लेट के अनुसार कम वोल्टेज या हाई वोल्टेज है)",
      70: "Pump jam due to sand (रेत के कारण पंप जाम है)",
      71: "Motor not filled with water (मोटर में पानी नहीं भरा है)",
      72: "Wrong setting of pressure switch (प्रेशर स्विच की गलत सेटिंग)",
      73: "Total pipe length is more (कुल पाइप लंबाई अधिक है)",
      74: "Pipeline connection is wrong (पाइपलाइन सुधार गलत है)",
      75: "Faucet Pressure rating is wrong (नल का प्रेशर रेटिंग गलत है)",
      76: "Low HP rating Pump Selected (कम HP रेटिंग वाला पंप चुना गया है)",
      77: "Line pressure is not correct, check pressure setting (लाइन प्रेशर सही नहीं है, प्रेशर सेटिंग जांचें)",
      78: "Float switch is faulty or not installed correctly (फ्लोट स्विच खराब है या सही तरीके से स्थापित नहीं है)",
      79: "Y Strainer installation is wrong- upside (Y स्ट्रेनर स्थापना गलत है- उल्टा)",
      80: "Suction bend is block (सक्शन बेंड ब्लॉक है)",
      81: "Wrong installation of suction bend -down side strainer (सक्शन बेंड की गलत स्थापना - नीचे की तरफ स्ट्रेनर)",
      82: "Pump not placed horizontal inside water (पंप पानी के अंदर क्षैतिज रूप से नहीं रखा गया है)",
      83: "Wrong model selection (गलत मॉडल चयन)",
      84: "Pump is running with slurry (पंप स्लरी के साथ चल रहा है)",
      85: "Pump not fully submerged inside water (पंप पानी के अंदर पूरी तरह से डूबा नहीं है)",
      86: "Installation is not correct (स्थापना सही नहीं है)",
      87: "Install the pump with delivery pipe line coming from over head tank (ओवर हेड टैंक से आने वाली डिलीवरी पाइप लाइन के साथ पंप स्थापित करें)",
      88: "Pump should be installed in horizontal position only (पंप को केवल क्षैतिज स्थिति में स्थापित करना चाहिए)",
      89: "Check switch selection -ON/OFF/ AUTO for correctness (स्विच चयन -ON/OFF/AUTO की शुद्धता जांचें)",
      90: "Flow switch installation is wrong (फ्लो स्विच स्थापना गलत है)",
      91: "Change switch selection for speed and high discharge (गति और उच्च डिस्चार्ज के लिए स्विच चयन बदलें)",
      92: "No water in suction line (सक्शन लाइन में पानी नहीं है)",
      93: "Pump wrong installation (पंप गलत स्थापना)",
      94: "Impeller Jam (इम्पेलर जाम)",
      95: "Float switch operation is not correct (फ्लोट स्विच संचालन सही नहीं है)",
      96: "Bottom strainer is block (बॉटम स्ट्रेनर ब्लॉक है)"
  };

  const causeSolutions = {
    1: "Fill pump with water before starting (पंप शुरू करने से पहले पानी भरें)",
    2: "Fill suction pipe completely (सक्शन पाइप को पूरी तरह भरें)",
    3: "Reduce suction lift to under 18 feet (पानी की गहराई 18 फीट से कम करें)",
    4: "Check and increase suction pressure (सक्शन दबाव जांचें और बढ़ाएं)",
    5: "Correct the leakage in suction line (सक्शन लाइन में लीकेज को ठीक करें)",
    6: "Fix air leaks in suction line (सक्शन लाइन में लीकेज ठीक करें)",
    7: "Seal all air leaks in suction line (सक्शन लाइन में सभी हवा के लीकेज  को सील करें)",
    8: "Replace or adjust stuffing box (स्टफिंग बॉक्स बदलें या समायोजित करें)",
    9: "Clean or Replace pump NRV (पंप एनआरवी को साफ करें या बदलें)",
    10: "Submerge suction pipe in water (सक्शन पाइप पानी में डूबा होना चाहिए)",
    11: "Clean water seal pipe (वॉटर सील पाइप साफ करें)",
    12: "Realign seal cage (सील केज को सही संरेखित करें)",
    13: "Increase pump speed (पंप की गति बढ़ाएं)",
    14: "Reduce pump speed (पंप की गति कम करें)",
    15: "Correct rotation direction (घूर्णन दिशा सही करें)",
    16: "Reduce system head or use higher capacity pump (पानी फेंकने की ऊँचाई कम करें या अधिक क्षमता वाला पंप उपयोग करें)",
    17: "Operate the pump within the head range specified on the nameplate (पंप को नेम प्लेट की हेड रेंज के अंदर ही चलाएँ)",
    18: "Use correct liquid density (सही तरल घनत्व उपयोग करें)",
    19: "Use correct liquid viscosity (सही तरल चिपचिपाहट उपयोग करें)",
    20: "Increase pump capacity (पंप की क्षमता बढ़ाएं)",
    21: "Adjust parallel pump operation (समानांतर पंप संचालन समायोजित करें)",
    22: "Remove obstruction from pump or free the pump (केसिंग खोलकर मिट्टी साफ करें और पंप को फ्री करें)",
    23: "Realign pump components (पंप के घटकों को सही संरेखित करें)",
    24: "Strengthen foundation (नींव मजबूत करें)",
    25: "Replace bent shaft (मुड़ी हुई शाफ्ट बदलें)",
    26: "Fix rubbing parts (रगड़ने वाले भाग ठीक करें)",
    27: "Replace worn bearings (घिसे हुए बेयरिंग बदलें)",
    28: "Replace worn wearing rings (घिसे हुए वियरिंग रिंग्स बदलें)",
    29: "Replace damaged impeller (खराब इम्पेलर बदलें)",
    30: "Replace leaky casing gasket (लीकी केसिंग गैस्केट बदलें)",
    31: "Replace worn shaft sleeves (घिसे हुए शाफ्ट स्लीव्स बदलें)",
    32: "Adjust packing properly (पैकिंग को सही तरीके से समायोजित करें)",
    33: "Use correct packing type (सही पैकिंग प्रकार उपयोग करें)",
    34: "Center the shaft (शाफ्ट को केंद्रित करें)",
    35: "Balance the rotor (रोटर को संतुलित करें)",
    36: "Loosen gland (ग्लैंड को ढीला करें)",
    37: "Add cooling liquid (शीतलन तरल जोड़ें)",
    38: "Adjust stuffing box clearance (स्टफिंग बॉक्स क्लीयरेंस समायोजित करें)",
    39: "Clean sealing liquid (सीलिंग तरल साफ करें)",
    40: "Reduce thrust load (थ्रस्ट लोड कम करें)",
    41: "Clean and regrease bearings (बेयरिंग साफ करें और फिर से ग्रीस लगाएं)",
    42: "Add proper lubrication (उचित स्नेहन जोड़ें)",
    43: "Reinstall bearings correctly (बेयरिंग को सही तरीके से स्थापित करें)",
    44: "Clean bearings (बेयरिंग साफ करें)",
    45: "Replace rusty bearings (जंग लगे बेयरिंग बदलें)",
      46: "Remove condensation from bearing housing (बेयरिंग हाउसिंग से संघनन हटाएं)",
      47: "Increase pump's RPM by changning the capacitor or increase the voltage(कैपेसिटर चेंज करके या वोल्टेज बढ़ाकर पंप का आरपीएम बढ़ाएँ)",
      48: "Replace mechanical seal (मैकेनिकल सील बदलें)",
      49: "Use 1 inch or smaller delivery pipe (1 इंच या छोटा डिलीवरी पाइप उपयोग करें)",
      50: "Run the pump in clean water (साफ पानी में पंप चलाएं)",
      51: "Run the pump with water (पंप पानी के साथ ही चलाएँ)",
      52: "Replace damaged bearings (खराब बेयरिंग बदलें)",
      53: "Install pump in open area with proper ventilation (पंप को खुले क्षेत्र में उचित वेंटिलेशन के साथ स्थापित करें)",
      54: "Tighten all electrical connections (सभी बिजली के कनेक्शन कसें)",
      55: "Use larger delivery pipe size (बड़ा डिलीवरी पाइप साइज़ उपयोग करें)",
      56: "Use cold water or allow water to cool down (ठंडा पानी उपयोग करें या पानी को ठंडा होने दें)",
       57: "Operate the pump only within 180V to 260V range (180 वोल्टेज या 260 वोल्टेज के अंदर ही पंप चलाएँ)",
       58: "Remove pump jam and clean pump casing (पंप जाम हटाएं और केसिंग साफ करें)", 59: "Use voltage stabilizer or correct voltage supply (वोल्टेज स्टेबिलाइजर या सही वोल्टेज उपयोग करें)", 60: "Always run pump with water (हमेशा पंप पानी के साथ चलाएं)", 61: "Use cold water or allow water to cool down (ठंडा पानी उपयोग करें या पानी को ठंडा होने दें)", 62: "Use clean water for pump operation (पंप के लिए साफ पानी उपयोग करें)", 63: "Replace mechanical seal and check motor (मैकेनिकल सील बदलें और मोटर जांचें)", 64: "Seal terminal box properly (टर्मिनल बॉक्स को ठीक से सील करें या बदलें)",        65: "Install pump above water level or use submersible pump (पंप को पानी के स्तर से ऊपर लगाएं या सबमर्सिबल पंप उपयोग करें)",
      66: "Install foot valve in suction line (सक्शन लाइन में फुट वाल्व लगाएं)",
      67: "Use delivery pipe size as per name plate specifications (नेम प्लेट के अनुसार डिलीवरी पाइप साइज़ उपयोग करें)",
      68: "Use delivery pipe size as per name plate specifications (नेम प्लेट के अनुसार डिलीवरी पाइप साइज़ उपयोग करें)",
      69: "Check and correct the supplyvoltage (वोल्टेज उपयोग करें)",
      70: "Remove sand and free the impeller (रेत हटाएं और इम्पेलर को फ्री करें)",
      71: "Fill the motor with clean water as per specification (स्पेसिफिकेशन के अनुसार मोटर में साफ पानी भरें)",
      72: "Correct the pressure switch setting (प्रेशर स्विच की सेटिंग सही करें)",
      73: "Reduce total pipe length (कुल पाइप लंबाई कम करें)",
      74: "Correct the pipeline installation (पाइपलाइन स्थापना सही करें)",
      75: "Use correct faucet pressure rating (सही नल प्रेशर रेटिंग उपयोग करें)",
      76: "Select pump with higher HP rating (अधिक HP रेटिंग वाला पंप चुनें)",
      77: "Correct the line pressure setting (लाइन प्रेशर सेटिंग सही करें)",
      78: "Replace or correctly install the float switch (फ्लोट स्विच बदलें या सही तरीके से स्थापित करें)",
      79: "Install Y Strainer correctly (Y स्ट्रेनर को सही तरीके से स्थापित करें)",
      80: "Clean or unblock the suction bend (सक्शन बेंड को साफ करें या अनब्लॉक करें)",
      81: "Install suction bend correctly with strainer on down side (सक्शन बेंड को नीचे की तरफ स्ट्रेनर के साथ सही तरीके से स्थापित करें)",
      82: "Place pump horizontally inside water (पंप को पानी के अंदर क्षैतिज रूप से रखें)",
      83: "Select correct pump model (सही पंप मॉडल चुनें)",
      84: "Run pump with clean water, not slurry (पंप को स्लरी के बजाय साफ पानी के साथ चलाएं)",
      85: "Fully submerge pump inside water (पंप को पानी के अंदर पूरी तरह से डुबोएं)",
      86: "Correct the pump installation (पंप स्थापना सही करें)",
      87: "Install pump with delivery pipe line coming from overhead tank (ओवर हेड टैंक से आने वाली डिलीवरी पाइप लाइन के साथ पंप स्थापित करें)",
      88: "Install pump in horizontal position only (पंप को केवल क्षैतिज स्थिति में स्थापित करें)",
      89: "Correct the switch selection -ON/OFF/AUTO (स्विच चयन -ON/OFF/AUTO सही करें)",
      90: "Correct the flow switch installation (फ्लो स्विच स्थापना सही करें)",
      91: "Change switch selection for speed and high discharge (गति और उच्च डिस्चार्ज के लिए स्विच चयन बदलें)",
      92: "Fill water in suction line (सक्शन लाइन में पानी भरें)",
      93: "Correct the pump installation (पंप स्थापना सही करें)",
      94: "Free the impeller or clean it (इम्पेलर को फ्री करें या साफ करें)",
      95: "Correct the float switch operation (फ्लोट स्विच संचालन सही करें)",
      96: "Clean or unblock the bottom strainer (बॉटम स्ट्रेनर को साफ करें या अनब्लॉक करें)"
  };

  // Cause animations mapping - removed all symbols
  const causeAnimations = {
    1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "",
    11: "", 12: "", 13: "", 14: "", 15: "", 16: "", 17: "", 18: "", 19: "", 20: "",
    21: "", 22: "", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "", 29: "", 30: "",
    31: "", 32: "", 33: "", 34: "", 35: "", 36: "", 37: "", 38: "", 39: "", 40: "",
    41: "", 42: "", 43: "", 44: "", 45: "", 46: "", 47: "", 48: "", 49: "", 50: "", 51:"",
     52: "", 53: "", 54: "", 55: "", 56: "", 57: "", 58: "", 59: "", 60: "", 61: "", 62: "", 63: "", 64: "", 65: "", 66: "", 67: "", 68: "", 69: "", 70: "", 71: "",
     72: "", 73: "", 74: "", 75: "", 76: "",
     77: "", 78: "",
     79: "",
     80: "", 81: "", 82: "",
     83: "", 84: "", 85: "",
     86: "", 87: "", 88: "", 89: "", 90: "",
     91: "", 92: "", 93: "",
     94: "", 95: "", 96: "",
  };

  const videoLinks = {
    mmb: "https://youtu.be/YzIg_zQh3_g?si=740pPZlXMcHnGbEf",
    pp: "https://youtu.be/YGmssQ09yF4?si=T1D7cZ1CGikS2FeN",
    bws: null,
    ow: null,
    type5: null,
    type6: null
  };

  // Pump type image selection
  if (pumpTypeGrid) {
    pumpTypeGrid.addEventListener('click', (e) => {
      const pumpItem = e.target.closest('.pump-type-item');
      if (!pumpItem) return;
      
      // Remove selection from all items
      document.querySelectorAll('.pump-type-item').forEach(item => {
        item.classList.remove('selected');
      });
      
      // Add selection to clicked item
      pumpItem.classList.add('selected');
      
      // Update hidden input value
      if (pumpTypeHidden) {
        pumpTypeHidden.value = pumpItem.dataset.value;
      }
      
      // Hide or show problems based on pump type selection
      if (problemSelect) {
        const options = Array.from(problemSelect.options);
        const problem3Option = options.find(opt => opt.text === 'Insufficient pressure delivered (पानी का प्रेशर कम है)');
        const noiseOption = options.find(opt => opt.text === 'Pump creates noise (पंप शोर करता है)');
        
        // Handle problem 8 (Pump creates noise) - hide for 3borwp/6borwp and circulatingpump
        if (noiseOption) {
          if (pumpItem.dataset.value === '3borwp' || pumpItem.dataset.value === '6borwp' || pumpItem.dataset.value === 'circulatingpump') {
            noiseOption.disabled = true;
            noiseOption.style.display = 'none';
            // If currently selected, reset selection
            if (problemSelect.value === noiseOption.value) {
              problemSelect.value = '';
            }
          } else {
            noiseOption.disabled = false;
            noiseOption.style.display = '';
          }
        }
        
        // Handle problem 3 - hide for Inline circulating pump and Dewatering pump
        if (problem3Option) {
          if (pumpItem.dataset.value === 'circulatingpump' || pumpItem.dataset.value === 'dewatering') {
            problem3Option.disabled = true;
            problem3Option.style.display = 'none';
            if (problemSelect.value === problem3Option.value) {
              problemSelect.value = '';
            }
          } else {
            problem3Option.disabled = false;
            problem3Option.style.display = '';
          }
        }
        
        // Handle problem 4 - hide for Dewatering pump
        const problem4Option = options.find(opt => opt.text === 'Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)');
        if (problem4Option) {
          if (pumpItem.dataset.value === 'dewatering') {
            problem4Option.disabled = true;
            problem4Option.style.display = 'none';
            if (problemSelect.value === problem4Option.value) {
              problemSelect.value = '';
            }
          } else {
            problem4Option.disabled = false;
            problem4Option.style.display = '';
          }
        }
        
        // Handle problem 6 - hide for Inline circulating pump and Dewatering pump
        const problem6Option = options.find(opt => opt.text === 'Pump is tripping (पंप ट्रिप कर रहा है)');
        if (problem6Option) {
          if (pumpItem.dataset.value === 'circulatingpump' || pumpItem.dataset.value === 'dewatering') {
            problem6Option.disabled = true;
            problem6Option.style.display = 'none';
            if (problemSelect.value === problem6Option.value) {
              problemSelect.value = '';
            }
          } else {
            problem6Option.disabled = false;
            problem6Option.style.display = '';
          }
        }
      }

      // Refresh causes if a problem is already selected
      if (problemSelect.value) {
        problemSelect.dispatchEvent(new Event('change'));
      }
    });
  }

  // Toggle sections
  checkBtn.addEventListener('click', () => {
    checkBtn.classList.add('active');
    videoBtn.classList.remove('active');
    installBtn.classList.remove('active');
    problemSection.style.display = 'block';
    videoSection.style.display = 'none';
    installSection.style.display = 'none';
    videoBox.innerHTML = "";
    pumpTypeSelect.value = "";
  });

  videoBtn.addEventListener('click', () => {
    videoBtn.classList.add('active');
    checkBtn.classList.remove('active');
    installBtn.classList.remove('active');
    problemSection.style.display = 'none';
    videoSection.style.display = 'block';
    installSection.style.display = 'none';
    solutionBox.innerHTML = "";
    problemSelect.value = "";
  });

  // Toggle to Installation guide
  installBtn.addEventListener('click', () => {
    installBtn.classList.add('active');
    checkBtn.classList.remove('active');
    videoBtn.classList.remove('active');
    problemSection.style.display = 'none';
    videoSection.style.display = 'none';
    installSection.style.display = 'block';
    solutionBox.innerHTML = "";
    resultBox.innerHTML = "";
    videoBox.innerHTML = "";
    if (installImageBox) installImageBox.innerHTML = "";
    problemSelect.value = "";
    pumpTypeSelect.value = "";
  });

  // Installation headings click handlers
  document.querySelectorAll('.install-heading').forEach(h => {
    h.addEventListener('click', () => {
      const img = h.getAttribute('data-image');
      const size = h.getAttribute('data-size');
      if (!installImageBox) return;
      if (img) {
        const maxWidth = size === 'small' ? '90%' : '95%';
        const maxHeight = size === 'small' ? '90vh' : '60vh';
        installImageBox.innerHTML = `
          <div style="display:flex; justify-content:center; align-items:center;">
            <img src="${img}" alt="Installation" style="max-width:${maxWidth}; max-height:${maxHeight}; object-fit:contain; display:block; margin:0 auto; border:1px solid #ddd; border-radius:8px;" />
          </div>
        `;
      } else {
        installImageBox.innerHTML = `<div style="padding:20px; background:#f8f9fa; border:1px dashed #bbb; border-radius:8px; color:#666;">Image coming soon</div>`;
      }
      // Visual feedback: mimic cause-item selection style
      document.querySelectorAll('.install-heading').forEach(x => {
        x.classList.remove('selected');
        x.style.backgroundColor = '#f8f9f9';
      });
      h.classList.add('selected');
      h.style.backgroundColor = '#e3f2fd';
    });
  });

  // Show causes when problem is selected
  problemSelect.addEventListener('change', () => {
    const selected = problemSelect.value;
    let causes = diagnosticMap[selected];
    if (!causes) {
      solutionBox.innerHTML = "";
      return;
    }

    // Get selected pump type
    const selectedPumpType = pumpTypeHidden?.value || '';
    
    // Prevent showing causes for problems 3, 6, and 8 if Inline circulating pump is selected
    if (selectedPumpType === 'circulatingpump') {
      if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)" ||
          selected === "Pump is tripping (पंप ट्रिप कर रहा है)" ||
          selected === "Pump creates noise (पंप शोर करता है)") {
        solutionBox.innerHTML = "";
        return;
      }
    }
    
    // Prevent showing causes for problems 3, 4, and 6 if Dewatering pump is selected
    if (selectedPumpType === 'dewatering') {
      if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)" ||
          selected === "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)" ||
          selected === "Pump is tripping (पंप ट्रिप कर रहा है)") {
        solutionBox.innerHTML = "";
        return;
      }
    }
    
    // Filter causes based on pump type
    if (selectedPumpType === 'centrifugale') {
      // Remove causes 9 (Pump NRV blocked) and 10 (Suction pipe not submerged)
      causes = causes.filter(causeId => causeId !== 9 && causeId !== 10);
      
      // Special handling for "Low discharge" problem
      if (selected === "Low discharge (पंप का डिस्चार्ज कम है)") {
        // Add new cause 67 (Delivery pipe size is more than the pipe size given in name plate)
        causes.push(67);
      }
      
      // Special handling for "Insufficient pressure delivered" problem
      if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)") {
        // Remove causes 50 (Pump running with dirty water) and 55 (delivery pipe size less than 1/2 inch) for centrifugal pump
        causes = causes.filter(causeId => causeId !== 50 && causeId !== 55);
        // Add cause 48 (Leakage from mechanical seal) for centrifugal pump
        causes.push(48);
      }
      
      // Special handling for "Pump is tripping" problem
      if (selected === "Pump is tripping (पंप ट्रिप कर रहा है)") {
        // Remove cause 57 (Low or high voltage) for centrifugal pump
        causes = causes.filter(causeId => causeId !== 57);
        // Add cause 69 (low voltage or high voltage than name plate specifications) for centrifugal pump
        causes.push(69);
      }
      
      // Add new cause 66 (Foot valve was not used in suction line) for relevant problems
      const problemsWithFootValveIssue = [
        "Pump does not deliver water (पंप पानी नहीं देता)",
        "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)"
      ];
      
      if (problemsWithFootValveIssue.includes(selected)) {
        causes.push(66);
      }
    }
    
    // Filter causes for shallow well pump
    if (selectedPumpType === 'shallow') {
      // Remove cause 9 (Pump NRV blocked) from all causes for shallow well pump
      causes = causes.filter(causeId => causeId !== 9);
      
      // Problem 1: Remove cause 1
      if (selected === "Pump does not deliver water (पंप पानी नहीं देता)") {
        causes = causes.filter(causeId => causeId !== 1);
      }
      // Problem 3: Remove cause 55
      else if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)") {
        causes = causes.filter(causeId => causeId !== 55);
      }
    }
    
    // Filter causes for Openwell pump
    if (selectedPumpType === 'opwell') {
      // Problem 1: Remove causes 1, 3, 48, 9, and 10 (in numerical order) and add new cause
      if (selected === "Pump does not deliver water (पंप पानी नहीं देता)") {
        causes = causes.filter(causeId => ![1, 3, 48, 9, 10].includes(causeId));
        // Add new cause for openwell pump
        causes.push(80); // Suction bend is block
      }
      // Problem 2: Remove causes 48, 9, 49 and add new cause
      else if (selected === "Low discharge (पंप का डिस्चार्ज कम है)") {
        causes = causes.filter(causeId => ![48, 9, 49].includes(causeId));
        // Add existing cause 67
        causes.push(67); // Delivery pipe size is more than the pipe size given in name plate
      }
      // Problem 3: Remove cause 55 and add new cause
      else if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)") {
        causes = causes.filter(causeId => causeId !== 55);
        // Add existing cause 73
        causes.push(73); // Total pipe length is more
      }
      // Problem 4: Remove causes 3, 9, 48, 1 and add new cause
      else if (selected === "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)") {
        causes = causes.filter(causeId => ![3, 9, 48, 1].includes(causeId));
        // Add existing cause 74
        causes.push(74); // Pipeline connection is wrong
      }
      // Problem 6: Remove cause 56 and add new causes
      else if (selected === "Pump is tripping (पंप ट्रिप कर रहा है)") {
        causes = causes.filter(causeId => causeId !== 56);
        // Add new causes for openwell pump
        causes.push(81, 71, 82); // Wrong installation of suction bend -down side strainer, No water filled in motor (cause 71), Pump not placed horizontal inside water
      }
      // Problem 7: Remove causes 60, 62
      else if (selected === "Motor winding burn (मोटर की वाइंडिंग जल गई है)") {
        causes = causes.filter(causeId => ![60, 62].includes(causeId));
      }
      // Problem 8: Remove causes 56, 57, 68
      else if (selected === "Pump creates noise (पंप शोर करता है)") {
        causes = causes.filter(causeId => ![56, 57, 68].includes(causeId));
      }
    }
    
    // Filter causes for Sewage pump
    if (selectedPumpType === 'a1sewage') {
      // Problem 1: Remove causes 1, 3, 6, 9, 49 and add cause 78
      if (selected === "Pump does not deliver water (पंप पानी नहीं देता)") {
        causes = causes.filter(causeId => ![1, 3, 6, 9, 49].includes(causeId));
        if (!causes.includes(78)) {
          causes.push(78); // Float switch is faulty or not installed correctly
        }
      }
      // Problem 2: Remove causes 6, 9, 49 and add cause 76
      else if (selected === "Low discharge (पंप का डिस्चार्ज कम है)") {
        causes = causes.filter(causeId => ![6, 9, 49].includes(causeId));
        if (!causes.includes(76)) {
          causes.push(76); // Low HP rating Pump Selected
        }
      }
      // Problem 3: Remove causes 50, 55 and add new cause
      else if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)") {
        causes = causes.filter(causeId => ![50, 55].includes(causeId));
        if (!causes.includes(83)) {
          causes.push(83); // Wrong model selection
        }
      }
      // Problem 4: Remove causes 2, 3, 5, 10, 1 and add causes 78, 70
      else if (selected === "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)") {
        causes = causes.filter(causeId => ![2, 3, 5, 10, 1].includes(causeId));
        if (!causes.includes(78)) {
          causes.push(78); // Float switch is faulty or not installed correctly
        }
        if (!causes.includes(70)) {
          causes.push(70); // Pump jam due to sand
        }
      }
      // Problem 5: Remove cause 50 and add new cause
      else if (selected === "Pump drawing more current (पंप ज़्यादा करंट खींच रहा है)") {
        causes = causes.filter(causeId => causeId !== 50);
        if (!causes.includes(84)) {
          causes.push(84); // Pump is running with slurry
        }
      }
      // Problem 6: Remove cause 50 and add new cause
      else if (selected === "Pump is tripping (पंप ट्रिप कर रहा है)") {
        causes = causes.filter(causeId => causeId !== 50);
        if (!causes.includes(84)) {
          causes.push(84); // Pump is running with slurry
        }
      }
      // Problem 7: Remove causes 62, 64, 65 and add new cause
      else if (selected === "Motor winding burn (मोटर की वाइंडिंग जल गई है)") {
        causes = causes.filter(causeId => ![62, 64, 65].includes(causeId));
        if (!causes.includes(85)) {
          causes.push(85); // Pump not fully submerged inside water
        }
      }
      // Problem 8: Remove causes 53, 55
      else if (selected === "Pump creates noise (पंप शोर करता है)") {
        causes = causes.filter(causeId => ![53, 55].includes(causeId));
      }
      // Problem 9: Remove causes 53, 55
      else if (selected === "Pump overheats (पंप अधिक गर्म हो जाता है)") {
        causes = causes.filter(causeId => ![53, 55].includes(causeId));
      }
      
      // Remove any duplicate causes for sewage pump
      causes = [...new Set(causes)];
    }
    
    // Filter causes for Inline circulating pump
    if (selectedPumpType === 'circulatingpump') {
      // Problem 1: Remove causes 1, 3, 48, 9, 10, 47 and add new causes
      if (selected === "Pump does not deliver water (पंप पानी नहीं देता)") {
        causes = causes.filter(causeId => ![1, 3, 48, 9, 10, 47].includes(causeId));
        // Add new causes for inline circulating pump
        causes.push(86, 87, 88, 89, 90); // Installation is not correct, Install the pump with delivery pipe line coming from over head tank, Pump should be installed in horizontal position only, Check switch selection -ON/OFF/AUTO for correctness, Flow switch installation is wrong
      }
      // Problem 2: Remove causes 6, 48, 9 and add new cause
      else if (selected === "Low discharge (पंप का डिस्चार्ज कम है)") {
        causes = causes.filter(causeId => ![6, 48, 9].includes(causeId));
        // Add new cause for inline circulating pump
        causes.push(91); // Change switch selection for speed and high discharge
      }
      // Problem 4: Remove causes 3, 5, 10, 48, 1 and add new causes
      else if (selected === "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)") {
        causes = causes.filter(causeId => ![3, 5, 10, 48, 1].includes(causeId));
        // Add new causes for inline circulating pump
        causes.push(92, 93); // No water in suction line, Pump wrong installation
      }
      // Problem 7: Remove causes 61, 63, 65
      else if (selected === "Motor winding burn (मोटर की वाइंडिंग जल गई है)") {
        causes = causes.filter(causeId => ![61, 63, 65].includes(causeId));
      }
      // Problem 8: Remove causes 53, 55
      else if (selected === "Pump creates noise (पंप शोर करता है)") {
        causes = causes.filter(causeId => ![53, 55].includes(causeId));
      }
      // Problem 9: Remove causes 53, 55
      else if (selected === "Pump overheats (पंप अधिक गर्म हो जाता है)") {
        causes = causes.filter(causeId => ![53, 55].includes(causeId));
      }
      
      // Remove any duplicate causes for inline circulating pump
      causes = [...new Set(causes)];
    }
    
    // Filter causes for Dewatering pump
    if (selectedPumpType === 'dewatering') {
      // Problem 1: Remove causes 1, 3, 6, 22, 48, 9, 10, 49 and add new causes
      if (selected === "Pump does not deliver water (पंप पानी नहीं देता)") {
        causes = causes.filter(causeId => ![1, 3, 6, 22, 48, 9, 10, 49].includes(causeId));
        // Add new causes for dewatering pump
        if (!causes.includes(92)) {
          causes.push(92); // No water in suction line
        }
        if (!causes.includes(94)) {
          causes.push(94); // Impeller Jam
        }
        if (!causes.includes(95)) {
          causes.push(95); // Float switch operation is not correct
        }
        if (!causes.includes(96)) {
          causes.push(96); // Bottom strainer is block
        }
      }
      // Problem 2: Remove causes 6, 22, 48, 9 and add new cause
      else if (selected === "Low discharge (पंप का डिस्चार्ज कम है)") {
        causes = causes.filter(causeId => ![6, 22, 48, 9].includes(causeId));
        // Add new cause for dewatering pump
        if (!causes.includes(96)) {
          causes.push(96); // Bottom strainer is block
        }
      }
      // Problem 7: Remove causes 63, 64, 65
      else if (selected === "Motor winding burn (मोटर की वाइंडिंग जल गई है)") {
        causes = causes.filter(causeId => ![63, 64, 65].includes(causeId));
      }
      // Problem 8: Remove causes 53, 55, 56
      else if (selected === "Pump creates noise (पंप शोर करता है)") {
        causes = causes.filter(causeId => ![53, 55, 56].includes(causeId));
      }
      // Problem 9: Remove causes 22, 53, 56, 55
      else if (selected === "Pump overheats (पंप अधिक गर्म हो जाता है)") {
        causes = causes.filter(causeId => ![22, 53, 56, 55].includes(causeId));
      }
      
      // Remove any duplicate causes for dewatering pump
      causes = [...new Set(causes)];
    }
    
    // Filter causes for single stage pressure pump and multistage booster pump
    if (selectedPumpType === 'SStage' || selectedPumpType === 'MStage') {
      // Problem 1: Remove causes 1 and 3
      if (selected === "Pump does not deliver water (पंप पानी नहीं देता)") {
        causes = causes.filter(causeId => ![1, 3].includes(causeId));
      }
      // Problem 3: Remove cause 55 and add new causes
      else if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)") {
        causes = causes.filter(causeId => causeId !== 55);
        // Add new causes for pressure pump problems
        causes.push(72, 73, 74, 75, 76, 5); // Wrong setting of pressure switch, Total pipe length is more, Pipeline correction is wrong, Faucet Pressure rating is wrong, Low HP rating Pump Selected, Leakage in suction line
      }
      // Problem 4: Remove causes 3, 1 and add new causes
      else if (selected === "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)") {
        causes = causes.filter(causeId => ![3, 1].includes(causeId));
        // Add new causes for pressure pump problems
        causes.push(77, 78); // Line pressure is not correct, Float switch is faulty or not installed correctly
      }
      // Problem 6: Remove cause 17 and add new causes
      else if (selected === "Pump is tripping (पंप ट्रिप कर रहा है)") {
        causes = causes.filter(causeId => causeId !== 17);
        // Add new causes for pressure pump problems
        causes.push(79, 72, 5); // Y Strainer installation is wrong- upside, Wrong setting of pressure switch, Leakage in suction line
      }
      // Problem 8: Remove causes 53, 55
      else if (selected === "Pump creates noise (पंप शोर करता है)") {
        causes = causes.filter(causeId => ![53, 55].includes(causeId));
      }
      // Problem 9: Remove causes 16, 53, 55
      else if (selected === "Pump overheats (पंप अधिक गर्म हो जाता है)") {
        causes = causes.filter(causeId => ![16, 53, 55].includes(causeId));
      }
    }
    
    // Filter causes for deep well jet pump
    if (selectedPumpType === 'deepwell') {
      // No specific cause filtering needed, but suction lift height will be changed to 100ft
    }
    
    // Filter causes for 3-4inch and 5-6-7-8inch borewell pumps
    if (selectedPumpType === '3borwp' || selectedPumpType === '6borwp') {
      // Replace causes 1, 3, 6, 48, 10 with cause 67 (Delivery pipe size is more than the pipe size given in name plate)
      // Keep cause 22 but it will show impeller text instead of casing text
      causes = causes.filter(causeId => ![1, 3, 6, 48, 10].includes(causeId));
      if (!causes.includes(67)) {
        causes.push(67);
      }
    }
    
    // Apply special rules for 3-4 inch and 5-6-7-8 inch borewell pumps
    if (selectedPumpType === '3borwp' || selectedPumpType === '6borwp') {
      // Ensure cause 22 (Pump jam due to dirt...) is considered across all problems
      if (!causes.includes(22)) {
        causes.push(22);
      }
      // Hide cause 49 always
      causes = causes.filter(causeId => causeId !== 49);
      // Remove cause 55 under "Insufficient pressure delivered"
      if (selected === "Insufficient pressure delivered (पानी का प्रेशर कम है)") {
        causes = causes.filter(causeId => causeId !== 55);
      }
      // Remove causes 2 and 5, add 23 under "Pump loses prime after starting"
      if (selected === "Pump loses prime after starting (पंप चालू होने के बाद पानी नहीं उठाता)") {
        causes = causes.filter(causeId => causeId !== 2 && causeId !== 5);
        if (!causes.includes(23)) {
          causes.push(23);
        }
      }
      // Under "Pump overheats" keep only up to 51 and add 71
      if (selected === "Pump overheats (पंप अधिक गर्म हो जाता है)") {
        const dryRunIndex = causes.indexOf(51);
        if (dryRunIndex !== -1) {
          causes = causes.slice(0, dryRunIndex + 1);
        }
        if (!causes.includes(71)) {
          causes.push(71);
        }
      }
      // Under "Motor winding burn" remove X-marked causes
      if (selected === "Motor winding burn (मोटर की वाइंडिंग जल गई है)") {
        const removeForMotorBurn = new Set([58, 63, 64, 65, 67]);
        causes = causes.filter(causeId => !removeForMotorBurn.has(causeId));
      }
    }

    // Remove cause 84 (Pump is running with slurry) from all pump types except sewage pump
    if (selectedPumpType !== 'a1sewage') {
      causes = causes.filter(causeId => causeId !== 84);
    }

    // Remove causes 86-96 from all pump types except where they're explicitly added
    // Causes 86-90, 91, 92-93: Only for Inline circulating pump (circulatingpump)
    // Causes 92, 94-96: Only for Dewatering pump (dewatering)
    // Cause 92: Used by both circulatingpump and dewatering
    
    // Remove causes 94-96 if not dewatering (these are dewatering-specific)
    if (selectedPumpType !== 'dewatering') {
      causes = causes.filter(causeId => ![94, 95, 96].includes(causeId));
    }
    
    // Remove causes 86-91, 93 if not circulatingpump (these are circulating pump-specific)
    if (selectedPumpType !== 'circulatingpump') {
      causes = causes.filter(causeId => ![86, 87, 88, 89, 90, 91, 93].includes(causeId));
    }
    
    // Remove cause 92 if not circulatingpump or dewatering (used by both)
    if (selectedPumpType !== 'circulatingpump' && selectedPumpType !== 'dewatering') {
      causes = causes.filter(causeId => causeId !== 92);
    }

    // Remove any duplicate causes to avoid showing the same cause twice
    causes = [...new Set(causes)];

    const list = causes.map(num => {
      // Special handling for different causes based on pump types
      let causeText = causeDescriptions[num];
      
      // Special handling for cause 3 (Suction lift too high) for different pump types
      if (num === 3 && selectedPumpType === 'shallow') {
        causeText = "Suction lift too high (पानी की गहराई ज़मीन से 28 फीट से ज़्यादा है)";
      } else if (num === 3 && selectedPumpType === 'deepwell') {
        causeText = "Suction lift too high (पानी की गहराई ज़मीन से 100 फीट से ज़्यादा है)";
      }
      
      // Special handling for cause 22 (Pump jam)
      if (num === 22) {
        if (selectedPumpType === '3borwp' || selectedPumpType === '6borwp') {
          // For borewell pumps: show dirt-only wording
          causeText = "Pump jam due to dirt (इम्पेलर में मिट्टी होने की वजह से पंप जाम है)";
        }
      }
      
      return `
        <div class="cause-item" data-cause-id="${num}" style="cursor: pointer; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; transition: background-color 0.3s; text-align: left;">
          <div class="cause-text" style="text-align: left;">${causeText}</div>
        </div>
      `;
    }).join("");
    
    solutionBox.innerHTML = `
      <h3>🔧 Click Below Possible Causes  (संभावित कारणों के लिए नीचे क्लिक करें):</h3>
      <div style="margin-top: 15px;">${list}</div>
    `;

    // Add click handlers to cause items
    solutionBox.querySelectorAll('.cause-item').forEach(item => {
      item.addEventListener('click', () => {
        const causeId = parseInt(item.dataset.causeId);
        showSolutionPopup(causeId);
      });

      // Add hover effects
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#e3f2fd';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = '#f9f9f9';
      });
    });
  });

  // Function to show solution popup
  function showSolutionPopup(causeId) {
    let cause = causeDescriptions[causeId];
    let solution = causeSolutions[causeId];
    
    // Special handling for different causes based on pump types
    if (causeId === 3) {
      const selectedPumpType = pumpTypeHidden?.value || '';
      if (selectedPumpType === 'shallow') {
        cause = "Suction lift too high (पानी की गहराई ज़मीन से 28 फीट से ज़्यादा है)";
        solution = "Reduce suction lift to under 28 feet (पानी की गहराई 28 फीट से कम करें)";
      } else if (selectedPumpType === 'deepwell') {
        cause = "Suction lift too high (पानी की गहराई ज़मीन से 100 फीट से ज़्यादा है)";
        solution = "Reduce suction lift to under 100 feet (पानी की गहराई 100 फीट से कम करें)";
      }
    }
    
    // Special handling for cause 22 (Pump jam)
    if (causeId === 22) {
      const selectedPumpType = pumpTypeHidden?.value || '';
      if (selectedPumpType === '3borwp' || selectedPumpType === '6borwp') {
        // Dirt-only wording for borewell pumps
        cause = "Pump jam due to dirt (इम्पेलर में मिट्टी होने की वजह से पंप जाम है)";
        solution = "Remove obstruction from pump or free the pump (इम्पेलर खोलकर मिट्टी साफ करें और पंप को फ्री करें)";
      }
    }
    
    if (!cause || !solution) return;

    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    popup.innerHTML = `
      <div style="text-align: right; margin-bottom: 15px;">
        <button id="closePopup" style="background: #ff4444; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 16px;">✕ Close</button>
      </div>
      <h2 style="color: #003366; margin-bottom: 20px;">🔧 Solution (समाधान)</h2>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h3 style="color: #004080; margin-bottom: 10px;">Problem (समस्या):</h3>
        <p style="margin: 0; font-size: 16px;">${cause}</p>
      </div>
      <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
        <h3 style="color: #2e7d32; margin-bottom: 10px;">Solution (समाधान):</h3>
        <p style="margin: 0; font-size: 16px; font-weight: bold;">${solution}</p>
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Close popup handlers
    const closeBtn = popup.querySelector('#closePopup');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Show video when pump type is selected
  pumpTypeSelect.addEventListener('change', () => {
    const selected = pumpTypeSelect.value;
    const link = videoLinks[selected];

    if (link) {
      videoBox.innerHTML = `
        <h3>🎥 Troubleshooting Video for ${selected.toUpperCase()}:</h3>
        <a href="${link}" target="_blank">Watch Now</a>
      `;
    } else {
      videoBox.innerHTML = `<p>📹 Video for this pump type is coming soon.</p>`;
    }
  });

  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedProblem = problemSelect.value;
    const selectedPumpType = pumpTypeHidden?.value || '';

    // Validate - check for default selections
    if (!selectedProblem || selectedProblem === '') {
      resultBox.innerHTML = `⚠️ Please select a problem (समस्या चुनें).`;
      return;
    }

    if (!selectedPumpType || selectedPumpType === '') {
      resultBox.innerHTML = `⚠️ Please select a pump type (पंप प्रकार चुनें).`;
      return;
    }

    // Save to database
    try {
      const selectedItem = document.querySelector(`[data-value="${selectedPumpType}"]`);
      const pumpName = selectedItem ? selectedItem.querySelector('.pump-name').textContent : selectedPumpType;
      
      await pumpDB.saveProblem({
        pumpType: selectedPumpType,
        pumpName: pumpName,
        problem: selectedProblem,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      
      console.log('Problem saved to database');
    } catch (error) {
      console.error('Error saving problem to database:', error);
    }

    let message = `✅ Submitted. Problem: <strong>${selectedProblem}</strong>`;
    if (selectedPumpType) {
      const selectedItem = document.querySelector(`[data-value="${selectedPumpType}"]`);
      const pumpName = selectedItem ? selectedItem.querySelector('.pump-name').textContent : selectedPumpType;
      message += `<br>Pump type: <strong>${pumpName}</strong>`;
    }
    resultBox.innerHTML = message;
  });
});