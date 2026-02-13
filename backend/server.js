const express = require("express");
const cors = require("cors");
const colors = require("colors");
const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const openApiSpec = require("./openapi.json");
const backendPackage = require("./package.json");
const ACTIONS = require("./Actions");
require("dotenv").config();
const http = require("http");
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const Space = require("./models/spaceSchema");
const User = require("./models/userSchema");
connectDB();

const port = process.env.PORT || 5000;
const versionedOpenApiSpec = {
  ...openApiSpec,
  info: {
    ...openApiSpec.info,
    version:
      backendPackage.version ||
      (openApiSpec.info && openApiSpec.info.version) ||
      "unknown",
  },
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).json({
    service: "CodeCollab Backend API",
    status: "ok",
    version: backendPackage.version || "unknown",
    docs: "/docs",
    openapi: "/openapi.json",
    routes: {
      users: "/users",
      spaces: "/spaces",
    },
    message: "Visit /docs for interactive API documentation.",
  });
});

app.get("/openapi.json", (req, res) => {
  res.json(versionedOpenApiSpec);
});

app.get("/docs", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CodeCollab API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #fafafa; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        persistAuthorization: true
      });
    </script>
  </body>
</html>`);
});

app.use("/spaces", require("./routes/spaceRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use(errorHandler);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const getSpaceRole = (space, userId) => {
  if (!userId) {
    return "viewer";
  }

  if (space.owner.toString() === userId.toString()) {
    return "owner";
  }

  const membership = (space.members || []).find(
    (entry) => entry.user.toString() === userId.toString()
  );

  return membership?.role || "viewer";
};

const canEditRole = (role) => role === "owner" || role === "editor";

const getTokenFromSocket = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) {
    return authToken;
  }

  const authHeader = socket.handshake.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

io.use(async (socket, next) => {
  try {
    const token = getTokenFromSocket(socket);

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select("_id name email");

      if (user) {
        socket.data.user = user;
      }
    }

    socket.data.spaceId = null;
    socket.data.role = "viewer";
    socket.data.activeName = null;
    socket.data.activeEmail = null;

    next();
  } catch (error) {
    // Fall back to anonymous read-only session.
    socket.data.user = null;
    socket.data.spaceId = null;
    socket.data.role = "viewer";
    socket.data.activeName = null;
    socket.data.activeEmail = null;
    next();
  }
});

io.on("connection", (socket) => {
  const user = socket.data.user;
  const isValidCodePayload = (payload) =>
    payload &&
    typeof payload.spaceId === "string" &&
    typeof payload.change === "string";

  const broadcastCodeChange = (actionName, payload = {}) => {
    if (!isValidCodePayload(payload)) {
      return;
    }

    if (!canEditRole(socket.data.role)) {
      return;
    }

    const { spaceId, change, seq, timestamp, origin, clientId } = payload;
    if (socket.data.spaceId !== spaceId) {
      return;
    }

    socket.broadcast.to(spaceId).emit(actionName, {
      change,
      seq: typeof seq === "number" ? seq : undefined,
      clientId: clientId || socket.id,
      origin: origin || "editor",
      timestamp: typeof timestamp === "number" ? timestamp : Date.now(),
      serverTimestamp: Date.now(),
    });
  };

  // User joins to space
  socket.on(ACTIONS.JOIN, async ({ spaceId, name }) => {
    try {
      if (!spaceId || typeof spaceId !== "string") {
        return;
      }

      const space = await Space.findOne({ spaceId }).select("owner members activeUsers");
      if (!space) {
        socket.emit("space-error", "Space does not exist");
        return;
      }

      if (socket.data.spaceId && socket.data.spaceId !== spaceId) {
        socket.leave(socket.data.spaceId);
      }

      socket.join(spaceId);
      socket.data.spaceId = spaceId;

      const role = getSpaceRole(space, user?._id);
      socket.data.role = role;

      const activeName = user?.name || (typeof name === "string" && name.trim()) || "Guest";
      const activeEmail = user?.email || `guest:${socket.id}`;
      socket.data.activeName = activeName;
      socket.data.activeEmail = activeEmail;

      await Space.findOneAndUpdate(
        { spaceId },
        { $pull: { activeUsers: { email: activeEmail } } }
      );

      const res = await Space.findOneAndUpdate(
        { spaceId },
        { $push: { activeUsers: { name: activeName, email: activeEmail } } },
        { returnDocument: "after" }
      );

      io.to(spaceId).emit(ACTIONS.JOINED, res.activeUsers);
    } catch (e) {
      socket.emit("space-error", "Unable to join space");
    }
  });

  // User leaves space
  socket.on(ACTIONS.LEAVE, async ({ spaceId }) => {
    try {
      const targetSpaceId = spaceId || socket.data.spaceId;
      if (!targetSpaceId || !socket.data.activeEmail) {
        return;
      }

      const res = await Space.findOneAndUpdate(
        { spaceId: targetSpaceId },
        { $pull: { activeUsers: { email: socket.data.activeEmail } } },
        { returnDocument: "after" }
      );

      if (res) {
        socket.broadcast.to(targetSpaceId).emit(ACTIONS.LEFT, {
          activeUsers: res.activeUsers,
          name: socket.data.activeName || "Guest",
        });
      }

      socket.leave(targetSpaceId);
      if (socket.data.spaceId === targetSpaceId) {
        socket.data.spaceId = null;
      }
    } catch (e) {
      socket.emit("space-error", "Unable to leave space");
    }
  });

  // CODE change
  socket.on(ACTIONS.CODE_CHANGE, (payload) => {
    broadcastCodeChange(ACTIONS.SYNC_CODE, payload);
  });

  socket.on(ACTIONS.CODE_CHANGE_V2, (payload) => {
    broadcastCodeChange(ACTIONS.SYNC_CODE_V2, payload);
  });

  socket.on(ACTIONS.FILE_METADATA_CHANGE, async ({ spaceId, fileLang, fileName }) => {
    if (!spaceId || socket.data.spaceId !== spaceId) {
      return;
    }

    if (!canEditRole(socket.data.role)) {
      return;
    }

    if (typeof fileLang !== "string" || typeof fileName !== "string") {
      return;
    }

    const space = await Space.findOne({ spaceId }).select("spaceData");
    if (!space || !space.spaceData?.[0]) {
      return;
    }

    space.spaceData[0].fileLang = fileLang;
    space.spaceData[0].fileName = fileName;
    await space.save();

    socket.broadcast
      .to(spaceId)
      .emit(ACTIONS.SYNC_FILE_METADATA, { fileName, fileLang });
  });

  socket.on(ACTIONS.RESYNC_REQUEST_V2, async ({ spaceId }) => {
    if (!spaceId || typeof spaceId !== "string") {
      return;
    }

    if (socket.data.spaceId !== spaceId) {
      return;
    }

    const space = await Space.findOne({ spaceId }).select("spaceData");
    if (!space || !space.spaceData?.[0]) {
      return;
    }

    socket.emit(ACTIONS.RESYNC_RESPONSE_V2, {
      spaceId,
      fileData: space.spaceData[0].fileData,
      fileLang: space.spaceData[0].fileLang,
      fileName: space.spaceData[0].fileName,
      serverTimestamp: Date.now(),
    });
  });

  socket.on("disconnect", async () => {
    try {
      if (!socket.data.spaceId || !socket.data.activeEmail) {
        return;
      }

      const res = await Space.findOneAndUpdate(
        { spaceId: socket.data.spaceId },
        { $pull: { activeUsers: { email: socket.data.activeEmail } } },
        { returnDocument: "after" }
      );

      if (res) {
        socket.broadcast.to(socket.data.spaceId).emit(ACTIONS.LEFT, {
          activeUsers: res.activeUsers,
          name: socket.data.activeName || "Guest",
        });
      }
    } catch (e) {
      // Intentionally ignored to avoid crashing disconnect flow.
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
