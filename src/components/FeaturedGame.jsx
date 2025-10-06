import { PlayIcon } from '@heroicons/react/24/solid'

const FeaturedGame = () => {
  return (
    <div className="relative bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600 rounded-3xl overflow-hidden shadow-2xl">
      {/* Featured Game Banner - Star Stable Style */}
      <div className="relative p-6 min-h-80 flex flex-col justify-between">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-80 rounded-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Small Game Icon */}
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">🐴</span>
          </div>
          
          {/* Game Title */}
          <div className="mb-6">
            <h1 className="text-white text-5xl font-bold mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              Star Stable
            </h1>
            <p className="text-white/90 text-lg">Social</p>
          </div>
        </div>

        {/* Play Button */}
        <div className="relative z-10 flex justify-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-3 transition-all hover:scale-105 shadow-lg">
            <PlayIcon className="w-6 h-6" />
            <span>PLAY NOW</span>
          </button>
        </div>

        {/* Additional Games Preview */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-2">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-xs text-white font-bold">
            Water Color Sort
          </div>
          <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center text-xs text-white font-bold">
            Hex Hyper Dash
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedGame