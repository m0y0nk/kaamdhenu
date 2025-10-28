import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Search, Users, Star, Shield } from 'lucide-react';

export default function Home() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Find Skilled Workers Near You</h1>
          <p className="text-xl mb-8">Connect with verified workers for all your needs</p>
          
          <div className="max-w-2xl mx-auto mt-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for plumbers, electricians, cleaners..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Workers</h3>
            <p className="text-gray-600">All workers are verified with ID proof</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rated & Reviewed</h3>
            <p className="text-gray-600">See ratings and reviews from other customers</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">Secure payments with Razorpay</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Popular Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {['Plumber', 'Electrician', 'Carpenter', 'Cleaning', 'Cooking', 'Gardening', 'Painter', 'Delivery'].map((cat) => (
              <Link
                key={cat}
                to={`/search?category=${cat}`}
                className="bg-gray-50 hover:bg-primary-50 border border-gray-200 rounded-lg p-6 text-center transition"
              >
                <p className="font-semibold text-gray-900">{cat}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Join KaamSetu Today</h2>
          <p className="text-gray-600 mb-6">Register as a worker or customer to get started</p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth/signup?role=WORKER" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700">
              Become a Worker
            </Link>
            <Link to="/auth/signup?role=CUSTOMER" className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900">
              Hire Workers
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

