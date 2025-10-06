const BestActionGames = ({ onGameSelect }) => {
  const actionGames = [
    { id: 'chess', title: 'Chess vs Bot', plays: '1.2M', color: 'bg-gradient-to-br from-gray-800 to-gray-900', playable: true },
    { id: 'tictactoe', title: 'Tic Tac Toe', plays: '890K', color: 'bg-gradient-to-br from-blue-500 to-purple-600', playable: true },
    { id: 3, title: 'Bob the Robber 2', plays: '1.5M', color: 'bg-gradient-to-br from-green-600 to-gray-700' },
    { id: 'snakeladder', title: 'Snake & Ladder', plays: '750K', color: 'bg-gradient-to-br from-green-500 to-yellow-500', playable: true },
    { id: 5, title: 'Snail Bob 5', plays: '980K', color: 'bg-gradient-to-br from-green-500 to-yellow-500' },
    { id: 'wheel', title: 'Wheel of Fortune', plays: '420K', color: 'bg-gradient-to-br from-purple-500 to-pink-500', playable: true }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">BEST OF ACTION GAMES</h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors">
          View All
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 gap-4">
        {actionGames.map((game) => (
          <div
            key={game.id}
            onClick={() => game.playable && onGameSelect && onGameSelect(game.id)}
            className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 hover:scale-105 transition-all shadow-lg border border-blue-500 hover:border-lime-400 relative ${
              game.playable ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {/* Playable Badge */}
            {game.playable && (
              <div className="absolute top-1 right-1 bg-lime-500 text-black text-xs font-bold px-1 py-0.5 rounded z-10">
                PLAY
              </div>
            )}

            {/* Game Thumbnail */}
            <div className={`w-full h-16 ${game.color} rounded-lg flex items-center justify-center text-white font-bold text-xs mb-3 shadow-md`}>
              {game.title.split(' ')[0]}
            </div>

            {/* Game Info */}
            <div>
              <h3 className="text-white font-semibold text-xs mb-1 truncate">{game.title}</h3>
              <p className="text-blue-300 text-xs">{game.plays} plays</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestActionGames