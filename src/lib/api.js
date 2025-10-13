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


