import { WebSocketServer } from 'ws'; // Import WebSocketServer từ ws

// Tạo WebSocket server trên cổng 8081
const wss = new WebSocketServer({ port: 8081 });

console.log("WebSocket server is running on ws://localhost:8081");

wss.on('connection', (ws) => {
    console.log('A new client connected.');

    ws.on('message', (message) => {
        console.log('Received:', message);

        // Gửi tin nhắn tới tất cả client
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});