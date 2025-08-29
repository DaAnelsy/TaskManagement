import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'tasks',
  timestamps: true
})
export class Task extends Model<Task> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true // ← Agregar esto
  })
  description?: string;

  @Column({
    type: DataType.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending'
  })
  status!: 'pending' | 'in_progress' | 'completed';

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true // ← Agregar esto
  })
  assignedToId?: number;

  @BelongsTo(() => User)
  assignedTo?: User;

  @Column(DataType.INTEGER)
  createdById!: number;
}