import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

// 建立一個不會在測試之間共享的 QueryClient 實例
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // 關鍵：關閉重試邏輯，讓測試可以立即失敗，而不是等待逾時
        retry: false,
      },
    },
  });

// 擴展 AllTheProviders 的 props，以接受 MemoryRouter 的 props
interface AllTheProvidersProps {
  children: ReactNode;
  memoryRouterProps?: MemoryRouterProps;
}

const AllTheProviders = ({
  children,
  memoryRouterProps = {},
}: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();
  return (
    // MemoryRouter 用於測試中需要路由功能的元件
    <MemoryRouter {...memoryRouterProps}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

// 重新匯出所有 @testing-library/react 的方法
export * from '@testing-library/react';

// 覆寫預設的 render 方法
export { customRender as render };

// 擴展 RenderOptions 以包含我們的 memoryRouterProps
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  memoryRouterProps?: MemoryRouterProps;
}

const customRender = (
  ui: ReactElement,
  { memoryRouterProps, ...options }: CustomRenderOptions = {}
) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders memoryRouterProps={memoryRouterProps}>
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper, ...options });
};
