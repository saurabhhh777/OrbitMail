import React, { useState } from 'react';
import { userAuthStore } from '../../store/userAuthStore';
import { Toaster, toast } from 'react-hot-toast';

interface Domain {
  id: string;
  name: string;
  isVerified: boolean;
  emails: string[];
  mxRecords: {
    type: string;
    name: string;
    value: string;
    priority: number;
  }[];
}



const Dashboard: React.FC = () => {
  const { addDomain } = userAuthStore();

  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'voidmail.fun',
      isVerified: true,
      emails: ['founder', 'support', 'noreply', 'admin'],
      mxRecords: [
        { type: 'MX', name: '@', value: 'mx1.voidmail.fun', priority: 10 },
        { type: 'MX', name: '@', value: 'mx2.voidmail.fun', priority: 20 },
      ],
    },
    {
      id: '2',
      name: 'mydomain.io',
      isVerified: false,
      emails: ['contact'],
      mxRecords: [
        { type: 'MX', name: '@', value: 'mx1.voidmail.fun', priority: 10 },
        { type: 'MX', name: '@', value: 'mx2.voidmail.fun', priority: 20 },
      ],
    },
  ]);

  const [newDomain, setNewDomain] = useState('');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<Record<string, string>>({});
  const [copiedRecord, setCopiedRecord] = useState('');

  const toggleDomain = (domainId: string) => {
    setExpandedDomain(expandedDomain === domainId ? null : domainId);
    setVerifyingDomain(null);
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error("Please enter a domain name.");
      return;
    }

    try {
      const res = await addDomain(newDomain);
      if(res){
        toast.success("Domain added successfully");
        setDomains((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: newDomain,
            isVerified: false,
            emails: [],
            mxRecords: [
              { type: 'MX', name: '@', value: 'mx1.voidmail.fun', priority: 10 },
              { type: 'MX', name: '@', value: 'mx2.voidmail.fun', priority: 20 },
            ],
          },
        ]);
      }

      // Add new domain to local state (temporary representation)
      setNewDomain('');
    } catch (error) {
      toast.error("Failed to add domain");
      console.error("Error adding domain:", error);
    }
  };

  const startVerification = (domainId: string) => {
    setVerifyingDomain(domainId);
    setVerificationStatus((prev) => ({ ...prev, [domainId]: 'pending' }));
  };

  const verifyDomain = async (domainId: string) => {
    setVerificationStatus((prev) => ({ ...prev, [domainId]: 'verifying' }));

    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2;
        if (success) {
          setDomains((domains) =>
            domains.map((domain) =>
              domain.id === domainId ? { ...domain, isVerified: true } : domain
            )
          );
          setVerificationStatus((prev) => ({ ...prev, [domainId]: 'verified' }));
        } else {
          setVerificationStatus((prev) => ({ ...prev, [domainId]: 'failed' }));
        }
        resolve(success);
      }, 2000);
    });
  };

  const handleAddEmail = (domainId: string, emailPrefix: string) => {
    if (emailPrefix.trim()) {
      setDomains((domains) =>
        domains.map((domain) =>
          domain.id === domainId
            ? { ...domain, emails: [...domain.emails, emailPrefix.trim()] }
            : domain
        )
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(text);
    setTimeout(() => setCopiedRecord(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">VoidMail Dashboard</h1>
          <p className="text-gray-600">Manage your domains and email addresses</p>
        </header>

        {/* Add Domain */}
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

        {/* Domains */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Domains</h2>

          {domains.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No domains added yet. Add your first domain to get started!</p>
            </div>
          ) : (
            domains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                expandedDomain={expandedDomain}
                toggleDomain={toggleDomain}
                verifyingDomain={verifyingDomain}
                verificationStatus={verificationStatus}
                startVerification={startVerification}
                verifyDomain={verifyDomain}
                handleAddEmail={handleAddEmail}
                copyToClipboard={copyToClipboard}
                copiedRecord={copiedRecord}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 🧩 Sub-components
interface DomainCardProps {
  domain: Domain;
  expandedDomain: string | null;
  toggleDomain: (id: string) => void;
  verifyingDomain: string | null;
  verificationStatus: Record<string, string>;
  startVerification: (id: string) => void;
  verifyDomain: (id: string) => Promise<unknown>;
  handleAddEmail: (id: string, email: string) => void;
  copyToClipboard: (text: string) => void;
  copiedRecord: string;
}

const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  expandedDomain,
  toggleDomain,
  verifyingDomain,
  verificationStatus,
  startVerification,
  verifyDomain,
  handleAddEmail,
  copyToClipboard,
  copiedRecord,
}) => {
  const isExpanded = expandedDomain === domain.id;
  const isVerifying = verifyingDomain === domain.id;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => toggleDomain(domain.id)}
      >
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full mr-3 ${
              domain.isVerified ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          ></span>
          <h3 className="text-lg font-medium">{domain.name}</h3>
          {domain.isVerified && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Verified
            </span>
          )}
        </div>
        {!domain.isVerified && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              startVerification(domain.id);
            }}
            className="px-3 py-1 rounded-md text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            disabled={verificationStatus[domain.id] === 'verifying'}
          >
            {verificationStatus[domain.id] === 'verifying' ? 'Verifying...' : 'Verify Domain'}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="border-t p-4 bg-gray-50">
          {isVerifying ? (
            <VerifyPanel
              domain={domain}
              verifyDomain={verifyDomain}
              status={verificationStatus[domain.id]}
              copyToClipboard={copyToClipboard}
              copiedRecord={copiedRecord}
              cancel={() => toggleDomain(domain.id)}
            />
          ) : (
            <EmailSection domain={domain} onAddEmail={handleAddEmail} />
          )}
        </div>
      )}
    </div>
  );
};

const EmailSection: React.FC<{ domain: Domain; onAddEmail: (id: string, email: string) => void }> = ({
  domain,
  onAddEmail,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-700">Email Addresses</h4>
        <EmailForm onAdd={(prefix) => onAddEmail(domain.id, prefix)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {domain.emails.map((prefix, index) => (
          <div key={index} className="bg-white border rounded-lg p-3 flex items-center">
            <div className="flex-1">
              <span className="font-medium">{prefix}</span>
              <span className="text-gray-500">@{domain.name}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const EmailForm: React.FC<{ onAdd: (prefix: string) => void }> = ({ onAdd }) => {
  const [emailPrefix, setEmailPrefix] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailPrefix.trim()) {
      onAdd(emailPrefix);
      setEmailPrefix('');
      setIsAdding(false);
    }
  };

  return !isAdding ? (
    <button
      onClick={() => setIsAdding(true)}
      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
    >
      ➕ Add Email
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
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-r text-sm">
        Add
      </button>
    </form>
  );
};

const VerifyPanel: React.FC<{
  domain: Domain;
  verifyDomain: (id: string) => Promise<unknown>;
  status: string;
  copyToClipboard: (text: string) => void;
  copiedRecord: string;
  cancel: () => void;
}> = ({ domain, verifyDomain, status, copyToClipboard, copiedRecord, cancel }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Verify Domain Ownership</h3>
      {status === 'failed' && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-2">Verification failed. Try again.</div>
      )}
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h4 className="font-medium mb-2">Add these MX records to your DNS:</h4>
        <ul>
          {domain.mxRecords.map((record, idx) => {
            const text = `${record.name} ${record.priority} ${record.value}`;
            return (
              <li key={idx} className="text-sm mb-1 flex justify-between">
                <span>{text}</span>
                <button onClick={() => copyToClipboard(text)} className="text-blue-500 text-xs">
                  {copiedRecord === text ? 'Copied' : 'Copy'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => verifyDomain(domain.id)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={status === 'verifying'}
        >
          {status === 'verifying' ? 'Verifying...' : 'Verify DNS'}
        </button>
        <button onClick={cancel} className="px-4 py-2 text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
