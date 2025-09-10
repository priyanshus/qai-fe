
import { useState } from 'react';
import ChatModal from './ChatModal';
import InputFormModal from './InputFormModal';

const Header = ({ onChatSubmit, onAnalyzeSubmit, onLoadingChange, formData, isLoading }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInputFormOpen, setIsInputFormOpen] = useState(false);
  
  const handleOpenChat = () => {
    setIsChatOpen(true);
  };
  
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };
  
  const handleChatSubmit = (query) => {
    if (onChatSubmit) {
      onChatSubmit(query);
    }
  };
  
  const handleOpenInputForm = () => {
    setIsInputFormOpen(true);
  };
  
  const handleCloseInputForm = () => {
    setIsInputFormOpen(false);
  };
  
  const handleAnalyzeSubmit = (data) => {
    if (onAnalyzeSubmit) {
      console.log('Header passing form data to App:', data);
      onAnalyzeSubmit(data);
      setIsInputFormOpen(false); // Close modal after submission
    }
  };
  
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QA-I</h1>
            <p className="text-xs text-blue-200">Quality Assurance Impact Analyzer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenInputForm}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-medium">Analyze PR</span>
          </button>
          
          <button 
            onClick={handleOpenChat}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-medium">Ask Questions</span>
          </button>
        </div>
      </div>
      
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={handleCloseChat}
        onSubmit={handleChatSubmit} 
      />
      
      <InputFormModal 
        isOpen={isInputFormOpen}
        onClose={handleCloseInputForm}
        onSubmit={handleAnalyzeSubmit}
        onLoadingChange={onLoadingChange}
        formData={formData}
        isLoading={isLoading}
      />
    </header>
  );
};

export default Header;
