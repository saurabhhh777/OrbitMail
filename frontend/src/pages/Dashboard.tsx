import React, { useState, useEffect, useCallback } from "react";
import { userAuthStore } from "../../store/userAuthStore";
import { Toaster, toast } from "react-hot-toast";

// Define the domain object type
interface Domain {
  _id: string;
  userId: string;
  domain: string;
  isVerified: boolean;
  emails: any[];
  createdAt: string;
  __v: number;
}

const Dashboard: React.FC = () => {
  const { getAllDomain, addDomain, verifyDomain } = userAuthStore();
  const [newDomain, setNewDomain] = useState<string>("");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});

  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      console.log("[Dashboard] Fetching domains...");
      const response = await getAllDomain();
      
      console.log("[Dashboard] API response:", response);
      
      if (response && response.domains && Array.isArray(response.domains)) {
        console.log(`[Dashboard] Found ${response.domains.length} domains`);
        setDomains(response.domains);
      } else {
        console.error("[Dashboard] Unexpected response format:", response);
        toast.error("Failed to load domains: Invalid response format");
        setDomains([]);
      }
    } catch (error) {
      console.error("[Dashboard] Error fetching domains:", error);
      toast.error("Failed to load domains");
      setDomains([]);
    } finally {
      setLoading(false);
    }
  }, [getAllDomain]);

  useEffect(() => {
    console.log("[Dashboard] Component mounted, fetching domains");
    fetchDomains();
  }, [fetchDomains]);

  const handleVerifyDomain = async (domainId: string, domainName: string) => {
    console.log(`[Dashboard] Verifying domain: ${domainName} (ID: ${domainId})`);
    try {
      // Set verifying state for this specific domain
      setVerifying(prev => ({ ...prev, [domainId]: true }));
      
      console.log(`[Dashboard] Calling verifyDomain for: ${domainName}`);
      const response = await verifyDomain(domainId);
      console.log(`[Dashboard] verifyDomain response for ${domainName}:`, response);

      if (response && response.success) {
        toast.success(`${domainName} is verified`);
        console.log(`[Dashboard] Refreshing domains after verification of ${domainName}`);
        
        // Optimistic UI update
        setDomains(prevDomains => 
          prevDomains.map(d => 
            d._id === domainId ? { ...d, isVerified: true } : d
          )
        );
      } else {
        toast.error(response?.message || `Failed to verify ${domainName}`);
      }
    } catch (error: any) {
      console.error(`[Dashboard] Error verifying domain ${domainName}:`, error);
      toast.error(error.message || `Failed to verify ${domainName}`);
    } finally {
      // Reset verifying state
      setVerifying(prev => ({ ...prev, [domainId]: false }));
    }
  }

  const handleAddDomain = async () => {
    const domain = newDomain.trim();
    if (!domain) {
      toast.error("Please enter a domain name.");
      return;
    }

    try {
      console.log(`[Dashboard] Adding domain: ${domain}`);
      const res = await addDomain(domain);
      console.log(`[Dashboard] addDomain response for ${domain}:`, res);
      
      if (res) {
        toast.success("Domain added successfully");
        setNewDomain("");
        console.log(`[Dashboard] Refreshing domains after adding ${domain}`);
        await fetchDomains();
      }
    } catch (error: any) {
      console.error(`[Dashboard] Error adding domain ${domain}:`, error);
      toast.error(error.message || "Failed to add domain");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            VoidMail Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your domains and email addresses
          </p>
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
              onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
            />
            <button
              onClick={handleAddDomain}
              className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              Add Domain
            </button>
          </div>
        </div>

        {/* Domains List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Domains</h2>
          
          {loading ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-500">Loading domains...</p>
            </div>
          ) : domains.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No domains found. Add your first domain!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {domains.map((domainObj) => (
                <div 
                  key={domainObj._id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-mono font-bold text-gray-800">
                      {domainObj.domain}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      domainObj.isVerified 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {domainObj.isVerified ? "Verified" : "Pending Verification"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-500">
                      <span>Created: {formatDate(domainObj.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>Emails: {domainObj.emails.length}</span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 border border-blue-600 rounded text-sm disabled:text-gray-400 disabled:border-gray-400"
                        onClick={() => navigator.clipboard.writeText(domainObj.domain)}
                      >
                        Copy Domain
                      </button>
                      <button 
                        className={`px-3 py-1 rounded text-sm font-medium flex items-center justify-center ${
                          domainObj.isVerified
                            ? "bg-gray-100 text-gray-800 border border-gray-300"
                            : "bg-green-600 hover:bg-green-900 text-white"
                        } disabled:bg-gray-300 disabled:text-gray-500`}
                        disabled={domainObj.isVerified || verifying[domainObj._id]}
                        onClick={() => handleVerifyDomain(domainObj._id, domainObj.domain)}
                      >
                        {verifying[domainObj._id] ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Verifying...
                          </>
                        ) : domainObj.isVerified ? (
                          "Verified"
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;