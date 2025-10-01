import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../src/modules/cats/cats.module';
import { CatsService } from '../src/modules/cats/cats.service';
import { INestApplication } from '@nestjs/common';

describe('Cats (e2e)', () => {
  let app: INestApplication;
  let catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET cats', () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({ data: ['test'] }); // Fixed: TransformInterceptor wraps response in { data: ... }
  });

  afterAll(async () => {
    await app.close();
  });
});