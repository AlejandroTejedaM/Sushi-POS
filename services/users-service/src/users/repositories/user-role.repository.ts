import { FindOneOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../entities/user-roles.entity';

@Injectable()
export class UserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly repository: Repository<UserRole>
  ) {}

  public findOne(options: FindOneOptions<UserRole>): Promise<UserRole | null> {
    return this.repository.findOne(options);
  }
}
