import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';

describe('CatsService', () => {
  let service: CatsService;
  let repository: Repository<CatEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(CatEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    repository = module.get<Repository<CatEntity>>(getRepositoryToken(CatEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a cat', async () => {
    const catDto = { name: 'Milo', age: 2, breed: 'Tabby' };
    const createdCat = { id: 1, ...catDto, isActive: true, createdAt: new Date(), updatedAt: new Date() };

    mockRepository.create.mockReturnValue(createdCat);
    mockRepository.save.mockResolvedValue(createdCat);

    const result = await service.create(catDto);

    expect(mockRepository.create).toHaveBeenCalledWith(catDto);
    expect(mockRepository.save).toHaveBeenCalledWith(createdCat);
    expect(result).toEqual(createdCat);
  });

  it('should find all cats', async () => {
    const cats = [
      { id: 1, name: 'Milo', age: 2, breed: 'Tabby', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    mockRepository.find.mockResolvedValue(cats);

    const result = await service.findAll();

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    expect(result).toEqual(cats);
  });
});
