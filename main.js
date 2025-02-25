// Language translations
const translations = {
  en: {
    title: 'BMI Calculator',
    metricUnit: 'Metric (kg/cm)',
    imperialUnit: 'Imperial (lbs/in)',
    weightMetric: 'Weight (kg):',
    heightMetric: 'Height (cm):',
    weightImperial: 'Weight (lbs):',
    heightImperial: 'Height:',
    feet: 'Feet',
    inches: 'Inches',
    calculate: 'Calculate BMI',
    reset: 'Reset',
    yourResult: 'Your BMI Result',
    result: 'Your BMI Result',
    enterWeight: 'Enter weight',
    enterHeight: 'Enter height',
    invalidInput: 'Please enter valid values for all fields.',
    bmiText: 'BMI',
    categories: {
      underweight: {
        name: 'Underweight',
        tip: 'Consider consulting a healthcare provider about gaining weight safely.'
      },
      normal: {
        name: 'Normal Weight',
        tip: 'Maintain your healthy lifestyle with balanced diet and regular exercise.'
      },
      overweight: {
        name: 'Overweight',
        tip: 'Focus on portion control and increasing physical activity.'
      },
      obese: {
        name: 'Obese',
        tip: 'Please consult a healthcare provider for a personalized weight management plan.'
      }
    }
  },
  bn: {
    title: 'বিএমআই ক্যালকুলেটর',
    metricUnit: 'মেট্রিক (কেজি/সেমি)',
    imperialUnit: 'ইম্পেরিয়াল (পাউন্ড/ইঞ্চি)',
    weightMetric: 'ওজন (কেজি):',
    heightMetric: 'উচ্চতা (সেমি):',
    weightImperial: 'ওজন (পাউন্ড):',
    heightImperial: 'উচ্চতা:',
    feet: 'ফুট',
    inches: 'ইঞ্চি',
    calculate: 'বিএমআই গণনা করুন',
    reset: 'রিসেট',
    yourResult: 'আপনার বিএমআই ফলাফল',
    result: 'আপনার বিএমআই ফলাফল',
    enterWeight: 'ওজন লিখুন',
    enterHeight: 'উচ্চতা লিখুন',
    invalidInput: 'অনুগ্রহ করে সব ঘরে সঠিক মান দিন।',
    bmiText: 'বিএমআই',
    categories: {
      underweight: {
        name: 'কম ওজন',
        tip: 'নিরাপদে ওজন বাড়ানোর জন্য স্বাস্থ্যসেবা প্রদানকারীর পরামর্শ নিন।'
      },
      normal: {
        name: 'স্বাভাবিক ওজন',
        tip: 'সুষম খাবার ও নিয়মিত ব্যায়ামের মাধ্যমে আপনার স্বাস্থ্যকর জীবনধারা বজায় রাখুন।'
      },
      overweight: {
        name: 'বেশি ওজন',
        tip: 'খাবারের পরিমাণ নিয়ন্ত্রণ করুন এবং শারীরিক কার্যকলাপ বাড়ান।'
      },
      obese: {
        name: 'স্থূলতা',
        tip: 'ওজন নিয়ন্ত্রণের জন্য একজন স্বাস্থ্যসেবা প্রদানকারীর পরামর্শ নিন।'
      }
    }
  }
};

// DOM Elements
const unitToggle = document.querySelectorAll('input[name="unit"]');
const metricInputs = document.querySelector('.metric-inputs');
const imperialInputs = document.querySelector('.imperial-inputs');
const calculateBtn = document.getElementById('calculate');
const resetBtn = document.getElementById('reset');
const resultDiv = document.getElementById('result');
const bmiValueDiv = document.getElementById('bmi-value');
const bmiCategoryDiv = document.getElementById('bmi-category');
const healthTipDiv = document.getElementById('health-tip');
const languageSelect = document.getElementById('language-select');

// Current language
let currentLang = 'en';

// BMI Categories ranges
const bmiCategories = {
  underweight: {
    range: [0, 18.5],
    color: 'underweight'
  },
  normal: {
    range: [18.5, 24.9],
    color: 'normal'
  },
  overweight: {
    range: [25, 29.9],
    color: 'overweight'
  },
  obese: {
    range: [30, Infinity],
    color: 'obese'
  }
};

// Update UI text based on selected language
function updateUIText() {
  const t = translations[currentLang];
  
  // Update document language
  document.documentElement.lang = currentLang;
  document.body.classList.add('fonts-loaded');
  
  // Update title and buttons
  document.querySelector('h1').textContent = t.title;
  document.querySelectorAll('input[name="unit"]')[0].nextSibling.textContent = ` ${t.metricUnit}`;
  document.querySelectorAll('input[name="unit"]')[1].nextSibling.textContent = ` ${t.imperialUnit}`;
  
  // Update labels and placeholders
  document.querySelector('label[for="weight-metric"]').textContent = t.weightMetric;
  document.querySelector('label[for="height-metric"]').textContent = t.heightMetric;
  document.querySelector('label[for="weight-imperial"]').textContent = t.weightImperial;
  document.querySelector('label[for="height-imperial-ft"]').textContent = t.heightImperial;
  
  document.getElementById('weight-metric').placeholder = t.enterWeight;
  document.getElementById('height-metric').placeholder = t.enterHeight;
  document.getElementById('weight-imperial').placeholder = t.enterWeight;
  document.getElementById('height-imperial-ft').placeholder = t.feet;
  document.getElementById('height-imperial-in').placeholder = t.inches;
  
  // Update buttons
  calculateBtn.textContent = t.calculate;
  resetBtn.textContent = t.reset;
  
  // Update result section title
  document.querySelector('#result h2').textContent = t.yourResult;
  
  // Update result section if visible
  if (!resultDiv.classList.contains('hidden')) {
    const bmi = parseFloat(bmiValueDiv.textContent.split(': ')[1]);
    displayResults(bmi);
  }
}

// Language switch handler
languageSelect.addEventListener('change', (e) => {
  currentLang = e.target.value;
  updateUIText();
});

// Toggle between metric and imperial units
unitToggle.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'metric') {
      metricInputs.classList.remove('hidden');
      imperialInputs.classList.add('hidden');
    } else {
      metricInputs.classList.add('hidden');
      imperialInputs.classList.remove('hidden');
    }
    resetCalculator();
  });
});

// Calculate BMI
function calculateBMI() {
  const isMetric = document.querySelector('input[name="unit"]:checked').value === 'metric';
  let bmi;

  if (isMetric) {
    const weight = parseFloat(document.getElementById('weight-metric').value);
    const height = parseFloat(document.getElementById('height-metric').value) / 100; // Convert cm to m
    
    if (!weight || !height) return null;
    bmi = weight / (height * height);
  } else {
    const weight = parseFloat(document.getElementById('weight-imperial').value);
    const feet = parseFloat(document.getElementById('height-imperial-ft').value);
    const inches = parseFloat(document.getElementById('height-imperial-in').value);
    
    if (!weight || (!feet && !inches)) return null;
    const totalInches = (feet * 12) + (inches || 0);
    bmi = (weight / (totalInches * totalInches)) * 703;
  }

  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
}

// Get BMI Category
function getBMICategory(bmi) {
  for (const [category, data] of Object.entries(bmiCategories)) {
    if (bmi >= data.range[0] && bmi < data.range[1]) {
      return {
        category: translations[currentLang].categories[category].name,
        color: data.color,
        tip: translations[currentLang].categories[category].tip
      };
    }
  }
}

// Display Results
function displayResults(bmi) {
  const categoryData = getBMICategory(bmi);
  const t = translations[currentLang];
  
  bmiValueDiv.textContent = `${t.bmiText}: ${bmi}`;
  bmiCategoryDiv.textContent = `${categoryData.category}`;
  healthTipDiv.textContent = categoryData.tip;
  
  // Remove all color classes and add the current one
  bmiValueDiv.className = categoryData.color;
  resultDiv.classList.remove('hidden');
}

// Calculate Button Click Handler
calculateBtn.addEventListener('click', () => {
  const bmi = calculateBMI();
  if (bmi) {
    displayResults(bmi);
  } else {
    alert(translations[currentLang].invalidInput);
  }
});

// Reset Calculator
function resetCalculator() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => input.value = '');
  resultDiv.classList.add('hidden');
}

// Reset Button Click Handler
resetBtn.addEventListener('click', resetCalculator);

// Initialize UI with default language
document.body.classList.add('fonts-loaded');
updateUIText();