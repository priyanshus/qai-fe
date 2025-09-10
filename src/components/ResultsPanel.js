import { useEffect, useMemo, useState } from 'react';

// Helper component for risk badges
const RiskBadge = ({ risk }) => {
  const getBadgeColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm shadow-red-300';
      case 'medium':
        return 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm shadow-amber-200';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm shadow-green-300';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-300';
    }
  };

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getBadgeColor(risk)} inline-flex items-center`}>
      {risk.toLowerCase() === 'high' && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      {risk}
    </span>
  );
};

// Accordion component for functional impacts
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        className={`flex justify-between items-center w-full p-4 text-left font-medium ${isOpen ? 'bg-blue-50 text-blue-800' : 'bg-white text-gray-800'} hover:bg-blue-50 transition-colors duration-200`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isOpen ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-blue-600' : 'text-gray-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 pt-3 border-t border-gray-200 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

const ResultsPanel = ({ result, isLoading, lastQuery }) => {
  // Debug logging
  console.log("ResultsPanel received result:", result);
  console.log("ResultsPanel isLoading:", isLoading);

  // State for tracking checked test cases
  const [checkedScenarios, setCheckedScenarios] = useState({});
  
  // State for tracking expanded test cases
  const [expandedScenarios, setExpandedScenarios] = useState({});

  // Generate a unique key for the current result to store in localStorage
  const resultKey = useMemo(() => {
    if (!result || !result.qa_scenarios) return null;
    // Create a simple hash based on the test case titles and count
    const titles = result.qa_scenarios.map(scenario => scenario.title).join('|');
    return `qai_scenarios_${btoa(titles).slice(0, 16)}`;
  }, [result]);

  // Load checked state from localStorage when result changes
  useEffect(() => {
    if (resultKey) {
      const saved = localStorage.getItem(resultKey);
      if (saved) {
        try {
          setCheckedScenarios(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading checked scenarios from localStorage:', error);
          setCheckedScenarios({});
        }
      } else {
        setCheckedScenarios({});
      }
    }
  }, [resultKey]);

  // Save checked state to localStorage whenever it changes
  useEffect(() => {
    if (resultKey && Object.keys(checkedScenarios).length > 0) {
      localStorage.setItem(resultKey, JSON.stringify(checkedScenarios));
    }
  }, [checkedScenarios, resultKey]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (!result || !result.qa_scenarios || result.qa_scenarios.length === 0) return 0;
    const checkedCount = Object.values(checkedScenarios).filter(Boolean).length;
    return Math.round((checkedCount / result.qa_scenarios.length) * 100);
  }, [checkedScenarios, result]);

  // Handle checkbox toggle
  const handleScenarioToggle = (scenarioId) => {
    setCheckedScenarios(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };

  // Handle expand/collapse toggle
  const handleExpandToggle = (scenarioId) => {
    setExpandedScenarios(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Analyzing PR impact...</p>
          <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <div className="text-center text-gray-500 py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2 text-lg font-medium">No analysis yet</p>
          <p className="mt-1">Enter PR details and click "Analyze Impact" to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Test Cases Checklist</h2>
          </div>
          
          {/* Overall Risk adjacent to title */}
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border">
            <span className="font-medium text-gray-700 mr-2 text-sm">Overall Risk:</span>
            <RiskBadge risk={result.overallRisk || 'Medium'} />
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg border">
          <div className="flex items-center mr-3">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">{completionPercentage}%</span>
          </div>
          <span className="text-xs text-gray-500">
            {Object.values(checkedScenarios).filter(Boolean).length} of {result.qa_scenarios.length} completed
          </span>
        </div>
      </div>
      
      {/* Display the last query if available */}
      {result.chatQuery && (
        <div className="mb-5 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
          <div className="p-1 bg-white rounded-full mr-3 border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Query:</p>
            <p className="text-sm text-gray-600">{result.chatQuery}</p>
          </div>
        </div>
      )}

      {/* Test Cases Section (Todo Style) */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {result.qa_scenarios.map((testCase, index) => {
              // Generate ID and risk if not provided
              const id = testCase.id || `TC${String(index + 1).padStart(3, '0')}`;
              const risk = testCase.risk || (testCase.priority === 'High' ? 'High' : 
                                            testCase.priority === 'Medium' ? 'Medium' : 'Low');
              
              const isChecked = checkedScenarios[id] || false;
              const isExpanded = expandedScenarios[id] || false;
              
              // Determine styling based on checked state and risk level
              const containerClasses = `
                hover:bg-gray-50 transition-all duration-200
                ${isChecked ? 'bg-gray-50 opacity-75' : 'bg-white'}
              `;
              
              const textClasses = `
                ${isChecked ? 'text-gray-500 line-through' : 'text-gray-800'}
              `;
              
              const descriptionClasses = `
                ${isChecked ? 'text-gray-400 line-through' : 'text-gray-600'}
              `;
              
              return (
                <div key={id} className={containerClasses}>
                  {/* Main content row */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => handleExpandToggle(id)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          id={`scenario-${id}`}
                          checked={isChecked}
                          onChange={() => handleScenarioToggle(id)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-mono font-medium text-blue-600">{id}</span>
                            <h4 className={`font-semibold ${textClasses} transition-all duration-200`}>
                              {testCase.title}
                            </h4>
                            {/* Expand/Collapse indicator */}
                            <svg 
                              className={`w-5 h-5 transition-transform duration-200 ${
                                isExpanded ? 'transform rotate-180 text-blue-600' : 'text-gray-400'
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <RiskBadge risk={risk} />
                        </div>
                        
                        <p className={`text-sm ${descriptionClasses} transition-all duration-200`}>
                          {testCase.objective}
                        </p>
                        
                        {/* Tags if available */}
                        {testCase.tags && testCase.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {testCase.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className={`text-xs px-2 py-1 rounded-full border ${
                                  isChecked 
                                    ? 'bg-gray-100 text-gray-400 border-gray-200' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                } transition-all duration-200`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className={`px-4 pb-4 border-t border-gray-100 ${isChecked ? 'opacity-75' : ''}`}>
                      <div className="pl-9 pt-3"> {/* Align with content above checkbox */}
                        
                        {/* Test Steps */}
                        {testCase.steps && testCase.steps.length > 0 && (
                          <div className="mb-4">
                            <h5 className={`text-sm font-semibold mb-2 ${isChecked ? 'text-gray-500' : 'text-gray-700'}`}>
                              Test Steps:
                            </h5>
                            <ol className="list-decimal list-inside space-y-1">
                              {testCase.steps.map((step, stepIndex) => (
                                <li 
                                  key={stepIndex} 
                                  className={`text-sm ${
                                    isChecked ? 'text-gray-400 line-through' : 'text-gray-600'
                                  } transition-all duration-200`}
                                >
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Expected Results */}
                        {testCase.expected && (
                          <div>
                            <h5 className={`text-sm font-semibold mb-2 ${isChecked ? 'text-gray-500' : 'text-gray-700'}`}>
                              Expected Result:
                            </h5>
                            <div className={`text-sm p-3 rounded-lg border-l-4 ${
                              isChecked 
                                ? 'bg-gray-50 border-gray-300 text-gray-400 line-through' 
                                : 'bg-green-50 border-green-400 text-green-800'
                            } transition-all duration-200`}>
                              {testCase.expected}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Functional Impact Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-1 bg-purple-100 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Functional Impact</h3>
        </div>
        <div className="space-y-3">
          <Accordion title="Features Impacted">
            <ul className="space-y-2">
              {result.features_impacted.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Accordion>
          
          <Accordion title="Modules Impacted">
            <ul className="space-y-2">
              {result.modules_impacted.map((module, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{module}</span>
                </li>
              ))}
            </ul>
          </Accordion>
          
          <Accordion title="Code Files Impacted">
            {Object.keys(result.code_symbols_impacted).map((file, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-50 border-l-4 border-blue-400 rounded">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p className="text-sm font-mono text-gray-800">{file}</p>
                </div>
              </div>
            ))}
          </Accordion>
          
          <Accordion title="Risk Hotspots">
            {result.risk_hotspots.map((hotspot, index) => {
              const severityColor = 
                hotspot.severity.toLowerCase() === 'high' ? 'border-red-400 bg-red-50' : 
                hotspot.severity.toLowerCase() === 'medium' ? 'border-amber-400 bg-amber-50' : 
                'border-blue-400 bg-blue-50';
                
              return (
                <div key={index} className={`mb-3 p-3 border-l-4 rounded-md ${severityColor}`}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-mono font-medium text-gray-800">{hotspot.file}</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 shadow-sm font-medium">
                        Severity: {hotspot.severity}
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 shadow-sm font-medium">
                        Likelihood: {hotspot.likelihood}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{hotspot.reason}</p>
                </div>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
