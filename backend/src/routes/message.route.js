import express from 'express';
import { ProtectRoute } from '../middleware/auth.middleware.js';
import { getUsersForChat , getMessages,sendMessage} from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users",ProtectRoute,getUsersForChat); //for specific user, we will get the list of users for chat
router.get("/:id",ProtectRoute,getMessages);//for specific user, we will get the messages of a particular friend
//protectRoute will already give the user which is loggedin
router.post("/send/:id",ProtectRoute,sendMessage); //for specific user, we will send the message to a particular friend

export default router;