import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import '../styles/AppearanceSettings.css';
import { useSettings } from '../wrappers/SettingsProvider';
import { Settings } from '../wrappers/SettingsProvider';
import useReset from '../hooks/useReset';

interface AppearanceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useSettings();
    const currentTheme = settings.theme;
    const [selectedTheme, setSelectedTheme] = useState(currentTheme);
    const {handleReset} = useReset();

    const handleThemeSelect = (theme: Settings["theme"]) => {
        setSelectedTheme(theme);
        updateSettings({ theme });
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, checked} = e.target;
      updateSettings({[name]: checked});

      if (name === 'moveByClick') {
        handleReset()
      }
    }

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
    <>
      <div className="appearance-overlay" onClick={handleCancel} />
      
      <div className="appearance-settings">
        <div className="appearance-header">
          <h3>Настройки</h3>
          <button 
            className="appearance-close"
            onClick={handleCancel}
            aria-label="Закрыть настройки"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="appearance-content">
          <div className="theme-section">
            <h4>Внешний вид</h4>       
            <div className="theme-options-grid">
              {/* Спокойная тема */}
              <div 
                className={`theme-card ${selectedTheme === 'calm' ? 'selected' : ''}`}
                onClick={() => handleThemeSelect('calm')}
              >
                <div className="theme-card-preview calm-preview">
                  <div className="preview-grid">
                    <div className="preview-grid-item" style={{ backgroundColor: '#6A8CAF' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#A3D9B1' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#D4A5A5' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#6A8CAF' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#A3D9B1' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#D4A5A5' }} />
                  </div>
                </div>
                <div className="theme-card-info">
                  <div className="theme-card-name">
                    Спокойный
                  </div>
                </div>
              </div>

              {/* Яркая тема */}
              <div 
                className={`theme-card ${selectedTheme === 'bright' ? 'selected' : ''}`}
                onClick={() => handleThemeSelect('bright')}
              >
                <div className="theme-card-preview bright-preview">
                  <div className="preview-grid">
                    <div className="preview-grid-item" style={{ backgroundColor: '#667eea' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#f093fb' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#5ee7df' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#667eea' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#f093fb' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#5ee7df' }} />
                  </div>
                </div>
                <div className="theme-card-info">
                  <div className="theme-card-name">
                    Яркий
                  </div>
                </div>
              </div>

              {/* Классическая тема */}
              <div 
                className={`theme-card ${selectedTheme === 'classic' ? 'selected' : ''}`}
                onClick={() => handleThemeSelect('classic')}
              >
                <div className="theme-card-preview classic-preview-square">
                  <div className="preview-grid">
                    <div className="preview-grid-item" style={{ backgroundColor: '#895907' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#a67c1e' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#c9a952' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#895907' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#a67c1e' }} />
                    <div className="preview-grid-item" style={{ backgroundColor: '#c9a952' }} />
                  </div>
                </div>
                <div className="theme-card-info">
                  <div className="theme-card-name">
                    Классик
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Чекбокс для суммы строк */}
          <div className="checkbox-section">
            <label className="checkbox-row">
              <div className="checkbox-container">
                <input
                  name='showRowSums'
                  type="checkbox"
                  id="rowsums"
                  className="checkbox-input"
                  checked={settings.showRowSums}
                  onChange={handleCheckbox}
                />
                <div className="checkbox-custom" />
              </div>
              <span className="checkbox-label">
                Суммы строк
              </span>
            </label>
            <p className="checkbox-description">
              Показать / скрыть суммы для каждого ряда счет
            </p>
          </div>

          {/* Чек бокс для разделителя рядов */}
          <div className="checkbox-section">
            <label className="checkbox-row">
              <div className="checkbox-container">
                <input
                  name="dotDivider"
                  type="checkbox"
                  id="rowsums"
                  className="checkbox-input"
                  checked={settings.dotDivider}
                  onChange={handleCheckbox}
                />
                <div className="checkbox-custom" />
              </div>
              <span className="checkbox-label">
                Простой разделитель
              </span>
            </label>
            <p className="checkbox-description">
              Разделитель для групп разрядов в виде точки
            </p>
          </div>
          
          <div className="theme-section">
            <h4>Управление</h4>
          </div>
          {/* Чекбокс для типа управления */}
          <div className="checkbox-section">
            <label className="checkbox-row">
              <div className="checkbox-container">
                <input
                  name="moveByClick"
                  type="checkbox"
                  id="rowsums"
                  className="checkbox-input"
                  checked={settings.moveByClick}
                  onChange={handleCheckbox}
                />
                <div className="checkbox-custom" />
              </div>
              <span className="checkbox-label">
                Двигать по клику
              </span>
            </label>
            <p className="checkbox-description">
              Перемещать костяшки без перетаскивания
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppearanceSettings;