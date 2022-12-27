
import express from 'express'
import LiveoomsController from './controllers/audioRooms'
import RecordingsController from './controllers/recordings'
import NotificationsController from './controllers/notifications'

const liveRoomRoutes = express.Router()
const recordingsRoutes = express.Router()
const notificationsRoutes = express.Router()

//ROOMS
liveRoomRoutes.get("/:id", LiveoomsController.getRoom);
liveRoomRoutes.get('/', LiveoomsController.getRooms);
liveRoomRoutes.put("/:id", LiveoomsController.updateRoom);
liveRoomRoutes.post('/', LiveoomsController.createRoom);
liveRoomRoutes.delete("/:id", LiveoomsController.deleteRoom);


//RECORDINGS
recordingsRoutes.post('/upload', RecordingsController.uploadRecording);

//notifications
notificationsRoutes.post('/emailInvite', NotificationsController.sendInviteEmail);

export {
    liveRoomRoutes,
    recordingsRoutes,
    notificationsRoutes
}

