export async function fetchWines({ signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = import.meta.env.VITE_AUTH_TOKEN

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('VITE_AUTH_TOKEN is not set')

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
  const token = import.meta.env.VITE_AUTH_TOKEN

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('VITE_AUTH_TOKEN is not set')
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

export async function fetchPaginatedWines({ page = 0, limit = 5, order = 'DESC', orderBy = 'total', signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = import.meta.env.VITE_AUTH_TOKEN

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('VITE_AUTH_TOKEN is not set')

  const url = new URL(`${baseUrl}/api/wines/paginated`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('order', order)
  url.searchParams.set('orderBy', orderBy)

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
  const token = import.meta.env.VITE_AUTH_TOKEN

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('VITE_AUTH_TOKEN is not set')

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
  const token = import.meta.env.VITE_AUTH_TOKEN

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('VITE_AUTH_TOKEN is not set')

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

export async function fetchMovementsByMonth({ year, month, signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE
  const token = import.meta.env.VITE_AUTH_TOKEN

  if (!baseUrl) throw new Error('VITE_API_BASE is not set')
  if (!token) throw new Error('VITE_AUTH_TOKEN is not set')
  if (typeof year !== 'number' || typeof month !== 'number') {
    throw new Error('year and month are required numbers')
  }

  const url = new URL(`${baseUrl}/api/movements/by-month`)
  url.searchParams.set('year', String(year))
  url.searchParams.set('month', String(month))

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

