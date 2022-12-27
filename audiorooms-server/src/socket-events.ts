import { Server, Socket } from "socket.io";
import AudioRoomController from "./controllers/audioRooms";
import { PrismaClient, Room, User } from '@prisma/client'

const prisma = new PrismaClient();


//register callbacks for audiocalls received/rejected
const inviteToCallCallbacks: { [key: string]: any } = {};

export const setupWebSocketListeners = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('[SOCKET.IO] New connection', socket.id);

        socket.on("user-joined-audio-room", async ({ roomId, user, role }) => {
            console.log(`[SOCKET.IO]: User joined room ${roomId}`, user);
            socket.join(roomId);
            io.in(roomId).emit("user-joined-audio-room", user);

            console.log("updating participants");
            AudioRoomController.addParticipants(roomId, [{ id: user.id, role }]);
            console.log("updated participants");

        });

        socket.on("user-left-audio-room", async ({ roomId, userId, closeRoom }) => {
            console.log("user left audio  room id " + roomId + " user id " + userId);
            try {
                if (closeRoom) {
                    socket.to(roomId).emit("room-closed");
                    const updatedRoom = await prisma.room.update({ where: { id: roomId }, data: { isLive: false } });

                } else {
                    socket.to(roomId).emit("user-left-audio-room", userId);
                    AudioRoomController.removeParticipants(roomId, [userId]);
                }
            } catch (error) {
                console.log("[AUDIOROOMS]:[USER-LEFT-AUDIO-ROOM]", error);
            }
        });

        socket.on("host-created-audio-room", (room) => {
            socket.join(room._id);
        });

        socket.on("raise-hand", ({ _id, roomId }) => {
            io.in(roomId).emit("raise-hand", { _id });
        });

        socket.on("unraise-hand", ({ _id, roomId }) => {
            io.in(roomId).emit("unraise-hand", { _id });
        });

        // socket.on("peer_online", async ({ userId, peerId }) => {
        //     try {
        //         const response =
        //             await require("./controllers/experts").updateAudioCallUser(userId, {
        //                 peerId,
        //             });

        //         if (response instanceof Error) {
        //             throw response;
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     }
        // });

        socket.on("user-mute-audio", ({ _id, roomId, isMuted }) => {
            io.in(roomId).emit("user-mute-audio", { _id, isMuted });
        });

        socket.on("update-user-role", async ({ userId, roomId, role }) => {
            console.log(`${userId} room ${roomId} role ${role}`);

            const response = await prisma.userRole.updateMany({ where: { userId, roomId }, data: { role } });
            io.in(roomId).emit("update-user-role", { userId, role });
        });

        socket.on(
            "invite-to-call",
            async ({ hostId, recepientId, room, role }, callback) => {

                const user = await prisma.user.findUnique({ where: { id: recepientId }, select: { socketId: true } });

                if (!user) {
                    console.log("user not found");
                    return;
                }

                console.log(
                    `invite to call user ${recepientId} socketid ${user?.socketId} room ${room.title}`
                );
                const callId = `${hostId}-${recepientId}-${Date.now()}`;
                inviteToCallCallbacks[callId] = callback; //todo add typing for this. Infact for the entire websockets service
                console.log("Callbacks", inviteToCallCallbacks);
                io.to(user?.socketId as string).emit("invite-to-call", { room, role, callId });
            }
        );

        socket.on("call-response", ({ callId, status }) => {
            const callback = inviteToCallCallbacks[callId];
            console.log(`call response for callid ${callId} response ${status}`);
            console.log(`callbacks`, inviteToCallCallbacks);
            callback({ status });
            delete inviteToCallCallbacks[callId];
        });

        socket.on("ping-room", ({ roomId }) => {
            try {
                AudioRoomController.pingRoom(roomId);
            } catch (err) {
                console.log(
                    `[SOCKETS]:[PING-ROOM] error pining room ${roomId}, {Date.now()}`,
                    err
                );
            }
        });

        socket.on("user-ready", async ({ socketId, userId }) => {
            console.log(`user ${userId} socket ${socketId} is ready`);
            try {
                const user = await prisma.user.update({ where: { id: userId }, data: { socketId } });

                if (!user) {
                    throw `user ${userId} not found`;
                }
            } catch (e) {
                console.log(e);
            }
        });

    });
}
