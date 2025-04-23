import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_stats')
export class UserStats {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  osuId!: string;

  @Column()
  username!: string;

  @Column()
  globalRank!: number;

  @Column()
  countryRank!: number;

  @Column('float')
  performancePoints!: number;

  @Column()
  country!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}