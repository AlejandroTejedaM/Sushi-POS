import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  public findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.repository.findOne(options);
  }

  public find(options?: FindManyOptions<User>): Promise<User[]> {
    return this.repository.find(options);
  }

  public create(entity: DeepPartial<User>): Promise<User> {
    const newEntity: User = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  public delete(options: FindOptionsWhere<User>): Promise<DeleteResult> {
    return this.repository.delete(options);
  }
}
