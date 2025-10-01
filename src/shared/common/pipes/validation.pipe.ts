
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    console.log('=== Class-Validator ValidationPipe ===');
    console.log('Input value:', value);
    console.log('Metatype:', metatype?.name);

    if (!metatype || !this.toValidate(metatype)) {
      console.log('Skipping validation (primitive type or no metatype)');
      return value;
    }

    console.log('Converting plain object to class instance...');
    const object = plainToInstance(metatype, value);
    console.log('Class instance created:', object);

    console.log('Running validation...');
    const errors = await validate(object);
    console.log('Validation errors:', errors.length);

    if (errors.length > 0) {
      console.log('Validation failed! Errors:', errors.map(e => e.constraints));
      throw new BadRequestException('Validation failed');
    }

    console.log('Validation passed! Returning value...');
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
