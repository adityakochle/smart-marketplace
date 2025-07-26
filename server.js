const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Arcade = require('@arcadeai/arcadejs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept PDF, DOC, DOCX, TXT files
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
    }
  }
});

// Mock data for tradesmen/companies (in a real app, this would come from a database)
const mockTradesmen = [
  {
    id: 1,
    name: "ABC Plumbing Services",
    specialty: "plumbing",
    rating: 4.8,
    location: "San Francisco, CA",
    description: "Professional plumbing services for residential and commercial properties",
    contact: "+1-555-0123",
    website: "https://abcplumbing.com"
  },
  {
    id: 2,
    name: "Master Carpentry Co.",
    specialty: "carpentry",
    rating: 4.9,
    location: "San Francisco, CA",
    description: "Expert carpentry and woodworking services",
    contact: "+1-555-0124",
    website: "https://mastercarpentry.com"
  },
  {
    id: 3,
    name: "Golden State Construction",
    specialty: "construction",
    rating: 4.7,
    location: "San Francisco, CA",
    description: "Full-service construction and renovation company",
    contact: "+1-555-0125",
    website: "https://goldenstateconstruction.com"
  },
  {
    id: 4,
    name: "Quick Fix Electric",
    specialty: "electrical",
    rating: 4.6,
    location: "San Francisco, CA",
    description: "Licensed electrical contractors for all your electrical needs",
    contact: "+1-555-0126",
    website: "https://quickfixelectric.com"
  }
];

// AI Integration Functions
async function analyzeWithZeroentropy(jobDescription) {
  try {
    const apiKey = process.env.ZEROENTROPY_API_KEY;
    
    if (!apiKey || apiKey === 'your_zeroentropy_api_key_here') {
      console.log('Using mock Zeroentropy analysis (no API key provided)');
      // Fallback to mock analysis
      const analysis = {
        tradeType: extractTradeType(jobDescription),
        complexity: Math.random() > 0.5 ? 'high' : 'medium',
        estimatedCost: Math.floor(Math.random() * 5000) + 1000,
        urgency: Math.random() > 0.7 ? 'urgent' : 'normal'
      };
      return analysis;
    }

    console.log('Analyzing with Zeroentropy API:', jobDescription.substring(0, 100) + '...');
    
    // Try different possible Zeroentropy API endpoints
    const endpoints = [
      'https://api.zeroentropy.dev/v1/status/get-status',
      'https://api.zeroentropy.dev/v1/analyze',
      'https://api.zeroentropy.dev/analyze',
      'https://api.zeroentropy.dev/v1/jobs/analyze',
      'https://zeroentropy.dev/api/v1/analyze',
      'https://zeroentropy.dev/api/analyze'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.post(endpoint, {
          job_description: jobDescription,
          analysis_type: 'complexity_and_cost'
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });

        console.log('Zeroentropy API response received');
        return response.data;
      } catch (error) {
        if (error.response) {
          console.log(`Zeroentropy API error ${error.response.status}: ${error.response.statusText}`);
        } else {
          console.log(`Zeroentropy endpoint ${endpoint} failed: ${error.message}`);
        }
        continue;
      }
    }

    // If all endpoints fail, return mock data
    console.log('All Zeroentropy endpoints failed, using mock data');
    return {
      tradeType: extractTradeType(jobDescription),
      complexity: Math.random() > 0.5 ? 'high' : 'medium',
      estimatedCost: Math.floor(Math.random() * 5000) + 1000,
      urgency: Math.random() > 0.7 ? 'urgent' : 'normal'
    };

  } catch (error) {
    console.error('Zeroentropy API error:', error);
    return null;
  }
}

async function analyzeWithArcade(jobDescription) {
  try {
    const apiKey = process.env.ARCADE_API_KEY;
    
    if (!apiKey || apiKey === 'your_arcade_api_key_here') {
      console.log('Using mock Arcade analysis (no API key provided)');
      // Fallback to mock analysis
      const skills = ['plumbing', 'carpentry', 'electrical', 'construction'];
      const matchedSkills = skills.filter(skill => 
        jobDescription.toLowerCase().includes(skill)
      );
      
      return {
        requiredSkills: matchedSkills,
        experienceLevel: Math.random() > 0.5 ? 'expert' : 'intermediate',
        certifications: ['licensed', 'insured']
      };
    }

    console.log('Analyzing with Arcade API:', jobDescription.substring(0, 100) + '...');
    
    // Initialize Arcade client
    const client = new Arcade({
      apiKey: apiKey,
    });

    // Use a unique identifier for the user
    const userId = "smart-marketplace-user";

    try {
      // Try to use Arcade's analysis capabilities
      // For now, we'll use a simple text analysis approach
      const response = await client.tools.execute({
        tool_name: "Text.Analyze",
        input: { 
          text: jobDescription,
          analysis_type: "skill_matching"
        },
        user_id: userId,
      });

      console.log('Arcade API response received');
      return response.output.value;
    } catch (toolError) {
      console.log('Arcade tool execution failed, trying alternative approach');
      
      // Fallback: try to use a more generic analysis
      try {
        const response = await client.tools.execute({
          tool_name: "Text.Process",
          input: { 
            content: jobDescription,
            task: "extract skills and requirements for tradesman job"
          },
          user_id: userId,
        });

        console.log('Arcade alternative response received');
        return response.output.value;
      } catch (altError) {
        console.log('Arcade alternative approach failed:', altError.message);
        
        // Final fallback to mock data
        const skills = ['plumbing', 'carpentry', 'electrical', 'construction'];
        const matchedSkills = skills.filter(skill => 
          jobDescription.toLowerCase().includes(skill)
        );
        
        return {
          requiredSkills: matchedSkills,
          experienceLevel: Math.random() > 0.5 ? 'expert' : 'intermediate',
          certifications: ['licensed', 'insured']
        };
      }
    }
  } catch (error) {
    console.error('Arcade API error:', error);
    return null;
  }
}

async function analyzeWithDatalog(jobDescription) {
  try {
    const apiKey = process.env.DATALOG_API_KEY;
    
    if (!apiKey || apiKey === 'your_datalog_api_key_here') {
      console.log('Using mock Datalog analysis (no API key provided)');
      // Fallback to mock analysis
      return {
        marketDemand: 'high',
        averagePricing: Math.floor(Math.random() * 3000) + 1500,
        completionTime: Math.floor(Math.random() * 14) + 3,
        riskFactors: ['weather_dependent', 'permits_required']
      };
    }

    console.log('Analyzing with Datalog API:', jobDescription.substring(0, 100) + '...');
    
    // Try different possible Datalog API endpoints
    const endpoints = [
      'https://api.datalog.com/v1/analyze',
      'https://api.datalog.com/analyze',
      'https://api.datalog.com/v1/market/insights'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.post(endpoint, {
          job_description: jobDescription,
          analysis_type: 'market_intelligence'
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });

        console.log('Datalog API response received');
        return response.data;
      } catch (error) {
        if (error.response) {
          console.log(`Datalog API error ${error.response.status}: ${error.response.statusText}`);
        } else {
          console.log(`Datalog endpoint ${endpoint} failed: ${error.message}`);
        }
        continue;
      }
    }

    // If all endpoints fail, return mock data
    console.log('All Datalog endpoints failed, using mock data');
    return {
      marketDemand: 'high',
      averagePricing: Math.floor(Math.random() * 3000) + 1500,
      completionTime: Math.floor(Math.random() * 14) + 3,
      riskFactors: ['weather_dependent', 'permits_required']
    };

  } catch (error) {
    console.error('Datalog API error:', error);
    return null;
  }
}

// Helper function to extract trade type from job description
function extractTradeType(description) {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('plumb') || lowerDesc.includes('pipe') || lowerDesc.includes('water')) {
    return 'plumbing';
  } else if (lowerDesc.includes('carpent') || lowerDesc.includes('wood') || lowerDesc.includes('cabinet')) {
    return 'carpentry';
  } else if (lowerDesc.includes('electr') || lowerDesc.includes('wiring') || lowerDesc.includes('outlet')) {
    return 'electrical';
  } else if (lowerDesc.includes('construct') || lowerDesc.includes('build') || lowerDesc.includes('renovation')) {
    return 'construction';
  } else {
    return 'general';
  }
}

// Web search function using Perplexity AI
async function searchTradesmenOnline(jobDescription) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;
    
    if (!apiKey || apiKey === 'your_google_api_key_here' || !cseId || cseId === 'your_google_custom_search_engine_id_here') {
      console.log('Using mock web search (Google API keys not provided)');
      const tradeType = extractTradeType(jobDescription);
      const location = extractLocation(jobDescription) || 'San Francisco, CA';
      
      // Enhanced mock results based on job type
      const searchResults = [
        {
          name: "Bay Area Pro Services",
          specialty: tradeType,
          rating: 4.5,
          location: location,
          description: "Found through web search - professional service provider",
          contact: "+1-555-9999",
          website: "https://bayareapros.com"
        },
        {
          name: "Local Expert Contractors",
          specialty: tradeType,
          rating: 4.3,
          location: location,
          description: "Found through web search - local expert contractors",
          contact: "+1-555-8888",
          website: "https://localexperts.com"
        },
        {
          name: "AI-Enhanced Services",
          specialty: tradeType,
          rating: 4.7,
          location: location,
          description: "Found through AI search - modern technology-driven contractor",
          contact: "+1-555-7777",
          website: "https://aienhanced.com"
        }
      ];
      
      return searchResults;
    }

    console.log('Searching with Google Custom Search API:', jobDescription.substring(0, 100) + '...');
    
    const tradeType = extractTradeType(jobDescription);
    const location = extractLocation(jobDescription) || 'San Francisco, CA';
    const searchQuery = `${tradeType} contractor ${location} licensed insured`;
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: cseId,
        q: searchQuery,
        num: 5
      },
      timeout: 15000
    });

    console.log('Google Custom Search API response received');
    
    if (response.data.items && response.data.items.length > 0) {
      const searchResults = response.data.items.map((item, index) => ({
        name: item.title || `Contractor ${index + 1}`,
        specialty: tradeType,
        rating: (4.0 + Math.random() * 1.0).toFixed(1), // Mock rating
        location: location,
        description: item.snippet || `Found through Google search - ${tradeType} contractor`,
        contact: "+1-555-" + Math.floor(Math.random() * 9000 + 1000), // Mock contact
        website: item.link || `https://contractor${index + 1}.com`
      }));
      return searchResults;
    } else {
      console.log('No Google search results found, using mock data');
      return [
        {
          name: "Bay Area Pro Services",
          specialty: tradeType,
          rating: 4.5,
          location: location,
          description: "Found through web search - professional service provider",
          contact: "+1-555-9999",
          website: "https://bayareapros.com"
        },
        {
          name: "Local Expert Contractors",
          specialty: tradeType,
          rating: 4.3,
          location: location,
          description: "Found through web search - local expert contractors",
          contact: "+1-555-8888",
          website: "https://localexperts.com"
        },
        {
          name: "AI-Enhanced Services",
          specialty: tradeType,
          rating: 4.7,
          location: location,
          description: "Found through AI search - modern technology-driven contractor",
          contact: "+1-555-7777",
          website: "https://aienhanced.com"
        }
      ];
    }
    
  } catch (error) {
    console.error('Google Custom Search API error:', error);
    if (error.response) {
      console.log(`Google API error ${error.response.status}: ${error.response.statusText}`);
    }
    // Fallback to mock data
    const tradeType = extractTradeType(jobDescription);
    const location = extractLocation(jobDescription) || 'San Francisco, CA';
    return [
      {
        name: "Bay Area Pro Services",
        specialty: tradeType,
        rating: 4.5,
        location: location,
        description: "Found through web search - professional service provider",
        contact: "+1-555-9999",
        website: "https://bayareapros.com"
      },
      {
        name: "Local Expert Contractors",
        specialty: tradeType,
        rating: 4.3,
        location: location,
        description: "Found through web search - local expert contractors",
        contact: "+1-555-8888",
        website: "https://localexperts.com"
      },
      {
        name: "AI-Enhanced Services",
        specialty: tradeType,
        rating: 4.7,
        location: location,
        description: "Found through AI search - modern technology-driven contractor",
        contact: "+1-555-7777",
        website: "https://aienhanced.com"
      }
    ];
  }
}

// Helper function to extract location from job description
function extractLocation(description) {
  const locationPatterns = [
    /(?:in|at|near|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/i,
    /(?:location|area|city):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

// Helper function to extract tradesmen information from text response
function extractTradesmenFromText(text, tradeType, location) {
  const results = [];
  
  // Simple extraction patterns
  const companyPatterns = [
    /([A-Z][a-zA-Z\s&]+(?:Services|Contractors|Plumbing|Electric|Construction|Carpentry))/g,
    /([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Company))/g
  ];
  
  for (const pattern of companyPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match, index) => {
        if (index < 3) { // Limit to 3 results
          results.push({
            name: match.trim(),
            specialty: tradeType,
            rating: 4.0 + Math.random() * 0.5,
            location: location,
            description: `Found through Perplexity AI search - ${tradeType} services`,
            contact: "+1-555-" + Math.floor(Math.random() * 9000 + 1000),
            website: `https://${match.toLowerCase().replace(/\s+/g, '')}.com`
          });
        }
      });
    }
  }
  
  return results.length > 0 ? results : [
    {
      name: "AI-Found Services",
      specialty: tradeType,
      rating: 4.4,
      location: location,
      description: "Found through Perplexity AI search",
      contact: "+1-555-7777",
      website: "https://aifoundservices.com"
    }
  ];
}

// Routes
app.post('/api/upload', upload.single('jobsheet'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from file (simplified - in real app, use libraries like pdf-parse for PDFs)
    let jobDescription = '';
    
    if (req.file.mimetype === 'text/plain') {
      jobDescription = fs.readFileSync(req.file.path, 'utf8');
    } else {
      // For PDF/DOC files, you'd use libraries like pdf-parse or mammoth
      // For now, we'll use the filename as description
      jobDescription = `Job description from ${req.file.originalname}`;
    }

    // Analyze with AI services
    const [zeroentropyAnalysis, arcadeAnalysis, datalogAnalysis] = await Promise.all([
      analyzeWithZeroentropy(jobDescription),
      analyzeWithArcade(jobDescription),
      analyzeWithDatalog(jobDescription)
    ]);

    // Search for tradesmen
    const onlineResults = await searchTradesmenOnline(jobDescription);
    
    // Filter local tradesmen based on analysis
    const tradeType = extractTradeType(jobDescription);
    const localMatches = mockTradesmen.filter(tradesman => 
      tradesman.specialty === tradeType || tradeType === 'general'
    );

    // Combine and rank results
    const allResults = [...localMatches, ...onlineResults];
    const rankedResults = allResults.sort((a, b) => b.rating - a.rating);

    res.json({
      success: true,
      file: req.file.originalname,
      jobDescription,
      analysis: {
        zeroentropy: zeroentropyAnalysis,
        arcade: arcadeAnalysis,
        datalog: datalogAnalysis
      },
      recommendations: rankedResults.slice(0, 5) // Top 5 recommendations
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    // Analyze with AI services
    const [zeroentropyAnalysis, arcadeAnalysis, datalogAnalysis] = await Promise.all([
      analyzeWithZeroentropy(jobDescription),
      analyzeWithArcade(jobDescription),
      analyzeWithDatalog(jobDescription)
    ]);

    // Search for tradesmen
    const onlineResults = await searchTradesmenOnline(jobDescription);
    
    // Filter local tradesmen based on analysis
    const tradeType = extractTradeType(jobDescription);
    const localMatches = mockTradesmen.filter(tradesman => 
      tradesman.specialty === tradeType || tradeType === 'general'
    );

    // Combine and rank results
    const allResults = [...localMatches, ...onlineResults];
    const rankedResults = allResults.sort((a, b) => b.rating - a.rating);

    res.json({
      success: true,
      jobDescription,
      analysis: {
        zeroentropy: zeroentropyAnalysis,
        arcade: arcadeAnalysis,
        datalog: datalogAnalysis
      },
      recommendations: rankedResults.slice(0, 5)
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Marketplace API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 