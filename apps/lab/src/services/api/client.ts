/**
 * MEJUNJE Backoffice API Client Helper
 * Base REST API wrapper for MEJUNJE Backoffice (/apps/lab)
 */

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponseEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number = 400) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Resolves canonical API base URL from environment or current origin.
 * Default canonical dev API URL: https://www.mejunje.com.ar/dev/api or relative /dev/api
 */
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_MEJUNJE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Relative path when served on same domain (Vercel rewrite/proxy to BlueHost)
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/dev/api`;
  }

  return 'https://www.mejunje.com.ar/dev/api';
};

/**
 * Generic JSON API request executor with envelope parsing and standardized error handling.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();
    let body: any;

    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      throw new ApiError(
        'INVALID_RESPONSE',
        `Servidor devolvió una respuesta no válida (HTTP ${response.status})`,
        response.status
      );
    }

    if (!response.ok || body.success === false) {
      const errCode = body?.error?.code || `HTTP_${response.status}`;
      const errMessage = body?.error?.message || `Error en la solicitud (HTTP ${response.status})`;
      throw new ApiError(errCode, errMessage, response.status);
    }

    return body.data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'NETWORK_ERROR',
      error.message || 'Error de conexión con la API de MEJUNJE.',
      0
    );
  }
}
