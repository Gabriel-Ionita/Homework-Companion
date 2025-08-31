import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import Container from './Container'

export default function Header() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="border-b bg-white">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-lg font-semibold">
            Tutor Matematică cu AI
          </Link>

          {/* Desktop nav */}
          <nav className="hidden gap-4 sm:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:underline ${isActive ? 'text-blue-600 font-medium' : ''}`
              }
              end
            >
              Acasă
            </NavLink>
            <NavLink
              to="/analyze"
              className={({ isActive }) =>
                `hover:underline ${isActive ? 'text-blue-600 font-medium' : ''}`
              }
            >
              Analizează
            </NavLink>
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Deschide meniu"
            className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border"
            onClick={() => setOpen(v => !v)}
          >
            <span className="i">≡</span>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden pb-3">
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-2 py-1 rounded hover:bg-gray-100 ${
                    isActive ? 'text-blue-600 font-medium' : ''
                  }`
                }
                end
              >
                Acasă
              </NavLink>
              <NavLink
                to="/analyze"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-2 py-1 rounded hover:bg-gray-100 ${
                    isActive ? 'text-blue-600 font-medium' : ''
                  }`
                }
              >
                Analizează
              </NavLink>
            </nav>
          </div>
        )}
      </Container>
    </header>
  )
}
