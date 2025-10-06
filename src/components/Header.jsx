import { useState } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const [showCategories, setShowCategories] = useState(false)

  const recentGames = [
    { id: 1, image: '🎮', name: 'Game 1' },
    { id: 2, image: '🕹️', name: 'Game 2' },
    { id: 3, image: '🎯', name: 'Game 3' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              🎮
            </div>
            <span className="ml-3 text-white text-xl font-bold">ARCADIA</span>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <button className="bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-full font-medium transition-colors">
              TOP GAMES
            </button>
            <button className="bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-full font-medium transition-colors">
              FAVORITE GAMES
            </button>
            <button className="bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-full font-medium transition-colors">
              LEADERBOARD
            </button>
            <div className="relative">
              <button 
                className="bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-full font-medium transition-colors flex items-center"
                onClick={() => setShowCategories(!showCategories)}
              >
                CATEGORIES
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </button>
              {showCategories && (
                <div className="absolute top-full mt-2 left-0 bg-blue-800 rounded-lg shadow-xl min-w-48 py-2">
                  <a href="#" className="block px-4 py-2 text-white hover:bg-blue-700">Action</a>
                  <a href="#" className="block px-4 py-2 text-white hover:bg-blue-700">Adventure</a>
                  <a href="#" className="block px-4 py-2 text-white hover:bg-blue-700">Puzzle</a>
                  <a href="#" className="block px-4 py-2 text-white hover:bg-blue-700">Racing</a>
                  <a href="#" className="block px-4 py-2 text-white hover:bg-blue-700">Sports</a>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Recent Games */}
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-white text-sm font-medium">RECENT</span>
              <div className="flex space-x-1">
                {recentGames.map(game => (
                  <div key={game.id} className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform cursor-pointer">
                    {game.image}
                  </div>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-medium transition-colors">
              LOGIN / SIGNUP
            </button>

            {/* Search Icon */}
            <button className="text-white hover:text-lime-400 transition-colors">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header