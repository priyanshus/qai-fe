import { useState } from 'react';

const InputPanel = ({ onAnalyze, isLoading, isCollapsed }) => {
  const [formData, setFormData] = useState({
    prUrl: '',
    prDescription: '',
    project: 'moviedb',
    includeCodeContext: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  if (isCollapsed) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700">PR Analysis Input</h3>
          </div>
          <button 
            onClick={() => onAnalyze({ ...formData, showForm: true })}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-2 py-1 rounded transition-colors duration-150"
          >
            Edit
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
          <p className="truncate"><span className="font-medium text-gray-700">URL:</span> {formData.prUrl}</p>
          {formData.prDescription && (
            <p className="mt-1 truncate"><span className="font-medium text-gray-700">Description:</span> {formData.prDescription.substring(0, 30)}...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center mb-5 pb-3 border-b border-gray-100">
        <div className="p-2 bg-blue-100 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Pull Request Analysis</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <label htmlFor="prUrl" className="block text-sm font-semibold text-gray-700 mb-1">
            PR URL
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              id="prUrl"
              name="prUrl"
              type="url"
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/org/repo/pull/123"
              value={formData.prUrl}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="prDescription" className="block text-sm font-semibold text-gray-700 mb-1">
            PR Description
          </label>
          <div className="rounded-md shadow-sm">
            <textarea
              id="prDescription"
              name="prDescription"
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter PR description or context..."
              value={formData.prDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>
        
        <div>
          <label htmlFor="project" className="block text-sm font-semibold text-gray-700 mb-1">
            Project
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <select
              id="project"
              name="project"
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.project}
              onChange={handleChange}
            >
              <option value="moviedb">MovieDB</option>
              <option value="userservice">User Service</option>
              <option value="paymentapi">Payment API</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="flex items-center">
            <input
              id="includeCodeContext"
              name="includeCodeContext"
              type="checkbox"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.includeCodeContext}
              onChange={handleChange}
            />
            <label htmlFor="includeCodeContext" className="ml-2 block text-sm font-medium text-gray-700">
              Include code context
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">Adding code context will improve analysis accuracy</p>
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
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
  );
};

export default InputPanel;
