import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('settings')
export class Setting {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  @Column()
  chat: boolean;

  @UpdateDateColumn()
  update_at: Date;

  @CreateDateColumn()
  create_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
