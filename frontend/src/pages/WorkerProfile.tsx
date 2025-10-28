import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Star, Verified, MapPin } from 'lucide-react';

export default function WorkerProfile() {
  const { id } = useParams();
  const [worker, setWorker] = useState<any>(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorker();
      fetchReviews();
    }
  }, [id]);

  const fetchWorker = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workers/${id}`);
      const data = await response.json();
      setWorker(data.worker);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/worker/${id}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  if (!worker) {
    return (
      <Layout>
        <div className="text-center py-12">Worker not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-8">
            <img
              src={worker.photos?.[0] || '/placeholder.jpg'}
              alt={worker.displayName}
              className="w-48 h-48 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{worker.displayName}</h1>
                {worker.verified && <Verified className="w-6 h-6 text-blue-600" />}
              </div>
              <p className="text-xl text-gray-600 mb-4">{worker.category}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">{worker.rating}</span>
                  <span className="text-gray-600">({worker.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{worker.serviceArea}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-primary-600">
                  ₹{worker.price}/{worker.chargeType === 'hourly' ? 'hour' : worker.chargeType}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700">{worker.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{review.customerId?.name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

