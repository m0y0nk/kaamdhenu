import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Search, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Requests</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No requests yet</p>
                <a
                  href="/search"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Search for workers
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <div key={request._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{request.workerId?.name}</p>
                        <p className="text-sm text-gray-600">{request.message}</p>
                        <p className="text-sm text-gray-600">₹{request.price}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    {request.status === 'accepted' && (
                      <div className="mt-3">
                        <button
                          onClick={() => toast("Payments are coming soon.")}
                          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                        >
                          Pay Now
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

