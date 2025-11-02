import React, { useEffect, useMemo, useRef, useState } from 'react'

const MENU_CACHE_STORAGE_KEY = 'dopabeans-menu-cache-v4'
const MENU_CACHE_TTL_MS = 1000 * 60 * 30
const DEFAULT_PRODUCT_IMAGE = '/images/products/coming-soon.jpg'
const WHATSAPP_PHONE_NUMBER = '971501983844'
const PRODUCT_IMAGE_MAP = {
  pdct010: '/images/products/espresso.jpg',
  espresso: '/images/products/espresso.jpg',
  pdct020: '/images/products/piccolo.jpg',
  piccolo: '/images/products/piccolo.jpg',
  pdct030: '/images/products/cortado.jpg',
  cortado: '/images/products/cortado.jpg',
  pdct040: '/images/products/cappuccino.jpg',
  cappuccino: '/images/products/cappuccino.jpg',
  pdct050: '/images/products/americano.jpg',
  americano: '/images/products/americano.jpg',
  pdct060: '/images/products/flat-white.jpg',
  flat_white: '/images/products/flat-white.jpg',
  pdct070: '/images/products/latte.jpg',
  latte: '/images/products/latte.jpg',
  pdct080: '/images/products/spanish-latte.jpg',
  spanish_latte: '/images/products/spanish-latte.jpg',
  pdct090: '/images/products/dopabeans-signature-hot.jpg',
  dopabeans_signature_hot: '/images/products/dopabeans-signature-hot.jpg',
  pdct100: '/images/products/spanish-cortado.jpg',
  spanish_cortado: '/images/products/spanish-cortado.jpg',
  pdct110: '/images/products/pistachio-latte.jpg',
  pistachio_latte: '/images/products/pistachio-latte.jpg',
  pdct120: '/images/products/caramel-latte.jpg',
  caramel_latte: '/images/products/caramel-latte.jpg',
  pdct130: '/images/products/hot-chocolate.jpg',
  hot_chocolate: '/images/products/hot-chocolate.jpg',
  pdct140: '/images/products/sahlab.jpg',
  sahlab: '/images/products/sahlab.jpg',
  pdct150: '/images/products/dopabeans-signature-cold.jpg',
  dopabeans_signature_cold: '/images/products/dopabeans-signature-cold.jpg',
  pdct160: '/images/products/iced-spanish-latte.jpg',
  iced_spanish_latte: '/images/products/iced-spanish-latte.jpg',
  pdct170: '/images/products/iced-latte.jpg',
  iced_latte: '/images/products/iced-latte.jpg',
  pdct180: '/images/products/iced-americano.jpg',
  iced_americano: '/images/products/iced-americano.jpg',
  pdct190: '/images/products/iced-pistachio-latte.jpg',
  iced_pistachio_latte: '/images/products/iced-pistachio-latte.jpg',
  pdct200: '/images/products/iced-tea.jpg',
  iced_tea: '/images/products/iced-tea.jpg',
  pdct210: '/images/products/iced-tea-passion.jpg',
  iced_tea_passion: '/images/products/iced-tea-passion.jpg',
  pdct220: '/images/products/iced-tea-peach.jpg',
  iced_tea_peach: '/images/products/iced-tea-peach.jpg',
  pdct230: '/images/products/iced-tea-strawberry.jpg',
  iced_tea_strawberry: '/images/products/iced-tea-strawberry.jpg',
  pdct240: '/images/products/Iced-Caramel-Latte.jpg',
  iced_caramel_latte: '/images/products/Iced-Caramel-Latte.jpg',
  pdct250: '/images/products/Iced-Spanish-Cortado.jpg',
  iced_spanish_cortado: '/images/products/Iced-Spanish-Cortado.jpg',
  pdct260: '/images/products/cream-espresso.jpg',
  cream_espresso: '/images/products/cream-espresso.jpg',
  pdct270: '/images/products/mango-smoothie.jpg',
  mango_smoothie: '/images/products/mango-smoothie.jpg',
  mango_smoothei: '/images/products/mango-smoothie.jpg',
  pdct280: '/images/products/hot-regular-matcha.jpg',
  regular: '/images/products/hot-regular-matcha.jpg',
  regular_matcha: '/images/products/hot-regular-matcha.jpg',
  regular_hot: '/images/products/hot-regular-matcha.jpg',
  hot_regular_matcha: '/images/products/hot-regular-matcha.jpg',
  pdct290: '/images/products/cold-regular-matcha.jpg',
  cold_regular_matcha: '/images/products/cold-regular-matcha.jpg',
  regular_cold_matcha: '/images/products/cold-regular-matcha.jpg',
  cold_regula_matcha: '/images/products/cold-regular-matcha.jpg',
  pdct300: '/images/products/dopabeans-matcha.jpg',
  dopabeans: '/images/products/dopabeans-matcha.jpg',
  dopabeans_matcha: '/images/products/dopabeans-matcha.jpg',
  pdct310: '/images/products/cloud-matcha.jpg',
  cloud: '/images/products/cloud-matcha.jpg',
  cloud_matcha: '/images/products/cloud-matcha.jpg',
  pdct320: '/images/products/strawberry-matcha.jpg',
  strawberry: '/images/products/strawberry-matcha.jpg',
  strawberry_matcha: '/images/products/strawberry-matcha.jpg',
  pdct330: '/images/products/crema-matcha.jpg',
  crema: '/images/products/crema-matcha.jpg',
  pdct340: '/images/products/passion-fruit-mojito.jpg',
  passion_fruit: '/images/products/passion-fruit-mojito.jpg',
  pdct350: '/images/products/peach-mojito.jpg',
  peach: '/images/products/peach-mojito.jpg',
  pdct360: '/images/products/strawberry-mojito.jpg',
  pdct370: '/images/products/coconut-berry-mojito.jpg',
  coconut_berry: '/images/products/coconut-berry-mojito.jpg',
  pdct380: '/images/products/lychee-rose-mojito.jpg',
  lychee_rose: '/images/products/lychee-rose-mojito.jpg',
  pdct390: '/images/products/blueberry-mojito.jpg',
  blueberry: '/images/products/blueberry-mojito.jpg',
  pdct400: '/images/products/blue-lagoon-mojito.jpg',
  blue_lagoon: '/images/products/blue-lagoon-mojito.jpg',
  pdct410: '/images/products/kids-mojito.jpg',
  kinder: '/images/products/kids-mojito.jpg',
  kinder_mojito: '/images/products/kids-mojito.jpg',
  kids_mojito: '/images/products/kids-mojito.jpg',
  pdct420: '/images/products/acai-smoothie.jpg',
  acai_smoothie: '/images/products/acai-smoothie.jpg',
  pdct430: '/images/products/acai-bowl.jpg',
  acai_bowl: '/images/products/acai-bowl.jpg',
  pdct440: '/images/products/v60.jpg',
  v60: '/images/products/v60.jpg',
  v60_hot: '/images/products/v60.jpg',
  pdct450: '/images/products/v60-cold.jpg',
  v60_cold: '/images/products/v60-cold.jpg',
  pdct460: '/images/products/chemex-hot.jpg',
  chemex_hot: '/images/products/chemex-hot.jpg',
  pdct470: '/images/products/chemex-cold.jpg',
  chemex_cold: '/images/products/chemex-cold.jpg',
  pdct480: '/images/products/cold-brew.jpg',
  cold_brew: '/images/products/cold-brew.jpg',
  pdct490: '/images/products/banana-frappe.jpg',
  banana_frappe: '/images/products/banana-frappe.jpg',
  pdct500: '/images/products/pistachio-frappe.jpg',
  pistachio_frappe: '/images/products/pistachio-frappe.jpg',
  pdct510: '/images/products/caramel-frappe.jpg',
  caramel_frappe: '/images/products/caramel-frappe.jpg',
  pdct520: '/images/products/oreo-frappe.jpg',
  oreo_frappe: '/images/products/oreo-frappe.jpg',
  pdct530: '/images/products/pistachio-milkshake.jpg',
  pistachio: '/images/products/pistachio-milkshake.jpg',
  pdct540: '/images/products/oreo-milkshake.jpg',
  oreo: '/images/products/oreo-milkshake.jpg',
  pdct550: '/images/products/caramel-milkshake.jpg',
  caramel: '/images/products/caramel-milkshake.jpg',
  pdct560: '/images/products/mango-milkshake.jpg',
  mango_milkshake: '/images/products/mango-milkshake.jpg',
  pdct570: '/images/products/spacial-karkade.jpg',
  karkade: '/images/products/spacial-karkade.jpg',
  special_karkade: '/images/products/spacial-karkade.jpg',
  spacial_karkade: '/images/products/spacial-karkade.jpg',
  pdct580: '/images/products/banana-pudding.jpg',
  banana_pudding: '/images/products/banana-pudding.jpg',
  pdct590: '/images/products/mango-cake.jpg',
  mango_cake: '/images/products/mango-cake.jpg',
  pdct600: '/images/products/tiramisu.jpg',
  tiramisu_cake: '/images/products/tiramisu.jpg',
  tiramisu: '/images/products/tiramisu.jpg',
  pdct610: '/images/products/sebastian-cheesecake.jpg',
  sebastian_cheese_cake: '/images/products/sebastian-cheesecake.jpg',
  pdct620: '/images/products/aseeda.jpg',
  molten_aseeda: '/images/products/aseeda.jpg',
  aseeda: '/images/products/aseeda.jpg',
  pdct630: '/images/products/choclate-cake.jpg',
  choclate_cake: '/images/products/choclate-cake.jpg',
  pdct640: '/images/products/cookie.jpg',
  coockie: '/images/products/cookie.jpg',
  cookie: '/images/products/cookie.jpg',
  pdct650: '/images/products/sparkling-water.jpg',
  sparkling_water: '/images/products/sparkling-water.jpg',
  pdct660: '/images/products/normal-water.jpg',
  normal_water: '/images/products/normal-water.jpg',
  water: '/images/products/normal-water.jpg'
}

const PRODUCT_NAME_OVERRIDES = {
  kinder_mojito: 'Kids Mojito',
  kinder: 'Kids Mojito',
  pdct410: 'Kids Mojito'
}

const DEFAULT_PROD_BACKEND_URL = 'https://dopabeans-backend.onrender.com'
const DEFAULT_LOCAL_BACKEND_URL = 'http://127.0.0.1:8000'

const sanitizeBaseUrl = (value) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed === '/' || trimmed.toLowerCase() === 'relative' || trimmed.toLowerCase() === 'same-origin') {
    return ''
  }
  return trimmed.replace(/\/+$/, '')
}

const resolveBackendBaseUrl = () => {
  const envValue =
    typeof import.meta !== 'undefined' && import.meta?.env?.VITE_BACKEND_URL
      ? sanitizeBaseUrl(String(import.meta.env.VITE_BACKEND_URL))
      : ''

  if (envValue) {
    return envValue
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.local')) {
      return DEFAULT_LOCAL_BACKEND_URL
    }
  }

  return DEFAULT_PROD_BACKEND_URL
}

const BACKEND_BASE_URL = resolveBackendBaseUrl()

const buildBackendUrl = (path) => {
  if (typeof path !== 'string' || path.length === 0) return ''
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!BACKEND_BASE_URL) {
    return normalizedPath
  }
  return `${BACKEND_BASE_URL}${normalizedPath}`
}

const buildWhatsappConfirmationUrl = (orderNumber) => {
  const suffix = typeof orderNumber === 'string' && orderNumber.trim().length > 0 ? orderNumber.trim() : ''
  const message = suffix ? `paid_${suffix}` : 'paid'
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`
}

const FALLBACK_MILK_OPTIONS = [
  { value: 'normal', label: 'Normal Milk' },
  { value: 'oat', label: 'Oat Milk' },
  { value: 'coconut', label: 'Coconut Milk' }
]

const FALLBACK_BEAN_OPTIONS = [
  { value: 'brazilian', label: 'Brazilian' },
  { value: 'colombian', label: 'Colombian' }
]

const MILK_OPTION_BLUEPRINTS = [
  { value: 'normal', label: 'Normal Milk', keywords: ['normal'] },
  { value: 'oat', label: 'Oat Milk', keywords: ['oat'] },
  { value: 'coconut', label: 'Coconut Milk', keywords: ['coconut'] }
]

const BEAN_OPTION_BLUEPRINTS = [
  { value: 'brazilian', label: 'Brazilian', keywords: ['brazil'] },
  { value: 'colombian', label: 'Colombian', keywords: ['colomb'] }
]

const FALLBACK_DEFAULT_MILK_OPTION = FALLBACK_MILK_OPTIONS[0]?.value ?? 'normal'
const FALLBACK_DEFAULT_BEAN_OPTION = FALLBACK_BEAN_OPTIONS[0]?.value ?? null

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
  if (!Array.isArray(options) || options.length === 0) {
    return null
  }
  const flagged = options.find((option) => option?.isDefault && option?.value)
  if (flagged) {
    return flagged.value
  }
  const normalOption = options?.find((option) => option.value === 'normal')
  return normalOption?.value ?? options[0]?.value ?? null
}

const MilkSelector = ({ options, value, onChange }) => {
  const [selectedMilk, setSelectedMilk] = useState(() => {
    const defaultValue = getDefaultMilkValue(options)
    if (value && options.some((option) => option.value === value)) {
      return value
    }
    return defaultValue
  })

  useEffect(() => {
    const defaultValue = getDefaultMilkValue(options)
    if (value && options.some((option) => option.value === value)) {
      setSelectedMilk(value)
    } else {
      setSelectedMilk(defaultValue)
    }
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

const getDefaultBeanValue = (options) => {
  if (!Array.isArray(options) || options.length === 0) {
    return null
  }
  const flagged = options.find((option) => option?.isDefault && option?.value)
  if (flagged) {
    return flagged.value
  }
  const first = options[0]
  return first ? first.value : null
}

const BeanSelector = ({ options, value, onChange }) => {
  const [selectedBean, setSelectedBean] = useState(() => {
    const defaultValue = getDefaultBeanValue(options)
    if (value && options.some((option) => option.value === value)) {
      return value
    }
    return defaultValue
  })

  useEffect(() => {
    const defaultValue = getDefaultBeanValue(options)
    if (value && options.some((option) => option.value === value)) {
      setSelectedBean(value)
    } else {
      setSelectedBean(defaultValue)
    }
  }, [value, options])

  const handleSelection = (optionValue) => {
    setSelectedBean(optionValue)
    if (typeof onChange === 'function') {
      onChange(optionValue)
    }
  }

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedBean === option.value
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

const buildCategoriesFromSections = (sections) => {
  if (!Array.isArray(sections)) return []
  const slugOccurrences = new Map()
  const descriptors = []

  sections.forEach((section, index) => {
    if (!section || !Array.isArray(section.products) || section.products.length === 0) {
      return
    }

    const baseName = section.category || `Category ${index + 1}`
    const baseSlug = section.slug || createProductSlug(baseName) || `category-${index + 1}`
    const occurrence = slugOccurrences.get(baseSlug) ?? 0
    slugOccurrences.set(baseSlug, occurrence + 1)
    const resolvedSlug = occurrence === 0 ? baseSlug : `${baseSlug}-${occurrence + 1}`

    descriptors.push({
      id: section.id ?? null,
      name: baseName,
      slug: resolvedSlug,
      position: descriptors.length,
      product_count: Array.isArray(section.products) ? section.products.length : 0
    })
  })

  return descriptors
}

const interpretYesNoValue = (value) => {
  if (typeof value === 'boolean') return value
  if (value == null) return null

  if (typeof value === 'number') {
    if (Number.isFinite(value)) {
      if (value === 1) return true
      if (value === 0) return false
    }
  }

  const normalized = String(value).trim().toLowerCase()
  if (!normalized) return null

  if (
    [
      'yes',
      'y',
      'true',
      '1',
      'available',
      'in stock',
      'in_stock',
      'instock',
      'available_now',
      'ready'
    ].includes(normalized)
  ) {
    return true
  }

  if (
    [
      'no',
      'n',
      'false',
      '0',
      'n/a',
      'sold out',
      'sold_out',
      'soldout',
      'out of stock',
      'out_of_stock',
      'unavailable',
      'not available',
      'na'
    ].includes(normalized)
  ) {
    return false
  }

  return null
}

const CART_STORAGE_KEY = 'dopabeans-cart-v1'
const ORDER_REFERENCE_STORAGE_KEY = 'dopabeans-last-order-reference-v1'
const CART_EXPIRY_MS = 1000 * 60 * 10

const getProductKey = (product) => {
  if (!product) return ''
  if (product.id) return String(product.id).toLowerCase()
  if (product.slug) return String(product.slug).toLowerCase()
  if (product.name) return createProductSlug(product.name)
  return ''
}

const getProductSlugValue = (product) => createProductSlug(product?.slug || product?.name || product?.id)

const isProductCustomizable = (product) => {
  if (!product) return true

  const hasMilkFlag = typeof product.milkCustomizable === 'boolean'
  const hasBeanFlag = typeof product.beanCustomizable === 'boolean'
  if (hasMilkFlag || hasBeanFlag) {
    return Boolean((hasMilkFlag && product.milkCustomizable) || (hasBeanFlag && product.beanCustomizable))
  }

  const explicitFlag = interpretYesNoValue(product.isCustomizable ?? product.is_customizabe)
  if (explicitFlag !== null) {
    return explicitFlag
  }

  const slug = getProductSlugValue(product)
  const key = getProductKey(product)
  return !(NON_CUSTOMIZABLE_PRODUCTS.has(slug) || NON_CUSTOMIZABLE_PRODUCTS.has(key))
}

const isProductMilkCustomizable = (product) => {
  if (!product) return false

  const hasMilkOptions = Array.isArray(product.milkOptions) && product.milkOptions.length > 0

  if (typeof product.milkCustomizable === 'boolean') {
    return product.milkCustomizable && hasMilkOptions
  }

  const explicitFlag = interpretYesNoValue(
    product.isMilkCustomizable ?? product.is_milk_customizabe ?? product.is_milk_customizable
  )
  if (explicitFlag !== null) {
    return explicitFlag && hasMilkOptions
  }

  return hasMilkOptions && isProductCustomizable(product)
}

const isProductBeanCustomizable = (product) => {
  if (!product) return false

  const hasBeanOptions = Array.isArray(product.beanOptions) && product.beanOptions.length > 0

  if (typeof product.beanCustomizable === 'boolean') {
    return product.beanCustomizable && hasBeanOptions
  }

  const explicitFlag = interpretYesNoValue(
    product.isBeanCustomizable ?? product.is_bean_customizabe ?? product.is_bean_customizable
  )
  if (explicitFlag !== null) {
    return explicitFlag && hasBeanOptions
  }

  return hasBeanOptions
}

const sanitizeStoredCartItem = (entry) => {
  if (!entry || typeof entry !== 'object') return null
  const product = entry.product && typeof entry.product === 'object' ? entry.product : null
  if (!product) return null

  const quantityValue = Number(entry.quantity)
  const quantity = Number.isFinite(quantityValue) && quantityValue > 0 ? Math.min(20, Math.floor(quantityValue)) : 1
  const milk = typeof entry.milk === 'string' ? entry.milk : entry.milk === null ? null : null
  const bean = typeof entry.bean === 'string' ? entry.bean : entry.bean === null ? null : null
  const productKey =
    entry.productKey ||
    (typeof entry.entryKey === 'string' ? entry.entryKey.split('::')[0] : '') ||
    getProductKey(product)

  if (!productKey) return null

  let inferredMilk = milk
  let inferredBean = bean
  if ((!inferredMilk || !inferredBean) && typeof entry.entryKey === 'string') {
    const parts = entry.entryKey.split('::').slice(1)
    for (const part of parts) {
      if (!inferredMilk && part.startsWith('milk-')) {
        inferredMilk = part.slice(5)
      } else if (!inferredBean && part.startsWith('bean-')) {
        inferredBean = part.slice(5)
      } else if (!inferredMilk) {
        inferredMilk = part
      }
    }
  }

  const entryKeyParts = [productKey]
  if (inferredMilk) entryKeyParts.push(`milk-${inferredMilk}`)
  if (inferredBean) entryKeyParts.push(`bean-${inferredBean}`)

  const entryKey =
    entry.entryKey && entry.entryKey.includes('::')
      ? entry.entryKey
      : entryKeyParts.join('::')

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
    milk: inferredMilk ?? null,
    bean: inferredBean ?? null
  }
}

const loadStoredCartSnapshot = () => {
  if (typeof window === 'undefined') {
    return { items: [], savedAt: null }
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return { items: [], savedAt: null }
    }

    const parsed = JSON.parse(raw)

    let savedAt = null
    let storedItems = []

    if (Array.isArray(parsed)) {
      storedItems = parsed
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.items)) {
        storedItems = parsed.items
      }
      const parsedSavedAt = Number(parsed.savedAt)
      savedAt = Number.isFinite(parsedSavedAt) ? parsedSavedAt : null
    } else {
      return { items: [], savedAt: null }
    }

    if (!Array.isArray(storedItems)) {
      return { items: [], savedAt: null }
    }

    const now = Date.now()

    if (savedAt && now - savedAt >= CART_EXPIRY_MS) {
      try {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      } catch (storageError) {
        // Ignore removal issues; we'll treat the cart as empty.
      }
      return { items: [], savedAt: null }
    }

    const sanitizedItems = storedItems.map(sanitizeStoredCartItem).filter(Boolean)

    if (!sanitizedItems.length) {
      try {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      } catch (storageError) {
        // Ignore removal issues; the cart will be treated as empty.
      }
      return { items: [], savedAt: null }
    }

    return {
      items: sanitizedItems,
      savedAt: savedAt || now
    }
  } catch (error) {
    return { items: [], savedAt: null }
  }
}

const loadStoredOrderReference = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(ORDER_REFERENCE_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    const orderNumber = typeof parsed.orderNumber === 'string' && parsed.orderNumber.trim().length > 0
      ? parsed.orderNumber.trim()
      : null

    if (!orderNumber) {
      return null
    }

    const savedAtValue = Number(parsed.savedAt)
    return {
      orderNumber,
      savedAt: Number.isFinite(savedAtValue) ? savedAtValue : null
    }
  } catch (error) {
    return null
  }
}

const persistOrderReference = (orderNumber) => {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof orderNumber !== 'string') {
    return
  }

  const trimmed = orderNumber.trim()
  if (!trimmed) {
    return
  }

  try {
    window.localStorage.setItem(
      ORDER_REFERENCE_STORAGE_KEY,
      JSON.stringify({ orderNumber: trimmed, savedAt: Date.now() })
    )
  } catch (storageError) {
    // Ignore storage issues.
  }
}


const serializeCartItemsForStorage = (items, savedAt) => {
  const timestamp = Number.isFinite(savedAt) ? savedAt : Date.now()

  return {
    version: 3,
    savedAt: timestamp,
    items: items.map((item) => ({
      id: item.id,
      product: item.product,
      productKey: item.productKey,
      entryKey: item.entryKey,
      quantity: item.quantity,
      milk: item.milk ?? null,
      bean: item.bean ?? null
    }))
  }
}

const normalizeModifierOptionLabel = (option) => {
  if (!option || typeof option !== 'object') return ''
  const label = option.name || option.name_localized || option.reference || option.id
  return label ? String(label).trim() : ''
}

const buildModifierOptionValue = (option) => {
  if (!option || typeof option !== 'object') return null
  if (option.id != null) {
    const idValue = String(option.id).trim()
    if (idValue) return idValue
  }
  const reference = option.reference != null ? String(option.reference).trim() : ''
  if (reference) return reference
  const label = normalizeModifierOptionLabel(option)
  const slug = createProductSlug(label)
  if (slug) return slug
  const fallback = JSON.stringify(option)
  return fallback || null
}

const collectOptionsForKeywords = (modifiers, keywords) => {
  if (!Array.isArray(modifiers) || !Array.isArray(keywords) || keywords.length === 0) {
    return []
  }

  const keywordMatches = (value) => {
    if (!value) return false
    const lower = String(value).toLowerCase()
    return keywords.some((keyword) => lower.includes(keyword))
  }

  const collected = new Map()

  modifiers.forEach((modifier) => {
    if (!modifier || typeof modifier !== 'object') return
    const nameMatches = keywordMatches(modifier.name) || keywordMatches(modifier.reference)
    if (!nameMatches) return

    const options = Array.isArray(modifier.options) ? modifier.options : []
    options.forEach((option) => {
      const label = normalizeModifierOptionLabel(option)
      if (!label) return
      const value = buildModifierOptionValue(option)
      if (!value) return
      if (collected.has(value)) return

      const numericPrice = Number(option.price)
      const price = Number.isFinite(numericPrice) ? numericPrice : null

      collected.set(value, {
        value,
        label,
        price,
        isDefault: Boolean(option.is_default)
      })
    })
  })

  return Array.from(collected.values())
}

const deriveMilkOptionsFromModifiers = (modifiers) => collectOptionsForKeywords(modifiers, ['milk'])

const deriveBeanOptionsFromModifiers = (modifiers) => collectOptionsForKeywords(modifiers, ['bean', 'coffee'])

const condenseOptionsWithBlueprints = (options, blueprints) => {
  if (!Array.isArray(options) || options.length === 0) {
    return []
  }

  const normalized = options.map((option) => {
    const label = option?.label || option?.name || option?.value || ''
    const lower = String(label).toLowerCase()
    const priceValue = Number(option?.price)
    return {
      ...option,
      label: label || '',
      lowerLabel: lower,
      price: Number.isFinite(priceValue) ? priceValue : null,
      isDefault: Boolean(option?.isDefault ?? option?.is_default)
    }
  })

  return blueprints
    .map((blueprint) => {
      const match = normalized.find((option) =>
        blueprint.keywords.some((keyword) => option.lowerLabel.includes(keyword))
      )

      if (!match) return null

      return {
        value: blueprint.value,
        label: blueprint.label,
        price: match.price,
        isDefault: match.isDefault
      }
    })
    .filter(Boolean)
}

const convertSelectorOptionsToModifierOptions = (options) =>
  options.map((option) => ({
    id: option.value,
    name: option.label,
    price: option.price != null ? Number(option.price) : null,
    is_default: option.isDefault ?? false
  }))

const mapProductToDetails = (item = {}) => {
  const availabilityFlag = interpretYesNoValue(item.isAvailable ?? item.availability)
  const isInStock = availabilityFlag !== false
  const availabilityLabel = item.availability && String(item.availability).trim()
    ? String(item.availability).trim()
    : isInStock
      ? 'In Stock'
      : 'Sold Out'

  const numericPrice = Number.isFinite(item.price) ? item.price : null
  const price = isInStock ? numericPrice : null

  const displayPrice = isInStock
    ? price != null
      ? price
      : item.rawPrice || 'Ask'
    : 'Sold Out'

  const directImageUrl = item.imageUrl ? String(item.imageUrl).trim() : ''

  const normalizedImageUrl = (() => {
    if (!directImageUrl) return ''
    if (/^https?:\/\//i.test(directImageUrl)) {
      return directImageUrl
    }
    if (directImageUrl.startsWith('//')) {
      return `https:${directImageUrl}`
    }
    if (directImageUrl.startsWith('/')) {
      return directImageUrl
    }
    return `/${directImageUrl.replace(/^\/+/, '')}`
  })()

  const slugSource = item.slug || item.product_slug || item.name || item.id
  const slug = createProductSlug(slugSource)

  const modifiers = Array.isArray(item.modifiers) ? item.modifiers : []
  const derivedMilkOptions = deriveMilkOptionsFromModifiers(modifiers)
  const derivedBeanOptions = deriveBeanOptionsFromModifiers(modifiers)
  const sourceMilkOptions = derivedMilkOptions.length > 0 ? derivedMilkOptions : Array.isArray(item.milkOptions) ? item.milkOptions : []
  const sourceBeanOptions = derivedBeanOptions.length > 0 ? derivedBeanOptions : Array.isArray(item.beanOptions) ? item.beanOptions : []
  const milkOptions = condenseOptionsWithBlueprints(sourceMilkOptions, MILK_OPTION_BLUEPRINTS)
  const beanOptions = condenseOptionsWithBlueprints(sourceBeanOptions, BEAN_OPTION_BLUEPRINTS)
  const defaultMilkOptionValue = getDefaultMilkValue(milkOptions)
  const defaultBeanOptionValue = getDefaultBeanValue(beanOptions)

  const normalizeOptions = (options = []) =>
    options
      .filter((option) => option && typeof option === 'object')
      .map((option, index) => {
        const numericPrice = Number(option.price)
        const numericSortOrder = Number(option.sort_order)
        return {
          id: option.id ?? `${slug || item.id || 'modifier'}-option-${index}`,
          name: option.name ?? option.name_localized ?? 'Option',
          price: Number.isFinite(numericPrice) ? numericPrice : null,
          is_default: Boolean(option.is_default ?? option.isDefault),
          sort_order: Number.isFinite(numericSortOrder) ? numericSortOrder : null
        }
      })
      .filter((option) => option.name && option.name.trim().length > 0)

  const normalizedModifiers = Array.isArray(modifiers)
    ? modifiers
        .filter((modifier) => modifier && typeof modifier === 'object')
        .map((modifier, index) => {
          const options = normalizeOptions(modifier.options)
          return {
            id: modifier.id ?? `${slug || item.id || 'modifier'}-${index}`,
            name: modifier.name ?? modifier.name_localized ?? 'Modifier',
            is_required: Boolean(modifier.is_required),
            options
          }
        })
        .filter((modifier) => Array.isArray(modifier.options) && modifier.options.length > 0)
    : []

  const addSyntheticModifier = (identifier, displayName, options) => {
    if (!Array.isArray(options) || options.length === 0) {
      return
    }
    normalizedModifiers.push({
      id: `${slug || item.id || identifier}-${identifier}`,
      name: displayName,
      options: convertSelectorOptionsToModifierOptions(options),
      is_required: false
    })
  }

  if (normalizedModifiers.length === 0) {
    addSyntheticModifier('milk', 'Types of Milk', milkOptions)
    addSyntheticModifier('bean', 'Types of Bean', beanOptions)
  }

  const imageKeys = [
    item.id ? String(item.id).toLowerCase() : null,
    slug,
    item.name ? createProductSlug(item.name) : null
  ].filter(Boolean)

  let resolvedImage = null
  for (const key of imageKeys) {
    if (PRODUCT_IMAGE_MAP[key]) {
      resolvedImage = PRODUCT_IMAGE_MAP[key]
      break
    }
  }

  const imageSrc = resolvedImage || normalizedImageUrl || DEFAULT_PRODUCT_IMAGE
  const normalizedAvailability = availabilityLabel.toLowerCase()

  return {
    ...item,
    modifiers: normalizedModifiers,
    milkOptions,
    beanOptions,
    defaultMilkOption: defaultMilkOptionValue,
    defaultBeanOption: defaultBeanOptionValue,
    normalizedAvailability,
    isInStock,
    displayPrice,
    imageSrc,
    slug,
    availability: availabilityLabel,
    isAvailable: isInStock,
    price
  }
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
  const initialCartSnapshotRef = useRef(null)
  if (initialCartSnapshotRef.current === null) {
    initialCartSnapshotRef.current = loadStoredCartSnapshot()
  }

  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/'
    return window.location.pathname || '/'
  })
  const [pendingScrollTarget, setPendingScrollTarget] = useState(null)
  const [cartItems, setCartItems] = useState(() => initialCartSnapshotRef.current.items)
  const [milkOptions, setMilkOptions] = useState(() => FALLBACK_MILK_OPTIONS.map((option) => ({ ...option })))
  const [beanOptions, setBeanOptions] = useState(() => FALLBACK_BEAN_OPTIONS.map((option) => ({ ...option })))
  const [cartFlow, setCartFlow] = useState({
    step: null,
    product: null,
    quantity: 1,
    milk: FALLBACK_DEFAULT_MILK_OPTION,
    bean: FALLBACK_DEFAULT_BEAN_OPTION,
    requiresMilk: false,
    requiresBean: false,
    mode: 'add',
    originalEntryKey: null,
    originalEntryId: null,
    availableMilkOptions: [],
    availableBeanOptions: []
  })
  const [cartFeedback, setCartFeedback] = useState(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [orderFlow, setOrderFlow] = useState(createInitialOrderFlowState)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuSections, setMenuSections] = useState([])
  const [menuCategories, setMenuCategories] = useState([])
  const [menuStatus, setMenuStatus] = useState('idle')
  const [menuError, setMenuError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [standaloneProductId, setStandaloneProductId] = useState(null)
  const [expandedProductKey, setExpandedProductKey] = useState(null)
  const [latestOrderReference, setLatestOrderReference] = useState(() => loadStoredOrderReference())
  const cartLastSavedAtRef = useRef(initialCartSnapshotRef.current.savedAt)
  const cartHydratedRef = useRef(false)
  const cartExpiryTimeoutRef = useRef(null)
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
  const defaultMilkOption = useMemo(
    () => getDefaultMilkValue(milkOptions) ?? FALLBACK_DEFAULT_MILK_OPTION,
    [milkOptions]
  )
  const defaultBeanOption = useMemo(
    () => getDefaultBeanValue(beanOptions) ?? FALLBACK_DEFAULT_BEAN_OPTION,
    [beanOptions]
  )
  const milkLabelMap = useMemo(() => {
    const map = new Map()
    const register = (option) => {
      if (!option) return
      const rawValue = option.value
      const key = typeof rawValue === 'string' ? rawValue : rawValue != null ? String(rawValue) : ''
      if (!key) return
      const label =
        typeof option.label === 'string' && option.label.trim().length > 0
          ? option.label.trim()
          : key
      if (!map.has(key)) {
        map.set(key, label)
      }
    }
    milkOptions.forEach(register)
    FALLBACK_MILK_OPTIONS.forEach(register)
    return map
  }, [milkOptions])
  const beanLabelMap = useMemo(() => {
    const map = new Map()
    const register = (option) => {
      if (!option) return
      const rawValue = option.value
      const key = typeof rawValue === 'string' ? rawValue : rawValue != null ? String(rawValue) : ''
      if (!key) return
      const label =
        typeof option.label === 'string' && option.label.trim().length > 0
          ? option.label.trim()
          : key
      if (!map.has(key)) {
        map.set(key, label)
      }
    }
    beanOptions.forEach(register)
    FALLBACK_BEAN_OPTIONS.forEach(register)
    return map
  }, [beanOptions])
  const getMilkLabel = (value) => {
    if (!value) return null
    const key = typeof value === 'string' ? value : String(value)
    return milkLabelMap.get(key) || key
  }
  const getBeanLabel = (value) => {
    if (!value) return null
    const key = typeof value === 'string' ? value : String(value)
    return beanLabelMap.get(key) || key
  }
  useEffect(() => {
    setCartFlow((previous) => {
      if (!previous) return previous
      const milkIsValid = previous.milk && milkOptions.some((option) => option.value === previous.milk)
      const beanIsValid = previous.bean && beanOptions.some((option) => option.value === previous.bean)
      const nextMilk = milkIsValid ? previous.milk : defaultMilkOption
      const nextBean = beanIsValid ? previous.bean : defaultBeanOption
      if (nextMilk === previous.milk && nextBean === previous.bean) {
        return previous
      }
      return {
        ...previous,
        milk: nextMilk,
        bean: nextBean
      }
    })
  }, [milkOptions, beanOptions, defaultMilkOption, defaultBeanOption])
  const menuCategoryDescriptors = useMemo(() => {
    if (!Array.isArray(menuSections) || menuSections.length === 0) {
      return []
    }

    const sectionEntries = []
    const slugOccurrences = new Map()
    const sectionByBaseSlug = new Map()
    const sectionById = new Map()

    menuSections.forEach((section, index) => {
      if (!section || !Array.isArray(section.products) || section.products.length === 0) {
        return
      }

      const baseName = section.category || `Category ${index + 1}`
      const baseSlug = section.slug || createProductSlug(baseName) || `category-${index + 1}`
      const occurrence = slugOccurrences.get(baseSlug) ?? 0
      slugOccurrences.set(baseSlug, occurrence + 1)
      const resolvedSlug = occurrence === 0 ? baseSlug : `${baseSlug}-${occurrence + 1}`

      const entry = {
        section,
        baseSlug,
        slug: resolvedSlug,
        name: baseName,
        id: section.id ?? null
      }

      sectionEntries.push(entry)
      if (!sectionByBaseSlug.has(baseSlug)) {
        sectionByBaseSlug.set(baseSlug, entry)
      }
      if (entry.id != null && !sectionById.has(String(entry.id))) {
        sectionById.set(String(entry.id), entry)
      }
    })

    const descriptors = []
    const seenSlugs = new Set()
    const usedEntries = new Set()
    const categoriesOrder = Array.isArray(menuCategories)
      ? [...menuCategories].sort((a, b) => {
          const aPos = Number.isFinite(a?.position) ? a.position : 0
          const bPos = Number.isFinite(b?.position) ? b.position : 0
          return aPos - bPos
        })
      : []

    const registerEntry = (entry, nameHint) => {
      if (!entry || usedEntries.has(entry)) return

      let slug = entry.slug
      let attempt = 2
      while (seenSlugs.has(slug)) {
        slug = `${entry.baseSlug}-${attempt}`
        attempt += 1
      }

      seenSlugs.add(slug)
      usedEntries.add(entry)
      descriptors.push({
        section: entry.section,
        category: entry.section.category || nameHint || entry.name,
        slug
      })
    }

    categoriesOrder.forEach((category, index) => {
      if (!category) return
      const baseSlug = category.slug || createProductSlug(category.name) || `category-${index + 1}`
      let entry = sectionByBaseSlug.get(baseSlug)
      if (!entry && category.id != null) {
        entry = sectionById.get(String(category.id))
      }
      registerEntry(entry, category.name)
    })

    sectionEntries.forEach((entry) => {
      registerEntry(entry)
    })

    return [...descriptors].sort((a, b) => {
      const aSlug = a?.slug || ''
      const bSlug = b?.slug || ''
      const aIsBestSeller = aSlug === 'best-seller'
      const bIsBestSeller = bSlug === 'best-seller'
      if (aIsBestSeller && !bIsBestSeller) return -1
      if (!aIsBestSeller && bIsBestSeller) return 1

      const aCount = Array.isArray(a?.section?.products) ? a.section.products.length : 0
      const bCount = Array.isArray(b?.section?.products) ? b.section.products.length : 0
      if (bCount !== aCount) {
        return bCount - aCount
      }
      const aName = a?.category ? String(a.category).toLowerCase() : ''
      const bName = b?.category ? String(b.category).toLowerCase() : ''
      if (aName < bName) return -1
      if (aName > bName) return 1
      return 0
    })
  }, [menuSections, menuCategories])

  const clearCartExpiryTimer = () => {
    if (cartExpiryTimeoutRef.current != null) {
      clearTimeout(cartExpiryTimeoutRef.current)
      cartExpiryTimeoutRef.current = null
    }
  }

  const handleCartExpiry = () => {
    clearCartExpiryTimer()

    const hadItems = Array.isArray(cartItems) && cartItems.length > 0

    cartLastSavedAtRef.current = null
    cartHydratedRef.current = false

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      } catch (storageError) {
        // Ignore removal issues; we'll treat the cart as cleared.
      }
    }

    if (!hadItems) {
      return
    }

    setCartItems([])
    setCartFlow(resetCartFlow())
    setOrderFlow(createInitialOrderFlowState())
    setCartModalOpen(false)
    setCartFeedback('Cart cleared after 10 minutes of inactivity.')
  }

  const scheduleCartExpiryCheck = (savedAt) => {
    if (typeof window === 'undefined') return

    clearCartExpiryTimer()
    if (!Number.isFinite(savedAt)) {
      return
    }

    const now = Date.now()
    const millisecondsUntilExpiry = savedAt + CART_EXPIRY_MS - now

    if (millisecondsUntilExpiry <= 0) {
      handleCartExpiry()
      return
    }

    cartExpiryTimeoutRef.current = window.setTimeout(() => {
      handleCartExpiry()
    }, millisecondsUntilExpiry)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    clearCartExpiryTimer()

    if (!cartItems || cartItems.length === 0) {
      try {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      } catch (storageError) {
        // Ignore storage errors when clearing the cart.
      }
      cartLastSavedAtRef.current = null
      cartHydratedRef.current = false
      return undefined
    }

    const baseSavedAt =
      cartHydratedRef.current && Number.isFinite(cartLastSavedAtRef.current)
        ? Date.now()
        : cartLastSavedAtRef.current ?? Date.now()

    const snapshot = serializeCartItemsForStorage(cartItems, baseSavedAt)

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(snapshot))
    } catch (error) {
      // Ignore storage errors to avoid blocking the UI.
    }

    cartLastSavedAtRef.current = snapshot.savedAt
    cartHydratedRef.current = true

    scheduleCartExpiryCheck(snapshot.savedAt)

    return () => {
      clearCartExpiryTimer()
    }
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

  const handleMenuCategoryNavigation = (categorySlug) => {
    if (!categorySlug) return
    const targetId = `category-${categorySlug}`
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

  function resetCartFlow() {
    return {
      step: null,
      product: null,
      quantity: 1,
      milk: defaultMilkOption,
      bean: defaultBeanOption,
      requiresMilk: false,
      requiresBean: false,
      mode: 'add',
      originalEntryKey: null,
      originalEntryId: null,
      availableMilkOptions: [],
      availableBeanOptions: []
    }
  }

  const closeCartFlow = () => {
    setCartFlow(resetCartFlow())
  }

  const startOrderFlow = () => {
    if (cartItems.length === 0) return
    if (isSubMenuPage) {
      setOrderFlow({ step: 'ready', type: 'takeaway', table: null })
      return
    }
    setOrderFlow({ step: 'type', type: null, table: null })
  }

  const handleSelectOrderType = (type) => {
    if (isSubMenuPage && type === 'in-house') {
      setOrderFlow({ step: 'ready', type: 'takeaway', table: null })
      return
    }
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
    if (isSubMenuPage) {
      setOrderFlow({ step: 'ready', type: 'takeaway', table: null })
      return
    }
    setOrderFlow({ step: 'type', type: null, table: null })
  }

  const handleChangeTableSelection = () => {
    setOrderFlow({ step: 'table', type: 'in-house', table: orderFlow.table })
  }

  const buildOrderSubmission = () => {
    if (cartItems.length === 0) {
      setCartFeedback('Add items to the cart before continuing.')
      return null
    }

    if (!orderFlow.type) {
      setCartFeedback('Please choose an order type before continuing.')
      return null
    }

    if (orderFlow.type === 'in-house' && !orderFlow.table) {
      setCartFeedback('Please select a table number before continuing.')
      return null
    }

    if (!Number.isFinite(cartTotalValue) || cartTotalValue <= 0) {
      setCartFeedback('Unable to calculate your total. Please review the cart and try again.')
      return null
    }

    const itemsMissingPrice = cartItems.some((item) => !Number.isFinite(Number(item.product?.price)))
    if (itemsMissingPrice) {
      setCartFeedback('Some items are missing prices. Please update them before submitting the order.')
      return null
    }

    let productSummary = cartItems
      .map((item) => {
        const name = item.product?.name || 'Drink'
        const milkLabel = getMilkLabel(item.milk)
        const beanLabel = getBeanLabel(item.bean)
        const descriptors = []
        if (milkLabel) descriptors.push(milkLabel)
        if (beanLabel) descriptors.push(`Bean: ${beanLabel}`)
        const descriptorSuffix = descriptors.length ? ` (${descriptors.join(', ')})` : ''
        return `${name} x${item.quantity}${descriptorSuffix}`
      })
      .join('; ')

    if (orderFlow.type === 'in-house' && orderFlow.table) {
      productSummary = `${productSummary}; Table ${orderFlow.table}`
    }

    const uniqueMilks = new Set(cartItems.map((item) => item.milk).filter(Boolean))
    let milkType = 'none'
    if (uniqueMilks.size === 1) {
      const [singleMilk] = Array.from(uniqueMilks)
      milkType = getMilkLabel(singleMilk) || singleMilk
    } else if (uniqueMilks.size > 1) {
      milkType = 'mixed'
    }

    const uniqueBeans = new Set(cartItems.map((item) => item.bean).filter(Boolean))
    let beanType = 'none'
    if (uniqueBeans.size === 1) {
      const [singleBean] = Array.from(uniqueBeans)
      beanType = getBeanLabel(singleBean) || singleBean
    } else if (uniqueBeans.size > 1) {
      beanType = 'mixed'
    }

    const payload = {
      product: productSummary,
      milk_type: milkType,
      order_type: orderFlow.type === 'in-house' ? 'inhouse' : orderFlow.type,
      bean_type: beanType,
      quantity: cartItemCount,
      amount: Number(cartTotalValue.toFixed(2))
    }

    const itemDetails = cartItems.map((item) => ({
      product_key: item.productKey || getProductKey(item.product),
      name: item.product?.name || 'Drink',
      quantity: item.quantity,
      milk: getMilkLabel(item.milk),
      milk_value: item.milk ?? null,
      bean: getBeanLabel(item.bean),
      bean_value: item.bean ?? null,
      notes: item.product?.description || ''
    }))

    return {
      payload,
      productSummary,
      itemDetails
    }
  }

  const handleOrderPayNow = async () => {
    if (isProcessingPayment) return

    const submission = buildOrderSubmission()
    if (!submission) return

    const { payload } = submission

    const endpoint = buildBackendUrl('/api/create-payment-session')
    if (!endpoint) {
      setCartFeedback('Payment service is unavailable. Please try again later.')
      return
    }

    try {
      setIsProcessingPayment(true)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const responseClone = response.clone()

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`
        try {
          const errorBody = await responseClone.json()
          if (errorBody && typeof errorBody === 'object') {
            const detailMessage =
              errorBody.detail ||
              errorBody.message ||
              (Array.isArray(errorBody) && errorBody.length > 0 ? errorBody[0] : null)
            if (detailMessage) {
              errorMessage = `${errorMessage}: ${detailMessage}`
            }
          }
        } catch {
          try {
            const text = await responseClone.text()
            if (text) {
              errorMessage = `${errorMessage}: ${text}`
            }
          } catch {
            // Ignore parsing failures; we'll fall back to the default message.
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      if (!data?.redirect_url) {
        throw new Error('Payment provider did not return a redirect link.')
      }

      const orderNumber =
        typeof data.order_number === 'string' && data.order_number.trim().length > 0
          ? data.order_number.trim()
          : null

      if (orderNumber) {
        persistOrderReference(orderNumber)
        setLatestOrderReference({ orderNumber, savedAt: Date.now() })
      }

      closeCartModal()
      window.location.assign(data.redirect_url)
    } catch (error) {
      console.error('Failed to create payment session', error)
      const fallbackMessage = 'Could not start the payment.'
      const detailMessage = error instanceof Error && error.message ? ` ${error.message}` : ' Please try again.'
      setCartFeedback(`${fallbackMessage}${detailMessage}`)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleSubmitKitchenOrder = async () => {
    if (isProcessingPayment) return

    const submission = buildOrderSubmission()
    if (!submission) return

    const { payload, itemDetails } = submission

    try {
      setIsProcessingPayment(true)

      const kitchenPayload = {
        ...payload,
        table_number: orderFlow.type === 'in-house' ? orderFlow.table : null,
        source: 'sub_menu',
        items: itemDetails,
        submitted_at: new Date().toISOString()
      }

      console.log('[SubMenu] Prepared kitchen order payload:', kitchenPayload)
      await new Promise((resolve) => setTimeout(resolve, 250))

      setCartItems([])
      closeCartModal()
      setCartFeedback('Order sent to the kitchen. Thank you!')
    } catch (error) {
      console.error('Failed to submit kitchen order', error)
      setCartFeedback('Could not send the order. Please try again.')
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

    const hydratedProduct =
      product && (Array.isArray(product.milkOptions) || Array.isArray(product.beanOptions))
        ? product
        : mapProductToDetails(product || {})

    const key = getProductKey(hydratedProduct)
    const existingItem = cartItems.find((item) => (item.productKey || getProductKey(item.product)) === key)
    const milkCustomizable = isProductMilkCustomizable(hydratedProduct)
    const beanCustomizable = isProductBeanCustomizable(hydratedProduct)
    const isEditFlow = Boolean(options.fromCartEdit)
    const entryContext = options.entry || null
    const existingQuantity = entryContext ? Number(entryContext.quantity) || 0 : existingItem ? Number(existingItem.quantity) || 0 : 0
    const initialQuantity = isEditFlow ? Math.max(existingQuantity, 1) : 1
    const productMilkOptions = (Array.isArray(hydratedProduct.milkOptions) && hydratedProduct.milkOptions.length > 0
      ? hydratedProduct.milkOptions
      : milkOptions
    ).map((option) => ({ ...option }))
    const productBeanOptions = (Array.isArray(hydratedProduct.beanOptions) && hydratedProduct.beanOptions.length > 0
      ? hydratedProduct.beanOptions
      : beanOptions
    ).map((option) => ({ ...option }))

    const optionExists = (optionsList, value) =>
      Array.isArray(optionsList) && optionsList.some((option) => option.value === value)

    const defaultProductMilk = getDefaultMilkValue(productMilkOptions) ?? hydratedProduct.defaultMilkOption ?? defaultMilkOption
    const defaultProductBean = getDefaultBeanValue(productBeanOptions) ?? hydratedProduct.defaultBeanOption ?? defaultBeanOption

    const sanitizeMilkValue = (value) => {
      if (!milkCustomizable) return null
      if (value && optionExists(productMilkOptions, value)) {
        return value
      }
      return defaultProductMilk
    }

    const sanitizeBeanValue = (value) => {
      if (!beanCustomizable) return null
      if (value && optionExists(productBeanOptions, value)) {
        return value
      }
      return defaultProductBean
    }

    const initialMilk = milkCustomizable
      ? sanitizeMilkValue(
          entryContext && entryContext.milk != null
            ? entryContext.milk
            : existingItem && existingItem.milk != null
              ? existingItem.milk
              : hydratedProduct.defaultMilkOption ?? defaultProductMilk
        )
      : null
    const initialBean = beanCustomizable
      ? sanitizeBeanValue(
          entryContext && entryContext.bean != null
            ? entryContext.bean
            : existingItem && existingItem.bean != null
              ? existingItem.bean
              : hydratedProduct.defaultBeanOption ?? defaultProductBean
        )
      : null
    const mode = options.fromCartEdit ? 'update' : 'add'

    setCartFlow({
      step: 'quantity',
      product: hydratedProduct,
      quantity: initialQuantity,
      milk: milkCustomizable ? initialMilk : null,
      bean: beanCustomizable ? initialBean : null,
      requiresMilk: milkCustomizable,
      requiresBean: beanCustomizable,
      mode,
      originalEntryKey: entryContext?.entryKey || (isEditFlow ? (existingItem?.entryKey || key) : null),
      originalEntryId: entryContext?.id || (isEditFlow ? existingItem?.id || null : null),
      availableMilkOptions: productMilkOptions,
      availableBeanOptions: productBeanOptions
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

  const backToQuantityStep = () => {
    setCartFlow((prev) => ({ ...prev, step: 'quantity' }))
  }

  const goToMilkStep = () => {
    setCartFlow((prev) => ({ ...prev, step: 'milk' }))
  }

  const goToBeanStep = () => {
    setCartFlow((prev) => ({ ...prev, step: 'bean' }))
  }

  const proceedFromQuantityStep = () => {
    if (cartFlow.requiresMilk) {
      goToMilkStep()
      return
    }
    if (cartFlow.requiresBean) {
      goToBeanStep()
      return
    }
    finalizeCartItem()
  }

  const proceedFromMilkStep = () => {
    if (cartFlow.requiresBean) {
      goToBeanStep()
      return
    }
    finalizeCartItem()
  }

  const proceedFromBeanStep = () => {
    finalizeCartItem()
  }

  const backToQuantityFromBean = () => {
    if (cartFlow.requiresMilk) {
      goToMilkStep()
      return
    }
    backToQuantityStep()
  }

  const selectMilkOption = (value) => {
    setCartFlow((prev) => ({ ...prev, milk: value }))
  }

  const selectBeanOption = (value) => {
    setCartFlow((prev) => ({ ...prev, bean: value }))
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
      requiresBean,
      milk: selectedMilk,
      bean: selectedBean,
      quantity,
      mode,
      originalEntryKey: flowOriginalEntryKey,
      originalEntryId,
      availableMilkOptions,
      availableBeanOptions
    } = cartFlow

    if (!product) return

    const effectiveMilkOptions =
      Array.isArray(availableMilkOptions) && availableMilkOptions.length > 0
        ? availableMilkOptions
        : milkOptions
    const effectiveBeanOptions =
      Array.isArray(availableBeanOptions) && availableBeanOptions.length > 0
        ? availableBeanOptions
        : beanOptions

    const fallbackMilk = getDefaultMilkValue(effectiveMilkOptions) ?? defaultMilkOption
    const fallbackBean = getDefaultBeanValue(effectiveBeanOptions) ?? defaultBeanOption

    const milk = requiresMilk
      ? selectedMilk && effectiveMilkOptions.some((option) => option.value === selectedMilk)
        ? selectedMilk
        : fallbackMilk
      : null
    const bean = requiresBean
      ? selectedBean && effectiveBeanOptions.some((option) => option.value === selectedBean)
        ? selectedBean
        : fallbackBean
      : null
    const targetKey = getProductKey(product)
    const entryKeyParts = [targetKey]
    if (milk) entryKeyParts.push(`milk-${milk}`)
    if (bean) entryKeyParts.push(`bean-${bean}`)
    const entryKey = entryKeyParts.join('::')
    const originalEntryKey = flowOriginalEntryKey || entryKeyParts[0]
    const resolvedOriginalEntryId = originalEntryId || null

    setCartItems((currentItems) => {
      const cleanedItems = currentItems.filter((item) => {
        const itemKey = item.entryKey || item.productKey || getProductKey(item.product)
        if (mode === 'update' && itemKey === originalEntryKey) {
          return false
        }
        return true
      })

      const existingIndex = cleanedItems.findIndex((item) => {
        const itemKey = item.entryKey || item.productKey || getProductKey(item.product)
        if (itemKey === entryKey) {
          return true
        }
        if (!bean && milk && (itemKey === `${targetKey}::${milk}` || itemKey === `${targetKey}::milk-${milk}`)) {
          return true
        }
        if (!milk && bean && (itemKey === `${targetKey}::bean-${bean}`)) {
          return true
        }
        if (!milk && !bean && itemKey === targetKey) {
          return true
        }
        return false
      })

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
          milk,
          bean
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
          milk,
          bean
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
        return {
          sections: parsedCache.sections,
          categories: Array.isArray(parsedCache.categories) ? parsedCache.categories : null,
          milkOptions: Array.isArray(parsedCache.milkOptions) ? parsedCache.milkOptions : null,
          beanOptions: Array.isArray(parsedCache.beanOptions) ? parsedCache.beanOptions : null,
          timestamp: typeof parsedCache.timestamp === 'number' ? parsedCache.timestamp : null
        }
      } catch (error) {
        return null
      }
    }

    const saveToCache = (data) => {
      if (typeof window === 'undefined') return
      try {
        const payload = JSON.stringify({
          sections: data.sections,
          categories: data.categories,
          milkOptions: data.milkOptions,
          beanOptions: data.beanOptions,
          timestamp: Date.now()
        })
        window.localStorage.setItem(MENU_CACHE_STORAGE_KEY, payload)
      } catch (error) {
        // Swallow caching errors; rendering should continue
      }
    }

    const cachedMenu = loadFromCache()
    if (cachedMenu && isMounted) {
      setMenuSections(cachedMenu.sections)
      if (cachedMenu.categories) {
        setMenuCategories(cachedMenu.categories)
      }
      if (cachedMenu.milkOptions) {
        setMilkOptions(cachedMenu.milkOptions)
      }
      if (cachedMenu.beanOptions) {
        setBeanOptions(cachedMenu.beanOptions)
      }
      setMenuStatus('success')
    }

    const fetchMenu = async ({ background = false } = {}) => {
      if (!background) {
        setMenuStatus(cachedMenu ? 'success' : 'loading')
        setMenuError(null)
      }

      try {
        const response = await fetch(buildBackendUrl('/api/menu'), {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (!response.ok) {
          throw new Error(`Unable to load menu data (${response.status})`)
        }

        const payload = await response.json()

        const receivedSections = Array.isArray(payload.sections) ? payload.sections : []
        const receivedCategories = Array.isArray(payload.categories) ? payload.categories : null
        const receivedMilkOptions = Array.isArray(payload.milk_options) ? payload.milk_options : null
        const receivedBeanOptions = Array.isArray(payload.bean_options) ? payload.bean_options : null

        const finalMilkOptions =
          receivedMilkOptions && receivedMilkOptions.length > 0
            ? receivedMilkOptions.map((option) => ({ ...option }))
            : FALLBACK_MILK_OPTIONS.map((option) => ({ ...option }))

        const finalCategories =
          receivedCategories && receivedCategories.length > 0
            ? receivedCategories.map((category, index) => ({
                ...category,
                position:
                  typeof category.position === 'number' && Number.isFinite(category.position)
                    ? category.position
                    : index
              }))
            : buildCategoriesFromSections(receivedSections)

        const finalBeanOptions =
          receivedBeanOptions && receivedBeanOptions.length > 0
            ? receivedBeanOptions.map((option) => ({ ...option }))
            : FALLBACK_BEAN_OPTIONS.map((option) => ({ ...option }))

        if (isMounted) {
          setMenuSections(receivedSections)
          setMenuCategories(finalCategories)
          setMilkOptions(finalMilkOptions)
          setBeanOptions(finalBeanOptions)
          setMenuStatus('success')
          setMenuError(null)
          saveToCache({
            sections: receivedSections,
            categories: finalCategories,
            milkOptions: finalMilkOptions,
            beanOptions: finalBeanOptions
          })
        }
      } catch (error) {
        if (!isMounted) return

        if (!background || !cachedMenu) {
          setMenuSections([])
          setMenuCategories([])
          setMenuStatus('error')
        }
        setMenuError(error instanceof Error ? error.message : 'Failed to load menu data')
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
  const isSubMenuPage = currentPath === '/sub-menu'
  const isMenuInterface = isMenuPage || isSubMenuPage
  const isPaymentSuccessPage = currentPath === '/payment-success'
  const readyOrderFlowMessage =
    orderFlow.type === 'in-house' && orderFlow.table
      ? `Table ${orderFlow.table} selected${
          isSubMenuPage ? '. Review items and send to the kitchen when ready.' : ' for in-house service.'
        }`
      : !isSubMenuPage
          ? 'Takeaway order selected.'
          : null
  const paymentSuccessOrderNumber = latestOrderReference?.orderNumber || ''
  const paymentSuccessWhatsappUrl = buildWhatsappConfirmationUrl(paymentSuccessOrderNumber)

  useEffect(() => {
    if (!isPaymentSuccessPage) {
      return undefined
    }

    clearCartExpiryTimer()
    setCartItems([])
    setCartFlow(resetCartFlow())
    setOrderFlow(createInitialOrderFlowState())
    setCartModalOpen(false)
    setCartFeedback(null)

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      } catch (storageError) {
        // Ignore removal failures.
      }
    }

    setLatestOrderReference(loadStoredOrderReference())

    return undefined
  }, [isPaymentSuccessPage])
  useEffect(() => {
    if (!isMenuInterface) {
      closeExpandedProductCard()
    }
  }, [isMenuInterface])

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

  const shouldShowProductModal = Boolean(selectedProduct && !isMenuInterface)

  const renderCartFlowContent = () => {
    if (!cartFlow.product || !cartFlow.step) {
      return null
    }

    const effectiveMilkOptions =
      Array.isArray(cartFlow.availableMilkOptions) && cartFlow.availableMilkOptions.length > 0
        ? cartFlow.availableMilkOptions
        : milkOptions
    const effectiveBeanOptions =
      Array.isArray(cartFlow.availableBeanOptions) && cartFlow.availableBeanOptions.length > 0
        ? cartFlow.availableBeanOptions
        : beanOptions

    if (cartFlow.step === 'quantity') {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 id="cart-flow-title" className="text-xl font-semibold text-[#23314F]">
              Select Quantity
            </h2>
            <p className="text-sm text-gray-600">
              How many {cartFlow.product?.name} would you like?
            </p>
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
              onClick={proceedFromQuantityStep}
              className="px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90"
            >
              {cartFlow.requiresMilk || cartFlow.requiresBean
                ? 'Next'
                : cartFlow.mode === 'update'
                  ? 'Save'
                  : 'Add to cart'}
            </button>
          </div>
        </div>
      )
    }

    if (cartFlow.step === 'milk') {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 id="cart-flow-title" className="text-xl font-semibold text-[#23314F]">
              Choose Your Milk
            </h2>
            <p className="text-sm text-gray-600">
              Select your milk of choice for {cartFlow.product?.name}.
            </p>
          </div>
          <MilkSelector options={effectiveMilkOptions} value={cartFlow.milk} onChange={selectMilkOption} />
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
              onClick={proceedFromMilkStep}
              className="px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90"
            >
              {cartFlow.requiresBean
                ? 'Next'
                : cartFlow.mode === 'update'
                  ? 'Save'
                  : 'Add to cart'}
            </button>
          </div>
        </div>
      )
    }

    if (cartFlow.step === 'bean') {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 id="cart-flow-title" className="text-xl font-semibold text-[#23314F]">
              Choose Your Beans
            </h2>
            <p className="text-sm text-gray-600">
              Select the bean preference for {cartFlow.product?.name}.
            </p>
          </div>
          <BeanSelector options={effectiveBeanOptions} value={cartFlow.bean} onChange={selectBeanOption} />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={backToQuantityFromBean}
              className="px-4 py-2 rounded border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={proceedFromBeanStep}
              className="px-4 py-2 rounded bg-[#23314F] text-white text-sm font-semibold hover:opacity-90"
            >
              {cartFlow.mode === 'update' ? 'Save' : 'Add to cart'}
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  const cartFlowModal = !isMenuInterface || !cartFlow.step || !cartFlow.product
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
              {renderCartFlowContent()}
            </div>
          </div>
        </div>
      )

  const cartSummaryModal = !isMenuInterface || !cartModalOpen
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
                <p className="text-sm text-gray-600">Your cart is empty. Start by adding products.</p>
              ) : (
                <ul className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const milkLabel = getMilkLabel(item.milk)
                    const beanLabel = getBeanLabel(item.bean)
                    const productName = item.product?.name || 'Selected Drink'
                    const detailParts = []
                    if (milkLabel) detailParts.push(milkLabel)
                    if (beanLabel) detailParts.push(`Bean: ${beanLabel}`)
                    const displayName = productName
                    const unitPrice = Number(item.product?.price)
                    const hasUnitPrice = Number.isFinite(unitPrice)
                    const lineTotal = hasUnitPrice ? (unitPrice * item.quantity).toFixed(2) : null
                    const previewImage =
                      item.product?.imageSrc || item.product?.imageUrl || '/images/assets/logo.png'

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
                            <div className="text-left">
                              <p className="font-medium leading-snug">{displayName}</p>
                              {detailParts.length > 0 ? (
                                <p className="text-xs text-gray-500">{detailParts.join(' • ')}</p>
                              ) : null}
                            </div>
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
                            {hasUnitPrice ? <CurrencyIcon className="w-4 h-4" /> : null}
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
                  {orderFlow.step === 'type' && !isSubMenuPage ? (
                    <div className="space-y-3">
                      <p className="text-base sm:text-lg font-semibold text-[#23314F] bg-[#F2F5FA] px-3 py-2 rounded">Is this an in-house or a takeaway order?</p>
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
                      {readyOrderFlowMessage ? (
                        <p className="text-sm text-gray-600">{readyOrderFlowMessage}</p>
                      ) : null}
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
                        {!isSubMenuPage ? (
                          <button
                            type="button"
                            onClick={handleOrderFlowBackToType}
                            className="px-3 py-2 rounded border border-gray-300 text-xs font-semibold text-[#23314F] hover:bg-gray-100"
                          >
                            Change order type
                          </button>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={isSubMenuPage ? handleSubmitKitchenOrder : handleOrderPayNow}
                        disabled={isProcessingPayment}
                        className={`w-full px-4 py-3 rounded ${
                          isSubMenuPage ? 'bg-[#23314F] text-white' : 'bg-[#F2B705] text-[#23314F]'
                        } text-sm font-semibold hover:opacity-90 ${
                          isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isProcessingPayment
                          ? isSubMenuPage
                            ? 'Sending...'
                            : 'Processing...'
                          : isSubMenuPage
                            ? 'Send to Kitchen'
                            : 'Pay Now'}
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
              {standaloneProduct.price != null ? <CurrencyIcon className="w-6 h-6" /> : null}
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
            {isPaymentSuccessPage ? (
              <div className="w-full flex justify-center">
                <img src="/images/assets/logo.png" alt="DopaBeans logo" className="h-10 w-auto" />
              </div>
            ) : isMenuInterface ? (
              <>
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                >
                  <img src="/images/assets/logo.png" alt="DopaBeans logo" className="h-10 w-auto" />
                </button>
                <span className="flex-1 text-center text-base sm:text-lg font-semibold uppercase tracking-wide text-[#23314F]">
                  {isSubMenuPage ? 'Cafe Menu' : 'Menu'}
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
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                >
                  <img src="/images/assets/logo.png" alt="DopaBeans logo" className="h-10 w-auto" />
                </button>
                <nav
                  className="hidden sm:flex sm:space-x-4 md:space-x-6 font-semibold text-sm sm:text-base text-[#23314F]"
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
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        {isMenuInterface && menuCategoryDescriptors.length > 0 ? (
          <div className="px-2 sm:px-10 mt-4 mb-20 sm:mb-24">
            <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl border border-white/40">
              <div className="px-3 sm:px-6 py-3 overflow-hidden">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {menuCategoryDescriptors.map(({ category, slug }) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => handleMenuCategoryNavigation(slug)}
                      className="px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold text-[#23314F] bg-white border border-[#23314F]/20 rounded-md whitespace-nowrap shadow hover:bg-[#23314F] hover:text-white hover:border-[#23314F] transition-all duration-200"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {!isMenuInterface && menuOpen && (
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

      {isMenuInterface ? (
        <main
          className={`${isSubMenuPage ? 'pt-40 sm:pt-48' : 'pt-48 sm:pt-56'} pb-20 px-3 sm:px-8`}
        >
          <div className="w-full max-w-[96rem] mx-auto space-y-6 sm:space-y-8">
            {isSubMenuPage ? (
              <div className="bg-[#23314F] text-white rounded-lg px-4 py-3 shadow">
                <p className="text-sm sm:text-base font-semibold">In-cafe ordering</p>
                <p className="text-xs sm:text-sm text-white/80">
                  Choose your drinks, and send the order to the kitchen.
                </p>
              </div>
            ) : null}
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
            {menuStatus === 'success' && menuCategoryDescriptors.length === 0 ? (
              <p className="text-center text-base sm:text-lg text-gray-600">Menu will be available shortly.</p>
            ) : null}
            {menuStatus === 'success' && menuCategoryDescriptors.length > 0
              ? menuCategoryDescriptors.map(({ section, slug }) => {
                  if (!section || !Array.isArray(section.products) || section.products.length === 0) {
                    return null
                  }
                  return (
                    <section
                      key={section.category || slug}
                      id={`category-${slug}`}
                      className="space-y-4 scroll-mt-32 sm:scroll-mt-36"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#23314F]">{section.category}</h3>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {section.products.length} {section.products.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
                        {section.products.map((item) => {
                          const productDetails = mapProductToDetails(item)
                          const { displayPrice, imageSrc, isInStock, normalizedAvailability, price } = productDetails
                          const modifierList = Array.isArray(productDetails.modifiers)
                            ? productDetails.modifiers.filter(
                                (modifier) => Array.isArray(modifier?.options) && modifier.options.length > 0
                              )
                            : []
                          const modifierCount = modifierList.length
                          const productKey = getProductKey(productDetails) || productDetails.slug || item.id || item.name
                          const isAvailable = isInStock
                          const showCurrencyIcon = price != null

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
                                  {showCurrencyIcon ? <CurrencyIcon className="w-4 h-4" /> : null}
                                  {displayPrice}
                                </span>
                                {modifierCount > 0 ? (
                                  <p className="text-xs text-gray-500">
                                    {`${modifierCount} modifier${modifierCount > 1 ? 's' : ''} available`}
                                  </p>
                                ) : null}
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
          {isMenuInterface && cartItems.length > 0 ? (
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
                    {expandedProductDetails.price != null ? <CurrencyIcon className="w-5 h-5" /> : null}
                    {expandedProductDetails.displayPrice}
                  </div>
                  <div className="space-y-1">
                    {expandedProductDetails.description ? (
                      <p id="expanded-product-description" className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {expandedProductDetails.description}
                      </p>
                    ) : (
                      <p className="text-sm sm:text-base text-gray-500 italic">Description coming soon.</p>
                    )}
                    <p className="text-xs text-gray-500 italic">*Actual product may vary from the photo.</p>
                  </div>
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
      ) : isPaymentSuccessPage ? (
        <main className="min-h-screen pt-44 pb-24 px-4 sm:px-8 bg-gradient-to-b from-white via-[#f5f6f8] to-white">
          <div className="w-full max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#23314F]">Payment Successful</h1>
              <p className="text-base sm:text-lg text-gray-700">
                Thanks! Your payment is confirmed. Tap below so Mira can share your order number in WhatsApp.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <a
                href={paymentSuccessWhatsappUrl}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] text-white text-sm sm:text-base font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
                data-ignore-auto-contrast
              >
                View Order Number
              </a>
              <button
                type="button"
                onClick={() => navigateToPath('/menu')}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full border border-[#23314F] text-[#23314F] text-sm sm:text-base font-semibold hover:bg-[#23314F] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#23314F]"
              >
                Return to Menu
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="pt-0 sm:pt-1">
          <section
            id="home"
            className="relative z-0 min-h-[80vh] flex items-center justify-center text-center pt-16 pb-36"
          >
            <div className="relative z-10 flex justify-center w-full px-2 sm:px-10 py-12 sm:py-20 overflow-auto">
              <div
                className="bg-white p-4 sm:p-6 rounded shadow-2xl"
                style={{ width: '96rem', minWidth: '96rem', maxWidth: '96rem', height: '54rem', minHeight: '54rem', maxHeight: '54rem' }}
              >
                <img
                  src="/images/assets/hero.jpg"
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

                {menuStatus === 'success' && menuCategoryDescriptors.length === 0 && (
                  <p className="text-center text-base sm:text-lg text-gray-600">Menu will be available shortly.</p>
                )}

                {menuCategoryDescriptors.map(({ section, slug }) => (
                  <div key={section.category || slug} id={`category-${slug}`} className="scroll-mt-32 sm:scroll-mt-36">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">{section.category}</h3>
                    <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory pb-2 justify-start">
                      {section.products.map((item) => {
                        const productDetails = mapProductToDetails(item)
                        const { displayPrice, imageSrc, isInStock, normalizedAvailability, price } = productDetails
                        const modifierList = Array.isArray(productDetails.modifiers)
                          ? productDetails.modifiers.filter(
                              (modifier) => Array.isArray(modifier?.options) && modifier.options.length > 0
                            )
                          : []
                        const modifierCount = modifierList.length
                        const productKey = getProductKey(productDetails) || productDetails.slug || item.id || item.name
                        const showCurrencyIcon = price != null

                        return (
                          <li
                            key={productKey}
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
                                {showCurrencyIcon ? <CurrencyIcon className="w-4 h-4" /> : null}
                                {displayPrice}
                              </span>
                              <p className="mt-1 text-xs text-gray-500">
                                {modifierCount > 0
                                  ? `${modifierCount} modifier${modifierCount > 1 ? 's' : ''} available`
                                  : 'No modifiers'}
                              </p>
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

          <section id="vision" className="py-12 sm:py-14 px-4 sm:px-8 text-center">
            <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Our Vision</h2>
              <p className="text-gray-700">
                More than a café, we are a community space for authentic moments, made possible through quality, care, and the joy of coffee.
              </p>
            </div>
          </section>

          <section id="about" className="py-12 sm:py-14 px-4 sm:px-8 text-center">
            <div className="w-full max-w-[96rem] mx-auto bg-white bg-opacity-95 rounded shadow-2xl p-6 sm:p-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">About Us</h2>
              <p className="text-base sm:text-lg text-gray-700">
                More than just a café, DopaBeans is a gathering place where genuine moments come to life—rooted in quality craftsmanship, heartfelt care, and the simple joy that only exceptional coffee can bring.
              </p>
            </div>
          </section>

          <section id="contact" className="py-12 sm:py-14 px-4 sm:px-8 text-center">
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
                  {selectedProduct?.price != null ? <CurrencyIcon className="w-5 h-5" /> : null}
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
