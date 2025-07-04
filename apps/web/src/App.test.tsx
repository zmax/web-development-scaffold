import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { render } from './test/test-utils';

describe('App', () => {
  it('renders welcome message', () => {
    // 使用我們自訂的 render 函式，它會自動包裹 MemoryRouter
    render(<App />);
    // 根據您的 App.tsx 內容調整此斷言
    // 根據錯誤日誌，App 預設渲染 HomePage，其標題為 "Welcome to Web Scaffold"
    expect(
      screen.getByRole('heading', { name: /Welcome to Web Scaffold/i })
    ).toBeInTheDocument();
  });
});
