import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>
  ) {}

  public create(refreshToken: DeepPartial<RefreshToken>): Promise<RefreshToken> {
    const entity: RefreshToken = this.repository.create(refreshToken);
    return this.repository.save(entity);
  }

  public delete(options: FindOptionsWhere<RefreshToken>): Promise<DeleteResult> {
    return this.repository.delete(options);
  }

  public findOne(options: FindOneOptions<RefreshToken>): Promise<RefreshToken | null> {
    return this.repository.findOne(options);
  }
}
