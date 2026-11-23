import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import VideoModal from './components/VideoModal'
import HomePage from './pages/HomePage'
import QuotePage from './pages/QuotePage'
import PricingPage from './pages/PricingPage'
import CatalogPage from './pages/CatalogPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function AppShell() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark')
    } catch {
      return false
    }
  })
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem('p4l-theme', next ? 'dark' : 'light')
      } catch {
        // ignore storage errors
      }
      return next
    })
  }

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, qty: p.qty + item.qty, totalPrice: (p.qty + item.qty) * p.unitPrice }
            : p,
        )
      }
      return [...prev, item]
    })
    setCartOpen(true)
  }

  const handleUpdateQty = (id, newQty) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: newQty, totalPrice: newQty * p.unitPrice } : p)),
    )
  }

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header
        darkMode={darkMode}
        onToggleDark={toggleDark}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenVideo={setActiveVideo} />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/pricing" element={<PricingPage onAddToCart={handleAddToCart} />} />
          <Route path="*" element={<CatalogPage onAddToCart={handleAddToCart} />} />
        </Routes>
      </div>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
      />

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
