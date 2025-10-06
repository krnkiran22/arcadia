import { PlayIcon } from '@heroicons/react/24/solid'

const FeaturedGame = () => {
  const featuredGame = {
    title: 'CYBER PUNK RACING',
    subtitle: 'ULTIMATE EDITION',
    description: 'Experience the thrill of futuristic racing in neon-lit cityscapes',
    image: '🏎️',
    rating: 4.8,
    plays: '2.1M'
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-blue-800 to-cyan-900 rounded-3xl overflow-hidden shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-500 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative p-8 flex flex-col justify-between min-h-80">
        <div>
          {/* Game Icon/Image */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg">
            {featuredGame.image}
          </div>

          {/* Title */}
          <div className="mb-4">
            <h2 className="text-white text-3xl font-bold mb-2">{featuredGame.title}</h2>
            <p className="text-orange-400 text-lg font-semibold">{featuredGame.subtitle}</p>
          </div>

          {/* Description */}
          <p className="text-blue-200 text-sm mb-6 max-w-md leading-relaxed">
            {featuredGame.description}
          </p>

          {/* Stats */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className="text-white font-semibold">{featuredGame.rating}</span>
            </div>
            <div className="text-blue-200 text-sm">
              {featuredGame.plays} plays
            </div>
          </div>
        </div>

        {/* Play Button */}
        <div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-3 transition-all hover:scale-105 shadow-lg">
            <PlayIcon className="w-6 h-6" />
            <span>PLAY NOW</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-8 right-8 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30"></div>
      </div>
    </div>
  )
}

export default FeaturedGame