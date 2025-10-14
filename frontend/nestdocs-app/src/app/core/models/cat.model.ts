/**
 * Cat domain model
 */
export interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  createdAt?: Date;
}

/**
 * Cat creation request DTO
 */
export interface CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

/**
 * Cat update request DTO
 */
export interface UpdateCatDto {
  name?: string;
  age?: number;
  breed?: string;
}
