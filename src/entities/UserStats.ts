import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('user_stats')
@Index(['osuId', 'mode'], { unique: true })
export class UserStats {
  @PrimaryGeneratedColumn()
  id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'osuId' })
    user!: User;

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