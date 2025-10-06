import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const GameSeriesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const gameSeries = [
    { id: 1, name: 'Moto X3M', icon: '🏍️', games: 15 },
    { id: 2, name: 'Bob The Robber', icon: '🕵️', games: 8 },
    { id: 3, name: 'Kizi Adventures', icon: '🌟', games: 12 },
    { id: 4, name: 'Fireboy & Watergirl', icon: '🔥', games: 6 },
    { id: 5, name: 'Papa\'s Games', icon: '👨‍🍳', games: 20 },
    { id: 6, name: 'Subway Surfers', icon: '🚇', games: 5 },
    { id: 7, name: 'Temple Run', icon: '🏃', games: 4 }
  ]

  const itemsPerView = 4
  const maxIndex = Math.max(0, gameSeries.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">Game Series</h2>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(gameSeries.length / itemsPerView) }).map((_, index) => (
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
            {gameSeries.map((series) => (
              <div key={series.id} className="flex-none w-1/4 px-2">
                <div className="bg-gradient-to-br from-blue-700 to-blue-800 border border-blue-600 rounded-2xl p-4 hover:scale-105 transition-transform cursor-pointer shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl">
                        {series.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{series.name}</h3>
                        <p className="text-blue-300 text-xs">{series.games} games</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-lime-500 hover:bg-lime-600 rounded-full flex items-center justify-center transition-colors">
                      <ChevronRightIcon className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameSeriesCarousel