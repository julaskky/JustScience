const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/justscience/api'
).replace(/\/+$/, '');

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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
    throw new Error(data.message || 'Unable to complete request.');
  }

  return data;
}

export const api = {
  getServices() {
    return request('services.php', {
      method: 'GET',
    });
  },

  getHealth() {
    return request('index.php', {
      method: 'GET',
    });
  },

  submitEnrollment(enrollmentData) {
    return request('enrollments.php', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  },
};