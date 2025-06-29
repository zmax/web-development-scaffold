import { useAuthStore } from '@/stores';

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
  const { token } = useAuthStore.getState();
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
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

  return response.json();
}

/**
 * 專為 SWR `useSWR` 設計的 fetcher 函式 (用於 GET 請求)
 */
export const fetcher = (url: string) => apiRequest(url);

/**
 * 專為 SWR `useSWRMutation` 設計的 sender 函式 (用於 POST, PUT, DELETE 等操作)
 */
/**
 * A generic sender function for use with SWR's useSWRMutation.
 * It sends a POST request with the provided argument as the JSON body.
 * @param url The API endpoint to send the request to.
 * @param arg The data to be sent in the request body.
 * @returns The JSON response from the API.
 */
export async function sender<T>(
  url: string,
  { arg }: { arg: unknown }
): Promise<T> {
  const response = await apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  return response;
}
