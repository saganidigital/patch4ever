import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  Download,
  Lock,
  LogOut,
  Package,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import Logo from '../components/Logo'
import {
  ORDER_STATUSES,
  deleteOrder,
  exportOrdersCsv,
  loadCatalogConfig,
  loadOrders,
  resetCatalogConfig,
  saveCatalogConfig,
  updateOrder,
} from '../data/orderStore'

const ADMIN_AUTH_KEY = 'p4e-admin-session'
const DEMO_EMAIL = 'admin@patch4ever.com'
const DEMO_PASS = 'patch4ever2026'

const CATEGORY_TABS = [
  { id: 'all', label: 'All Categories' },
  { id: 'embroidered', label: 'Embroidered' },
  { id: 'woven', label: 'Woven' },
  { id: 'pvc', label: 'PVC' },
  { id: 'printed', label: 'Printed' },
  { id: 'name', label: 'Name' },
  { id: 'leather', label: 'Leather' },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === '1'
    } catch {
      return false
    }
  })
  const [loginEmail, setLoginEmail] = useState(DEMO_EMAIL)
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')

  const [section, setSection] = useState('dashboard') // dashboard | orders | categories
  const [orders, setOrders] = useState(() => loadOrders())
  const [catalog, setCatalog] = useState(() => loadCatalogConfig())

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [savedBanner, setSavedBanner] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginEmail.trim().toLowerCase() === DEMO_EMAIL && loginPass === DEMO_PASS) {
      setAuthed(true)
      setLoginError('')
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, '1')
      } catch {
        // ignore
      }
    } else {
      setLoginError('Invalid credentials. Use admin@patch4ever.com / patch4ever2026.')
    }
  }

  const handleLogout = () => {
    setAuthed(false)
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY)
    } catch {
      // ignore
    }
  }

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== 'cancelled')
    const totalRevenue = active.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)
    const pendingProofs = orders.filter((o) => o.status === 'proof-pending').length
    const inProduction = orders.filter((o) => o.status === 'in-production').length
    const rushOrders = orders.filter((o) => o.rush && o.status !== 'completed' && o.status !== 'cancelled').length
    const totalPatches = active.reduce((sum, o) => sum + (Number(o.qty) || 0), 0)

    const byCategory = CATEGORY_TABS.filter((c) => c.id !== 'all').map((cat) => {
      const catOrders = orders.filter((o) => o.patchType === cat.id)
      const rev = catOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0)
      return { ...cat, count: catOrders.length, revenue: rev }
    })

    return { totalRevenue, pendingProofs, inProduction, rushOrders, totalPatches, byCategory }
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (categoryFilter !== 'all' && o.patchType !== categoryFilter) return false
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const hay = `${o.id} ${o.customerName} ${o.email} ${o.company} ${o.patchType} ${o.backing}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [orders, categoryFilter, statusFilter, searchQuery])

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null

  const handleStatusChange = (orderId, nextStatus) => {
    setOrders(updateOrder(orderId, { status: nextStatus }))
  }

  const handleNotesChange = (orderId, adminNotes) => {
    setOrders(updateOrder(orderId, { adminNotes }))
  }

  const handleDeleteOrder = (orderId) => {
    setOrders(deleteOrder(orderId))
    if (selectedOrderId === orderId) setSelectedOrderId(null)
  }

  const updateCatalogAndPersist = (nextConfig, message = 'Order page settings saved!') => {
    setCatalog(nextConfig)
    saveCatalogConfig(nextConfig)
    setSavedBanner(message)
    setTimeout(() => setSavedBanner(''), 2500)
  }

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-950 px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-primary-900/90 p-8 shadow-2xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo className="h-9 text-white" />
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 font-heading text-xs font-bold tracking-widest text-accent-300 uppercase">
              <Lock className="size-3.5" /> Admin Portal
            </span>
            <h1 className="mt-3 font-heading text-3xl font-black uppercase">Sign In to Admin</h1>
            <p className="mt-1 text-sm text-primary-200">
              Manage custom patch orders, proofs, and order-page categories.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold tracking-wider text-primary-200 uppercase">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-primary-950 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold tracking-wider text-primary-200 uppercase">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-white/15 bg-primary-950 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer rounded-full bg-accent py-3 font-heading text-lg font-black text-white uppercase shadow-lg transition hover:bg-accent-600"
            >
              Sign In to Admin Panel →
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-white/10 bg-primary-950/60 p-3.5 text-xs text-primary-200">
            <p className="font-bold text-white">Demo Admin Credentials:</p>
            <p className="mt-1">
              Email: <code className="text-accent-300">{DEMO_EMAIL}</code>
            </p>
            <p>
              Password: <code className="text-accent-300">{DEMO_PASS}</code>
            </p>
            <button
              type="button"
              onClick={() => {
                setLoginEmail(DEMO_EMAIL)
                setLoginPass(DEMO_PASS)
              }}
              className="mt-2 cursor-pointer font-bold text-accent-300 underline hover:text-white"
            >
              Auto-fill credentials
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-200 no-underline hover:text-white">
              <ArrowLeft className="size-3.5" /> Back to Patch4Ever Storefront
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 text-neutral-900 lg:flex-row dark:bg-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col bg-primary-950 text-white lg:w-64">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link to="/" className="no-underline" aria-label="Patch4Ever Storefront">
            <Logo className="h-7 text-white" />
          </Link>
          <span className="rounded bg-accent px-2 py-0.5 font-heading text-[10px] font-black uppercase">Admin</span>
        </div>

        <nav className="flex flex-row gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ClipboardList },
            { id: 'categories', label: 'Order Categories', icon: SlidersHorizontal },
          ].map((item) => {
            const Icon = item.icon
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 font-heading text-base font-bold tracking-wide uppercase transition ${
                  active ? 'bg-accent text-white shadow' : 'text-primary-100 hover:bg-white/10'
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="hidden space-y-2 border-t border-white/10 p-4 lg:block">
          <Link
            to="/make-your-own-patches"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white no-underline hover:bg-white/20"
          >
            Open Live Order Page →
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-primary-200 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
          <div>
            <h1 className="font-heading text-2xl font-black text-primary-800 uppercase dark:text-white">
              {section === 'dashboard'
                ? 'Admin Overview'
                : section === 'orders'
                  ? 'Orders by Patch Category'
                  : 'Order Page Categories & Pricing'}
            </h1>
            <p className="text-xs text-neutral-500">
              Synced live with /make-your-own-patches &amp; /quote
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {savedBanner && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="size-3.5" /> {savedBanner}
              </span>
            )}
            <button
              type="button"
              onClick={() => exportOrdersCsv(filteredOrders)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <Download className="size-3.5" /> Export CSV
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-800 px-3.5 py-2 text-xs font-bold text-white no-underline hover:bg-primary-900"
            >
              <ArrowLeft className="size-3.5" /> Storefront
            </Link>
          </div>
        </header>

        <div className="p-6">
          {/* SECTION 1: OVERVIEW DASHBOARD */}
          {section === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${stats.totalPatches.toLocaleString()} total patches`, icon: DollarSign, tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15' },
                  { label: 'Proofs Pending', value: stats.pendingProofs, sub: 'Awaiting artist proof', icon: Clock, tone: 'text-amber-600 bg-amber-50 dark:bg-amber-500/15' },
                  { label: 'In Production', value: stats.inProduction, sub: 'Active stitching / molding', icon: Package, tone: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/15' },
                  { label: 'Active Rush Orders', value: stats.rushOrders, sub: '5–10 day SLA priority', icon: Zap, tone: 'text-accent-600 bg-accent/10' },
                ].map((kpi) => {
                  const Icon = kpi.icon
                  return (
                    <div key={kpi.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xs font-bold tracking-wider text-neutral-500 uppercase">
                          {kpi.label}
                        </span>
                        <span className={`grid size-9 place-items-center rounded-xl ${kpi.tone}`}>
                          <Icon className="size-4" />
                        </span>
                      </div>
                      <p className="mt-2 font-heading text-3xl font-black text-primary-900 dark:text-white">
                        {kpi.value}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">{kpi.sub}</p>
                    </div>
                  )
                })}
              </div>

              {/* Orders by Patch Category Breakdown */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-800">
                  <h2 className="font-heading text-lg font-bold text-primary-800 uppercase dark:text-white">
                    Revenue by Order Category
                  </h2>
                  <div className="mt-4 space-y-3.5">
                    {stats.byCategory.map((cat) => {
                      const pct = stats.totalRevenue > 0 ? Math.round((cat.revenue / stats.totalRevenue) * 100) : 0
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(cat.id)
                            setSection('orders')
                          }}
                          className="block w-full cursor-pointer text-left group"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold group-hover:text-primary-600">
                              {cat.label} <span className="text-xs font-normal text-neutral-500">({cat.count} orders)</span>
                            </span>
                            <span className="font-heading font-bold tabular-nums">${cat.revenue.toFixed(2)}</span>
                          </div>
                          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                            <div className="h-full rounded-full bg-primary-600 transition-all group-hover:bg-accent" style={{ width: `${Math.max(4, pct)}%` }} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-800">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-primary-800 uppercase dark:text-white">
                      Latest Orders
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSection('orders')}
                      className="cursor-pointer font-heading text-xs font-bold text-accent-600 uppercase hover:underline"
                    >
                      Manage All →
                    </button>
                  </div>
                  <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-700">
                    {orders.slice(0, 5).map((o) => {
                      const st = ORDER_STATUSES.find((s) => s.id === o.status) || ORDER_STATUSES[0]
                      return (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => {
                            setSection('orders')
                            setSelectedOrderId(o.id)
                          }}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left transition hover:bg-neutral-50 dark:hover:bg-white/5"
                        >
                          <div>
                            <p className="font-heading text-base font-bold text-primary-800 dark:text-white">
                              {o.id} · {o.customerName}{' '}
                              {o.rush && <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-[10px] text-white">RUSH</span>}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {o.qty} × {o.patchType.toUpperCase()} ({o.width}&quot;×{o.height}&quot;) · {o.backing}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${st.badge}`}>
                              {st.label}
                            </span>
                            <p className="mt-0.5 font-heading text-sm font-black">${o.totalPrice.toFixed(2)}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ORDERS BY CATEGORY MANAGER */}
          {section === 'orders' && (
            <div className="space-y-5">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {CATEGORY_TABS.map((tab) => {
                  const count = tab.id === 'all' ? orders.length : orders.filter((o) => o.patchType === tab.id).length
                  const active = categoryFilter === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`cursor-pointer rounded-full px-4 py-1.5 font-heading text-sm font-bold uppercase transition ${
                        active
                          ? 'bg-primary-700 text-white shadow'
                          : 'bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-primary-50 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700'
                      }`}
                    >
                      {tab.label} <span className="ml-1 opacity-75">({count})</span>
                    </button>
                  )
                })}
              </div>

              {/* Search + Status Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search order ID, customer, company, backing..."
                    className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-semibold dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="all">All Statuses</option>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-800">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-500 uppercase dark:border-neutral-700 dark:bg-neutral-900/50">
                    <tr>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Category &amp; Specs</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">
                          No orders match the current category or search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const st = ORDER_STATUSES.find((s) => s.id === o.status) || ORDER_STATUSES[0]
                        return (
                          <tr key={o.id} className="hover:bg-primary-50/40 dark:hover:bg-white/5">
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderId(o.id)}
                                className="cursor-pointer font-heading text-base font-black text-primary-700 hover:underline dark:text-primary-300"
                              >
                                {o.id}
                              </button>
                              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                                {o.rush && <span className="rounded bg-accent px-1.5 font-bold text-white">RUSH</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold">{o.customerName}</p>
                              <p className="text-xs text-neutral-500">{o.company || o.email}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-block rounded-md bg-primary-50 px-2 py-0.5 font-heading text-xs font-bold text-primary-800 uppercase dark:bg-primary-900 dark:text-primary-200">
                                {o.patchType}
                              </span>
                              <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                                {o.width}&quot;×{o.height}&quot; {o.shape} · {o.backing}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-right font-heading font-bold tabular-nums">{o.qty}</td>
                            <td className="px-4 py-3 text-right font-heading text-base font-black tabular-nums">
                              ${o.totalPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={o.status}
                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold focus:outline-none ${st.badge}`}
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s.id} value={s.id} className="bg-white text-neutral-900">
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderId(o.id)}
                                  className="cursor-pointer rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800 hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-200"
                                >
                                  Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(o.id)}
                                  className="cursor-pointer rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                                  aria-label={`Delete ${o.id}`}
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: ORDER PAGE CATEGORIES & PRICING MANAGER */}
          {section === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Changes made here update the live <strong>Order Page</strong> (<code>/make-your-own-patches</code>) immediately.
                </p>
                <button
                  type="button"
                  onClick={() => updateCatalogAndPersist(resetCatalogConfig(), 'Reset to default categories & pricing!')}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  <RotateCcw className="size-3.5" /> Reset Defaults
                </button>
              </div>

              {/* Patch Types */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-800">
                <h2 className="font-heading text-lg font-bold text-primary-800 uppercase dark:text-white">
                  Patch Type Categories
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {catalog.patchTypes.map((pt, idx) => (
                    <div key={pt.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-base font-bold uppercase">{pt.name}</span>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold">
                          <input
                            type="checkbox"
                            checked={pt.enabled}
                            onChange={(e) => {
                              const next = {
                                ...catalog,
                                patchTypes: catalog.patchTypes.map((item, i) =>
                                  i === idx ? { ...item, enabled: e.target.checked } : item,
                                ),
                              }
                              updateCatalogAndPersist(next)
                            }}
                            className="accent-primary-600"
                          />
                          Active
                        </label>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-neutral-500">Min Qty</label>
                          <input
                            type="number"
                            min={1}
                            value={pt.minQty}
                            onChange={(e) => {
                              const next = {
                                ...catalog,
                                patchTypes: catalog.patchTypes.map((item, i) =>
                                  i === idx ? { ...item, minQty: Math.max(1, Number(e.target.value) || 10) } : item,
                                ),
                              }
                              updateCatalogAndPersist(next)
                            }}
                            className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1 font-bold dark:border-neutral-600 dark:bg-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-500">Turnaround</label>
                          <input
                            type="text"
                            value={pt.turnaround}
                            onChange={(e) => {
                              const next = {
                                ...catalog,
                                patchTypes: catalog.patchTypes.map((item, i) =>
                                  i === idx ? { ...item, turnaround: e.target.value } : item,
                                ),
                              }
                              updateCatalogAndPersist(next)
                            }}
                            className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1 font-bold dark:border-neutral-600 dark:bg-neutral-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backings & Upgrades */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-800">
                  <h2 className="font-heading text-lg font-bold text-primary-800 uppercase dark:text-white">
                    Backing Options &amp; Surcharges
                  </h2>
                  <div className="mt-4 space-y-2.5">
                    {catalog.backings.map((b, idx) => (
                      <div key={b.id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm dark:border-neutral-700">
                        <label className="flex cursor-pointer items-center gap-2.5 font-semibold">
                          <input
                            type="checkbox"
                            checked={b.enabled}
                            onChange={(e) => {
                              const next = {
                                ...catalog,
                                backings: catalog.backings.map((item, i) =>
                                  i === idx ? { ...item, enabled: e.target.checked } : item,
                                ),
                              }
                              updateCatalogAndPersist(next)
                            }}
                            className="accent-primary-600"
                          />
                          {b.name}
                        </label>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-neutral-500">+$</span>
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            value={b.pricePerPatch}
                            onChange={(e) => {
                              const next = {
                                ...catalog,
                                backings: catalog.backings.map((item, i) =>
                                  i === idx ? { ...item, pricePerPatch: Math.max(0, Number(e.target.value) || 0) } : item,
                                ),
                              }
                              updateCatalogAndPersist(next)
                            }}
                            className="w-16 rounded-lg border border-neutral-300 px-2 py-1 text-right font-bold dark:border-neutral-600 dark:bg-neutral-900"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-800">
                  <h2 className="font-heading text-lg font-bold text-primary-800 uppercase dark:text-white">
                    Thread &amp; Packaging Upgrades
                  </h2>
                  <div className="mt-4 space-y-2.5">
                    {catalog.upgrades.map((u, idx) => (
                      <div key={u.id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm dark:border-neutral-700">
                        <label className="flex cursor-pointer items-center gap-2.5 font-semibold">
                          <input
                            type="checkbox"
                            checked={u.enabled}
                            onChange={(e) => {
                              const next = {
                                ...catalog,
                                upgrades: catalog.upgrades.map((item, i) =>
                                  i === idx ? { ...item, enabled: e.target.checked } : item,
                                ),
                              }
                              updateCatalogAndPersist(next)
                            }}
                            className="accent-primary-600"
                          />
                          {u.name}
                        </label>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-neutral-500">+$</span>
                          <input
                            type="number"
                            step="0.05"
                            min="0"
                            value={u.pricePerPatch}
                            onChange={(e) => {
                              const next = {
                                ...catalog,
                                upgrades: catalog.upgrades.map((item, i) =>
                                  i === idx ? { ...item, pricePerPatch: Math.max(0, Number(e.target.value) || 0) } : item,
                                ),
                              }
                              updateCatalogAndPersist(next)
                            }}
                            className="w-16 rounded-lg border border-neutral-300 px-2 py-1 text-right font-bold dark:border-neutral-600 dark:bg-neutral-900"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ORDER DETAIL SLIDE-OVER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Order ${selectedOrder.id}`}>
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs" onClick={() => setSelectedOrderId(null)} />
          <div className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white p-6 shadow-2xl dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
              <div>
                <p className="font-heading text-xs font-black tracking-widest text-accent uppercase">
                  {selectedOrder.source || 'Order Page'} · {selectedOrder.patchType}
                </p>
                <h2 className="font-heading text-2xl font-black text-primary-800 dark:text-white">
                  Order {selectedOrder.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Close order details"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-sm">
              <div>
                <label className="mb-1 block text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Order Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 font-bold dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <p className="font-heading text-xs font-bold tracking-wider text-primary-700 uppercase dark:text-primary-300">
                  Patch Specifications
                </p>
                <dl className="mt-2.5 space-y-1.5">
                  <div className="flex justify-between"><dt className="text-neutral-500">Category</dt><dd className="font-bold uppercase">{selectedOrder.patchType}</dd></div>
                  <div className="flex justify-between"><dt className="text-neutral-500">Shape &amp; Size</dt><dd className="font-bold">{selectedOrder.shape} · {selectedOrder.width}&quot;×{selectedOrder.height}&quot;</dd></div>
                  <div className="flex justify-between"><dt className="text-neutral-500">Coverage / Finish</dt><dd className="font-bold">{selectedOrder.coverage}</dd></div>
                  <div className="flex justify-between"><dt className="text-neutral-500">Border</dt><dd className="font-bold">{selectedOrder.border}</dd></div>
                  <div className="flex justify-between"><dt className="text-neutral-500">Backing</dt><dd className="font-bold">{selectedOrder.backing}</dd></div>
                  <div className="flex justify-between"><dt className="text-neutral-500">Upgrades</dt><dd className="font-bold">{selectedOrder.upgrades?.length ? selectedOrder.upgrades.join(', ') : 'None'}</dd></div>
                  <div className="flex justify-between"><dt className="text-neutral-500">Quantity</dt><dd className="font-bold">{selectedOrder.qty} (${selectedOrder.unitPrice.toFixed(2)}/ea)</dd></div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2 dark:border-neutral-700"><dt className="font-bold">Total</dt><dd className="font-heading text-lg font-black text-primary-800 dark:text-white">${selectedOrder.totalPrice.toFixed(2)}</dd></div>
                </dl>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <p className="font-heading text-xs font-bold tracking-wider text-primary-700 uppercase dark:text-primary-300">
                  Customer &amp; Artwork
                </p>
                <div className="mt-2 space-y-1">
                  <p className="font-bold">{selectedOrder.customerName} {selectedOrder.company && `(${selectedOrder.company})`}</p>
                  <p className="text-neutral-600 dark:text-neutral-300">{selectedOrder.email} {selectedOrder.phone && `· ${selectedOrder.phone}`}</p>
                  {selectedOrder.address && <p className="text-xs text-neutral-500">{selectedOrder.address}</p>}
                  {selectedOrder.inHandsDate && <p className="text-xs font-semibold text-accent-600">In-Hands Date: {selectedOrder.inHandsDate}</p>}
                  <p className="pt-1 text-xs"><strong>Artwork:</strong> {selectedOrder.artworkName || 'None'}</p>
                  {selectedOrder.notes && <p className="text-xs text-neutral-600 dark:text-neutral-300"><strong>Customer Notes:</strong> {selectedOrder.notes}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Internal Artist / Production Notes
                </label>
                <textarea
                  rows={3}
                  value={selectedOrder.adminNotes || ''}
                  onChange={(e) => handleNotesChange(selectedOrder.id, e.target.value)}
                  placeholder="Add proof tracking, thread notes, or shipping tracking number..."
                  className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
