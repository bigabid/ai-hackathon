export interface Gallery {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  items: GalleryItem[]
}

export interface GalleryItem {
  id: string
  galleryId: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl: string
  title?: string
  description?: string
  createdAt: Date
}

export interface AdminUser {
  id: string
  username: string
  createdAt: Date
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}
