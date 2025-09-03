import React, { useState } from 'react'
import heroImage from './assets/hero.png'
import flatWhite from './assets/flat-white.jpeg'
import chocolateDrink from './assets/chocolate-drink.jpeg'
import americano from './assets/americano.jpg'
import pistachioMilkshake from './assets/pistachio-milkshake.jpeg'
import caiSmoothie from './assets/cai-smoothie.jpeg'
import matchaLatte from './assets/matcha-latte.jpeg'
import cremeMatcha from './assets/creme-matcha.jpeg'
import hibiscusIcedTea from './assets/hibiscus-iced-tea.jpeg'
import icedAmericano from './assets/iced-americano.jpeg'
import icedEspresso from './assets/iced-espresso.jpeg'
import icedSpanishLatte from './assets/iced-spanish-latte.jpg'
import icedCaramelLatte from './assets/iced-caramel-latte.jpeg'
import mochaccinoDark from './assets/mochaccino-dark.jpeg'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

  return (
    <div className="font-sans bg-background text-fontLightBackground scroll-smooth">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
          <h1 className="text-base sm:text-xl font-bold cursor-pointer" onClick={() => scrollTo('home')}>
            DopaBeans
          </h1>
          <nav className="hidden sm:flex sm:space-x-4 md:space-x-6">
            <button onClick={() => scrollTo('menu')} className="hover:text-black text-gray-600 text-sm sm:text-base">Menu</button>
            <button onClick={() => scrollTo('vision')} className="hover:text-black text-gray-600 text-sm sm:text-base">Vision</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-black text-gray-600 text-sm sm:text-base">Contact</button>
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white shadow px-4 pb-4 space-y-3 text-center">
            <button onClick={() => scrollTo('menu')} className="block w-full text-gray-700">Menu</button>
            <button onClick={() => scrollTo('vision')} className="block w-full text-gray-700">Vision</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-gray-700">Contact</button>
          </div>
        )}
      </header>

      <main className="pt-20">
        <div className="bg-yellow-300 text-black font-bold text-center py-4 text-xl z-50 shadow-md">
          🚧 This website is under construction. Stay tuned! 🚧
        </div>
        {/* Hero */}
        <section id="home" className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-center" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="bg-white bg-opacity-80 p-4 sm:p-6 w-11/12 sm:w-auto rounded">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Welcome to DopaBeans</h2>
            <p className="text-sm sm:text-lg text-gray-600">Crafted Coffee. Honest Taste.</p>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">Our Menu</h2>
          <div className="space-y-16 max-w-4xl mx-auto px-4">
            {/* Hot Drinks */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Hot Drinks</h3>
              <ul className="flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2">
                {[
                  { name: "Flat White – AED 18", img: flatWhite },
                  { name: "Cortado – AED 17", img: chocolateDrink },
                  { name: "Espresso – AED 12", img: americano },
                  { name: "Americano – AED 14", img: americano },
                  { name: "Latte – AED 18", img: chocolateDrink },
                  { name: "Cappuccino – AED 18", img: chocolateDrink },
                  { name: "Turkish Coffee – AED 15", img: chocolateDrink },
                  { name: "Hot Chocolate – AED 17", img: chocolateDrink }
                ].map((item, i) => (
                  <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                    <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px] mx-auto" />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cold Drinks */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Cold Drinks</h3>
              <ul className="flex overflow-x-auto space-x-4 snap-x snap-mandatory px-1 pb-2">
                {[
                  { name: "Pistachio Milkshake – AED 20", img: pistachioMilkshake },
                  { name: "Cai Smoothie – AED 19", img: caiSmoothie },
                  { name: "Matcha Latte – AED 17", img: matchaLatte },
                  { name: "Creme Matcha – AED 21", img: cremeMatcha },
                  { name: "Hibiscus Iced Tea – AED 18", img: hibiscusIcedTea },
                  { name: "Iced Americano – AED 17", img: icedAmericano },
                  { name: "Iced Espresso – AED 16", img: icedEspresso },
                  { name: "Iced Spanish Latte – AED 20", img: icedSpanishLatte },
                  { name: "Iced Caramel Latte – AED 21", img: icedCaramelLatte },
                  { name: "Mochaccino Dark – AED 20", img: mochaccinoDark }
                ].map((item, i) => (
                  <li key={i} className="min-w-[150px] sm:min-w-[200px] snap-start shrink-0 bg-gray-100 p-4 rounded shadow text-left">
                    <img src={item.img} alt={item.name} className="mb-2 rounded w-full object-cover aspect-square max-w-[200px] mx-auto" />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section id="vision" className="py-20 bg-gray-100 text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Vision</h2>
          <p className="max-w-xl mx-auto text-gray-600">
            More than a café – we are a community space for authentic moments, made possible through quality, care, and the joy of coffee.
          </p>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-black text-fontDarkBackground py-12 text-center px-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-xs sm:text-sm">dopabeans@dopabeansuae.com</p>
          <p className="text-xs sm:text-sm">Instagram: @dopabeansuae</p>
        </footer>
      </main>
    </div>
  )
}

export default App