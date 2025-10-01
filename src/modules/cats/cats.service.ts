import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cat } from "./interfaces/cat.interface";
import { CatEntity } from "./entities/cat.entity";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
  ) {}

  async create(createCatDto: Omit<Cat, 'id'>): Promise<CatEntity> {
    const cat = this.catRepository.create(createCatDto);
    return this.catRepository.save(cat);
  }

  async findAll(): Promise<CatEntity[]> {
    return this.catRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CatEntity | null> {
    return this.catRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: number, updateCatDto: Partial<Cat>): Promise<CatEntity | null> {
    await this.catRepository.update(id, updateCatDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Soft delete by setting isActive to false
    await this.catRepository.update(id, { isActive: false });
  }

  async getCount(): Promise<number> {
    return this.catRepository.count({ where: { isActive: true } });
  }
}
