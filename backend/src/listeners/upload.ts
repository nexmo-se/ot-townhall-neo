import { Request, Response } from "express";

class UploadListener{
  static async upload(req: Request, res: Response): Promise<void>{
    const fileName = req.file.filename;
    return res.json({fileName}).end();
  }
}
export default UploadListener;
