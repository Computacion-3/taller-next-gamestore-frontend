export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export class RestHttpClient {
  private readonly baseUrl: string;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
    private readonly getToken?: () => string | null,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extra,
    };
    const token = this.getToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: this.buildHeaders(options.headers),
      ...(options.body !== undefined && { body: JSON.stringify(options.body) }),
    });

    if (!response.ok) {
      let message = `Error HTTP (${response.status})`;
      try {
        const errorBody = (await response.json()) as {
          message?: string | string[];
        };
        if (Array.isArray(errorBody.message)) {
          message = errorBody.message.join(', ');
        } else if (typeof errorBody.message === 'string') {
          message = errorBody.message;
        }
      } catch {
        // Mantiene el mensaje genérico si el cuerpo no es JSON
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }
    return JSON.parse(text) as T;
  }
}
