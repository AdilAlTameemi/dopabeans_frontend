import React, { useEffect, useState } from 'react'
import heroImage from './assets/hero.jpg'

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

  const scrollTo = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

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

  return (
    <div
      className="font-sans bg-background text-fontLightBackground scroll-smooth"
      data-auto-contrast-root
      style={{ backgroundColor: '#E3E3DD' }}
    >
      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center p-4 pr-4 pl-[1cm] w-full">
          <button type="button" onClick={() => scrollTo('home')} className="cursor-pointer bg-transparent border-0 p-0 flex-shrink-0">
            <img src="/images/logo.png" alt="DopaBeans logo" className="w-[180px] sm:w-[240px] h-auto" />
          </button>
          <nav
            className="hidden sm:flex sm:space-x-4 md:space-x-6 font-semibold text-base sm:text-lg text-white"
            data-ignore-auto-contrast
          >
            <button
              onClick={() => scrollTo('menu')}
              className="hover:opacity-80 text-white"
              data-ignore-auto-contrast
            >
              Menu
            </button>
            <button
              onClick={() => scrollTo('vision')}
              className="hover:opacity-80 text-white"
              data-ignore-auto-contrast
            >
              Vision
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="hover:opacity-80 text-white"
              data-ignore-auto-contrast
            >
              Contact
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="hover:opacity-80 text-white"
              data-ignore-auto-contrast
            >
              About Us
            </button>
          </nav>
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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

      <main>

        {/* Hero */}
        <section
          id="home"
          className="relative z-0 h-screen bg-cover bg-center flex flex-col justify-center items-center text-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="mt-24 bg-white bg-opacity-80 p-4 sm:p-6 w-11/12 sm:w-auto rounded">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Welcome to DopaBeans</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-gray-800">Dopamine By Coffee Bean</p>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="py-20 text-left px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">Our Menu</h2>
          <div className="space-y-16 w-full">
              
              {/* Hot Drinks */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Hot Drinks</h3>
                <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2 justify-start">
                  {[
                    { name: "Espresso", price: 18, img: "/images/products/espresso.jpg" },
                    { name: "Piccolo", price: 22, img: "/images/products/piccolo.jpg" },
                    { name: "Cortado", price: 24, img: "/images/products/cortado.jpg" },
                    { name: "Cappuccino", price: 25, img: "/images/products/cappuccino.jpg" },
                    { name: "Americano", price: 21, img: "/images/products/americano.jpg" },
                    { name: "Flat White", price: 25, img: "/images/products/flat-white.jpg" },
                    { name: "Latte", price: 25, img: "/images/products/latte.jpg" },
                    { name: "Spanish Latte", price: 28, img: "/images/products/spanish-latte.jpg" },
                    { name: "DopaBeans Signature Hot", price: 35, img: "/images/products/dopabeans-signature-hot.jpg" },
                    { name: "Spanish Cortado", price: 25, img: "/images/products/spanish-cortado.jpg" },
                    { name: "Pistachio Latte", price: 30, img: "/images/products/pistachio-latte.jpg" }
                  ].sort((a, b) => b.price - a.price).map((item, i) => (
                    <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                      <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px]" />
                      <div className="text-sm sm:text-base">
                        <span className="font-medium block">{item.name}</span>
                        <span className="flex items-center gap-1">
                          <CurrencyIcon className="w-4 h-4" />
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cold Drinks */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Cold Drinks</h3>
                <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2 justify-start">
                  {[
                    { name: "DopaBeans Signature Cold", price: 35, img: "/images/products/dopabeans-signature-cold.jpg" },
                    { name: "Iced Spanish Latte", price: 28, img: "/images/products/iced-spanish-latte.jpg" },
                    { name: "Iced Latte", price: 25, img: "/images/products/iced-latte.jpg" },
                    { name: "Iced Americano", price: 22, img: "/images/products/iced-americano.jpg" },
                    { name: "Iced Pistachio Latte", price: 30, img: "/images/products/iced-pistachio-latte.jpg" },
                    { name: "Iced Tea", price: 23, img: "/images/products/iced-tea.jpg" },
                    { name: "Iced Tea Passion", price: 23, img: "/images/products/iced-tea-passion.jpg" },
                    { name: "Iced Tea Peach", price: 23, img: "/images/products/iced-tea-peach.jpg" },
                    { name: "Iced Tea Strawberry", price: 23, img: "/images/products/iced-tea-strawberry.jpg" }
                  ].sort((a, b) => b.price - a.price).map((item, i) => (
                    <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                      <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px]" />
                      <div className="text-sm sm:text-base">
                        <span className="font-medium block">{item.name}</span>
                        <span className="flex items-center gap-1">
                          <CurrencyIcon className="w-4 h-4" />
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matcha */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Matcha</h3>
                <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2 justify-start">
                  {[
                    { name: "Regular Matcha", price: 29, img: "/images/products/regular-matcha.jpg" },
                    { name: "DopaBeans Matcha", price: 37, img: "/images/products/dopabeans-matcha.jpg" },
                    { name: "Cloud Matcha", price: 37, img: "/images/products/cloud-matcha.jpg" },
                    { name: "Strawberry Matcha", price: 37, img: "/images/products/strawberry-matcha.jpg" }
                  ].sort((a, b) => b.price - a.price).map((item, i) => (
                    <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                      <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px]" />
                      <div className="text-sm sm:text-base">
                        <span className="font-medium block">{item.name}</span>
                        <span className="flex items-center gap-1">
                          <CurrencyIcon className="w-4 h-4" />
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mojitos */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Mojitos</h3>
                <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2 justify-start">
                  {[
                    { name: "Special Karkade", price: 30, img: "/images/products/spacial-karkade.jpg" },
                    { name: "Mojitos", price: 30, img: "/images/products/dopabeans-mojitos.jpg" }
                  ].sort((a, b) => b.price - a.price).map((item, i) => (
                    <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                      <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px]" />
                      <div className="text-sm sm:text-base">
                        <span className="font-medium block">{item.name}</span>
                        <span className="flex items-center gap-1">
                          <CurrencyIcon className="w-4 h-4" />
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Açaí */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Açaí</h3>
                <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2 justify-start">
                  {[
                    { name: "Açaí Smoothie", price: 34, img: "/images/products/acai-smoothie.jpg" },
                    { name: "Açaí Bowl", price: 40, img: "/images/products/acai-bowl.jpg" }
                  ].sort((a, b) => b.price - a.price).map((item, i) => (
                    <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                      <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px]" />
                      <div className="text-sm sm:text-base">
                        <span className="font-medium block">{item.name}</span>
                        <span className="flex items-center gap-1">
                          <CurrencyIcon className="w-4 h-4" />
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filtered Coffee */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Filtered Coffee</h3>
                <ul className="w-full flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2 justify-start">
                  {[
                    { name: "V60", price: 33, img: "/images/products/v60.jpg" },
                    { name: "Cold Brew", price: 30, img: "/images/products/cold-brew.jpg" }
                  ].sort((a, b) => b.price - a.price).map((item, i) => (
                    <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                      <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px]" />
                      <div className="text-sm sm:text-base">
                        <span className="font-medium block">{item.name}</span>
                        <span className="flex items-center gap-1">
                          <CurrencyIcon className="w-4 h-4" />
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

        {/* Vision */}
        <section id="vision" className="py-20 text-center px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600">
            More than a café – we are a community space for authentic moments, made possible through quality, care, and the joy of coffee.
          </p>
        </section>

        {/* About Us */}
        <section id="about" className="py-20 text-center px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">About Us</h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600">
            More than just a café, DopaBeans is a gathering place where genuine moments come to life—rooted in quality craftsmanship, heartfelt care, and the simple joy that only exceptional coffee can bring.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 text-center px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-base sm:text-lg">info@dopabeansuae.com</p>
          <p className="text-base sm:text-lg">Instagram: @dopabeansuae</p>
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
    </div>
  )
}

export default App
