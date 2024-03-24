'use client'
import { useState } from 'react'
import clsx from 'clsx'

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleHamburgerClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="w-full px-2 bg-blue-200 fixed">
      <div className="h-10 flex flex-row justify-between items-center">
        <span className="font-bold text-white">Nav header</span>
        <div className="relative">
          <button onClick={handleHamburgerClick} className="block tablet:hidden">
            {
              <img
                src="/icons/hamburger.png"
                alt="hamburger icon"
                className={clsx('w-6 h-6 transition ', { 'rotate-180': isOpen })}
              />
            }
          </button>
          <ul className="hidden tablet:flex">
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div
        className={clsx('w-full bg-blue-200 transition-all max-h-0 overflow-hidden duration-300 absolute left-0', {
          'max-h-40': isOpen
        })}
      >
        <ul className="flex flex-col justify-center items-center h-full">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
    </nav>
  )
}
