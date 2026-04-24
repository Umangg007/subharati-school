import { apiRequest } from '../utils/api';

export const adminService = {
  // Get admin dashboard stats
  getStats: async () => {
    return await apiRequest('/api/admin/stats', { auth: true });
  },

  // Get all admissions
  getAdmissions: async (page = 1, limit = 10) => {
    return await apiRequest(`/api/admissions?page=${page}&limit=${limit}`, { auth: true });
  },

  // Get all enquiries
  getEnquiries: async (page = 1, limit = 10) => {
    return await apiRequest(`/api/enquiries?page=${page}&limit=${limit}`, { auth: true });
  },

  // Get all notices
  getNotices: async (page = 1, limit = 10) => {
    return await apiRequest(`/api/notices?page=${page}&limit=${limit}`, { auth: true });
  },

  // Get all events
  getEvents: async (page = 1, limit = 10) => {
    return await apiRequest(`/api/events?page=${page}&limit=${limit}`, { auth: true });
  },

  // Get gallery items
  getGallery: async (page = 1, limit = 10) => {
    return await apiRequest(`/api/gallery?page=${page}&limit=${limit}`, { auth: true });
  },

  // Create new notice
  createNotice: async (noticeData) => {
    return await apiRequest('/api/notices', {
      method: 'POST',
      body: noticeData,
      auth: true
    });
  },

  // Create new event
  createEvent: async (eventData) => {
    return await apiRequest('/api/events', {
      method: 'POST',
      body: eventData,
      auth: true
    });
  },

  // Update notice
  updateNotice: async (id, noticeData) => {
    return await apiRequest(`/api/notices/${id}`, {
      method: 'PUT',
      body: noticeData,
      auth: true
    });
  },

  // Update event
  updateEvent: async (id, eventData) => {
    return await apiRequest(`/api/events/${id}`, {
      method: 'PUT',
      body: eventData,
      auth: true
    });
  },

  // Delete notice
  deleteNotice: async (id) => {
    return await apiRequest(`/api/notices/${id}`, {
      method: 'DELETE',
      auth: true
    });
  },

  // Delete event
  deleteEvent: async (id) => {
    return await apiRequest(`/api/events/${id}`, {
      method: 'DELETE',
      auth: true
    });
  },

  // Delete gallery item
  deleteGalleryItem: async (id) => {
    return await apiRequest(`/api/gallery/${id}`, {
      method: 'DELETE',
      auth: true
    });
  },

  // Upload file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return await apiRequest('/api/uploads', {
      method: 'POST',
      body: formData,
      auth: true
    });
  }
};
