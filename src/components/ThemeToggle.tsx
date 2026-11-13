/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

type ThemeChoice = 'system' | 'light' | 'dark';

const themeLabels: Record<ThemeChoice, string> = {
  system: '跟随系统',
  light: '浅色',
  dark: '深色',
};

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setTheme, theme, resolvedTheme } = useTheme();

  const setThemeColor = (currentTheme?: string) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = currentTheme === 'dark' ? '#0c111c' : '#f9fbfe';

    if (!meta) {
      const newMeta = document.createElement('meta');
      newMeta.name = 'theme-color';
      newMeta.content = color;
      document.head.appendChild(newMeta);
    } else {
      meta.setAttribute('content', color);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setThemeColor(resolvedTheme);
    }
  }, [mounted, resolvedTheme]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isMenuOpen]);

  if (!mounted) {
    return <div className='w-10 h-10' />;
  }

  const activeTheme = (theme || 'system') as ThemeChoice;
  const ThemeIcon =
    activeTheme === 'system'
      ? Monitor
      : resolvedTheme === 'dark'
      ? Sun
      : Moon;

  const chooseTheme = (choice: ThemeChoice) => {
    const applyTheme = () => setTheme(choice);

    if (!(document as any).startViewTransition) {
      applyTheme();
    } else {
      (document as any).startViewTransition(applyTheme);
    }

    setIsMenuOpen(false);
  };

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen((open) => !open)}
        className='w-10 h-10 p-2 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200/50 dark:text-gray-300 dark:hover:bg-gray-700/50 transition-colors'
        aria-label={`主题模式：${themeLabels[activeTheme]}`}
        aria-haspopup='menu'
        aria-expanded={isMenuOpen}
        title={`主题模式：${themeLabels[activeTheme]}`}
      >
        <ThemeIcon className='w-full h-full' />
      </button>

      {isMenuOpen && (
        <div
          role='menu'
          aria-label='选择主题模式'
          className='absolute right-0 top-12 z-50 min-w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900'
        >
          {(['system', 'light', 'dark'] as const).map((choice) => (
            <button
              key={choice}
              type='button'
              role='menuitemradio'
              aria-checked={activeTheme === choice}
              onClick={() => chooseTheme(choice)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                activeTheme === choice
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {themeLabels[choice]}
              {activeTheme === choice && (
                <span className='float-right' aria-hidden='true'>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
