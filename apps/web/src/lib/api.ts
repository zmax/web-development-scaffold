import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

interface ErrorPayload {
  message?: string;
  errors?: unknown[] | null;
}

/**
 * 自訂 API 錯誤類別，用於標準化錯誤處理
 */
export class ApiError extends Error {
  status: number;
  errors: unknown[] | null;

  constructor(
    status: number,
    message: string,
    errors: unknown[] | null = null
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/**
 * 通用的請求函式
 * @param url API 端點路徑
 * @param options RequestInit 選項
 */
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const { auth } = useAuthStore.getState();
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  if (auth?.token) {
    headers.set('Authorization', `Bearer ${auth.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData: ErrorPayload = await response.json().catch(() => ({})); // No body
    throw new ApiError(
      response.status,
      errorData.message || response.statusText,
      errorData.errors
    );
  }

  // 處理回應主體為空的情況 (例如 204 No Content)
  const contentType = response.headers.get('content-type');
  if (
    response.status === 204 ||
    !contentType ||
    !contentType.includes('application/json')
  ) {
    return Promise.resolve(undefined as T);
  }

  return response.json() as Promise<T>;
}

const post = <T, U>(url: string, body: U): Promise<T> =>
  apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });

const patch = <T, U>(url: string, body: U): Promise<T> =>
  apiRequest<T>(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const api = {
  post,
  patch,
};
