import './styles/App.css'
import AbacusProvider from './wrappers/AbacusProvider';
import { SettingsProvider } from './wrappers/SettingsProvider';
import Game from './components/Game';

function App() {

  return (
    <div className="background">
      <div className="app">
        <h1>Abacus Online</h1>
        <SettingsProvider>
          <AbacusProvider>
            <Game />
          </AbacusProvider>
        </SettingsProvider>
      </div>
    </div>
  )
}

export default App

