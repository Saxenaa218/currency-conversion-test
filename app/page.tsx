'use client'

import { useState, useEffect } from 'react'

// Currency data and mappings
const countryToCurrency: Record<string, string> = {
  'US': 'USD', 'CA': 'CAD', 'MX': 'MXN', 'GB': 'GBP', 'FR': 'EUR', 'DE': 'EUR', 
  'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR', 
  'GR': 'EUR', 'FI': 'EUR', 'IE': 'EUR', 'CH': 'CHF', 'NO': 'NOK', 'SE': 'SEK', 
  'DK': 'DKK', 'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN', 
  'HR': 'EUR', 'RS': 'RSD', 'RU': 'RUB', 'UA': 'UAH', 'CN': 'CNY', 'JP': 'JPY', 
  'KR': 'KRW', 'IN': 'INR', 'ID': 'IDR', 'TH': 'THB', 'MY': 'MYR', 'SG': 'SGD', 
  'PH': 'PHP', 'VN': 'VND', 'AU': 'AUD', 'NZ': 'NZD', 'BR': 'BRL', 'AR': 'ARS', 
  'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN', 'ZA': 'ZAR', 'NG': 'NGN', 'KE': 'KES', 
  'EG': 'EGP', 'AE': 'AED', 'SA': 'SAR', 'IL': 'ILS', 'TR': 'TRY'
}

const currencySymbols: Record<string, string> = {
  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥', 'INR': '₹', 
  'KRW': '₩', 'CAD': '$', 'AUD': '$', 'CHF': 'CHF', 'SEK': 'kr', 'NOK': 'kr', 
  'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft', 'RUB': '₽', 'BRL': 'R$', 
  'MXN': '$', 'SGD': '$', 'HKD': '$', 'NZD': '$', 'ZAR': 'R', 'TRY': '₺', 
  'AED': 'د.إ', 'SAR': 'ر.س', 'ILS': '₪', 'THB': '฿', 'MYR': 'RM', 'IDR': 'Rp', 
  'PHP': '₱', 'VND': '₫', 'EGP': 'ج.م', 'NGN': '₦', 'KES': 'KSh'
}

interface DetectionResult {
  method: string
  country?: string
  currency?: string
  success: boolean
  data?: any
  error?: string
}

export default function CurrencyTestPage() {
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([])
  const [finalCurrency, setFinalCurrency] = useState<string>('USD')
  const [finalCountry, setFinalCountry] = useState<string>('US')
  const [isLoading, setIsLoading] = useState(true)
  const [browserInfo, setBrowserInfo] = useState<any>({})

  useEffect(() => {
    detectCurrency()
  }, [])

  const detectCurrency = async () => {
    const results: DetectionResult[] = []
    let detectedCountry = 'US'
    let detectedCurrency = 'USD'

    // Gather browser info
    const info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
    }
    setBrowserInfo(info)

    // Method 1: Check cookies (from server middleware)
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        if (key && value) acc[key] = value
        return acc
      }, {} as Record<string, string>)

      if (cookies['user-currency'] && cookies['user-country']) {
        results.push({
          method: 'Cookies (Server)',
          country: cookies['user-country'],
          currency: cookies['user-currency'],
          success: true,
          data: cookies
        })
        detectedCountry = cookies['user-country']
        detectedCurrency = cookies['user-currency']
      } else {
        results.push({
          method: 'Cookies (Server)',
          success: false,
          error: 'No currency cookies found'
        })
      }
    } catch (error: any) {
      results.push({
        method: 'Cookies (Server)',
        success: false,
        error: error?.message || 'Unknown error'
      })
    }

    // Method 2: Intl.NumberFormat currency
    try {
      const intlCurrency = Intl.NumberFormat().resolvedOptions().currency
      if (intlCurrency) {
        results.push({
          method: 'Intl.NumberFormat',
          currency: intlCurrency,
          success: true,
          data: { currency: intlCurrency }
        })
        if (detectedCurrency === 'USD') {
          detectedCurrency = intlCurrency
        }
      } else {
        results.push({
          method: 'Intl.NumberFormat',
          success: false,
          error: 'No currency detected'
        })
      }
    } catch (error: any) {
      results.push({
        method: 'Intl.NumberFormat',
        success: false,
        error: error?.message || 'Unknown error'
      })
    }

    // Method 3: Browser language/locale
    try {
      const languages = navigator.languages || [navigator.language]
      let foundCountry = null
      
      for (const lang of languages) {
        const countryFromLocale = lang.split('-')[1]?.toUpperCase()
        if (countryFromLocale && countryToCurrency[countryFromLocale]) {
          foundCountry = countryFromLocale
          break
        }
      }

      if (foundCountry) {
        const currency = countryToCurrency[foundCountry]
        results.push({
          method: 'Browser Languages',
          country: foundCountry,
          currency: currency,
          success: true,
          data: { languages, detectedCountry: foundCountry }
        })
        if (detectedCountry === 'US') {
          detectedCountry = foundCountry
          detectedCurrency = currency
        }
      } else {
        results.push({
          method: 'Browser Languages',
          success: false,
          error: 'No country detected from languages',
          data: { languages }
        })
      }
    } catch (error: any) {
      results.push({
        method: 'Browser Languages',
        success: false,
        error: error?.message || 'Unknown error'
      })
    }

    // Method 4: Timezone detection
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const timezoneToCountry: Record<string, string> = {
        'America/New_York': 'US', 'America/Chicago': 'US', 'America/Los_Angeles': 'US',
        'America/Denver': 'US', 'America/Toronto': 'CA', 'America/Vancouver': 'CA',
        'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
        'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
        'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK',
        'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Seoul': 'KR',
        'Asia/Kolkata': 'IN', 'Asia/Singapore': 'SG', 'Asia/Bangkok': 'TH',
        'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
        'America/Sao_Paulo': 'BR', 'America/Mexico_City': 'MX'
      }

      const countryFromTimezone = timezoneToCountry[timezone]
      if (countryFromTimezone) {
        const currency = countryToCurrency[countryFromTimezone]
        results.push({
          method: 'Timezone',
          country: countryFromTimezone,
          currency: currency,
          success: true,
          data: { timezone, detectedCountry: countryFromTimezone }
        })
        if (detectedCountry === 'US' && countryFromTimezone !== 'US') {
          detectedCountry = countryFromTimezone
          detectedCurrency = currency
        }
      } else {
        results.push({
          method: 'Timezone',
          success: false,
          error: 'Timezone not mapped to country',
          data: { timezone }
        })
      }
    } catch (error: any) {
      results.push({
        method: 'Timezone',
        success: false,
        error: error?.message || 'Unknown error'
      })
    }

    // Method 5: IP-based detection (client-side)
    try {
      // Get public IP
      const ipResponse = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(5000)
      })
      
      if (ipResponse.ok) {
        const ipData = await ipResponse.json()
        
        if (ipData.ip && ipData.ip !== '127.0.0.1') {
          // Get location from IP
          try {
            const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`, {
              signal: AbortSignal.timeout(5000)
            })
            
            if (locationResponse.ok) {
              const locationData = await locationResponse.json()
              if (locationData.country_code && locationData.country_code !== 'XX') {
                const country = locationData.country_code.toUpperCase()
                const currency = countryToCurrency[country] || 'USD'
                
                results.push({
                  method: 'IP Geolocation',
                  country: country,
                  currency: currency,
                  success: true,
                  data: { ip: ipData.ip, location: locationData }
                })
                
                // Use IP detection as highest priority if different from default
                detectedCountry = country
                detectedCurrency = currency
              } else {
                results.push({
                  method: 'IP Geolocation',
                  success: false,
                  error: 'Invalid country code from API',
                  data: locationData
                })
              }
            } else {
              results.push({
                method: 'IP Geolocation',
                success: false,
                error: `Location API failed: ${locationResponse.status}`
              })
            }
          } catch (locError: any) {
            results.push({
              method: 'IP Geolocation',
              success: false,
              error: `Location detection failed: ${locError?.message || 'Unknown error'}`
            })
          }
        } else {
          results.push({
            method: 'IP Geolocation',
            success: false,
            error: 'Local IP detected, skipping geolocation',
            data: ipData
          })
        }
      } else {
        results.push({
          method: 'IP Geolocation',
          success: false,
          error: `IP detection failed: ${ipResponse.status}`
        })
      }
    } catch (error: any) {
      results.push({
        method: 'IP Geolocation',
        success: false,
        error: error?.message || 'Unknown error'
      })
    }

    setDetectionResults(results)
    setFinalCountry(detectedCountry)
    setFinalCurrency(detectedCurrency)
    setIsLoading(false)
  }

  const formatPrice = (amount: number, currency: string) => {
    const symbol = currencySymbols[currency] || currency
    return `${symbol}${amount.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Currency Detection Test
          </h1>
          
          {/* Final Result */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              🎯 Final Detection Result
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{finalCountry}</div>
                <div className="text-sm text-gray-600">Country</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{finalCurrency}</div>
                <div className="text-sm text-gray-600">Currency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(29.99, finalCurrency)}
                </div>
                <div className="text-sm text-gray-600">Sample Price</div>
              </div>
            </div>
          </div>

          {/* Sample Pricing */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              💰 Sample Pricing in {finalCurrency}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-lg font-semibold">Basic</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(9.99, finalCurrency)}
                </div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow border-2 border-green-500">
                <div className="text-lg font-semibold">Pro</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(29.99, finalCurrency)}
                </div>
                <div className="text-sm text-gray-500">/month</div>
                <div className="text-xs text-green-600 font-medium">RECOMMENDED</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-lg font-semibold">Enterprise</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(99.99, finalCurrency)}
                </div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
            </div>
          </div>

          {/* Detection Methods */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🔍 Detection Methods Results
            </h2>
            <div className="space-y-4">
              {detectionResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{result.method}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        result.success
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {result.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </div>
                  
                  {result.success ? (
                    <div className="text-sm">
                      {result.country && (
                        <div><strong>Country:</strong> {result.country}</div>
                      )}
                      {result.currency && (
                        <div><strong>Currency:</strong> {result.currency}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">
                        View raw data
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Browser Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🌐 Browser Information
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Language:</strong> {browserInfo.language}</div>
                <div><strong>Platform:</strong> {browserInfo.platform}</div>
                <div><strong>Timezone:</strong> {browserInfo.timezone}</div>
                <div><strong>Locale:</strong> {browserInfo.locale}</div>
              </div>
              <div className="mt-4">
                <strong>Languages:</strong> {browserInfo.languages?.join(', ')}
              </div>
              <div className="mt-2">
                <strong>User Agent:</strong>
                <div className="text-xs bg-white p-2 rounded mt-1 break-all">
                  {browserInfo.userAgent}
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="mt-2 text-gray-600">Detecting currency...</div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setIsLoading(true)
                setDetectionResults([])
                detectCurrency()
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh Detection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
