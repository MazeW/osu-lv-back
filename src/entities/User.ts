import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  osuId!: string;

  @Column({ unique: true, type: 'text' })
  discordId!: string;

  @Column({ default: false })
  deleted!: boolean;

  @Column({ type: 'text', nullable: true })
  discordName!: string | null;

  @Column({ type: 'text', nullable: true })
  discordUsername!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}