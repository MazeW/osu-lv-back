import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('user_scores')
export class UserScore {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column()
  mode!: string;

  @Column({nullable: true})
  rank!: string;

  @Column('simple-array')
  mods!: string[];

  @Column('float')
  pp!: number;

  @Column('float')
  ppWeighted!: number;

  @Column('float')
  accuracy!: number;

  @Column('json')
  statistics!: {
      count_100: number;
      count_300: number;
      count_50: number;
      count_geki: number | null;
      count_katu: number | null;
      count_miss: number;
  };

  @Column()
  beatmapArtist!: string;

  @Column()
  beatmapTitle!: string;

  @Column()
  beatmapDifficulty!: string;


  @Column()
  beatmapUrl!: string;

  @Column('json')
  covers!: {
      cover: string;
      'cover@2x': string;
      card: string;
      'card@2x': string;
      list: string;
      'list@2x': string;
      slimcover: string;
      'slimcover@2x': string;
  };

  @Column()
  createdAt!: Date;
}
