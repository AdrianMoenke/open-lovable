import type { InferredDataModel, Entity, Field } from '@/types/data-model';
import type { InferredApiSpec, ApiEndpoint } from '@/types/api-spec';

export interface DataApiInferenceInput {
  sessionId: string;
  url: string;
  markdown?: string;
}

// Very lightweight heuristic inference for MVP.
export function inferDataModel(input: DataApiInferenceInput): InferredDataModel {
  const baseName = deriveEntityBaseName(input.url);

  const fields: Field[] = [
    { name: 'id', type: 'string', isNullable: false },
    { name: 'createdAt', type: 'string', isNullable: false },
    { name: 'updatedAt', type: 'string', isNullable: false },
  ];

  const entities: Entity[] = [
    {
      name: baseName,
      fields,
    },
  ];

  return {
    id: `data-model-${input.sessionId}`,
    sessionId: input.sessionId,
    entities,
    relations: [],
  };
}

export function inferApiSpec(input: DataApiInferenceInput): InferredApiSpec {
  const baseName = deriveEntityBaseName(input.url);
  const resourcePath = `/${baseName.toLowerCase()}`;

  const endpoints: ApiEndpoint[] = [
    {
      path: resourcePath,
      method: 'GET',
      name: `list${baseName}`,
      description: `List ${baseName} records`,
    },
    {
      path: resourcePath,
      method: 'POST',
      name: `create${baseName}`,
      description: `Create a new ${baseName}`,
    },
  ];

  return {
    id: `api-spec-${input.sessionId}`,
    sessionId: input.sessionId,
    baseUrl: '/api',
    endpoints,
  };
}

function deriveEntityBaseName(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const [firstPart] = hostname.split('.');
    return capitalize(firstPart || 'Item');
  } catch {
    return 'Item';
  }
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

