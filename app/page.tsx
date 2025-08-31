import Link from 'next/link'
import { PhotoIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Photo Gallery
            </h1>
            <Link 
              href="/admin" 
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300
                       text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                       transition-colors duration-200"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Link 
              key={i} 
              href={`/gallery/${i}`}
              className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-xl"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 
                            group-hover:shadow-md group-hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg mb-6
                                group-hover:bg-gray-100 transition-colors duration-300">
                    <PhotoIcon className="h-20 w-20 text-gray-400 group-hover:text-primary-400 
                                       transition-colors duration-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600
                               transition-colors duration-300">
                    Gallery {i}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    A beautiful collection of nature photos
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary-600">
                    View Gallery
                    <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}