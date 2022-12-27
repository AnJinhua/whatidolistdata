import { PrismaClient, Room, User } from '@prisma/client'
import { Request, Response } from 'express';
const { HOST, COHOST, SPEAKER, AUDIENCE } = require("../constants");

const prisma = new PrismaClient()


const getRoom = async (req: Request, res: Response) => {
  try {
    const room = await prisma.room.findUnique({ where: { id: req.params.id } });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    return res.status(200).json(await reformatRoom(room));
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getRooms = async (req: Request, res: Response) => {
  let rooms;
  try {
    let { limit = '20', cursor, isLive, isPrivate, recorded, orderBy = 'desc' } = req.query;

    if (orderBy !== undefined && orderBy !== 'asc' && orderBy !== 'desc') {
      return res.status(400).json({ error: 'Invalid order by value' });
    }

    const rooms = await prisma.room.findMany({
      skip: cursor ? 1 : 0,
      take: parseInt(limit as string),
      where: {
        ...(typeof isPrivate !== 'undefined') && { isPrivate: isPrivate === 'true' },
        OR: [
          { ...(typeof isLive !== 'undefined') && { isLive: isLive === 'true' } },
          { ...(typeof recorded !== 'undefined') && { recordingUrl: recorded === "true" ? { not: "" } : "" } }, //if recorded is true, then recordingUrl should not be empty 
        ]
      },
      orderBy: {
        createdAt: orderBy === 'asc' ? 'asc' : 'desc',
      },
      cursor: cursor ? { id: cursor as string } : undefined,
    });

    const reformatRoomPromises = rooms.map((room) => {
      return reformatRoom(room);
    });

    const newCursor = rooms.length > 0 ? rooms[rooms.length - 1].id : null;

    const reformattedRooms = await Promise.all(reformatRoomPromises);
    return res.status(200).json({
      count: rooms.length,
      cursor: newCursor,
      data: reformattedRooms,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
};

const createRoom = async (req: Request, res: Response) => {
  interface participantReq {
    id: string
    role: string
  }

  try {
    const { title, topics, isPrivate, participants } = req.body as { title: string, topics: string[], participants: participantReq[], isPrivate: boolean };
    const room = await prisma.room.create({ data: { title, topics, participants: participants.map((participant) => participant.id), isPrivate } });

    const userRole = await prisma.userRole.createMany({ data: participants.map((participant) => ({ userId: participant.id, roomId: room.id, role: participant.role })) });
    const roomWithParticipants = (await prisma.room.findUnique({ where: { id: room.id } })) as Room;

    res.status(200).json(await reformatRoom(roomWithParticipants));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const updateRoom = async (req: Request, res: Response) => {
  try {
    const room = await prisma.room.update({ where: { id: req.params.id }, data: req.body });
    res.status(200).json(await reformatRoom(room));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

interface RoomParticipantReq {
  id: string
  role: string
}


const addParticipants = async (roomId: string, newParticipants: RoomParticipantReq[]) => {
  const room = await prisma.room.update({
    where: { id: roomId },
    data: {
      participants: {
        push: newParticipants.map((participant) => participant.id),
      }
    }
  });

  const userRoles = await prisma.userRole.createMany({ data: newParticipants.map((participant) => ({ userId: participant.id, roomId, role: participant.role })) });

  return reformatRoom(room);
};

const removeParticipants = async (roomId: string, participantsToRemove: string[]) => {
  const { participants } = (await prisma.room.findUnique({ where: { id: roomId } })) as Room;

  const room = await prisma.room.update({
    where: { id: roomId },
    data: {
      participants: {
        set: participants.filter((participant) => !participantsToRemove.includes(participant)),
      }
    }
  });

  return reformatRoom(room);
};

const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await prisma.room.delete({ where: { id: req.params.id } });
    res.status(200).json(await reformatRoom(room));
  } catch (err) {
    res.status(500).json(err);
  }
};

async function reformatRoom(room: Room) {
  let participants = {
    hosts: [] as User[],
    speakers: [] as User[],
    otherUsers: [] as User[],
  };

  const users = await prisma.user.findMany({ where: { id: { in: room.participants } } });

  for (let user of users) {

    try {
      const role = (await fetchUserRole(user.id, room.id)) as string;
      switch (role) {
        case HOST:
          participants.hosts.push(user);
          break;
        case COHOST:
          participants.hosts.push(user);
          break;
        case SPEAKER:
          participants.speakers.push(user);
          break;
        case AUDIENCE:
          participants.otherUsers.push(user);
          break;
        default:
          participants.otherUsers.push(user);
      }
    } catch (err) {
      console.log(err);

    }
  }

  let reformattedRoom = { ...room, ...participants };
  //@ts-ignore
  delete reformattedRoom.participants;

  return reformattedRoom;
}

interface UserFromMainDb {
  id: string;
  firstName: string,
  lastName: string,
  profileImage: string,
  email: string,
  summary: string,
}

interface FullUser extends UserFromMainDb {
  peerId?: string,
  role: string,
}



async function fetchUserRole(userId: string, roomId: string): Promise<string | undefined> {
  const userRole = await prisma.userRole.findFirst({ where: { userId, roomId } });
  return userRole?.role;
}

// exports.uploadS3 = async (req: Request, res: Response) => {
//   try {
//     console.log("file request", req.files);
//     console.log("request body", req.body);

//     const uploadedFile = req.files.file[0];
//     const roomId = req.body.roomId;
//     console.log(`uploaded file roomId ${roomId}`, uploadedFile);

//     if (!uploadedFile) {
//       res.status(401).json({
//         status: false,
//         message: "File not uploaded",
//       });
//     } else {
//       const resData = {
//         location: uploadedFile.location,
//         key: uploadedFile.key,
//         cdnUrl: MEDIA_CDN_URL + "audioRoomRecording/" + uploadedFile.key,
//       };

//       //update recoding url
//       const room = await Rooms.findByIdAndUpdate(
//         roomId,
//         { recordingUrl: resData.cdnUrl },
//         {
//           new: true,
//         }
//       );

//       res.status(200).json(resData);
//     }
//   } catch (err) {
//     console.log("error uploading file", err);
//     res.status(500).json(err);
//   }
// };


// every 5 minutes check if theres a live room without a ping in the last 5 minutes and update to false
const checkLiveRooms = () => {
  console.log(
    "[ROOMS] setinterval to check abandoned rooms every 5 minutes"
  );
  setInterval(async () => {
    try {
      const currentTime = new Date();
      const fourMinutesAgo = new Date(currentTime.setMinutes(currentTime.getMinutes() - 5));
      console.log("currentDate " + currentTime)
      console.log("fourMinutesAgo " + fourMinutesAgo)

      const rooms = await prisma.room.updateMany({
        where: {
          AND: [
            { isLive: true },
            {
              lastPing: {
                lte: fourMinutesAgo
              }
            }
          ]
        }, data: { isLive: false }
      });


      console.log("rooms with no active ping after 5 minutes", rooms);
    } catch (err) {
      console.log("error in check live rooms", err);
    }
  }, 300000); // 5 minutes 3000000 milliseconds
};

const pingRoom = async (roomId: string) => {
  try {
    const room = await prisma.room.update({ where: { id: roomId }, data: { lastPing: new Date() } })
  } catch (err) {
    console.log(
      `[CONTROLLERS]:[AUDIOROOM] error piniging room ${roomId} ${Date.now()}`,
      err
    );
  }
};

export default {
  getRoom,
  getRooms,
  updateRoom,
  createRoom,
  deleteRoom,
  addParticipants,
  removeParticipants,
  checkLiveRooms,
  pingRoom
};