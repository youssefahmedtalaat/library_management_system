/**
 * Smart Library LMS Frontend API Client
 * Seamlessly interfaces with the Node.js REST API (/api/v1)
 * Defined in Section 04 & 05 of the LMS Implementation Specification
 */

const API_BASE = '/api/v1';

function getToken() {
  try {
    return localStorage.getItem('library_token') || null;
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = body?.error?.message || `HTTP error ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = body?.error?.code || 'API_ERROR';
    error.data = body;
    throw error;
  }

  return body?.data;
}

export const api = {
  // Authentication
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me')
  },

  // Catalog
  books: {
    list: (params = {}) => {
      const search = new URLSearchParams();
      if (params.q) search.append('q', params.q);
      if (params.category) search.append('category', params.category);
      if (params.availability) search.append('availability', params.availability);
      if (params.page) search.append('page', params.page);
      if (params.limit) search.append('limit', params.limit);
      const queryStr = search.toString();
      return request(`/books${queryStr ? `?${queryStr}` : ''}`);
    },
    get: (id) => request(`/books/${id}`),
    create: (bookData) => request('/books', { method: 'POST', body: JSON.stringify(bookData) }),
    update: (id, bookData) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(bookData) }),
    delete: (id) => request(`/books/${id}`, { method: 'DELETE' }),
    categories: () => request('/books/categories'),
    authors: () => request('/books/authors'),
    getRatings: (id) => request(`/books/${id}/ratings`),
    rate: (id, ratingData) => request(`/books/${id}/ratings`, { method: 'POST', body: JSON.stringify(ratingData) })
  },

  // Circulation (Loans, Returns, Renewals)
  circulation: {
    issueLoan: (loanData) => request('/loans', { method: 'POST', body: JSON.stringify(loanData) }),
    returnLoan: (loanId) => request(`/loans/${loanId}/return`, { method: 'POST' }),
    renewLoan: (loanId) => request(`/loans/${loanId}/renew`, { method: 'POST' }),
    placeReservation: (resData) => request('/reservations', { method: 'POST', body: JSON.stringify(resData) }),
    listReservations: (params = {}) => {
      const search = new URLSearchParams();
      if (params.bookId) search.append('bookId', params.bookId);
      if (params.status) search.append('status', params.status);
      const queryStr = search.toString();
      return request(`/reservations${queryStr ? `?${queryStr}` : ''}`);
    },
    cancelReservation: (id) => request(`/reservations/${id}/cancel`, { method: 'POST' }),
    listFines: (params = {}) => {
      const search = new URLSearchParams();
      if (params.status) search.append('status', params.status);
      const queryStr = search.toString();
      return request(`/fines${queryStr ? `?${queryStr}` : ''}`);
    },
    settleFine: (id) => request(`/fines/${id}/settle`, { method: 'POST' })
  },

  // Members
  members: {
    getMyLoans: (status) => request(`/members/me/loans${status ? `?status=${status}` : ''}`),
    getMyReservations: () => request('/members/me/reservations'),
    getMyFines: () => request('/members/me/fines'),
    search: (query) => request(`/members${query ? `?q=${encodeURIComponent(query)}` : ''}`),
    get: (id) => request(`/members/${id}`)
  },

  // AI Assistant Discovery
  ai: {
    ask: ({ prompt, message, locale }) =>
      request('/ai/assistant', {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt || message, locale: locale || 'ar' })
      })
  },

  // Admin
  admin: {
    getStaff: () => request('/admin/staff'),
    createStaff: (staffData) => request('/admin/staff', { method: 'POST', body: JSON.stringify(staffData) }),
    updateStaffStatus: (id, status) => request(`/admin/staff/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getPolicies: () => request('/admin/policies'),
    updatePolicies: (policies) => request('/admin/policies', { method: 'PUT', body: JSON.stringify(policies) }),
    getAuditLogs: (params = {}) => {
      const search = new URLSearchParams();
      if (params.page) search.append('page', params.page);
      if (params.limit) search.append('limit', params.limit);
      if (params.action) search.append('action', params.action);
      const queryStr = search.toString();
      return request(`/admin/audit-logs${queryStr ? `?${queryStr}` : ''}`);
    }
  }
};
