import React, { useState, useContext } from 'react';
import { MenuOutlined, CloseOutlined, SettingOutlined, QuestionCircleOutlined, InfoCircleOutlined, StarOutlined } from '@ant-design/icons';
import { MdOutlineFitnessCenter } from "react-icons/md";
import '../styles/Menu.css';
import { AbacusContext } from '../wrappers/AbacusProvider';
import { LEVEL } from '../const/const';
import AppearanceSettings from './AppearanceSettings';
import useReset from '../hooks/useReset';
import { useSettings } from '../wrappers/SettingsProvider';
import useNewGame from '../hooks/useNewGame';
import CloseButton from './CloseButton';
  
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { level, setLevel, score, countSum, setScore } = useContext(AbacusContext)!;
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const { handleReset } = useReset();
  const { settings, resetSettings, updateSettings } = useSettings()!;
  const { startNewGame } = useNewGame();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleResetClick = () => {
    level !== 0 && setLevel(0);
    handleReset();
    handleClose();
    resetSettings();
    startNewGame();
    setScore(0)
  };

  const handleSettingsClick = () => {
    setIsAppearanceOpen(true);
  };

  const handleNewGame = () => {
    if (settings.mode !== 'ascent') {
      const mode = 'ascent';
      updateSettings({ mode });
      level !== 0 && setLevel(0);
      countSum > 0 && handleReset();
      startNewGame();
      handleClose();
    }
  }

  const handleExitGame = () => {
    // Swith to training mode
    if (settings.mode !== 'common') {
      const mode = 'common';
      updateSettings({ mode });
      handleReset();
      startNewGame();
    }
  }

  const handleHelp = () => {
    if (settings.showHelp) {
      updateSettings({ showHelp: false });
    } else {
      updateSettings({ showHelp: true });
    }
    handleClose();
  }

  const menuItems: MenuItem[] = [
    {
      id: 'new_game',
      label: 'Начать игру',
      icon: <StarOutlined />,
      onClick: handleNewGame
    },
    {
      id: 'simulator',
      label: 'Тренажер',
      icon: <MdOutlineFitnessCenter />,
      onClick: handleExitGame
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: <SettingOutlined />,
      onClick: handleSettingsClick
    },
    {
      id: 'help',
      label: 'Помощь',
      icon: <QuestionCircleOutlined />,
      onClick: handleHelp
    },
    // {
    //   id: 'about',
    //   label: 'О программе',
    //   icon: <InfoCircleOutlined />,
    //   onClick: () => console.log('О программе')
    // },
    {
      id: 'reset',
      label: 'Cброс',
      icon: <CloseOutlined />,
      onClick: () => handleResetClick()
    }
  ];

  return (
    <>
      {/* Кнопка открытия меню */}
      <button 
        className={`menu-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={toggleMenu}
        aria-label="Открыть меню"
      >
        <MenuOutlined />
      </button>

      {/* Затемнение фона */}
      {isOpen && (
        <div 
          className="menu-overlay" 
          onClick={handleClose}
          aria-label="Закрыть меню"
        />
      )}

      {/* Боковое меню */}
      <div className={`menu-container ${isOpen ? 'open' : ''}`}>
        {/* Заголовок меню */}
        <div className="menu-header">
          <div className="menu-title">
            <img
              className="menu-logo"
              src="/abacus-logo.jpeg"
            />
          </div>
          <CloseButton onClick={handleClose} />
        </div>

        {/* Информация о текущей игре */}
        <div className="game-info">
          <div className="info-item">
            <span className="info-label">Текущий уровень:</span>
            <span className="info-value level-badge">{LEVEL[level].name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Счет:</span>
            <span className="info-value score">{`${settings.mode !== 'common' ? score : '0' }`}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Режим:</span>
            <span className="info-value mode">{`${settings.mode === 'common' ? 'Тренажер' : 'Игра'}`}</span>
          </div>
        </div>

        {/* Навигация меню */}
        <nav className="menu-nav">
          <ul>
            {menuItems.map((item, index) => (
              <li key={item.id}>
                <button 
                  className={`menu-item ${index + 1 === menuItems.length && 'last-item'}`}
                  onClick={() => {
                    item.onClick?.();
                  }}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Футер меню */}
        <div className="menu-footer">
          <div className="footer-info">
            <p className="version">Версия 1.0.0</p>
            <p className="copyright">© 2024 Abacus Game</p>
          </div>
        </div>
      </div>

      <AppearanceSettings
        isOpen={isAppearanceOpen}
        onClose={() => setIsAppearanceOpen(false)}
      />
    </>
  );
};

export default Menu;