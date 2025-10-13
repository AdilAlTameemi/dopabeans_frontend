import React, { useEffect, useMemo, useState } from 'react'

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

const BACKEND_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta?.env?.VITE_BACKEND_URL
    ? String(import.meta.env.VITE_BACKEND_URL).replace(/\/+$/, '')
    : ''

const buildBackendUrl = (path) => {
  if (typeof path !== 'string' || path.length === 0) return ''
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!BACKEND_BASE_URL) {
    return normalizedPath
  }
  return `${BACKEND_BASE_URL}${normalizedPath}`
}

const MILK_OPTIONS = [
  { value: 'normal', label: 'Normal Milk' },
  { value: 'coconut', label: 'Coconut Milk' },
  { value: 'almond', label: 'Almond Milk' },
  { value: 'oat', label: 'Oat Milk' },
  { value: 'none', label: 'No Milk' }
]

const NON_CUSTOMIZABLE_PRODUCTS = new Set([
  'special_karkade',
  'spacial_karkade',
  'mojitos',
  'dopabeans_mojitos',
  'acai_smoothie',
  'acai_bowl',
  'product_025',
  'product_026',
  'product_027',
  'product_028'
])

const getDefaultMilkValue = (options) => {
  const normalOption = options?.find((option) => option.value === 'normal')
  return normalOption?.value ?? options?.[0]?.value
}

const MilkSelector = ({ options, value, onChange }) => {
  const [selectedMilk, setSelectedMilk] = useState(() => value ?? getDefaultMilkValue(options))

  useEffect(() => {
    setSelectedMilk(value ?? getDefaultMilkValue(options))
  }, [value, options])

  const handleSelection = (optionValue) => {
    setSelectedMilk(optionValue)
    if (typeof onChange === 'function') {
      onChange(optionValue)
    }
  }

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedMilk === option.value
        const buttonClasses = isSelected
          ? 'bg-gray-200 border-gray-300'
          : 'bg-white border-gray-200 hover:bg-gray-100'

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelection(option.value)}
            className={`w-full flex items-center justify-between rounded border px-4 py-3 font-medium transition-colors text-black ${buttonClasses}`}
          >
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

const createInitialOrderFlowState = () => ({
  step: 'idle',
  type: null,
  table: null
})

const ORDER_TABLE_NUMBERS = Array.from({ length: 8 }, (_, index) => index + 1)

const createProductSlug = (rawValue) => {
  if (!rawValue) return ''
  return rawValue
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const CART_STORAGE_KEY = 'dopabeans-cart-v1'

const getProductKey = (product) => {
  if (!product) return ''
  if (product.id) return String(product.id).toLowerCase()
  if (product.slug) return String(product.slug).toLowerCase()
  if (product.name) return createProductSlug(product.name)
  return ''
}

const getProductSlugValue = (product) => createProductSlug(product?.slug || product?.name || product?.id)

const isProductCustomizable = (product) => {
  const slug = getProductSlugValue(product)
  const key = getProductKey(product)
  return !(NON_CUSTOMIZABLE_PRODUCTS.has(slug) || NON_CUSTOMIZABLE_PRODUCTS.has(key))
}

const sanitizeStoredCartItem = (entry) => {
  if (!entry || typeof entry !== 'object') return null
  const product = entry.product && typeof entry.product === 'object' ? entry.product : null
  if (!product) return null

  const quantityValue = Number(entry.quantity)
  const quantity = Number.isFinite(quantityValue) && quantityValue > 0 ? Math.min(20, Math.floor(quantityValue)) : 1
  const milk = typeof entry.milk === 'string' ? entry.milk : entry.milk === null ? null : null
  const productKey =
    entry.productKey ||
    (typeof entry.entryKey === 'string' ? entry.entryKey.split('::')[0] : '') ||
    getProductKey(product)

  if (!productKey) return null

  const entryKey = entry.entryKey || (milk ? `${productKey}::${milk}` : productKey)
  const idSource = entry.id || entry.entryKey || entry.productKey || productKey
  const id =
    typeof idSource === 'string' && idSource.length > 0
      ? idSource
      : `${productKey}-${Date.now()}-${Math.random().toString(16).slice(2)}`

  return {
    id,
    product,
    productKey,
    entryKey,
    quantity,
    milk
  }
}

const loadStoredCartItems = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitizeStoredCartItem).filter(Boolean)
  } catch (error) {
    return []
  }
}

const serializeCartItemsForStorage = (items) =>
  items.map((item) => ({
    id: item.id,
    product: item.product,
    productKey: item.productKey,
    entryKey: item.entryKey,
    quantity: item.quantity,
    milk: item.milk ?? null
  }))

const mapProductToDetails = (item) => {
  const normalizedAvailability = (item.availability || '').toLowerCase()
  const isInStock = normalizedAvailability === 'in stock'
  const displayPrice = item.price != null ? item.price : item.rawPrice || 'Ask'
  const sheetImagePath = item.imageUrl ? item.imageUrl.replace(/^https?:\/\/[^/]+/i, '') : ''
  const imageSrc = PRODUCT_IMAGE_MAP[item.id] || sheetImagePath || item.imageUrl || '/images/logo.png'
  const slugSource = item.product_slug || item.name || item.id
  const slug = createProductSlug(slugSource)

  return {
    ...item,
    normalizedAvailability,
    isInStock,
    displayPrice,
    imageSrc,
    slug
  }
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
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/'
    return window.location.pathname || '/'
  })
  const [pendingScrollTarget, setPendingScrollTarget] = useState(null)
  const [cartItems, setCartItems] = useState(() => loadStoredCartItems())
  const [cartFlow, setCartFlow] = useState({
    step: null,
    product: null,
    quantity: 1,
    milk: 'normal',
    requiresMilk: true,
    mode: 'add',
    originalEntryKey: null,
    originalEntryId: null
  })
  const [cartFeedback, setCartFeedback] = useState(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [orderFlow, setOrderFlow] = useState(createInitialOrderFlowState)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuSections, setMenuSections] = useState([])
  const [menuStatus, setMenuStatus] = useState('idle')
  const [menuError, setMenuError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [standaloneProductId, setStandaloneProductId] = useState(null)
  const [expandedProductKey, setExpandedProductKey] = useState(null)
  const cartItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  )
  const cartTotalValue = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price)
      if (!Number.isFinite(price)) return sum
      return sum + price * item.quantity
    }, 0)
  }, [cartItems])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    try {
      if (!cartItems || cartItems.length === 0) {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      } else {
        const payload = JSON.stringify(serializeCartItemsForStorage(cartItems))
        window.localStorage.setItem(CART_STORAGE_KEY, payload)
      }
    } catch (error) {
      // Ignore storage errors to avoid blocking the UI.
    }
    return undefined
  }, [cartItems])

  const resetOrderFlow = () => {
    setOrderFlow(createInitialOrderFlowState())
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
  }

  const scrollToSection = (id) => {
    if (typeof document === 'undefined') return
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  const navigateToPath = (path) => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.pathname = path
    url.searchParams.delete('product')
    window.history.pushState({}, '', url.toString())
    setCurrentPath(url.pathname || '/')
    setStandaloneProductId(null)
    setSelectedProduct(null)
    setMenuOpen(false)
  }

  const handleNavigateMenuPage = () => {
    if (currentPath === '/menu') {
      setMenuOpen(false)
      return
    }
    navigateToPath('/menu')
  }

  const handleSectionNavigation = (targetId) => {
    if (currentPath !== '/') {
      setPendingScrollTarget(targetId)
      navigateToPath('/')
      return
    }
    scrollToSection(targetId)
  }

  const handleLogoClick = () => {
    if (currentPath === '/') {
      scrollToSection('home')
      return
    }
    navigateToPath('/')
  }

  const openCartModal = () => {
    resetOrderFlow()
    setCartModalOpen(true)
  }

  const closeCartModal = () => {
    setCartModalOpen(false)
    resetOrderFlow()
  }

  const resetCartFlow = () => ({
    step: null,
    product: null,
    quantity: 1,
    milk: 'normal',
    requiresMilk: true,
    mode: 'add',
    originalEntryKey: null,
    originalEntryId: null
  })

  const closeCartFlow = () => {
    setCartFlow(resetCartFlow())
  }

  const startOrderFlow = () => {
    if (cartItems.length === 0) return
    setOrderFlow({ step: 'type', type: null, table: null })
  }

  const handleSelectOrderType = (type) => {
    if (type === 'in-house') {
      setOrderFlow({ step: 'table', type, table: null })
      return
    }

    setOrderFlow({ step: 'ready', type, table: null })
  }

  const handleSelectOrderTable = (tableNumber) => {
    setOrderFlow({ step: 'ready', type: 'in-house', table: tableNumber })
  }

  const handleOrderFlowBackToType = () => {
    setOrderFlow({ step: 'type', type: null, table: null })
  }

  const handleChangeTableSelection = () => {
    setOrderFlow({ step: 'table', type: 'in-house', table: orderFlow.table })
  }

  const handleOrderPayNow = async () => {
    if (isProcessingPayment) return
    if (cartItems.length === 0) return

    if (!orderFlow.type) {
      setCartFeedback('Please choose an order type before paying.')
      return
    }

    if (orderFlow.type === 'in-house' && !orderFlow.table) {
      setCartFeedback('Please select a table number before paying.')
      return
    }

    if (!Number.isFinite(cartTotalValue) || cartTotalValue <= 0) {
      setCartFeedback('Unable to calculate your total. Please review the cart and try again.')
      return
    }

    const itemsMissingPrice = cartItems.some((item) => !Number.isFinite(Number(item.product?.price)))
    if (itemsMissingPrice) {
      setCartFeedback('Some items are missing prices. Please update them before paying online.')
      return
    }

    const endpoint = buildBackendUrl('/api/create-payment-session')
    if (!endpoint) {
      setCartFeedback('Payment service is unavailable. Please try again later.')
      return
    }

    const milkLabelLookup = MILK_OPTIONS.reduce((accumulator, option) => {
      accumulator[option.value] = option.label
      return accumulator
    }, {})

    let productSummary = cartItems
      .map((item) => {
        const name = item.product?.name || 'Drink'
        const milkLabel = item.milk ? milkLabelLookup[item.milk] : null
        const milkSuffix = milkLabel ? ` (${milkLabel})` : ''
        return `${name} x${item.quantity}${milkSuffix}`
      })
      .join('; ')

    if (orderFlow.type === 'in-house' && orderFlow.table) {
      productSummary = `${productSummary}; Table ${orderFlow.table}`
    }

    const uniqueMilks = new Set(cartItems.map((item) => item.milk).filter(Boolean))
    let milkType = 'none'
    if (uniqueMilks.size === 1) {
      const [singleMilk] = Array.from(uniqueMilks)
      milkType = milkLabelLookup[singleMilk] || singleMilk
    } else if (uniqueMilks.size > 1) {
      milkType = 'mixed'
    }

    const payload = {
      product: productSummary,
      milk_type: milkType,
      order_type: orderFlow.type === 'in-house' ? 'inhouse' : orderFlow.type,
      quantity: cartItemCount,
      amount: Number(cartTotalValue.toFixed(2))
    }

    try {
      setIsProcessingPayment(true)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      if (!data?.redirect_url) {
        throw new Error('Missing redirect_url in response')
      }

      closeCartModal()
      window.location.assign(data.redirect_url)
    } catch (error) {
      console.error('Failed to create payment session', error)
      setCartFeedback('Could not start the payment. Please try again.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleExpandProductCard = (product) => {
    const key = getProductKey(product)
    if (!key) return
    setExpandedProductKey((prev) => (prev === key ? null : key))
    setSelectedProduct(null)
  }

  const closeExpandedProductCard = () => {
    setExpandedProductKey(null)
  }

  const startAddToCart = (product, options = {}) => {
    if (!product || product.isInStock === false) return

    const key = getProductKey(product)
    const existingItem = cartItems.find((item) => (item.productKey || getProductKey(item.product)) === key)
    const customizable = isProductCustomizable(product)
    const isEditFlow = Boolean(options.fromCartEdit)
    const entryContext = options.entry || null
    const existingQuantity = entryContext ? Number(entryContext.quantity) || 0 : existingItem ? Number(existingItem.quantity) || 0 : 0
    const initialQuantity = isEditFlow ? Math.max(existingQuantity, 1) : 1
    const defaultMilk = cartFlow.milk || MILK_OPTIONS[0].value
    const initialMilk = customizable
      ? entryContext && entryContext.milk != null
        ? entryContext.milk
        : existingItem && existingItem.milk != null
          ? existingItem.milk
          : defaultMilk
      : null
    const mode = options.fromCartEdit ? 'update' : 'add'

    setCartFlow({
      step: 'quantity',
      product,
      quantity: initialQuantity,
      milk: customizable ? initialMilk : null,
      requiresMilk: customizable,
      mode,
      originalEntryKey: entryContext?.entryKey || (isEditFlow ? (existingItem?.entryKey || key) : null),
      originalEntryId: entryContext?.id || (isEditFlow ? existingItem?.id || null : null)
    })
  }

  const setCartFlowQuantity = (value) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return
    const sanitized = Math.max(1, Math.min(20, Math.floor(parsed)))
    setCartFlow((prev) => ({ ...prev, quantity: sanitized }))
  }

  const incrementCartQuantity = () => {
    setCartFlow((prev) => ({ ...prev, quantity: Math.max(1, Math.min(20, prev.quantity + 1)) }))
  }

  const decrementCartQuantity = () => {
    setCartFlow((prev) => ({ ...prev, quantity: Math.max(1, Math.min(20, prev.quantity - 1)) }))
  }

  const advanceToMilkSelection = () => {
    setCartFlow((prev) => {
      if (!prev.requiresMilk) return prev
      return { ...prev, step: 'milk' }
    })
  }

  const backToQuantityStep = () => {
    setCartFlow((prev) => ({ ...prev, step: 'quantity' }))
  }

  const selectMilkOption = (value) => {
    setCartFlow((prev) => ({ ...prev, milk: value }))
  }

  const removeCartItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleEditCartItem = (item) => {
    if (!item?.product) return
    closeCartModal()

    window.setTimeout(() => {
      startAddToCart(item.product, { fromCartEdit: true, entry: item })
    }, 0)
  }

  const finalizeCartItem = () => {
    const {
      product,
      requiresMilk,
      milk: selectedMilk,
      quantity,
      mode,
      originalEntryKey: flowOriginalEntryKey,
      originalEntryId
    } = cartFlow

    if (!product) return

    const milk = requiresMilk ? selectedMilk || 'normal' : null
    const targetKey = getProductKey(product)
    const entryKey = requiresMilk ? `${targetKey}::${milk}` : targetKey
    const originalEntryKey = flowOriginalEntryKey || targetKey
    const resolvedOriginalEntryId = originalEntryId || null

    setCartItems((currentItems) => {
      const cleanedItems = currentItems.filter((item) => {
        const itemKey = item.entryKey || item.productKey || getProductKey(item.product)
        if (mode === 'update' && itemKey === originalEntryKey) {
          return false
        }
        return true
      })

      const existingIndex = cleanedItems.findIndex(
        (item) => (item.entryKey || item.productKey || getProductKey(item.product)) === entryKey
      )

      if (existingIndex !== -1) {
        const updated = [...cleanedItems]
        const existingItem = updated[existingIndex]

        const newQuantity =
          mode === 'update' ? quantity : (Number(existingItem.quantity) || 0) + quantity

        updated[existingIndex] = {
          ...existingItem,
          id: mode === 'update' && resolvedOriginalEntryId ? resolvedOriginalEntryId : existingItem.id,
          product,
          productKey: targetKey,
          entryKey,
          quantity: newQuantity,
          milk
        }
        return updated
      }

      const baseId = resolvedOriginalEntryId || targetKey || product?.slug || product?.id || 'item'
      const uniqueId = mode === 'update' && resolvedOriginalEntryId ? resolvedOriginalEntryId : `${baseId}-${Date.now()}`

      return [
        ...cleanedItems,
        {
          id: uniqueId,
          product,
          productKey: targetKey,
          entryKey,
          quantity,
          milk
        }
      ]
    })

    const feedbackMessage = (() => {
      if (!product?.name) return 'Added to cart'
      return mode === 'update' ? `${product.name} updated` : `${product.name} added to cart`
    })()

    setCartFeedback(feedbackMessage)
    setCartFlow(resetCartFlow())
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    setCurrentPath(window.location.pathname || '/')

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/')
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (!pendingScrollTarget) return undefined
    if (currentPath !== '/') return undefined
    if (typeof window === 'undefined') return undefined

    const timeoutId = window.setTimeout(() => {
      scrollToSection(pendingScrollTarget)
      setPendingScrollTarget(null)
    }, 60)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [pendingScrollTarget, currentPath])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncStandaloneProduct = () => {
      const params = new URLSearchParams(window.location.search)
      const productParam = params.get('product')
      setStandaloneProductId(productParam ? productParam.toLowerCase() : null)
    }

    syncStandaloneProduct()
    window.addEventListener('popstate', syncStandaloneProduct)

    return () => {
      window.removeEventListener('popstate', syncStandaloneProduct)
    }
  }, [])

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

  useEffect(() => {
    if (!cartFlow.step) return undefined
    if (typeof window === 'undefined') return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeCartFlow()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cartFlow.step])

  useEffect(() => {
    if (!cartFeedback) return undefined
    if (typeof window === 'undefined') return undefined

    const timeoutId = window.setTimeout(() => {
      setCartFeedback(null)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [cartFeedback])

  useEffect(() => {
    if (!cartModalOpen) return undefined
    if (typeof window === 'undefined') return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeCartModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cartModalOpen])

  const standaloneProduct = useMemo(() => {
    if (!standaloneProductId) return null

    const normalizedTarget = standaloneProductId.toLowerCase()

    for (const section of menuSections) {
      for (const product of section.products) {
        const details = mapProductToDetails(product)
        const candidates = [
          details.slug,
          product.id ? createProductSlug(product.id) : null,
          product.name ? createProductSlug(product.name) : null,
          product.id ? String(product.id).toLowerCase() : null,
          product.name ? product.name.toLowerCase() : null
        ].filter(Boolean)

        if (candidates.includes(normalizedTarget)) {
          return details
        }
      }
    }

    return null
  }, [menuSections, standaloneProductId])

  const isStandaloneView = Boolean(standaloneProductId)
  const isMenuPage = currentPath === '/menu'
  useEffect(() => {
    if (!isMenuPage) {
      closeExpandedProductCard()
    }
  }, [isMenuPage])

  useEffect(() => {
    if (!expandedProductKey) return undefined
    if (typeof window === 'undefined') return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeExpandedProductCard()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    let originalOverflow = ''
    if (typeof document !== 'undefined') {
      originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (typeof document !== 'undefined') {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [expandedProductKey])

  const expandedProductDetails = useMemo(() => {
    if (!expandedProductKey) return null
    for (const section of menuSections) {
      if (!section || !Array.isArray(section.products)) continue
      for (const product of section.products) {
        const details = mapProductToDetails(product)
        if (getProductKey(details) === expandedProductKey) {
          return details
        }
      }
    }
    return null
  }, [expandedProductKey, menuSections])

  const shouldShowProductModal = Boolean(selectedProduct && !isMenuPage)

  const cartFlowModal = !isMenuPage || !cartFlow.step || !cartFlow.product
    ? null
    : (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4"
          onClick={closeCartFlow}
        >
          <div
            className="relative w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-flow-title"
          >
            <button
              type="button"
              onClick={closeCartFlow}
              className="absolute -top-10 right-0 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white"
              aria-label="Close customization"
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
            <div className="bg-white p-6 rounded shadow-2xl space-y-6">
              {cartFlow.step === 'quantity' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="cart-flow-title" className="text-xl font-semibold text-[#23314F]">
                      Select Quantity
                    </h2>
                    <p className="text-sm text-gray-600">
                      How many {cartFlow.product?.name} would you like?
                    </p>
                    {!cartFlow.requiresMilk ? (
                      <p className="text-xs text-gray-500">
                        This item will be added without milk customization.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={decrementCartQuantity}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-lg font-semibold text-gray-700 hover:bg-gray-300"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={cartFlow.quantity}
                      onChange={(event) => setCartFlowQuantity(event.target.value)}
                      className="w-20 text-center border border-gray-300 rounded py-2"
                    />
                    <button
                      type="button"
                      onClick={incrementCartQuantity}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-lg font-semibold text-gray-700 hover:bg-gray-300"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeCartFlow}
                      className="px-4 py-2 rounded border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={cartFlow.requiresMilk ? advanceToMilkSelection : finalizeCartItem}
                      className="px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90"
                    >
                      {cartFlow.requiresMilk ? 'Next' : cartFlow.mode === 'update' ? 'Save' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 id="cart-flow-title" className="text-xl font-semibold text-[#23314F]">
                      Choose Your Milk
                    </h2>
                    <p className="text-sm text-gray-600">
                      Select your milk of choice for {cartFlow.product?.name}.
                    </p>
                  </div>
                  <MilkSelector options={MILK_OPTIONS} value={cartFlow.milk} onChange={selectMilkOption} />
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={backToQuantityStep}
                      className="px-4 py-2 rounded border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={finalizeCartItem}
                      className="px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90"
                    >
                      {cartFlow.mode === 'update' ? 'Save' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )

  const cartSummaryModal = !isMenuPage || !cartModalOpen
    ? null
    : (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4"
          onClick={closeCartModal}
        >
          <div
            className="relative w-full max-w-lg"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-summary-title"
          >
            <button
              type="button"
              onClick={closeCartModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white"
              aria-label="Close cart"
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
            <div className="bg-white p-6 rounded shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="cart-summary-title" className="text-xl font-semibold text-[#23314F]">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-600">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCartModal}
                  className="text-sm text-[#23314F] hover:underline"
                >
                  Close
                </button>
              </div>
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-600">Your cart is empty. Start by adding a product.</p>
              ) : (
                <ul className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const milkOption = MILK_OPTIONS.find((option) => option.value === item.milk)
                    const milkLabel = milkOption?.label || null
                    const productName = item.product?.name || 'Selected Drink'
                    const displayName = milkLabel ? `${productName} with ${milkLabel}` : productName
                    const unitPrice = Number(item.product?.price)
                    const hasUnitPrice = Number.isFinite(unitPrice)
                    const lineTotal = hasUnitPrice ? (unitPrice * item.quantity).toFixed(2) : null
                    const previewImage = item.product?.imageSrc || item.product?.imageUrl || '/images/logo.png'

                    return (
                      <li key={item.id} className="border border-gray-200 rounded p-3 space-y-3">
                        <div className="flex items-center justify-between text-sm sm:text-base text-[#23314F] gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={previewImage}
                              alt={productName}
                              className="w-12 h-12 rounded object-cover"
                              loading="lazy"
                            />
                            <p className="font-medium leading-snug text-left">{displayName}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-[#23314F]">
                          <button
                            type="button"
                            onClick={() => handleEditCartItem(item)}
                            className="font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCartItem(item.id)}
                            className="font-semibold text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Price</span>
                          <span className="flex items-center gap-1">
                            <CurrencyIcon className="w-4 h-4" />
                            {item.product?.displayPrice || item.product?.rawPrice || 'Ask'}
                          </span>
                        </div>
                        {lineTotal ? (
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Product total</span>
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                              <CurrencyIcon className="w-4 h-4" />
                              {lineTotal}
                            </span>
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
              {cartItems.length > 0 ? (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  {Number.isFinite(cartTotalValue) && cartTotalValue > 0 ? (
                    <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="flex items-center gap-2">
                        <CurrencyIcon className="w-5 h-5" />
                        {cartTotalValue.toFixed(2)}
                      </span>
                    </div>
                  ) : null}
                  {orderFlow.step === 'idle' ? (
                    <button
                      type="button"
                      onClick={startOrderFlow}
                      className="w-full px-4 py-3 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90"
                    >
                      Order Now
                    </button>
                  ) : null}
                  {orderFlow.step === 'type' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Is this an in-house or a takeaway order?</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectOrderType('in-house')}
                          className="px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90"
                        >
                          In-house
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectOrderType('takeaway')}
                          className="px-4 py-2 rounded border border-[#23314F] text-sm font-semibold text-[#23314F] hover:bg-[#23314F] hover:text-white"
                        >
                          Takeaway
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={resetOrderFlow}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                  {orderFlow.step === 'table' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Choose a table number.</p>
                      <div className="flex flex-wrap gap-2">
                        {ORDER_TABLE_NUMBERS.map((tableNumber) => {
                          const isSelected = orderFlow.table === tableNumber
                          return (
                            <button
                              key={tableNumber}
                              type="button"
                              onClick={() => handleSelectOrderTable(tableNumber)}
                              className={`w-10 h-10 rounded text-sm font-semibold border transition ${
                                isSelected
                                  ? 'bg-[#23314F] text-white border-[#23314F]'
                                  : 'border-gray-300 text-[#23314F] hover:bg-gray-100'
                              }`}
                              aria-pressed={isSelected}
                            >
                              {tableNumber}
                            </button>
                          )
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={handleOrderFlowBackToType}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Back
                      </button>
                    </div>
                  ) : null}
                  {orderFlow.step === 'ready' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        {orderFlow.type === 'in-house' && orderFlow.table
                          ? `Table ${orderFlow.table} selected for in-house service.`
                          : 'Takeaway order selected.'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {orderFlow.type === 'in-house' ? (
                          <button
                            type="button"
                            onClick={handleChangeTableSelection}
                            className="px-3 py-2 rounded border border-gray-300 text-xs font-semibold text-[#23314F] hover:bg-gray-100"
                          >
                            Change table
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={handleOrderFlowBackToType}
                          className="px-3 py-2 rounded border border-gray-300 text-xs font-semibold text-[#23314F] hover:bg-gray-100"
                        >
                          Change order type
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleOrderPayNow}
                        disabled={isProcessingPayment}
                        className={`w-full px-4 py-3 rounded bg-[#F2B705] text-[#23314F] text-sm font-semibold hover:opacity-90 ${
                          isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )

  const buildProductLink = (product) => {
    const slug = createProductSlug(product?.slug || product?.name || product?.id)
    const targetSlug = slug || (product?.id ? String(product.id).toLowerCase() : '')

    if (!targetSlug) return '#'

    if (typeof window === 'undefined') {
      return `?product=${encodeURIComponent(targetSlug)}`
    }

    const url = new URL(window.location.href)
    url.searchParams.set('product', targetSlug)
    url.hash = ''
    return url.toString()
  }

  if (isStandaloneView) {
    const baseMenuUrl = typeof window === 'undefined'
      ? '/'
      : (() => {
          const url = new URL(window.location.href)
          url.searchParams.delete('product')
          if (!url.pathname) {
            url.pathname = '/'
          }
          return url.toString()
        })()

    let standaloneContent = null

    if (menuStatus === 'loading' || menuStatus === 'idle') {
      standaloneContent = (
        <p className="text-center text-base sm:text-lg text-gray-700">Loading product details…</p>
      )
    } else if (menuStatus === 'error') {
      standaloneContent = (
        <div className="text-center text-base sm:text-lg text-red-700 bg-red-100 border border-red-200 rounded p-4">
          <p>We couldn't load the product right now.</p>
          {menuError ? <p className="text-sm mt-2">{menuError}</p> : null}
        </div>
      )
    } else if (standaloneProduct) {
      standaloneContent = (
        <article className="bg-gray-100 p-4 sm:p-8 rounded shadow text-left space-y-5">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#23314F]">
              {standaloneProduct.name}
            </h1>
            {standaloneProduct.description ? (
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {standaloneProduct.description}
              </p>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 italic">Description coming soon.</p>
            )}
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <CurrencyIcon className="w-6 h-6" />
              {standaloneProduct.displayPrice}
            </div>
            {!standaloneProduct.isInStock && standaloneProduct.normalizedAvailability && (
              <span className="inline-block text-sm uppercase tracking-wide text-yellow-900 bg-yellow-200 px-3 py-1 rounded">
                {standaloneProduct.availability}
              </span>
            )}
          </div>
          <div className="overflow-hidden rounded-lg">
            <img
              src={standaloneProduct.imageSrc}
              alt={standaloneProduct.name}
              className="w-full h-auto object-cover"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        </article>
      )
    } else {
      standaloneContent = (
        <div className="text-center text-base sm:text-lg text-gray-700">
          <p>We couldn't find that product.</p>
        </div>
      )
    }

    return (
      <div
        className="font-sans bg-background text-fontLightBackground"
        data-auto-contrast-root
        style={{ backgroundColor: '#E3E3DD' }}
      >
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md sm:max-w-xl lg:max-w-3xl space-y-6">
            {standaloneContent}
            <div className="text-center">
              <a
                href={baseMenuUrl}
                className="text-sm text-[#23314F] underline hover:opacity-80"
              >
                Back to full menu
              </a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div
      className="font-sans bg-background text-fontLightBackground scroll-smooth"
      data-auto-contrast-root
      style={{ backgroundColor: '#E3E3DD' }}
    >
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="px-2 sm:px-10 pt-6">
          <div className="bg-white bg-opacity-95 rounded shadow-2xl flex items-center justify-between py-1.5 sm:py-2 px-3 sm:px-5 w-full max-w-[96rem] mx-auto">
            {isMenuPage ? (
              <>
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                >
                  <img src="/images/logo.png" alt="DopaBeans logo" className="h-10 w-auto" />
                </button>
                <span className="flex-1 text-center text-base sm:text-lg font-semibold uppercase tracking-wide text-[#23314F]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={openCartModal}
                  className="text-sm sm:text-base font-semibold text-[#23314F] hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#23314F] ml-auto"
                >
                  View Cart{cartItemCount > 0 ? ` (${cartItemCount})` : ''}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleLogoClick} className="cursor-pointer bg-transparent border-0 p-0 flex-shrink-0">
                  <img src="/images/logo.png" alt="DopaBeans logo" className="w-[180px] sm:w-[240px] h-auto" />
                </button>
                <nav
                  className="hidden sm:flex sm:space-x-4 md:space-x-6 font-semibold text-base sm:text-lg text-[#23314F]"
                  data-ignore-auto-contrast
                >
                  <button
                    onClick={handleNavigateMenuPage}
                    className={`hover:opacity-80 text-[#23314F] ${isMenuPage ? 'underline decoration-2 decoration-[#23314F]' : ''}`}
                    aria-current={isMenuPage ? 'page' : undefined}
                    data-ignore-auto-contrast
                  >
                    Menu
                  </button>
                  <button
                    onClick={() => handleSectionNavigation('vision')}
                    className="hover:opacity-80 text-[#23314F]"
                    data-ignore-auto-contrast
                  >
                    Vision
                  </button>
                  <button
                    onClick={() => handleSectionNavigation('contact')}
                    className="hover:opacity-80 text-[#23314F]"
                    data-ignore-auto-contrast
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => handleSectionNavigation('about')}
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
              </>
            )}
          </div>
        </div>
        {!isMenuPage && menuOpen && (
          <div className="md:hidden bg-[#23314F] shadow px-4 pb-4 space-y-3 text-center">
            <button
              onClick={handleNavigateMenuPage}
              className={`block w-full text-white ${isMenuPage ? 'font-semibold underline' : ''}`}
              aria-current={isMenuPage ? 'page' : undefined}
            >
              Menu
            </button>
            <button onClick={() => handleSectionNavigation('vision')} className="block w-full text-white">Vision</button>
            <button onClick={() => handleSectionNavigation('contact')} className="block w-full text-white">Contact</button>
            <button onClick={() => handleSectionNavigation('about')} className="block w-full text-white">About Us</button>
          </div>
        )}
      </header>

      {isMenuPage ? (
        <main className="pt-32 sm:pt-36 pb-20 px-3 sm:px-8">
          <div className="w-full max-w-[96rem] mx-auto space-y-10">
            {cartFeedback ? (
              <div className="text-sm sm:text-base text-green-800 bg-green-100 border border-green-200 rounded p-4 shadow">
                {cartFeedback}
              </div>
            ) : null}
            {menuStatus === 'loading' ? (
              <p className="text-center text-base sm:text-lg text-gray-600">Loading the latest menu…</p>
            ) : null}
            {menuStatus === 'error' ? (
              <div className="text-center text-base sm:text-lg text-red-700 bg-red-100 border border-red-200 rounded p-4">
                <p>We couldn't load the menu right now.</p>
                {menuError ? <p className="text-sm mt-2">{menuError}</p> : null}
              </div>
            ) : null}
            {menuStatus === 'success' && menuSections.length === 0 ? (
              <p className="text-center text-base sm:text-lg text-gray-600">Menu will be available shortly.</p>
            ) : null}
            {menuStatus === 'success' && menuSections.length > 0
              ? menuSections.map((section) => {
                  if (!section || !Array.isArray(section.products) || section.products.length === 0) {
                    return null
                  }
                  return (
                    <section key={section.category} className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#23314F]">{section.category}</h3>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {section.products.length} {section.products.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
                        {section.products.map((item) => {
                          const productDetails = mapProductToDetails(item)
                          const { displayPrice, imageSrc, isInStock, normalizedAvailability } = productDetails
                          const productKey = getProductKey(productDetails) || productDetails.slug || item.id || item.name
                          const isAvailable = isInStock

                          return (
                            <div
                              key={productKey}
                              className={`col-span-1 bg-gray-100 p-4 rounded shadow text-left flex flex-col h-full transition-shadow hover:shadow-lg ${
                                expandedProductKey === productKey ? 'ring-2 ring-[#23314F]' : ''
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleExpandProductCard(productDetails)}
                                className="mb-2 block w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#23314F]"
                                aria-label={`View details for ${productDetails.name}`}
                              >
                                <img
                                  src={imageSrc}
                                  alt={productDetails.name}
                                  className="rounded w-full object-cover aspect-square"
                                  loading="lazy"
                                />
                              </button>
                              <div className="text-sm sm:text-base flex-1 space-y-1">
                                <a
                                  href={buildProductLink(productDetails)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium block text-[#23314F] hover:underline"
                                >
                                  {productDetails.name}
                                </a>
                                <span className="flex items-center gap-1">
                                  <CurrencyIcon className="w-4 h-4" />
                                  {displayPrice}
                                </span>
                                {!isAvailable && normalizedAvailability ? (
                                  <span className="inline-block text-xs uppercase tracking-wide text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded">
                                    {productDetails.availability}
                                  </span>
                                ) : null}
                              </div>
                              <div className="pt-3 mt-auto">
                                <button
                                  type="button"
                                  onClick={() => startAddToCart(productDetails)}
                                  disabled={!isAvailable}
                                  className="w-full px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isAvailable ? 'Add to cart' : 'Out of stock'}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )
                })
              : null}
          </div>
          {isMenuPage && cartItems.length > 0 ? (
            <button
              type="button"
              onClick={openCartModal}
              className="fixed bottom-6 right-4 z-40 px-4 py-3 rounded-full bg-[#23314F] text-white text-sm sm:text-base font-semibold shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#23314F]"
            >
              View Cart
            </button>
          ) : null}
          {expandedProductDetails ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4"
              onClick={closeExpandedProductCard}
            >
              <div
                className="relative w-full max-w-md bg-gray-100 rounded shadow-2xl p-6 space-y-4"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="expanded-product-title"
                aria-describedby={
                  expandedProductDetails.description ? 'expanded-product-description' : undefined
                }
              >
                <button
                  type="button"
                  onClick={closeExpandedProductCard}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#23314F]"
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
                <div className="overflow-hidden rounded">
                  <img
                    src={expandedProductDetails.imageSrc}
                    alt={expandedProductDetails.name}
                    className="w-full object-cover aspect-square"
                  />
                </div>
                <div className="space-y-2">
                  <h3 id="expanded-product-title" className="text-xl sm:text-2xl font-semibold text-[#23314F]">
                    {expandedProductDetails.name}
                  </h3>
                  <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                    <CurrencyIcon className="w-5 h-5" />
                    {expandedProductDetails.displayPrice}
                  </div>
                  {expandedProductDetails.description ? (
                    <p id="expanded-product-description" className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {expandedProductDetails.description}
                    </p>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-500 italic">Description coming soon.</p>
                  )}
                  {!expandedProductDetails.isInStock && expandedProductDetails.normalizedAvailability ? (
                    <span className="inline-block text-xs uppercase tracking-wide text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded">
                      {expandedProductDetails.availability}
                    </span>
                  ) : null}
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      startAddToCart(expandedProductDetails)
                      closeExpandedProductCard()
                    }}
                    disabled={!expandedProductDetails.isInStock}
                    className="w-full px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {expandedProductDetails.isInStock ? 'Add to cart' : 'Out of stock'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      ) : (
        <main className="pt-0 sm:pt-1">
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
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleNavigateMenuPage}
                    className="px-6 py-3 rounded bg-[#23314F] text-white text-base sm:text-lg font-semibold hover:opacity-90"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="menu" className="-mt-32 sm:-mt-52 py-20 px-2 sm:px-10">
            <div className="w-full max-w-[96rem] mx-auto text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">Our Products</h2>
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
                        const productDetails = mapProductToDetails(item)
                        const { displayPrice, imageSrc, isInStock, normalizedAvailability } = productDetails

                        return (
                          <li
                            key={item.id}
                            className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left"
                          >
                            <button
                              type="button"
                              onClick={() => handleProductSelect(productDetails)}
                              className="mb-2 block w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#23314F]"
                              aria-label={`View details for ${productDetails.name}`}
                            >
                              <img
                                src={imageSrc}
                                alt={productDetails.name}
                                className="rounded w-full object-cover aspect-square max-w-[200px]"
                                loading="lazy"
                              />
                            </button>
                            <div className="text-sm sm:text-base">
                              <a
                                href={buildProductLink(productDetails)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium block text-[#23314F] hover:underline"
                              >
                                {productDetails.name}
                              </a>
                              <span className="flex items-center gap-1">
                                <CurrencyIcon className="w-4 h-4" />
                                {displayPrice}
                              </span>
                              {!isInStock && normalizedAvailability && (
                                <span className="mt-1 inline-block text-xs uppercase tracking-wide text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded">
                                  {productDetails.availability}
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

          <section id="vision" className="py-20 px-4 sm:px-8 text-center">
            <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Our Vision</h2>
              <p className="text-gray-700">
                More than a café, we are a community space for authentic moments, made possible through quality, care, and the joy of coffee.
              </p>
            </div>
          </section>

          <section id="about" className="py-20 px-4 sm:px-8 text-center">
            <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">About Us</h2>
              <p className="text-base sm:text-lg text-gray-700">
                More than just a café, DopaBeans is a gathering place where genuine moments come to life—rooted in quality craftsmanship, heartfelt care, and the simple joy that only exceptional coffee can bring.
              </p>
            </div>
          </section>

          <section id="contact" className="py-20 px-4 sm:px-8 text-center">
            <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Contact Us</h2>
              <p className="text-base sm:text-lg text-gray-700">info@dopabeansuae.com</p>
              <p className="text-base sm:text-lg text-gray-700">Instagram: @dopabeansuae</p>
            </div>
          </section>

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
      )}

      {shouldShowProductModal ? (
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
            aria-describedby={selectedProduct?.description ? 'product-modal-description' : undefined}
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
                  src={selectedProduct?.imageSrc}
                  alt={selectedProduct?.name}
                  className="w-full object-cover aspect-square"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 id="product-modal-title" className="text-xl sm:text-2xl font-semibold text-[#23314F]">
                  {selectedProduct?.name}
                </h3>
                <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  <CurrencyIcon className="w-5 h-5" />
                  {selectedProduct?.displayPrice}
                </div>
                {selectedProduct?.description ? (
                  <p id="product-modal-description" className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-gray-500 italic">Description coming soon.</p>
                )}
                {selectedProduct?.availability && selectedProduct.availability.toLowerCase() !== 'in stock' && (
                  <span className="inline-block text-xs uppercase tracking-wide text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded">
                    {selectedProduct.availability}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {cartSummaryModal}
      {cartFlowModal}
    </div>
  )
}

export default App
