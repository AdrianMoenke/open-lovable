export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  name: string;
  description?: string;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
}

export interface InferredApiSpec {
  id: string;
  sessionId: string;
  baseUrl?: string;
  endpoints: ApiEndpoint[];
}

