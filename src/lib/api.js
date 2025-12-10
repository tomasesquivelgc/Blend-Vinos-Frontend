// Token management
let authToken = null

export function setAuthToken(token) {
  authToken = token
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

export function getAuthToken() {
  if (!authToken) {
    authToken = localStorage.getItem('authToken')
  }
  return authToken
}

export function clearAuthToken() {
  authToken = null
  localStorage.removeItem('authToken')
}

// Check if token is expired
export function isTokenExpired(token) {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

export async function fetchWines({ signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${baseUrl}/api/wines`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function fetchWineByCode(code, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')
  if (!code || String(code).trim().length === 0) throw new Error('code is required')

  const response = await fetch(`${baseUrl}/api/wines/find/${encodeURIComponent(code)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function fetchPaginatedWines({ page = 0, limit = 5, order = 'DESC', orderBy = 'total', q, signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')

  const url = new URL(`${baseUrl}/api/wines/paginated`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('order', order)
  url.searchParams.set('orderBy', orderBy)
  if (q && String(q).trim().length > 0) url.searchParams.set('q', String(q).trim())

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}


export async function fetchUsers({ signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${baseUrl}/api/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function createMovement(body, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${baseUrl}/api/movements/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function fetchMovementsByMonth({ year, month, movementType, signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')
  if (typeof year !== 'number' || typeof month !== 'number') {
    throw new Error('year and month are required numbers')
  }

  const url = new URL(`${baseUrl}/api/movements/by-month`)
  url.searchParams.set('year', String(year))
  url.searchParams.set('month', String(month))
  if (movementType && String(movementType).trim().length > 0) {
    url.searchParams.set('accion', String(movementType).trim())
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function createWine(body, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${baseUrl}/api/wines/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function updateWine(id, body, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')
  if (!id) throw new Error('id is required')

  const response = await fetch(`${baseUrl}/api/wines/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function deleteWine(id, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')
  if (!id) throw new Error('id is required')

  const response = await fetch(`${baseUrl}/api/wines/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return true
}

export async function fetchWineById(id, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')
  if (!id) throw new Error('id is required')

  const response = await fetch(`${baseUrl}/api/wines/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function createUser(body, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function deleteUser(id, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')
  if (!id) throw new Error('id is required')

  const response = await fetch(`${baseUrl}/api/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return true
}

export async function login(credentials, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')

  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  const data = await response.json()
  if (data.token) {
    setAuthToken(data.token)
  }
  return data
}

export async function fetchTopSoldWines({ signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')

  const response = await fetch(`${baseUrl}/api/movements/top-sold`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}

export async function fetchCurrentUser({ signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE;
  const token = getAuthToken();

  if (!baseUrl) throw new Error('VITE_API_BASE is not set');
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${baseUrl}/api/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      throw new Error('Session expired. Please log in again.');
    }

    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`);
  }

  return await response.json();
}

export async function resetUserPassword(id, { signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = getAuthToken()

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('No authentication token')
  if (!id) throw new Error('id is required')

  const response = await fetch(`${baseUrl}/api/users/${encodeURIComponent(id)}/reset-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`)
  }

  return await response.json()
}
