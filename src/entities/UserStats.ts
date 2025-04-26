import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('user_stats')
@Index(['osuId', 'mode'], { unique: true })
export class UserStats {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
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

  @Column({ default: 'osu' })
  mode!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}