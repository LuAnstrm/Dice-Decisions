import type { LucideIcon } from 'lucide-react';
export type { ThemeId } from '@/styles/themes';

export type Role = 'dm' | 'player';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  dmOnly?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface StatusBarConfig {
  [pagePath: string]: string[];
}
