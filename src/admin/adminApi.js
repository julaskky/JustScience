
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/justscience/api'
).replace(/\/+$/, '');

let csrfToken = '';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers,
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('The server returned an invalid response.');
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Unable to complete the request.');
  }

  if (data.csrf_token) {
    csrfToken = data.csrf_token;
  }

  return data;
}

export const adminApi = {
  // Authentication
  async getCsrfToken() {
    const data = await request('admin-auth.php?action=csrf');
    csrfToken = data.csrf_token;
    return data;
  },

  async getSession() {
    return request('admin-auth.php?action=me');
  },

  login(email, password) {
    return request('admin-auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return request('admin-auth.php?action=logout', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  // Enrolment management
  getEnrollments(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });

    return request(`admin-enrollments.php?${params.toString()}`);
  },

  getEnrollment(id) {
    return request(`admin-enrollments.php?id=${encodeURIComponent(id)}`);
  },

  updateStatus(id, status) {
    return request('admin-enrollments.php', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
    });
  },

  // Course management
  getCourses() {
    return request('admin-courses.php');
  },

  saveCourse(course) {
    return request('admin-courses.php', {
      method: 'POST',
      body: JSON.stringify({
        action: 'save',
        ...course,
      }),
    });
  },

  updateCourseStatus(id, isActive) {
    return request('admin-courses.php', {
      method: 'POST',
      body: JSON.stringify({
        action: 'status',
        id,
        is_active: isActive ? 1 : 0,
      }),
    });
  },
};
