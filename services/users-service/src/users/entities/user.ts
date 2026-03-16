import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { UserRole } from './user-roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column()
  active: boolean;

  @OneToMany((): typeof RefreshToken => RefreshToken, (refreshToken: RefreshToken): User => refreshToken.user)
  refreshTokens: RefreshToken[];

  @ManyToOne((): typeof UserRole => UserRole)
  @JoinColumn({ name: 'role_id' })
  userRole: UserRole;
}
