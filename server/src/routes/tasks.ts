import express from 'express';
import { Task } from '../models/Task';
import { User } from '../models/User';

const router = express.Router();

// Tipos para las rutas
interface CreateTaskBody {
  title: string;
  description?: string;
  assignedToId?: number;
  createdById: number;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  assignedToId?: number;
}

// Get all tasks with assigned user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task
router.post('/', async (req: express.Request<{}, {}, CreateTaskBody>, res) => {
  try {
    const { title, description, assignedToId, createdById } = req.body;

    // Validación básica
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!createdById) {
      return res.status(400).json({ error: 'createdById is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || undefined,
      assignedToId: assignedToId || undefined,
      createdById,
      status: 'pending'
    });
    
    const taskWithUser = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!taskWithUser) {
      return res.status(404).json({ error: 'Task not found after creation' });
    }
    
    res.status(201).json(taskWithUser);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', async (req: express.Request<{ id: string }, {}, UpdateTaskBody>, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedToId } = req.body;
    
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.update({
      title: title !== undefined ? title?.trim() : task.title,
      description: description !== undefined ? description?.trim() : task.description,
      status: status || task.status,
      assignedToId: assignedToId !== undefined ? assignedToId : task.assignedToId
    });
    
    const updatedTask = await Task.findByPk(taskId, {
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found after update' });
    }
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', async (req: express.Request<{ id: string }>, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export { router as taskRoutes };