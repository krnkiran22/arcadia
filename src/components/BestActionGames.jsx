const BestActionGames = () => {
  const actionGames = [
    { id: 1, title: 'Fireboy and Watergirl', plays: '2.1M', color: 'bg-gradient-to-br from-red-500 to-blue-500' },
    { id: 2, title: 'Dynamons 5', plays: '1.8M', color: 'bg-gradient-to-br from-blue-500 to-purple-500' },
    { id: 3, title: 'Bob the Robber 2', plays: '1.5M', color: 'bg-gradient-to-br from-green-600 to-gray-700' },
    { id: 4, title: 'Fireboy and Watergirl 2', plays: '2.3M', color: 'bg-gradient-to-br from-orange-500 to-blue-500' },
    { id: 5, title: 'Snail Bob 5', plays: '980K', color: 'bg-gradient-to-br from-green-500 to-yellow-500' },
    { id: 6, title: 'Bob the Robber', plays: '1.2M', color: 'bg-gradient-to-br from-gray-600 to-green-600' }
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
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 hover:scale-105 transition-all cursor-pointer shadow-lg border border-blue-500 hover:border-lime-400"
          >
            {/* Game Thumbnail */}
            <div className={`w-full h-24 ${game.color} rounded-lg flex items-center justify-center text-white font-bold text-xs mb-3 shadow-md`}>
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