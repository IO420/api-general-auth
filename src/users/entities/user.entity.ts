import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Branch } from '../../branches/entities/branch.entity';

export enum UserRole {
  IO = 'IO',
  Admin = 'Admin',
  Operator = 'Operador',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ type: 'int', name: 'id_organization', nullable: true })
  id_organization: number | null;

  @Column({ type: 'varchar', length: 255,})
  password: string;

  @Column({ type: 'varchar', length: 100,})
  userName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Operator,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: false})
  owner: boolean;

  @Column({ type: 'boolean', default: true})
  active: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'id_organization',
    foreignKeyConstraintName: 'fk_users_organization',
  })
  organization: Organization;

  @ManyToMany(() => Branch, (branch) => branch.users, { cascade: true })
  @JoinTable({
    name: 'user_branches',
    joinColumn: {
      name: 'id_user',
      referencedColumnName: 'id_user',
      foreignKeyConstraintName: 'fk_user_branches_user',
    },
    inverseJoinColumn: {
      name: 'id_branch',
      referencedColumnName: 'id_branch',
      foreignKeyConstraintName: 'fk_user_branches_branch',
    },
  })
  branches: Branch[];
}