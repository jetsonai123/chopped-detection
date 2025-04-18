// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const resetBtn = document.getElementById('resetBtn');
const loadingContainer = document.getElementById('loadingContainer');
const resultsContainer = document.getElementById('resultsContainer');
const overallScoreElement = document.getElementById('overallScore');
const verdictTextElement = document.getElementById('verdictText');
const tipsList = document.getElementById('tipsList');

// Score elements
const hairScore = document.getElementById('hairScore');
const jawlineScore = document.getElementById('jawlineScore');
const facialStructureScore = document.getElementById('facialStructureScore');
const skinQualityScore = document.getElementById('skinQualityScore');
const eyeAreaScore = document.getElementById('eyeAreaScore');

// Score fill elements
const hairScoreFill = document.getElementById('hairScoreFill');
const jawlineScoreFill = document.getElementById('jawlineScoreFill');
const facialStructureScoreFill = document.getElementById('facialStructureScoreFill');
const skinQualityScoreFill = document.getElementById('skinQualityScoreFill');
const eyeAreaScoreFill = document.getElementById('eyeAreaScoreFill');

// Comment elements
const hairComment = document.getElementById('hairComment');
const jawlineComment = document.getElementById('jawlineComment');
const facialStructureComment = document.getElementById('facialStructureComment');
const skinQualityComment = document.getElementById('skinQualityComment');
const eyeAreaComment = document.getElementById('eyeAreaComment');

// Chart
let radarChart;

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
resetBtn.addEventListener('click', resetAnalysis);
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);

// Handle drag events
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect(e);
    }
}

// Handle file selection
function handleFileSelect(e) {
    const file = fileInput.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            uploadArea.style.display = 'none';
            previewContainer.style.display = 'block';
            
            // Start analysis
            startAnalysis(e.target.result);
        };
        
        reader.readAsDataURL(file);
    }
}

// Reset analysis
function resetAnalysis() {
    uploadArea.style.display = 'flex';
    previewContainer.style.display = 'none';
    loadingContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    fileInput.value = '';
    
    // Reset chart
    if (radarChart) {
        radarChart.destroy();
    }
}

// Start analysis
function startAnalysis(imageData) {
    loadingContainer.style.display = 'flex';
    resultsContainer.style.display = 'none';
    
    // Simulate API call delay
    setTimeout(() => {
        // Generate analysis results
        const results = generateAnalysisResults();
        
        // Display results
        displayResults(results);
        
        loadingContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
    }, 2500);
}

// Generate random number within a range, with optional skew
function normalRandom(min, max, skew = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return normalRandom(min, max, skew); // Resample if outside 0-1
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // Offset to min
    return Math.round(num);
}

// Generate more diverse analysis results with scores mostly in 60-80, but allow more spread and outliers
function generateAnalysisResults() {
    // Decide if there will be an outlier (20% chance)
    const outlierIndex = Math.random() < 0.2 ? Math.floor(Math.random() * 5) : -1;
    const outlierType = Math.random() < 0.5 ? 'high' : 'low';

    // Generate base scores
    let scores = [];
    for (let i = 0; i < 5; i++) {
        // 80% of the time use a wide normal range, 20% of the time use an outlier
        if (i === outlierIndex) {
            // Outlier: high (85-95) or low (50-59)
            if (outlierType === 'high') {
                scores.push(normalRandom(85, 95, 1.5));
            } else {
                scores.push(normalRandom(50, 59, 1.5));
            }
        } else {
            // Normal: 60-80, less skew for more spread
            scores.push(normalRandom(60, 80, 1.1));
        }
    }

    // Shuffle scores a bit to avoid patterns
    scores = scores.sort(() => Math.random() - 0.5);

    const [hairScoreValue, jawlineScoreValue, facialStructureScoreValue, skinQualityScoreValue, eyeAreaScoreValue] = scores;

    // Calculate overall score
    const overallScoreValue = Math.round(
        (hairScoreValue + jawlineScoreValue + facialStructureScoreValue + skinQualityScoreValue + eyeAreaScoreValue) / 5
    );

    // Generate comments based on scores
    const comments = {
        hair: generateComment(hairScoreValue),
        jawline: generateComment(jawlineScoreValue),
        facialStructure: generateComment(facialStructureScoreValue),
        skinQuality: generateComment(skinQualityScoreValue),
        eyeArea: generateComment(eyeAreaScoreValue)
    };

    // Generate improvement tips
    const tips = generateTips(hairScoreValue, jawlineScoreValue, facialStructureScoreValue, skinQualityScoreValue, eyeAreaScoreValue);

    return {
        scores: {
            overall: overallScoreValue,
            hair: hairScoreValue,
            jawline: jawlineScoreValue,
            facialStructure: facialStructureScoreValue,
            skinQuality: skinQualityScoreValue,
            eyeArea: eyeAreaScoreValue
        },
        comments,
        tips
    };
}

// Generate comment based on score
function generateComment(score) {
    if (score < 60) {
        return "Needs significant improvement";
    } else if (score < 70) {
        return "Below average, room for improvement";
    } else if (score < 80) {
        return "Average to good quality";
    } else if (score < 90) {
        return "Above average, impressive";
    } else {
        return "Exceptional quality";
    }
}

// Generate improvement tips based on scores
function generateTips(hairScore, jawlineScore, facialStructureScore, skinQualityScore, eyeAreaScore) {
    const tips = [];
    
    if (hairScore < 70) {
        tips.push("Consider a new hairstyle that complements your face shape better");
        tips.push("Regular conditioning treatments can improve hair texture and appearance");
    }
    
    if (jawlineScore < 70) {
        tips.push("Jawline exercises can help define your jaw muscles");
        tips.push("Maintaining proper posture can enhance jawline appearance");
    }
    
    if (facialStructureScore < 70) {
        tips.push("Facial exercises can help tone facial muscles");
        tips.push("Proper lighting and angles in photos can enhance facial structure");
    }
    
    if (skinQualityScore < 70) {
        tips.push("Establish a consistent skincare routine with cleansing and moisturizing");
        tips.push("Increase water intake and reduce sugar consumption for better skin");
    }
    
    if (eyeAreaScore < 70) {
        tips.push("Ensure adequate sleep to reduce under-eye puffiness");
        tips.push("Eye exercises can help reduce eye strain and improve appearance");
    }
    
    // Add some general tips if we don't have enough specific ones
    if (tips.length < 3) {
        tips.push("Regular exercise improves blood circulation and overall appearance");
        tips.push("Staying hydrated is key to maintaining good looks");
        tips.push("A balanced diet rich in vitamins and minerals enhances natural features");
    }
    
    return tips.slice(0, 5); // Return up to 5 tips
}

// Display results
function displayResults(results) {
    // Update score values
    overallScoreElement.textContent = results.scores.overall;
    hairScore.textContent = results.scores.hair;
    jawlineScore.textContent = results.scores.jawline;
    facialStructureScore.textContent = results.scores.facialStructure;
    skinQualityScore.textContent = results.scores.skinQuality;
    eyeAreaScore.textContent = results.scores.eyeArea;
    
    // Update score fill widths with animation
    hairScoreFill.style.width = `${results.scores.hair}%`;
    jawlineScoreFill.style.width = `${results.scores.jawline}%`;
    facialStructureScoreFill.style.width = `${results.scores.facialStructure}%`;
    skinQualityScoreFill.style.width = `${results.scores.skinQuality}%`;
    eyeAreaScoreFill.style.width = `${results.scores.eyeArea}%`;
    
    // Update comments
    hairComment.textContent = results.comments.hair;
    jawlineComment.textContent = results.comments.jawline;
    facialStructureComment.textContent = results.comments.facialStructure;
    skinQualityComment.textContent = results.comments.skinQuality;
    eyeAreaComment.textContent = results.comments.eyeArea;
    
    // Update verdict text
    if (results.scores.overall >= 70) {
        verdictTextElement.textContent = "This Nigga is a Chad";
        verdictTextElement.style.color = "#43f2ff";
        verdictTextElement.style.textShadow = "0 0 10px rgba(67, 242, 255, 0.7)";
    } else {
        verdictTextElement.textContent = "This Nigga is Chopped";
        verdictTextElement.style.color = "#ff6584";
        verdictTextElement.style.textShadow = "0 0 10px rgba(255, 101, 132, 0.7)";
    }
    
    // Update tips list
    tipsList.innerHTML = '';
    results.tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
    
    // Create radar chart
    createRadarChart(results.scores);
}

// Create radar chart
function createRadarChart(scores) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (radarChart) {
        radarChart.destroy();
    }
    
    // Create new chart
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Hair', 'Jawline', 'Facial Structure', 'Skin Quality', 'Eye Area'],
            datasets: [{
                label: 'Score',
                data: [scores.hair, scores.jawline, scores.facialStructure, scores.skinQuality, scores.eyeArea],
                backgroundColor: 'rgba(108, 99, 255, 0.2)',
                borderColor: 'rgba(108, 99, 255, 1)',
                pointBackgroundColor: 'rgba(108, 99, 255, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(108, 99, 255, 1)'
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: 'rgba(255, 255, 255, 0.7)',
                        z: 1,
                        font: {
                            size: 10
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
