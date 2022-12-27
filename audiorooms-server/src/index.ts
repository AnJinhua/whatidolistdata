// //@ts-nocheck
// import { Prisma, PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { PORT, WEBSITE_URL } from './config'
import express from 'express'
import cors from 'cors'
import http from 'http';
import bodyParser from 'body-parser';
import { Server, Socket } from "socket.io";
import { liveRoomRoutes, recordingsRoutes, notificationsRoutes } from "./routes"
import AudioRoomController from "./controllers/audioRooms"
import { AddressInfo } from 'node:net';
import { setupWebSocketListeners } from './socket-events';

const jsonParser = bodyParser.json()
const app = express()
const httpServer = http.createServer(app);

export const corsOptions = {
  origin: WEBSITE_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/rooms", jsonParser, liveRoomRoutes);
app.use("/recordings", jsonParser, recordingsRoutes);
app.use("/notifications", jsonParser, notificationsRoutes);

const io = new Server(httpServer, { cors: corsOptions });
setupWebSocketListeners(io);


httpServer.listen(PORT, () => {
  const address = httpServer.address() as AddressInfo;
  console.log(`AudioRooms Server ready at: ${address.address}:${address.port}`);
});

AudioRoomController.checkLiveRooms();
