import { useState } from 'react'
import Header from './components/Header'
import GameSeriesCarousel from './components/GameSeriesCarousel'
import FeaturedGame from './components/FeaturedGame'
import BestActionGames from './components/BestActionGames'
import NewReleases from './components/NewReleases'
import AllGames from './components/AllGames'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Header />
      
      {/* Main Content */}
      <main className="pt-20">
        {/* Game Series Carousel */}
        <section className="py-8">
          <GameSeriesCarousel />
        </section>

        {/* Featured Game and Best Action Games */}
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FeaturedGame />
            </div>
            <div className="lg:col-span-1">
              <BestActionGames />
            </div>
          </div>
        </section>

        {/* New Releases */}
        <section className="py-8">
          <NewReleases />
        </section>

        {/* All Games */}
        <section className="py-8 px-4">
          <AllGames />
        </section>
      </main>
    </div>
  )
}

export default App
