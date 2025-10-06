import { useState } from 'react'

const AllGames = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 16
  const totalPages = 11

  const allGames = [
    { id: 1, title: 'Adventure Quest', plays: '62987', icon: '🗡️', category: 'Adventure' },
    { id: 2, title: 'Racing Thunder', plays: '89245', icon: '🏎️', category: 'Racing' },
    { id: 3, title: 'Puzzle Master', plays: '45621', icon: '🧩', category: 'Puzzle' },
    { id: 4, title: 'Space Invaders', plays: '78934', icon: '👾', category: 'Arcade' },
    { id: 5, title: 'Football Pro', plays: '56789', icon: '⚽', category: 'Sports' },
    { id: 6, title: 'Magic Castle', plays: '67234', icon: '🏰', category: 'Fantasy' },
    { id: 7, title: 'Ninja Fight', plays: '89567', icon: '🥷', category: 'Action' },
    { id: 8, title: 'Ocean Explorer', plays: '34567', icon: '🌊', category: 'Adventure' },
    { id: 9, title: 'Robot Wars', plays: '78901', icon: '🤖', category: 'Action' },
    { id: 10, title: 'Farm Life', plays: '45678', icon: '🚜', category: 'Simulation' },
    { id: 11, title: 'Dragon Slayer', plays: '92345', icon: '🐲', category: 'RPG' },
    { id: 12, title: 'Sky Jump', plays: '56234', icon: '🪂', category: 'Adventure' },
    { id: 13, title: 'Cookie Clicker', plays: '123456', icon: '🍪', category: 'Casual' },
    { id: 14, title: 'Zombie Run', plays: '67890', icon: '🧟‍♂️', category: 'Action' },
    { id: 15, title: 'Chess Master', plays: '34512', icon: '♟️', category: 'Strategy' },
    { id: 16, title: 'Dance Battle', plays: '78234', icon: '💃', category: 'Music' }
  ]

  const pageNumbers = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-bold mb-2">All Games</h2>
        <p className="text-blue-300">Discover thousands of amazing games</p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-12">
        {allGames.map((game) => (
          <div
            key={game.id}
            className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-4 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-700 hover:border-lime-400 group"
          >
            {/* Game Thumbnail */}
            <div className="aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mb-4 flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-shadow">
              {game.icon}
            </div>

            {/* Game Info */}
            <div className="text-center">
              <h3 className="text-white font-semibold text-sm mb-1 truncate">{game.title}</h3>
              <p className="text-blue-300 text-xs mb-2">{game.plays} Plays</p>
              <div className="bg-blue-700 text-blue-200 px-2 py-1 rounded-full text-xs">
                {game.category}
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 1
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-700 text-white hover:bg-blue-600'
          }`}
        >
          PREV
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              currentPage === pageNum
                ? 'bg-lime-500 text-black'
                : 'bg-blue-700 text-white hover:bg-blue-600'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg font-medium transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-lime-500 text-black hover:bg-lime-600'
          }`}
        >
          NEXT
        </button>

        {/* Last Page Button */}
        {currentPage < totalPages - 2 && (
          <>
            <span className="text-gray-400">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-2 bg-lime-500 text-black rounded-lg font-medium hover:bg-lime-600 transition-colors"
            >
              {'>>'}
            </button>
          </>
        )}
      </div>

      {/* Results Info */}
      <div className="text-center mt-6">
        <p className="text-blue-300 text-sm">
          Showing {((currentPage - 1) * gamesPerPage) + 1}-{Math.min(currentPage * gamesPerPage, allGames.length * totalPages)} 
          of {allGames.length * totalPages} games
        </p>
      </div>
    </div>
  )
}

export default AllGames