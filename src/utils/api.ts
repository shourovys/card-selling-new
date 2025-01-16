import { ApiResponse } from '@/types';

export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}