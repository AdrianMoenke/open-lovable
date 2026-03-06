export interface Field {
  name: string;
  type: string;
  isNullable: boolean;
}

export interface Entity {
  name: string;
  fields: Field[];
}

export interface Relation {
  fromEntity: string;
  toEntity: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description?: string;
}

export interface InferredDataModel {
  id: string;
  sessionId: string;
  entities: Entity[];
  relations: Relation[];
}

