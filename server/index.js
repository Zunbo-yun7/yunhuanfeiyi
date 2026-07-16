import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import homeRoutes from "./routes/home.js";
import aboutRoutes from "./routes/about.js";
import xintanRoutes from "./routes/xintan.js";
import actionsRoutes from "./routes/actions.js";
import equipmentRoutes from "./routes/equipment.js";
import peopleRoutes from "./routes/people.js";
import uploadRoutes from "./routes/upload.js";
import logsRoutes from "./routes/logs.js";
import aiRoutes from "./routes/ai.js";
import schedulesRoutes from "./routes/schedules.js";
import scheduleLocationsRoutes from "./routes/schedule-locations.js";
import scheduleCastRoutes from "./routes/schedule-cast.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Yingge API server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/xintan", xintanRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/schedules", schedulesRoutes);
app.use("/api/schedule-locations", scheduleLocationsRoutes);
app.use("/api/schedule-cast", scheduleCastRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "服务器内部错误" });
});

app.listen(PORT, () => {
    console.log(`Yingge API server is running on port ${PORT}`);
});

export default app;
