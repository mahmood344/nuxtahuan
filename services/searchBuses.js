import { searchNiraBuses } from './providers/niraBus.js'

let latestSearchId = 0

export async function searchAllBusProviders(searchParams) {
  const searchId = ++latestSearchId

  const params = {
    origin: String(searchParams.origin || searchParams.from || '').trim().toUpperCase(),
    destination: String(searchParams.destination || searchParams.to || '').trim().toUpperCase(),
    departureDate: String(searchParams.departureDate || searchParams.departDate || '').replace(/[-/]/g, ''),
    no: Number(searchParams.no || 1)
  }

  if (!params.origin || !params.destination || !/^\d{8}$/.test(params.departureDate)) {
    throw new Error('مبدأ، مقصد یا تاریخ حرکت معتبر نیست')
  }

  try {
    const buses = await searchNiraBuses(params)

    if (searchId !== latestSearchId) return []

    return Array.isArray(buses) ? buses : []
  } catch (error) {
    if (searchId !== latestSearchId) return []

    console.error('Bus Search Error:', error)
    throw error
  }
}