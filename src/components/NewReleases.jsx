import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const NewReleases = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const newGames = [
    { id: 1, title: 'Dragon Quest', icon: '🐉', releaseDate: '2 days ago', rating: 4.9 },
    { id: 2, title: 'Space Odyssey', icon: '🌌', releaseDate: '5 days ago', rating: 4.7 },
    { id: 3, title: 'Medieval Knights', icon: '🛡️', releaseDate: '1 week ago', rating: 4.8 },
    { id: 4, title: 'Pixel Adventure', icon: '🎮', releaseDate: '1 week ago', rating: 4.6 },
    { id: 5, title: 'Ocean Explorer', icon: '🌊', releaseDate: '2 weeks ago', rating: 4.5 },
    { id: 6, title: 'Sky Racer', icon: '✈️', releaseDate: '2 weeks ago', rating: 4.7 },
    { id: 7, title: 'Magic Forest', icon: '🌳', releaseDate: '3 weeks ago', rating: 4.4 }
  ]

  const itemsPerView = 4
  const maxIndex = Math.max(0, newGames.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">New Releases</h2>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(newGames.length / itemsPerView) }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerView) === index ? 'bg-lime-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentIndex === 0 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-black hover:scale-110'
          }`}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentIndex >= maxIndex 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-black hover:scale-110'
          }`}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Carousel Content */}
        <div className="overflow-hidden mx-12">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {newGames.map((game) => (
              <div key={game.id} className="flex-none w-1/4 px-2">
                <div className="bg-gradient-to-br from-blue-700 to-blue-800 border border-blue-600 rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer shadow-lg hover:border-lime-400">
                  {/* New Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gradient-to-r from-lime-400 to-green-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white">{game.rating}</span>
                    </div>
                  </div>

                  {/* Game Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg mx-auto">
                    {game.icon}
                  </div>

                  {/* Game Info */}
                  <div className="text-center">
                    <h3 className="text-white font-semibold text-sm mb-2">{game.title}</h3>
                    <p className="text-blue-300 text-xs">{game.releaseDate}</p>
                  </div>

                  {/* Play Button */}
                  <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full text-sm font-medium transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewReleases