# Simple Gallery PRD

## Overview
A simple photo and video gallery application focused on personal sharing with friends and family. The application will provide an easy-to-use admin interface for uploading and organizing media, and generate shareable links for viewing.

## Core Features

### Admin Interface
- Single admin account with username/password login
- Simple dashboard to manage galleries
- Drag-and-drop file upload support
- Basic gallery organization (create, rename, delete galleries)
- Copy-to-clipboard share link generation

### Gallery View
- Clean, responsive layout for both desktop and mobile
- Support for images (jpg, png, gif) and videos (mp4)
- Basic media preview with lightbox view
- No authentication required for viewing shared galleries

### Technical Specifications

#### Authentication
- Simple username/password for admin
- No authentication required for gallery viewers
- Share links using unique, hard-to-guess URLs

#### File Handling
- Local file storage for MVP
- Support for common image and video formats
- Basic file validation and size limits
- Thumbnail generation for gallery previews

#### User Interface
- Modern, responsive design
- Drag-and-drop upload interface
- Simple navigation and organization
- Mobile-friendly viewing experience

## MVP Success Criteria
1. Admin can upload and organize media files
2. Galleries can be shared via unique links
3. Viewers can easily browse and view media
4. Interface works well on both desktop and mobile
5. Basic security measures are in place

## Future Enhancements (Post-MVP)
- Cloud storage integration
- Additional media format support
- Advanced gallery organization features
- Analytics and viewer tracking
- Enhanced security options

## Technical Stack
- Frontend: Next.js + React + Tailwind CSS
- Backend: Next.js API routes
- Database: SQLite for MVP
- Authentication: Next-Auth
- File handling: Local storage + Sharp for image processing
- Testing: Vitest + Playwright

## Security Considerations
- Secure admin authentication
- Rate limiting for uploads and API
- File type validation
- Unique, non-sequential gallery URLs
