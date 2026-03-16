import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @Column()
  active: boolean;

  @OneToMany((): typeof User => User, (user: User): string => user.id)
  user: User[];
}
