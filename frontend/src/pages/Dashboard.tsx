import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [domains, setDomains] = useState([
    {
      id: '1',
      name: 'voidmail.fun',
      isVerified: true,
      emails: ['founder', 'support', 'noreply', 'admin'],
      mxRecords: [
        { type: 'MX', name: '@', value: 'mx1.voidmail.fun', priority: 10 },
        { type: 'MX', name: '@', value: 'mx2.voidmail.fun', priority: 20 }
      ]
    },
    {
      id: '2',
      name: 'mydomain.io',
      isVerified: false,
      emails: ['contact'],
      mxRecords: [
        { type: 'MX', name: '@', value: 'mx1.voidmail.fun', priority: 10 },
        { type: 'MX', name: '@', value: 'mx2.voidmail.fun', priority: 20 }
      ]
    },
  ]);
  
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [newDomain, setNewDomain] = useState('');
  const [verifyingDomain, setVerifyingDomain] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [copiedRecord, setCopiedRecord] = useState('');

  const toggleDomain = (domainId) => {
    setExpandedDomain(expandedDomain === domainId ? null : domainId);
    setVerifyingDomain(null);
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      const newDomainObj = {
        id: Date.now().toString(),
        name: newDomain.trim(),
        isVerified: false,
        emails: [],
        mxRecords: [
          { type: 'MX', name: '@', value: 'mx1.voidmail.fun', priority: 10 },
          { type: 'MX', name: '@', value: 'mx2.voidmail.fun', priority: 20 }
        ]
      };
      setDomains([...domains, newDomainObj]);
      setNewDomain('');
    }
  };

  const startVerification = (domainId) => {
    setVerifyingDomain(domainId);
    setVerificationStatus(prev => ({ ...prev, [domainId]: 'pending' }));
  };

  const verifyDomain = async (domainId) => {
    // Simulating API call to backend
    setVerificationStatus(prev => ({ ...prev, [domainId]: 'verifying' }));
    
    // This would actually be an API call in a real app
    // const response = await fetch(`/api/verify-domain?domain=${domainName}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate for demo
        
        if (success) {
          setDomains(domains.map(domain => 
            domain.id === domainId ? { ...domain, isVerified: true } : domain
          ));
          setVerificationStatus(prev => ({ ...prev, [domainId]: 'verified' }));
        } else {
          setVerificationStatus(prev => ({ ...prev, [domainId]: 'failed' }));
        }
        resolve(success);
      }, 2000);
    });
  };

  const handleAddEmail = (domainId, emailPrefix) => {
    if (emailPrefix.trim()) {
      setDomains(domains.map(domain => 
        domain.id === domainId 
          ? { ...domain, emails: [...domain.emails, emailPrefix.trim()] } 
          : domain
      ));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(text);
    setTimeout(() => setCopiedRecord(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">VoidMail Dashboard</h1>
          <p className="text-gray-600">Manage your domains and email addresses</p>
        </header>

        {/* Add Domain Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Domain</h2>
          <div className="flex">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter domain name (e.g., yourdomain.com)"
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddDomain}
              className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Add Domain
            </button>
          </div>
        </div>

        {/* Domains List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Domains</h2>
          
          {domains.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No domains added yet. Add your first domain to get started!</p>
            </div>
          ) : (
            domains.map(domain => (
              <div 
                key={domain.id} 
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Domain Header */}
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleDomain(domain.id)}
                >
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-3 ${domain.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <h3 className="text-lg font-medium">{domain.name}</h3>
                    {domain.isVerified && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {!domain.isVerified && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startVerification(domain.id);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          verificationStatus[domain.id] === 'verifying' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        disabled={verificationStatus[domain.id] === 'verifying'}
                      >
                        {verificationStatus[domain.id] === 'verifying' ? 'Verifying...' : 'Verify Domain'}
                      </button>
                    )}
                    <span className="text-gray-400">
                      {expandedDomain === domain.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Domain Details */}
                {expandedDomain === domain.id && (
                  <div className="border-t p-4 bg-gray-50">
                    {verifyingDomain === domain.id ? (
                      // Verification Panel
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Verify Domain Ownership</h3>
                        
                        {verificationStatus[domain.id] === 'failed' && (
                          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Verification failed. Please check your DNS records and try again.
                          </div>
                        )}
                        
                        <div className="bg-white rounded-lg border p-4 mb-4">
                          <h4 className="font-medium mb-3">Add these MX records to your DNS configuration:</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {domain.mxRecords.map((record, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-3 text-sm text-gray-900">{record.type}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{record.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{record.value}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{record.priority}</td>
                                    <td className="px-4 py-3 text-sm">
                                      <button 
                                        onClick={() => copyToClipboard(`${record.name} ${record.priority} ${record.value}`)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                      >
                                        {copiedRecord === `${record.name} ${record.priority} ${record.value}` ? (
                                          <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Copied!
                                          </>
                                        ) : (
                                          <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                            Copy
                                          </>
                                        )}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => verifyDomain(domain.id)}
                            disabled={verificationStatus[domain.id] === 'verifying'}
                            className={`px-4 py-2 rounded-md ${
                              verificationStatus[domain.id] === 'verifying'
                                ? 'bg-blue-400 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {verificationStatus[domain.id] === 'verifying' ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                              </span>
                            ) : 'Verify DNS Configuration'}
                          </button>
                          
                          <button
                            onClick={() => setVerifyingDomain(null)}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-600">
                          <p className="mb-2">After adding these records to your domain's DNS settings, click "Verify DNS Configuration".</p>
                          <p>DNS changes may take up to 24 hours to propagate globally.</p>
                        </div>
                      </div>
                    ) : (
                      // Email Management Panel
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-700">Email Addresses</h4>
                          <EmailForm 
                            onAdd={(prefix) => handleAddEmail(domain.id, prefix)} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {domain.emails.map((prefix, index) => (
                            <div 
                              key={index} 
                              className="bg-white border rounded-lg p-3 flex items-center"
                            >
                              <div className="flex-1">
                                <span className="font-medium">{prefix}</span>
                                <span className="text-gray-500">@{domain.name}</span>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for adding new emails
const EmailForm = ({ onAdd }) => {
  const [emailPrefix, setEmailPrefix] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailPrefix.trim()) {
      onAdd(emailPrefix);
      setEmailPrefix('');
      setIsAdding(false);
    }
  };

  return (
    <div>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Email
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={emailPrefix}
            onChange={(e) => setEmailPrefix(e.target.value)}
            placeholder="Prefix (e.g., support)"
            autoFocus
            className="border border-gray-300 rounded-l px-3 py-1 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded-r text-sm"
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;