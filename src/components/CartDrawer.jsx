import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'

export default function CartDrawer({ open, onClose, items, onUpdateQty, onRemove }) {
  if (!open) return null

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div className="fixed inset-0 bg-black/55 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-primary-900 px-5 py-4 text-white dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="size-5 text-accent" />
            <h2 className="font-heading text-xl font-bold uppercase tracking-wide">Your Patch Cart</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 grid size-16 place-items-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                <ShoppingCart className="size-8" />
              </div>
              <p className="font-heading text-xl font-bold text-primary-800 dark:text-white">Your cart is empty</p>
              <p className="mt-1 max-w-xs text-sm text-neutral-600 dark:text-neutral-300">
                Use the interactive Price Calculator or Custom Builder to configure your patches or patched hats.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/pricing"
                  onClick={onClose}
                  className="rounded-full bg-primary-600 px-5 py-2.5 font-heading text-sm font-bold uppercase text-white no-underline hover:bg-primary-700"
                >
                  Price a Patch
                </Link>
                <Link
                  to="/quote"
                  onClick={onClose}
                  className="rounded-full bg-accent px-5 py-2.5 font-heading text-sm font-bold uppercase text-white no-underline hover:bg-accent-600"
                >
                  Get a Free Proof
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-primary-200 bg-primary-50/40 p-4 dark:border-primary-800 dark:bg-neutral-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-lg font-bold uppercase text-primary-800 dark:text-primary-200">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300">{item.specs}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-red-600 dark:hover:bg-neutral-700"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, Math.max(10, item.qty - 10))}
                        className="rounded-full p-1 text-primary-700 hover:bg-primary-50 dark:text-primary-200"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-10 text-center font-heading text-sm font-bold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, item.qty + 10)}
                        className="rounded-full p-1 text-primary-700 hover:bg-primary-50 dark:text-primary-200"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg font-black text-primary-800 dark:text-white">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-neutral-500">${item.unitPrice.toFixed(2)} each</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-300">Continental US Shipping</span>
              <span className="font-bold text-primary-700 dark:text-primary-300">FREE†</span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-heading text-lg font-bold uppercase">Estimated Total</span>
              <span className="font-heading text-2xl font-black text-primary-800 dark:text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <Link
              to="/quote"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full bg-accent py-3 font-heading text-lg font-black uppercase text-white no-underline shadow-md hover:bg-accent-600"
            >
              Submit Order &amp; Get Free Proof →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
