// پارس کردن وضعیت صندلی‌ها و کلاس‌های پروازی
export function parseNiraClasses(classesStatus) {
  if (!classesStatus) return { available: false, seats: 0, rbd: '' }

  // فرمت نیرا معمولاً به صورت کدهای متوالی است مثل: Y9 Q9 C0 X0 (کلاس C و X معمولاً یعنی پر یا باطل شده)
  const classes = classesStatus.split(' ')
  
  for (const item of classes) {
    if (!item) continue
    const rbd = item[0] // کلاس نرخی مثل Y
    const status = item.substring(1) // ظرفیت صندلی یا وضعیت مثل C یا X یا عدد صندلی

    if (status === 'C' || status === 'X' || status === '0') {
      continue // صندلی پر است یا باطل شده، کلاس بعدی را بررسی کن
    }

    const seats = parseInt(status, 10)
    if (!isNaN(seats) && seats > 0) {
      return { available: true, seats, rbd }
    }
  }

  return { available: false, seats: 0, rbd: '' }
}

// پارس کردن و استخراج قیمت بزرگسال از فیلد قیمت‌های نیرا
export function parseNiraPrices(adultTotalPrices) {
  if (!adultTotalPrices) return { min: 0 }
  
  // تبدیل قیمت به عدد و پیدا کردن ارزان‌ترین نرخ
  const prices = adultTotalPrices.split(',').map(p => parseFloat(p)).filter(p => !isNaN(p) && p > 0)
  if (prices.length === 0) return { min: 0 }

  return { min: Math.min(...prices) }
}
