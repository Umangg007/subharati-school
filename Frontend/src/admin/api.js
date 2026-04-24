import { apiRequest } from '../utils/api';

export const getAdminStats = async () => {
  return apiRequest('/api/admin/stats', { auth: true });
};

// Admissions
export const getAdmissions = async (page = 1, limit = 20) => {
  return apiRequest(`/api/admissions?page=${page}&limit=${limit}`, { auth: true });
};
export const deleteAdmission = async (id) => {
  return apiRequest(`/api/admissions/${id}`, { method: 'DELETE', auth: true });
};
export const updateAdmissionStatus = async (id, status) => {
  return apiRequest(`/api/admissions/${id}/status`, { method: 'PATCH', body: { status }, auth: true });
};

// Enquiries
export const getEnquiries = async (page = 1, limit = 20) => {
  return apiRequest(`/api/enquiries?page=${page}&limit=${limit}`, { auth: true });
};
export const deleteEnquiry = async (id) => {
  return apiRequest(`/api/enquiries/${id}`, { method: 'DELETE', auth: true });
};
export const updateEnquiryStatus = async (id, status) => {
  return apiRequest(`/api/enquiries/${id}/status`, { method: 'PATCH', body: { status }, auth: true });
};

// Events
export const getEvents = async (page = 1, limit = 20) => {
  return apiRequest(`/api/events?page=${page}&limit=${limit}`);
};
export const createEvent = async (data) => {
  return apiRequest('/api/events', { method: 'POST', body: data, auth: true });
};
export const deleteEvent = async (id) => {
  return apiRequest(`/api/events/${id}`, { method: 'DELETE', auth: true });
};

// Notices
export const getNotices = async (page = 1, limit = 20) => {
  return apiRequest(`/api/notices?page=${page}&limit=${limit}`);
};
export const createNotice = async (data) => {
  return apiRequest('/api/notices', { method: 'POST', body: data, auth: true });
};
export const deleteNotice = async (id) => {
  return apiRequest(`/api/notices/${id}`, { method: 'DELETE', auth: true });
};

// Gallery
export const getGallery = async ({ page = 1, limit = 100, search = '', category = 'All', section = '' } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search.trim())            params.set('search', search.trim());
  if (category && category !== 'All') params.set('category', category);
  if (section  && section  !== 'All') params.set('section',  section);
  return apiRequest(`/api/gallery?${params.toString()}`);
};
export const createGallery = async (data) => {
  return apiRequest('/api/gallery', { method: 'POST', body: data, auth: true });
};
export const deleteGallery = async (id) => {
  return apiRequest(`/api/gallery/${id}`, { method: 'DELETE', auth: true });
};
export const updateGallery = async ({ id, ...data }) => {
  return apiRequest(`/api/gallery/${id}`, { method: 'PATCH', body: data, auth: true });
};
export const bulkDeleteGallery = async (ids) => {
  return apiRequest('/api/gallery/bulk-delete', { method: 'POST', body: { ids }, auth: true });
};

// Upload
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest('/api/uploads', { method: 'POST', body: formData, auth: true });
};

// Videos
export const getVideos = async ({ search = '', category = 'All' } = {}) => {
  const params = new URLSearchParams();
  if (search.trim()) params.set('search', search.trim());
  if (category && category !== 'All') params.set('category', category);
  return apiRequest(`/api/videos?${params.toString()}`);
};
export const uploadVideo = async (file, metadata = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title || file.name.replace(/\.[^/.]+$/, ''));
  formData.append('description', metadata.description || '');
  formData.append('category', metadata.category || 'Infrastructure');
  return apiRequest('/api/videos', { method: 'POST', body: formData, auth: true });
};
export const deleteVideo = async (id) => {
  return apiRequest(`/api/videos/${id}`, { method: 'DELETE', auth: true });
};
export const updateVideo = async ({ id, ...data }) => {
  return apiRequest(`/api/videos/${id}`, { method: 'PATCH', body: data, auth: true });
};

// Auth
export const changePassword = async (currentPassword, newPassword) => {
  return apiRequest('/api/auth/change-password', { method: 'POST', body: { currentPassword, newPassword }, auth: true });
};
