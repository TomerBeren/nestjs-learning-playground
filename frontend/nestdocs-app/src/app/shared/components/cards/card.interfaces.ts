// Interfaces for SOLID principles - Dependency Inversion and Interface Segregation
export interface CardConfig {
  theme: CardTheme;
  layout: CardLayout;
  showHeader: boolean;
  showFooter: boolean;
}

export interface CardTheme {
  background: string;
  border: string;
  shadow: string;
  spacing: string;
}

export interface CardLayout {
  padding: string;
  borderRadius: string;
  headerSpacing: string;
  footerSpacing: string;
}

export interface CardContent {
  header?: any;
  body?: any;
  footer?: any;
}

// Default implementations
export const DEFAULT_CARD_THEME: CardTheme = {
  background: 'bg-white/10 backdrop-blur-sm',
  border: 'border-white/20',
  shadow: 'shadow-lg',
  spacing: 'space-y-4'
};

export const DEFAULT_CARD_LAYOUT: CardLayout = {
  padding: 'p-6',
  borderRadius: 'rounded-lg',
  headerSpacing: 'mb-4',
  footerSpacing: 'pt-4'
};

export const DEFAULT_CARD_CONFIG: CardConfig = {
  theme: DEFAULT_CARD_THEME,
  layout: DEFAULT_CARD_LAYOUT,
  showHeader: true,
  showFooter: true
};