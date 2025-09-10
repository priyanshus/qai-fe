import { useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [result, setResult] = useState(null); // Start with no data
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState(null);
  const [formData, setFormData] = useState({
    repo: 'organization/repository',
    pr: '', // Only PR should start blank
    token: 'ghp_default_token',
    provider: 'openrouter',
    model: 'anthropic/claude-sonnet-4',
    api_key: 'sk_default_api_key',
    filter_mode: 'all',
    brd_txt: ''
  });

  // Handle loading state changes from InputFormModal
  const handleLoadingChange = (loading) => {
    console.log('App loading state changed:', loading);
    setIsLoading(loading);
  };

  // Handle the API response from InputFormModal
  const handleAnalyze = (apiResponse) => {
    console.log('App received API response:', apiResponse);
    setResult(apiResponse); // Set the actual API response
  };
  
  const handleChatSubmit = (query) => {
    setLastQuery(query);
    setIsLoading(true);
    
    console.log("Processing chat query:", query);
    
    // TODO: Implement chat functionality with backend API
    // For now, just preserve existing result and add the query
    setTimeout(() => {
      if (result) {
        setResult({
          ...result,
          chatQuery: query, // Add the query to the result for display purposes
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        onChatSubmit={handleChatSubmit}
        onAnalyzeSubmit={handleAnalyze}
        onLoadingChange={handleLoadingChange}
        formData={formData}
        isLoading={isLoading}
      />
      <div className="flex flex-col flex-grow p-5 container mx-auto max-w-7xl">
        <ResultsPanel 
          result={result} 
          isLoading={isLoading} 
          lastQuery={lastQuery}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
