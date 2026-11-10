
const BASE_URL = 'https://api.ahuan.ir/api'

function mapNiraBus(bus, index) {
  const capacity = Number(bus.capacity || 0)
  const price = Number(bus.tripDestinationFare || 0)

  const isCanceled =
    String(bus.explanation || '').includes('کنسل') ||
    String(bus.type || '').includes('کنسل')

  const disabled =
    capacity <= 0 ||
    price <= 0 ||
    isCanceled

  return {
    id: `NIRABUS-${bus.moveCode || index}`,

    provider: 'NIRABUS',

    companyCode: bus.companyCode || '',
    companyName: bus.companyName || '',
    companyBrand: bus.rmtO_CompanyBrand || '',

    moveCode: bus.moveCode || '',

    origin: bus.tripOrigin || '',
    originName: bus.tripOriginName || '',

    destination: bus.tripDestination || '',
    destinationName: bus.tripDestinationName || '',

    departureDate: bus.departureDate || '',
    departureTime: bus.hour || '',

    busType: bus.type || '',
    busTypeCode: bus.typeE || '',

    capacity,
    priceFrom: price,
    currency: 'IRR',

    ridingPlace: bus.ridingPlace || '',
    getOffPlace: bus.getOffPlace || '',
    explanation: bus.explanation || '',

    disabled,
    statusMessage: disabled
      ? isCanceled
        ? 'کنسل شده'
        : capacity <= 0
          ? 'تکمیل ظرفیت'
          : 'قیمت نامعتبر'
      : 'قابل خرید',

    meta: {
      raw: bus
    }
  }
}

export async function searchNiraBuses(params) {
  try {
    const response = await $fetch(
      `${BASE_URL}/nira-bus/availability`,
      {
        method: 'GET',
        params: {
          origin: String(params.origin || '').toUpperCase(),
          destination: String(params.destination || '').toUpperCase(),
          departureDate: String(params.departureDate || '').replace(/[-/]/g, ''),
          no: Number(params.no || 1)
        }
      }
    )

    const availableBuses = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
        ? response
        : []

    return availableBuses
      .map((bus, index) => mapNiraBus(bus, index))
      .sort((a, b) => {
        if (a.disabled !== b.disabled) {
          return a.disabled ? 1 : -1
        }

        return a.priceFrom - b.priceFrom
      })

  } catch (error) {
    console.error('NIRA BUS Availability Error:', error)

    throw new Error(
      error?.data?.error ||
      error?.data?.message ||
      error?.message ||
      'خطا در دریافت سرویس‌های اتوبوس'
    )
  }
}
