export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    neon: string[];
  };
  effects: {
    glow: string;
    particle: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Klassisk neon-blå och lila estetik',
    colors: {
      primary: '#00f3ff',
      secondary: '#8a2be2',
      accent: '#ffffff',
      background: '#0a0a0a',
      neon: ['#00f3ff', '#8a2be2', '#ffffff']
    },
    effects: {
      glow: '0 0 20px rgba(0, 243, 255, 0.5)',
      particle: 'cyan'
    }
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    description: '80-tals inspirerad rosa och cyan',
    colors: {
      primary: '#ff6ec7',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#1a0033',
      neon: ['#ff6ec7', '#00ffff', '#ffff00']
    },
    effects: {
      glow: '0 0 25px rgba(255, 110, 199, 0.6)',
      particle: 'pink'
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Rymdinspirerad med djupblå och guld',
    colors: {
      primary: '#4a90e2',
      secondary: '#ffd700',
      accent: '#ff69b4',
      background: '#000814',
      neon: ['#4a90e2', '#ffd700', '#ff69b4']
    },
    effects: {
      glow: '0 0 30px rgba(74, 144, 226, 0.7)',
      particle: 'gold'
    }
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Grön digital regn-effekt',
    colors: {
      primary: '#00ff41',
      secondary: '#008f11',
      accent: '#ffffff',
      background: '#000000',
      neon: ['#00ff41', '#008f11', '#ffffff']
    },
    effects: {
      glow: '0 0 15px rgba(0, 255, 65, 0.8)',
      particle: 'lime'
    }
  },
  {
    id: 'sunset',
    name: 'Neon Sunset',
    description: 'Varm orange och lila solnedgång',
    colors: {
      primary: '#ff6b35',
      secondary: '#c77dff',
      accent: '#ffbe0b',
      background: '#0d0015',
      neon: ['#ff6b35', '#c77dff', '#ffbe0b']
    },
    effects: {
      glow: '0 0 25px rgba(255, 107, 53, 0.6)',
      particle: 'orange'
    }
  }
];

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};
