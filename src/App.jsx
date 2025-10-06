import { useState } from 'react'
import Header from './components/Header'
import GameSeriesCarousel from './components/GameSeriesCarousel'
import FeaturedGame from './components/FeaturedGame'
import BestActionGames from './components/BestActionGames'
import NewReleases from './components/NewReleases'
import AllGames from './components/AllGames'
import ChessGame from './components/games/ChessGame'
import TicTacToeGame from './components/games/TicTacToeGame'
import SnakeAndLadderGame from './components/games/SnakeAndLadderGame'
import WheelGame from './components/games/WheelGame'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const handleGameSelect = (gameName) => {
    setCurrentView(gameName)
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  // Render specific game based on current view
  if (currentView === 'chess') {
    return <ChessGame onBackToHome={handleBackToHome} />
  }
  
  if (currentView === 'tictactoe') {
    return <TicTacToeGame onBackToHome={handleBackToHome} />
  }
  
  if (currentView === 'snakeladder') {
    return <SnakeAndLadderGame onBackToHome={handleBackToHome} />
  }
  
  if (currentView === 'wheel') {
    return <WheelGame onBackToHome={handleBackToHome} />
  }

  // Home view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
      <Header />
      
      {/* Main Content */}
      <main className="pt-20">
        {/* Game Series Carousel */}
        <section className="py-8">
          <GameSeriesCarousel />
        </section>

        {/* Featured Game and Best Action Games */}
        <section className="py-8 px-6 max-w-[90%] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FeaturedGame />
            </div>
            <div className="lg:col-span-1">
              <BestActionGames onGameSelect={handleGameSelect} />
            </div>
          </div>
        </section>

        {/* New Releases */}
        <section className="py-8">
          <NewReleases />
        </section>

        {/* All Games */}
        <section className="py-8 px-6">
          <AllGames onGameSelect={handleGameSelect} />
        </section>
      </main>
    </div>
  )
}

export default App
