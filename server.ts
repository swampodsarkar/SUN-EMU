import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = 3000;

  // Track rooms (pair codes) and active connections
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Create a new session (Host/Emulator side)
    socket.on("host-create-session", () => {
      // Generate a 6-digit pair code
      let pairCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Ensure it's unique
      while (rooms.has(pairCode)) {
        pairCode = Math.floor(100000 + Math.random() * 900000).toString();
      }

      rooms.set(pairCode, { host: socket.id, controllers: [] });
      socket.join(pairCode);
      socket.emit("session-created", { pairCode });
      console.log(`Host ${socket.id} created session ${pairCode}`);
    });

    // Controller joining a session
    socket.on("controller-join", ({ pairCode }) => {
      const room = rooms.get(pairCode);
      
      if (room) {
        if (room.controllers.length >= 4) {
          socket.emit("join-error", { message: "Room is full (max 4 controllers)." });
          return;
        }

        const playerSlot = room.controllers.length + 1;
        room.controllers.push(socket.id);
        
        socket.join(pairCode);
        
        // Notify controller it joined successfully
        socket.emit("join-success", { pairCode, playerSlot });
        
        // Notify host that a new controller joined
        io.to(room.host).emit("controller-connected", { 
          id: socket.id, 
          playerSlot 
        });
        
        console.log(`Controller ${socket.id} joined session ${pairCode} as Player ${playerSlot}`);
      } else {
        socket.emit("join-error", { message: "Invalid or expired Pair Code." });
      }
    });

    // Relay controller input to the host
    socket.on("controller-input", ({ pairCode, type, key, value }) => {
      const room = rooms.get(pairCode);
      if (room) {
        io.to(room.host).emit("emulator-input", {
          id: socket.id,
          type,
          key,
          value
        });
      }
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Cleanup logic
      for (const [pairCode, room] of rooms.entries()) {
        if (room.host === socket.id) {
          // Host disconnected, destroy room
          io.to(pairCode).emit("host-disconnected");
          rooms.delete(pairCode);
          console.log(`Session ${pairCode} destroyed due to host disconnect`);
          break;
        } else {
          // Check if it was a controller
          const controllerIndex = room.controllers.indexOf(socket.id);
          if (controllerIndex !== -1) {
            room.controllers.splice(controllerIndex, 1);
            io.to(room.host).emit("controller-disconnected", { id: socket.id });
            console.log(`Controller ${socket.id} removed from session ${pairCode}`);
            break;
          }
        }
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
