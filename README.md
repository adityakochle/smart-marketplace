# Smart Marketplace - MCP Agents Hackathon

An AI-powered marketplace that connects users with tradesmen using advanced AI analysis from Zeroentropy, Arcade, and Datalog.

## 🚀 Features

- **File Upload**: Upload job requirements in PDF, DOC, DOCX, or TXT formats
- **Text Input**: Describe your job requirements directly in the app
- **AI Analysis**: Leverages three AI companies for comprehensive analysis:
  - **Zeroentropy**: Analyzes job complexity, cost estimation, and urgency
  - **Arcade**: Matches required skills and experience levels
  - **Datalog**: Provides market insights and risk assessment
- **Smart Search**: Searches both local database and web for tradesmen
- **Recommendations**: Get ranked recommendations with contact information
- **Modern UI**: Beautiful, responsive interface built with Material-UI

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Multer** for file uploads
- **Axios** for API calls
- **CORS** for cross-origin requests

### Frontend
- **React** with hooks
- **Material-UI** for modern UI components
- **React Router** for navigation
- **Axios** for API communication

### AI Integration
- **Zeroentropy** API (mock implementation)
- **Arcade** API (mock implementation)
- **Datalog** API (mock implementation)
- **Web Search** (mock implementation)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-marketplace
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # AI API Keys (replace with actual keys when available)
   ZEROENTROPY_API_KEY= ze_7RqP8VLYFEjJDCop
   ARCADE_API_KEY=arc_o1N3BXLvENHPG1qb123etpEZNJXDTtfHDYAqYNpvPQoXyo39wboN
   DATALOG_API_KEY=your_datalog_api_key_here
   
   # Web Search API Keys (replace with actual keys when available)
   BING_SEARCH_API_KEY=your_bing_search_api_key_here
   GOOGLE_SEARCH_API_KEY=AIzaSyCVqAfFuxNUCWtVQsWRDb6-Q6vs1k-YGQU
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the React frontend** (in a new terminal)
   ```bash
   npm run client
   ```
   The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
smart-marketplace/
├── server.js              # Express server with API endpoints
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── uploads/               # File upload directory
└── client/                # React frontend
    ├── src/
    │   ├── components/    # React components
    │   │   ├── Header.js
    │   │   ├── Home.js
    │   │   ├── JobUpload.js
    │   │   └── Results.js
    │   ├── App.js         # Main App component
    │   └── index.js       # React entry point
    └── package.json       # Frontend dependencies
```

## 🔧 API Endpoints

### Backend API (Port 5000)

- `POST /api/upload` - Upload jobsheet file
- `POST /api/analyze` - Analyze text job description
- `GET /api/health` - Health check endpoint

### Request Examples

**Upload File:**
```bash
curl -X POST -F "jobsheet=@job-requirements.pdf" http://localhost:5000/api/upload
```

**Analyze Text:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"jobDescription":"Need a plumber to fix a leaking pipe in the kitchen"}' \
  http://localhost:5000/api/analyze
```

## 🤖 AI Integration

### Current Implementation (Mock)
The application currently uses mock implementations for the AI services. To integrate with real APIs:

1. **Zeroentropy Integration**
   - Replace the `analyzeWithZeroentropy()` function in `server.js`
   - Add your API key to the `.env` file
   - Implement actual API calls using axios

2. **Arcade Integration**
   - Replace the `analyzeWithArcade()` function in `server.js`
   - Add your API key to the `.env` file
   - Implement skill matching and experience analysis

3. **Datalog Integration**
   - Replace the `analyzeWithDatalog()` function in `server.js`
   - Add your API key to the `.env` file
   - Implement market analysis and risk assessment

4. **Web Search Integration**
   - Replace the `searchTradesmenOnline()` function in `server.js`
   - Add Bing Search API or Google Custom Search API key
   - Implement actual web search functionality

## 🎯 Usage

1. **Visit the homepage** at `http://localhost:3000`
2. **Upload a jobsheet** or **describe your job** in the upload page
3. **Wait for AI analysis** - the system will analyze your requirements
4. **Review recommendations** - see ranked tradesmen with contact information
5. **Contact tradesmen** directly through the provided information

## 🧪 Testing

### Sample Job Descriptions

**Plumbing:**
```
Need a licensed plumber to fix a leaking pipe under the kitchen sink. 
The leak is causing water damage to the cabinet. Need someone available 
this week. Budget around $200-300.
```

**Carpentry:**
```
Looking for a skilled carpenter to build custom kitchen cabinets. 
Need 12 linear feet of cabinets with modern design. Must be experienced 
with hardwood and have portfolio of previous work. Timeline: 2-3 weeks.
```

**Electrical:**
```
Need electrical work for a home renovation. Installing new outlets, 
lighting fixtures, and upgrading the electrical panel. Must be licensed 
and insured. Project starts next month.
```

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku account
2. Install Heroku CLI
3. Run the following commands:
   ```bash
   heroku create your-app-name
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify Deployment
1. Build the project: `npm run build`
2. Drag the `client/build` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is created for the MCP Agents Hackathon.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Future Enhancements

- [ ] Real AI API integration
- [ ] User authentication and profiles
- [ ] Tradesmen registration system
- [ ] Review and rating system
- [ ] Real-time messaging
- [ ] Payment integration
- [ ] Mobile app development
- [ ] Advanced filtering and search
- [ ] Project tracking and management 