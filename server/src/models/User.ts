import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Task } from './Task';

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column({
    type: DataType.STRING,
    unique: true
  })
  email!: string;

  @HasMany(() => Task)
  tasks!: Task[];
}