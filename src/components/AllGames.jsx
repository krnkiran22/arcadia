import { useState } from 'react'

const AllGames = ({ onGameSelect }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 16
  const totalPages = 11

  const allGames = [
    // New playable games - cleaned up duplicates
    { id: 'chess', title: 'Chess vs Bot', plays: '1250000', color: 'bg-gradient-to-br from-gray-800 to-gray-900', category: 'Strategy', playable: true },
    { id: 'tictactoe', title: 'Tic Tac Toe', plays: '890000', color: 'bg-gradient-to-br from-blue-500 to-purple-600', category: 'Strategy', playable: true },
    { id: 'enhanced-snakeladder', title: 'Snake & Ladder', plays: '1250000', color: 'bg-gradient-to-br from-emerald-600 to-teal-600', category: 'Board Game', playable: true },
    { id: 'flappybird', title: 'Flappy Bird', plays: '2100000', color: 'bg-gradient-to-br from-sky-400 to-blue-600', category: 'Arcade', playable: true },
    { id: 'ludo', title: 'Ludo Game', plays: '1850000', color: 'bg-gradient-to-br from-red-500 to-yellow-500', category: 'Board Game', playable: true },
    { id: 'wheel', title: 'Wheel of Fortune', plays: '420000', color: 'bg-gradient-to-br from-purple-500 to-pink-500', category: 'Casino', playable: true },
    // Existing games
    { id: 1, title: 'Puzzle Blocks Asmr', plays: '62987', color: 'bg-gradient-to-br from-pink-400 to-red-500', category: 'Puzzle' },
    { id: 2, title: 'Bubble Shooter', plays: '69421', color: 'bg-gradient-to-br from-blue-400 to-green-500', category: 'Puzzle' },
    { id: 3, title: 'Kings and Queens Solitaire', plays: '36576', color: 'bg-gradient-to-br from-yellow-400 to-orange-500', category: 'Card' },
    { id: 4, title: 'Wonders of Ancient World', plays: '57728', color: 'bg-gradient-to-br from-blue-500 to-purple-500', category: 'Adventure' },
    { id: 5, title: 'Wild West Klondike', plays: '35753', color: 'bg-gradient-to-br from-orange-500 to-red-600', category: 'Adventure' },
    { id: 6, title: 'Mustang City Driver', plays: '167174', color: 'bg-gradient-to-br from-blue-600 to-gray-700', category: 'Racing' },
    { id: 7, title: 'Citymix Solitaire', plays: '151040', color: 'bg-gradient-to-br from-purple-500 to-pink-500', category: 'Card' },
    { id: 8, title: 'Machine City Balls', plays: '468226', color: 'bg-gradient-to-br from-orange-400 to-red-500', category: 'Puzzle' },
    { id: 9, title: 'DOP Stickman Jailbreak', plays: '689224', color: 'bg-gradient-to-br from-gray-500 to-black', category: 'Puzzle' },
    { id: 10, title: 'Dynamons 5', plays: '382472', color: 'bg-gradient-to-br from-blue-500 to-purple-600', category: 'Adventure' },
    { id: 11, title: 'Save the Baby Elsa', plays: '536672', color: 'bg-gradient-to-br from-blue-300 to-pink-400', category: 'Care' },
    { id: 12, title: 'Skibidi Toilet G-man', plays: '326433', color: 'bg-gradient-to-br from-gray-600 to-blue-600', category: 'Action' }
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
    <div className="max-w-[90%] mx-auto">
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
            onClick={() => game.playable && onGameSelect && onGameSelect(game.id)}
            className={`bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl p-4 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-blue-600 hover:border-lime-400 group relative ${
              game.playable ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {/* Playable Badge */}
            {game.playable && (
              <div className="absolute top-2 right-2 bg-lime-500 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                PLAYABLE
              </div>
            )}

            {/* Game Thumbnail */}
            <div className={`aspect-square ${game.color} rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:shadow-xl transition-shadow`}>
              {game.title.split(' ')[0]}
            </div>

            {/* Game Info */}
            <div className="text-center">
              <h3 className="text-white font-semibold text-sm mb-1 truncate">{game.title}</h3>
              <p className="text-blue-300 text-xs mb-2">{game.plays} Plays</p>
              <div className="bg-blue-600 text-blue-200 px-2 py-1 rounded-full text-xs">
                {game.category}
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <button className={`px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform ${
                game.playable 
                  ? 'bg-lime-500 hover:bg-lime-600 text-black' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}>
                {game.playable ? 'Play Game' : 'Coming Soon'}
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
            className={`w-10 h-10 rounded-lg font-bold transition-colors ${
              currentPage === pageNum
                ? 'bg-lime-500 text-black'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-lime-500 text-black hover:bg-lime-600'
          }`}
        >
          NEXT &gt;
        </button>

        {/* Last Page Button */}
        {currentPage < totalPages - 2 && (
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-3 py-2 bg-lime-500 text-black rounded-lg font-bold hover:bg-lime-600 transition-colors"
          >
            {'>>'}
          </button>
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