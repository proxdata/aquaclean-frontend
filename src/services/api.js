const BASE_URL = 'http://localhost:3001/api'

function getToken() {
  return localStorage.getItem('cw_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro na requisição')
  return data
}

export const api = {
  // Auth
  loginClient: (email, password) => request('POST', '/auth/client/login', { email, password }),
  loginAdmin: (password) => request('POST', '/auth/admin/login', { password }),

  // Plans
  getPlans: () => request('GET', '/plans'),

  // Clients
  getClients: () => request('GET', '/clients'),
  getMe: () => request('GET', '/clients/me'),
  createClient: (data) => request('POST', '/clients', data),
  updateClientStatus: (id, status) => request('PATCH', `/clients/${id}/status`, { status }),
  deleteClient: (id) => request('DELETE', `/clients/${id}`),

  // Washes
  getMyWashes: () => request('GET', '/washes/mine'),
  getAllWashes: () => request('GET', '/washes'),
  getClientWashes: (clientId) => request('GET', `/washes/client/${clientId}`),
  registerWash: (data) => request('POST', '/washes', data),

  // Stats
  getStats: () => request('GET', '/stats'),

  // Token helpers
  saveToken: (token) => localStorage.setItem('cw_token', token),
  clearToken: () => localStorage.removeItem('cw_token'),
  hasToken: () => !!getToken(),
}
