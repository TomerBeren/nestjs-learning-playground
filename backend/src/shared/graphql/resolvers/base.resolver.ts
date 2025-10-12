import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

// Define the minimum interface that any service must implement
export interface IBaseService<T> {
  findAll(): T[] | Promise<T[]>;
  findOne(id: number): T | Promise<T> | undefined;
}

export function BaseResolver<T>(classRef: Type<T>): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    // Subclasses provide the service (which can have MORE methods than IBaseService)
    abstract getService(): IBaseService<T>;

    // Inherited query - calls service.findAll()
    @Query(() => [classRef], { name: `findAll${classRef.name}` })
    async findAll(): Promise<T[]> {
      const service = this.getService();
      return await service.findAll();
    }

    // Inherited query - calls service.findOne(id)
    @Query(() => classRef, { name: `findOne${classRef.name}`, nullable: true })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<T | undefined> {
      const service = this.getService();
      return await service.findOne(id);
    }
  }
  return BaseResolverHost;
}
