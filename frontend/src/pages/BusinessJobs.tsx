import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

export default function BusinessJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', salary: '', salaryType: 'monthly', location: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) {
      // noop
    }
  };

  const createJob = async () => {
    try {
      if (!form.title || !form.salary) {
        toast.error('Please fill in job title and salary');
        return;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, salary: parseFloat(form.salary) || 0 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create job');
      setForm({ title: '', description: '', category: '', salary: '', salaryType: 'monthly', location: '' });
      fetchJobs();
      toast.success('Job posted successfully!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to post job');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Post Job Openings</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Create Job Post</h2>
          <p className="text-sm text-gray-600 mb-4">Fill in the details below to post a job opening</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500" 
                placeholder="e.g., Cook, Cleaner, Cashier" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500" 
                placeholder="e.g., Restaurant, Cleaning" 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500" 
                placeholder="e.g., Delhi, Mumbai" 
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹) *</label>
                <input 
                  type="text" 
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  placeholder="e.g., 15000, 20000" 
                  value={form.salary} 
                  onChange={(e) => setForm({ ...form, salary: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type</label>
                <select 
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  value={form.salaryType} 
                  onChange={(e) => setForm({ ...form, salaryType: e.target.value })}
                >
                  <option value="monthly">Per Month</option>
                  <option value="daily">Per Day</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea 
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-500" 
              placeholder="Describe the job requirements, working hours, etc." 
              rows={3}
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
            />
          </div>
          <button onClick={createJob} className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold">Post Job Opening</button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Job Listings</h2>
          {jobs.length === 0 ? (
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center text-gray-400">
              No jobs posted yet. Create your first job posting above!
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{job.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{job.category} • 📍 {job.location}</p>
                      <p className="text-sm font-medium text-green-700 mt-1">₹{job.salary} / {job.salaryType}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{job.status}</span>
                  </div>
                  {job.description && <p className="mt-2 text-gray-700">{job.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
