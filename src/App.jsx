import React, { useEffect, useState } from 'react'

const MENU_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/10LBztm1g4YhgJ_rN6ymQUJNj9QUoJPotD1ah_3kUyK8/export?format=csv'
const MENU_CACHE_STORAGE_KEY = 'dopabeans-menu-cache-v1'
const MENU_CACHE_TTL_MS = 1000 * 60 * 30
const PRODUCT_IMAGE_MAP = {
  product_001: '/images/products/espresso.jpg',
  product_002: '/images/products/piccolo.jpg',
  product_003: '/images/products/cortado.jpg',
  product_004: '/images/products/cappuccino.jpg',
  product_005: '/images/products/americano.jpg',
  product_006: '/images/products/flat-white.jpg',
  product_007: '/images/products/latte.jpg',
  product_008: '/images/products/spanish-latte.jpg',
  product_009: '/images/products/dopabeans-signature-hot.jpg',
  product_010: '/images/products/spanish-cortado.jpg',
  product_011: '/images/products/pistachio-latte.jpg',
  product_012: '/images/products/dopabeans-signature-cold.jpg',
  product_013: '/images/products/iced-spanish-latte.jpg',
  product_014: '/images/products/iced-latte.jpg',
  product_015: '/images/products/iced-americano.jpg',
  product_016: '/images/products/iced-pistachio-latte.jpg',
  product_017: '/images/products/iced-tea.jpg',
  product_018: '/images/products/iced-tea-passion.jpg',
  product_019: '/images/products/iced-tea-peach.jpg',
  product_020: '/images/products/iced-tea-strawberry.jpg',
  product_021: '/images/products/regular-matcha.jpg',
  product_022: '/images/products/dopabeans-matcha.jpg',
  product_023: '/images/products/cloud-matcha.jpg',
  product_024: '/images/products/strawberry-matcha.jpg',
  product_025: '/images/products/spacial-karkade.jpg',
  product_026: '/images/products/dopabeans-mojitos.jpg',
  product_027: '/images/products/acai-smoothie.jpg',
  product_028: '/images/products/acai-bowl.jpg',
  product_029: '/images/products/v60.jpg',
  product_030: '/images/products/cold-brew.jpg'
}

const parseCsv = (csvText) => {
  const rows = []
  let currentRow = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i]
    const nextChar = csvText[i + 1]

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        currentField += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      currentRow.push(currentField)
      currentField = ''
      continue
    }

    if (char === '\r') {
      continue
    }

    if (char === '\n') {
      currentRow.push(currentField)
      rows.push(currentRow)
      currentRow = []
      currentField = ''
      continue
    }

    currentField += char
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField)
    rows.push(currentRow)
  }

  return rows
}

const buildMenuSections = (csvRows) => {
  if (!csvRows.length) return []

  const [headerRow, ...dataRows] = csvRows
  const headers = headerRow.map((header) => header.trim())

  const items = dataRows
    .filter((row) => row.some((cell) => cell && cell.trim() !== ''))
    .map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index] ? row[index].trim() : ''
        return acc
      }, {})
    )

  const sections = new Map()

  items.forEach((item) => {
    const category = item.product_category || 'Other'
    if (!sections.has(category)) {
      sections.set(category, [])
    }

    const priceValue = Number(item.product_price)
    sections.get(category).push({
      id: item.product_id || item.product_name,
      name: item.product_name || 'Untitled Item',
      price: Number.isFinite(priceValue) ? priceValue : null,
      rawPrice: item.product_price || '',
      imageUrl: item.product_image_url || '',
      description: item.product_description || '',
      link: item.product_link || '',
      availability: item.product_availability || 'in stock'
    })
  })

  return Array.from(sections.entries()).map(([category, products]) => ({
    category,
    products: products.sort((a, b) => {
      if (a.price == null && b.price == null) return 0
      if (a.price == null) return 1
      if (b.price == null) return -1
      return b.price - a.price
    })
  }))
}

const CurrencyIcon = ({ className = '' }) => (
  <svg
    className={`inline-block ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <path
      d="M6 4h7c4.5 0 7 3 7 8s-2.5 8-7 8H6V4z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <line x1="8" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const isTransparent = (color) => {
  if (!color) return true
  return color === 'transparent' || color === 'rgba(0, 0, 0, 0)'
}

const parseRgbString = (color) => {
  if (!color) return null
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i)
  if (!match) return null
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] ? parseFloat(match[4]) : 1
  }
}

const calculateLuminance = ({ r, g, b }) => {
  const channel = (value) => {
    const v = value / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }

  const [rLinear, gLinear, bLinear] = [channel(r), channel(g), channel(b)]
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

const getEffectiveBackground = (element) => {
  let el = element
  let safetyCounter = 0
  while (el && safetyCounter < 15) {
    const bg = window.getComputedStyle(el).backgroundColor
    if (!isTransparent(bg)) {
      const parsed = parseRgbString(bg)
      if (parsed) return parsed
    }
    el = el.parentElement
    safetyCounter += 1
  }
  return { r: 255, g: 255, b: 255, a: 1 }
}

const hasVisibleText = (element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (node.textContent.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
  })
  return Boolean(walker.nextNode())
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuSections, setMenuSections] = useState([])
  const [menuStatus, setMenuStatus] = useState('idle')
  const [menuError, setMenuError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
  }

  const scrollTo = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadFromCache = () => {
      if (typeof window === 'undefined') return null
      try {
        const rawCache = window.localStorage.getItem(MENU_CACHE_STORAGE_KEY)
        if (!rawCache) return null
        const parsedCache = JSON.parse(rawCache)
        if (!parsedCache || !Array.isArray(parsedCache.sections)) return null
        return parsedCache
      } catch (error) {
        return null
      }
    }

    const saveToCache = (sections) => {
      if (typeof window === 'undefined') return
      try {
        const payload = JSON.stringify({ sections, timestamp: Date.now() })
        window.localStorage.setItem(MENU_CACHE_STORAGE_KEY, payload)
      } catch (error) {
        // Swallow caching errors; rendering should continue
      }
    }

    const cachedMenu = loadFromCache()
    if (cachedMenu && isMounted) {
      setMenuSections(cachedMenu.sections)
      setMenuStatus('success')
    }

    const fetchMenu = async ({ background = false } = {}) => {
      if (!background) {
        setMenuStatus(cachedMenu ? 'success' : 'loading')
        setMenuError(null)
      }

      try {
        const response = await fetch(MENU_SHEET_CSV_URL, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (!response.ok) {
          throw new Error(`Unable to load menu data (${response.status})`)
        }

        const csvText = await response.text()
        const rows = parseCsv(csvText)
        const sections = buildMenuSections(rows)

        if (isMounted) {
          setMenuSections(sections)
          setMenuStatus('success')
          setMenuError(null)
          saveToCache(sections)
        }
      } catch (error) {
        if (!isMounted) return

        if (!background || !cachedMenu) {
          setMenuSections([])
          setMenuStatus('error')
        }
        setMenuError(error.message)
      }
    }

    const cacheTimestamp = typeof cachedMenu?.timestamp === 'number' ? cachedMenu.timestamp : 0
    const cacheIsStale = !cachedMenu || !cacheTimestamp || Date.now() - cacheTimestamp > MENU_CACHE_TTL_MS
    if (cacheIsStale) {
      fetchMenu({ background: false })
    } else {
      fetchMenu({ background: true })
    }

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined

    const root = document.querySelector('[data-auto-contrast-root]')
    if (!root) return undefined

    const applyContrast = () => {
      const elements = root.querySelectorAll('*:not([data-ignore-auto-contrast])')
      elements.forEach((element) => {
        if (!hasVisibleText(element)) return

        const background = getEffectiveBackground(element)
        const luminance = calculateLuminance(background)
        const color = luminance > 0.55 ? '#111111' : '#ffffff'

        if (element.dataset.autoContrastAppliedColor === color) return

        element.dataset.autoContrastAppliedColor = color
        element.style.color = color
        element.style.setProperty('--auto-contrast-color', color)
      })
    }

    const scheduleContrast = () => window.requestAnimationFrame(applyContrast)

    applyContrast()

    const observer = new MutationObserver(() => {
      scheduleContrast()
    })

    observer.observe(root, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    })

    window.addEventListener('resize', scheduleContrast)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', scheduleContrast)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!selectedProduct) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeProductModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProduct])

  return (
    <div
      className="font-sans bg-background text-fontLightBackground scroll-smooth"
      data-auto-contrast-root
      style={{ backgroundColor: '#E3E3DD' }}
    >
      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="px-2 sm:px-10 pt-6">
          <div className="bg-white bg-opacity-95 rounded shadow-2xl flex justify-between items-center py-1.5 sm:py-2 px-3 sm:px-5 w-full max-w-[96rem] mx-auto">
            <button type="button" onClick={() => scrollTo('home')} className="cursor-pointer bg-transparent border-0 p-0 flex-shrink-0">
              <img src="/images/logo.png" alt="DopaBeans logo" className="w-[180px] sm:w-[240px] h-auto" />
            </button>
            <nav
              className="hidden sm:flex sm:space-x-4 md:space-x-6 font-semibold text-base sm:text-lg text-[#23314F]"
              data-ignore-auto-contrast
            >
              <button
                onClick={() => scrollTo('menu')}
                className="hover:opacity-80 text-[#23314F]"
                data-ignore-auto-contrast
              >
                Menu
              </button>
              <button
                onClick={() => scrollTo('vision')}
                className="hover:opacity-80 text-[#23314F]"
                data-ignore-auto-contrast
              >
                Vision
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="hover:opacity-80 text-[#23314F]"
                data-ignore-auto-contrast
              >
                Contact
              </button>
              <button
                onClick={() => scrollTo('about')}
                className="hover:opacity-80 text-[#23314F]"
                data-ignore-auto-contrast
              >
                About Us
              </button>
            </nav>
            <button className="md:hidden text-[#23314F]" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#23314F] shadow px-4 pb-4 space-y-3 text-center">
            <button onClick={() => scrollTo('menu')} className="block w-full text-white">Menu</button>
            <button onClick={() => scrollTo('vision')} className="block w-full text-white">Vision</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-white">Contact</button>
            <button onClick={() => scrollTo('about')} className="block w-full text-white">About Us</button>
          </div>
        )}
      </header>

      <main className="pt-0 sm:pt-1">

        {/* Hero */}
        <section
          id="home"
          className="relative z-0 min-h-[80vh] flex items-center justify-center text-center pt-24 pb-44"
        >
          <div className="relative z-10 flex justify-center w-full px-2 sm:px-10 py-12 sm:py-20 overflow-auto">
            <div
              className="bg-white p-4 sm:p-6 rounded shadow-2xl"
              style={{ width: '96rem', minWidth: '96rem', maxWidth: '96rem', height: '54rem', minHeight: '54rem', maxHeight: '54rem' }}
            >
              <img
                src="/images/hero/hero.jpg"
                alt="Guests enjoying the atmosphere at DopaBeans Café"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 px-4 z-20" style={{ top: '40%' }}>
            <div className="bg-white bg-opacity-90 p-4 sm:p-6 rounded shadow-xl max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Welcome to DopaBeans</h2>
              <p className="text-3xl sm:text-5xl font-extrabold text-gray-800">Dopamine By Coffee Bean</p>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="-mt-32 sm:-mt-52 py-20 px-2 sm:px-10">
          <div className="w-full max-w-[96rem] mx-auto text-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">Our Menu</h2>
            <div className="space-y-16 w-full">
              {menuStatus === 'loading' && (
                <p className="text-center text-base sm:text-lg text-gray-600">Loading the latest menu…</p>
              )}

              {menuStatus === 'error' && (
                <div className="text-center text-base sm:text-lg text-red-700 bg-red-100 border border-red-200 rounded p-4">
                  <p>We couldn't load the menu right now.</p>
                  {menuError ? <p className="text-sm mt-2">{menuError}</p> : null}
                </div>
              )}

              {menuStatus === 'success' && menuSections.length === 0 && (
                <p className="text-center text-base sm:text-lg text-gray-600">Menu will be available shortly.</p>
              )}

              {menuSections.map((section) => (
                <div key={section.category}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">{section.category}</h3>
                  <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory pb-2 justify-start">
                    {section.products.map((item) => {
                      const normalizedAvailability = (item.availability || '').toLowerCase()
                      const isInStock = normalizedAvailability === 'in stock'
                      const displayPrice = item.price != null ? item.price : item.rawPrice || 'Ask'
                      const sheetImagePath = item.imageUrl ? item.imageUrl.replace(/^https?:\/\/[^/]+/i, '') : ''
                      const imageSrc = PRODUCT_IMAGE_MAP[item.id] || sheetImagePath || item.imageUrl || '/images/logo.png'
                      const productDetails = { ...item, displayPrice, imageSrc }

                      return (
                        <li
                          key={item.id}
                          className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left"
                        >
                          <button
                            type="button"
                            onClick={() => handleProductSelect(productDetails)}
                            className="mb-2 block w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#23314F]"
                            aria-label={`View details for ${item.name}`}
                          >
                            <img
                              src={imageSrc}
                              alt={item.name}
                              className="rounded w-full object-cover aspect-square max-w-[200px]"
                              loading="lazy"
                            />
                          </button>
                          <div className="text-sm sm:text-base">
                            <span className="font-medium block">{item.name}</span>
                            <span className="flex items-center gap-1">
                              <CurrencyIcon className="w-4 h-4" />
                              {displayPrice}
                            </span>
                            {!isInStock && normalizedAvailability && (
                              <span className="mt-1 inline-block text-xs uppercase tracking-wide text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded">
                                {item.availability}
                              </span>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* Vision */}
        <section id="vision" className="py-20 px-4 sm:px-8 text-center">
          <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Our Vision</h2>
            <p className="text-gray-700">
              More than a café – we are a community space for authentic moments, made possible through quality, care, and the joy of coffee.
            </p>
          </div>
        </section>

        {/* About Us */}
        <section id="about" className="py-20 px-4 sm:px-8 text-center">
          <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">About Us</h2>
            <p className="text-base sm:text-lg text-gray-700">
              More than just a café, DopaBeans is a gathering place where genuine moments come to life—rooted in quality craftsmanship, heartfelt care, and the simple joy that only exceptional coffee can bring.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 px-4 sm:px-8 text-center">
          <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Contact Us</h2>
            <p className="text-base sm:text-lg text-gray-700">info@dopabeansuae.com</p>
            <p className="text-base sm:text-lg text-gray-700">Instagram: @dopabeansuae</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white text-black py-8 text-center text-sm space-y-2">
          <p>© {new Date().getFullYear()} DopaBeans. All rights reserved.</p>
          <p>
            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
              data-ignore-auto-contrast
              style={{ color: '#23314F' }}
            >
              Privacy Policy
            </a>
          </p>
        </footer>

      </main>
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4"
          onClick={closeProductModal}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            aria-describedby={selectedProduct.description ? 'product-modal-description' : undefined}
          >
            <button
              type="button"
              onClick={closeProductModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white"
              aria-label="Close product details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className="bg-gray-100 p-4 rounded shadow text-left">
              <div className="overflow-hidden rounded">
                <img
                  src={selectedProduct.imageSrc}
                  alt={selectedProduct.name}
                  className="w-full object-cover aspect-square"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 id="product-modal-title" className="text-xl sm:text-2xl font-semibold text-[#23314F]">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  <CurrencyIcon className="w-5 h-5" />
                  {selectedProduct.displayPrice}
                </div>
                {selectedProduct.description ? (
                  <p id="product-modal-description" className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-gray-500 italic">Description coming soon.</p>
                )}
                {selectedProduct.availability && selectedProduct.availability.toLowerCase() !== 'in stock' && (
                  <span className="inline-block text-xs uppercase tracking-wide text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded">
                    {selectedProduct.availability}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
