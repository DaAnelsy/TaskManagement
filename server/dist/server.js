"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const tasks_1 = require("./routes/tasks");
const users_1 = require("./routes/users");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/tasks', tasks_1.taskRoutes);
app.use('/api/users', users_1.userRoutes);
// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join-task', (taskId) => {
        socket.join(`task-${taskId}`);
    });
    socket.on('task-updated', (data) => {
        socket.to(`task-${data.taskId}`).emit('task-updated', data);
    });
    socket.on('task-created', (data) => {
        socket.broadcast.emit('task-created', data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Database sync and server start
const PORT = process.env.PORT || 5000;
database_1.default.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
