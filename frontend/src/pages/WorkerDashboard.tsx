import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, DollarSign, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState<any[]>([]);
  const [newService, setNewService] = useState({ title: '', description: '', chargeType: 'hourly', price: '', duration: '' });

  useEffect(() => {
    fetchStats();
    fetchRequests();
    fetchProfile();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    }
  };

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

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setServices(data.workerProfile?.services || []);
    } catch (error) {
      console.error(error);
    }
  };

  const addService = async () => {
    try {
      if (!newService.title || !newService.price) {
        toast.error('Please fill in service name and charges');
        return;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newService, price: parseFloat(newService.price) || 0 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add service');
      setServices(data.services);
      setNewService({ title: '', description: '', chargeType: 'hourly', price: '', duration: '' });
      toast.success('Service added successfully!');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/services/${serviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete service');
      setServices(data.services);
      toast.success('Service removed');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const updateStatus = async (requestId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchRequests();
      toast.success(`Request ${status}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Worker Dashboard</h1>
        
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
                <Briefcase className="w-12 h-12 text-primary-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Rating</p>
                  <p className="text-2xl font-bold">{stats.rating}</p>
                </div>
                <User className="w-12 h-12 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-600" />
              </div>
              <p className="mt-2 text-gray-700 font-semibold">Total Earnings: ₹{stats.totalEarnings || 0}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">Manage Your Services</h2>
            <p className="text-sm text-gray-600 mt-1">Add services you offer to attract more customers</p>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <span>My Services</span>
                <span className="text-sm text-gray-500 font-normal">({services.length})</span>
              </h3>
              {services.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-400 mb-2">No services added yet</p>
                  <p className="text-sm text-gray-400">Add your first service on the right</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {services.map((svc: any) => (
                    <div key={svc._id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{svc.title}</p>
                          <p className="text-sm text-gray-700 mt-1">₹{svc.price} per {svc.chargeType}</p>
                          {svc.duration && <p className="text-sm text-gray-500 mt-1">⏱️ {svc.duration}</p>}
                          {svc.description && <p className="text-sm text-gray-600 mt-2">{svc.description}</p>}
                        </div>
                        <button 
                          onClick={() => deleteService(svc._id)} 
                          className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-lg">Add New Service</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                  <input
                    placeholder="e.g., Tap repair, Wiring fix"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                  <textarea
                    placeholder="Tell customers what you'll do..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value={newService.chargeType}
                      onChange={(e) => setNewService({ ...newService, chargeType: e.target.value })}
                    >
                      <option value="hourly">Per Hour</option>
                      <option value="daily">Per Day</option>
                      <option value="fixed">Fixed Price</option>
                      <option value="monthly">Per Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Charges (₹) *</label>
                    <input
                      type="text"
                      placeholder="e.g., 500, 1000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (optional)</label>
                  <input
                    placeholder="e.g., 2 hours, 1 day"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  />
                </div>
                <button 
                  onClick={addService} 
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Service
                </button>
                <p className="text-xs text-gray-500 text-center">* Required fields</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Job Requests</h2>
          </div>
          <div className="p-6">
            {requests.length === 0 ? (
              <p className="text-gray-500">No requests yet</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <div key={request._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-lg">{request.customerId?.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                        <p className="text-sm font-medium text-green-700 mt-1">₹{request.price}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateStatus(request._id, 'accepted')}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => updateStatus(request._id, 'cancelled')}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                        >
                          ✕ Decline
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
