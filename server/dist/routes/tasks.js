"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Task_1 = require("../models/Task");
const User_1 = require("../models/User");
const router = express_1.default.Router();
exports.taskRoutes = router;
// Get all tasks with assigned user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task_1.Task.findAll({
            include: [{
                    model: User_1.User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email']
                }]
        });
        res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
// Create new task
router.post('/', async (req, res) => {
    try {
        const { title, description, assignedToId, createdById } = req.body;
        // Validación básica
        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!createdById) {
            return res.status(400).json({ error: 'createdById is required' });
        }
        const task = await Task_1.Task.create({
            title: title.trim(),
            description: description?.trim() || undefined,
            assignedToId: assignedToId || undefined,
            createdById,
            status: 'pending'
        });
        const taskWithUser = await Task_1.Task.findByPk(task.id, {
            include: [{
                    model: User_1.User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email']
                }]
        });
        if (!taskWithUser) {
            return res.status(404).json({ error: 'Task not found after creation' });
        }
        res.status(201).json(taskWithUser);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});
// Update task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, assignedToId } = req.body;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }
        const task = await Task_1.Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        await task.update({
            title: title !== undefined ? title?.trim() : task.title,
            description: description !== undefined ? description?.trim() : task.description,
            status: status || task.status,
            assignedToId: assignedToId !== undefined ? assignedToId : task.assignedToId
        });
        const updatedTask = await Task_1.Task.findByPk(taskId, {
            include: [{
                    model: User_1.User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email']
                }]
        });
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found after update' });
        }
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});
// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }
        const task = await Task_1.Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});
