import { useEffect, useState } from 'react';

const InputFormModal = ({ isOpen, onClose, onSubmit, onLoadingChange, isLoading, formData: propFormData }) => {
  const [formData, setFormData] = useState({
    repo: 'organization/repository',
    pr: '',
    token: 'ghp_default_token',
    provider: 'openrouter',
    model: 'anthropic/claude-sonnet-4',
    api_key: 'sk_default_api_key',
    filter_mode: 'all',
    brd_txt: ''
  });

  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    // Update form data if propFormData changes
    console.log('Received propFormData:', propFormData);
    if (propFormData) {
      const newFormData = {
        repo: propFormData.repo || 'organization/repository',
        pr: propFormData.pr || '', // Only PR should start blank
        token: propFormData.token || 'ghp_default_token',
        provider: propFormData.provider || 'openrouter',
        model: propFormData.model || 'anthropic/claude-sonnet-4',
        api_key: propFormData.api_key || 'sk_default_api_key',
        filter_mode: propFormData.filter_mode || 'all',
        brd_txt: propFormData.brd_txt || ''
      };
      console.log('Setting form data to:', newFormData);
      setFormData(newFormData);
    }
  }, [propFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    console.log(`Input changed: ${name} = ${newValue}`);
    
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const submitToBackend = async (payload) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    setApiLoading(true);
    setApiError('');
    
    // Notify parent component that loading has started
    if (onLoadingChange) {
      onLoadingChange(true);
    }
    
    try {
      const result = await submitToBackend(formData);
      console.log('API Response:', result);
      onSubmit(result); // Pass the API response to parent
      onClose(); // Close modal on successful submission
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error.message || 'Failed to analyze. Please try again.');
    } finally {
      setApiLoading(false);
      // Notify parent component that loading has finished
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative animate-fadeIn mt-20">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="font-semibold">PR Analysis Input</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            <div className="relative">
              <label htmlFor="repo" className="block text-sm font-semibold text-gray-700 mb-1">
                Repository
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <input
                  id="repo"
                  name="repo"
                  type="text"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="username/repository"
                  value={formData.repo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="pr" className="block text-sm font-semibold text-gray-700 mb-1">
                Pull Request Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <input
                  id="pr"
                  name="pr"
                  type="number"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="Enter PR number"
                  value={formData.pr}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-1">
                GitHub Token
              </label>
              <div className="rounded-md shadow-sm">
                <input
                  id="token"
                  name="token"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="ghp_xxxxxxxxxxxxxx"
                  value={formData.token}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="provider" className="block text-sm font-semibold text-gray-700 mb-1">
                AI Provider
              </label>
              <div className="relative rounded-md shadow-sm">
                <select
                  id="provider"
                  name="provider"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  value={formData.provider}
                  onChange={handleChange}
                >
                  <option value="openrouter">OpenRouter</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-semibold text-gray-700 mb-1">
                AI Model
              </label>
              <div className="rounded-md shadow-sm">
                <input
                  id="model"
                  name="model"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="anthropic/claude-sonnet-4"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="api_key" className="block text-sm font-semibold text-gray-700 mb-1">
                API Key
              </label>
              <div className="rounded-md shadow-sm">
                <input
                  id="api_key"
                  name="api_key"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="sk-xxxxxxxxxxxxxx"
                  value={formData.api_key}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="filter_mode" className="block text-sm font-semibold text-gray-700 mb-1">
                Filter Mode
              </label>
              <div className="relative rounded-md shadow-sm">
                <select
                  id="filter_mode"
                  name="filter_mode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  value={formData.filter_mode}
                  onChange={handleChange}
                >
                  <option value="all">All Files</option>
                  <option value="changed">Changed Files Only</option>
                  <option value="relevant">Relevant Files</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="brd_txt" className="block text-sm font-semibold text-gray-700 mb-1">
                Business Requirements (Optional)
              </label>
              <div className="rounded-md shadow-sm">
                <textarea
                  id="brd_txt"
                  name="brd_txt"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="Enter additional context or requirements..."
                  value={formData.brd_txt}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-md transition duration-150 ease-in-out flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={apiLoading || isLoading}
              >
                {(apiLoading || isLoading) ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Analyze Impact
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputFormModal;
