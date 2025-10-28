import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Star, MapPin, Verified } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    verified: '',
    minRating: ''
  });

  useEffect(() => {
    fetchWorkers();
  }, [filters]);

  const fetchWorkers = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workers?${params}`);
      const data = await response.json();
      setWorkers(data.workers || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Gardening">Gardening</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.verified === 'true'}
                    onChange={(e) => setFilters({...filters, verified: e.target.checked ? 'true' : ''})}
                  />
                  Verified Only
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Min Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : workers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No workers found</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {workers.map((worker: any) => (
                  <Link
                    key={worker._id}
                    to={`/workers/${worker._id}`}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                  >
                    <div className="flex gap-4">
                      <img
                        src={worker.photos?.[0] || '/placeholder.jpg'}
                        alt={worker.displayName}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{worker.displayName}</h3>
                          {worker.verified && <Verified className="w-5 h-5 text-blue-600" />}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{worker.category}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{worker.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{worker.serviceArea}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-semibold text-primary-600">
                            ₹{worker.price}/{worker.chargeType === 'hourly' ? 'hr' : worker.chargeType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

