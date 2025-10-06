const BestActionGames = () => {
  const actionGames = [
    { id: 1, title: 'Shadow Fighter', plays: '892K', icon: '⚔️' },
    { id: 2, title: 'Zombie Shooter', plays: '1.2M', icon: '🧟' },
    { id: 3, title: 'Ninja Master', plays: '756K', icon: '🥷' },
    { id: 4, title: 'Space Warrior', plays: '634K', icon: '🚀' },
    { id: 5, title: 'Battle Royale', plays: '2.1M', icon: '💥' },
    { id: 6, title: 'Gun Strike', plays: '987K', icon: '🔫' }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">BEST OF ACTION GAMES</h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 gap-4">
        {actionGames.map((game) => (
          <div
            key={game.id}
            className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl p-4 hover:scale-105 transition-all cursor-pointer shadow-lg border border-blue-600 hover:border-lime-400"
          >
            {/* Game Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-2xl mb-3 shadow-md">
              {game.icon}
            </div>

            {/* Game Info */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">{game.title}</h3>
              <p className="text-blue-300 text-xs">{game.plays} plays</p>
            </div>

            {/* Hover Effect Indicator */}
            <div className="mt-3 w-full h-1 bg-blue-600 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-lime-400 rounded-full transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Badge */}
      <div className="mt-6 flex justify-center">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold">
          🔥 HOT ACTION GAMES
        </div>
      </div>
    </div>
  )
}

export default BestActionGames