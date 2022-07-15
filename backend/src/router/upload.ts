import express, { Request } from 'express';

import ash from "express-async-handler";
import multer from 'multer';

import UploadListener from "../listeners/upload";

import path from 'path';

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        cb(null, path.join(__dirname, '.././uploads/lobby/'))
        
    },
    filename: (req: Request, file: any, cb: any) => {
        const { originalname } = file;
        const extension = originalname.split('.').pop();
        const { room_name: roomName } = req.params;
        cb(null, `${roomName}-lobbysource.${extension}`)
    }
})

const upload = multer({ storage });

const router = express.Router();
router.post("/:room_name", upload.single('lobbysource'), ash(UploadListener.upload));
export default router;