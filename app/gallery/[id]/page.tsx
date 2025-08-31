'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon, PhotoIcon, ShareIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import ImageLightbox from '@/components/gallery/ImageLightbox'

// This would come from your database in a real app
const MOCK_GALLERY = {
  id: '1',
  name: 'Sample Gallery',
  description: 'A beautiful collection of photos and artwork showcasing our latest work',
  items: [
    {
      id: '1',
      type: 'image',
      url: '/next.svg',
      thumbnailUrl: '/next.svg',
      title: 'Next.js Logo',
    },
    {
      id: '2',
      type: 'image',
      url: '/vercel.svg',
      thumbnailUrl: '/vercel.svg',
      title: 'Vercel Logo',
    },
    {
      id: '3',
      type: 'image',
      url: '/globe.svg',
      thumbnailUrl: '/globe.svg',
      title: 'Globe Icon',
    },
  ],
}

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // In a real app, fetch gallery data based on the ID
  const gallery = MOCK_GALLERY
  
  if (!gallery) {
    notFound()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gallery.name,
        text: gallery.description,
        url: window.location.href,
      })
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You would typically show a toast notification here
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Galleries
            </Link>
            <button 
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300
                       text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                       transition-colors duration-200"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Gallery content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {gallery.name}
          </h1>
          <p className="text-gray-600 text-lg">
            {gallery.description}
          </p>
        </div>
        
        <div className="gallery-grid">
          {gallery.items.map((item, index) => (
            <div 
              key={item.id} 
              className="gallery-item group cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index)
                setLightboxOpen(true)
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setCurrentImageIndex(index)
                  setLightboxOpen(true)
                }
              }}
            >
              <div className="relative w-full h-full bg-white p-6 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when no images */}
        {gallery.items.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No images</h3>
            <p className="mt-2 text-gray-500">
              This gallery doesn't have any images yet.
            </p>
          </div>
        )}

        {/* Lightbox */}
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={gallery.items}
          currentIndex={currentImageIndex}
          onNavigate={setCurrentImageIndex}
        />
      </div>
    </main>
  )
}