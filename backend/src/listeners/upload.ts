import { Request, Response } from "express";

class UploadListener{
  static async upload(req: Request, res: Response): Promise<void>{
    if (req.file) {
      const fileName = req.file.filename;
      return res.json({fileName}).end();
    }
    res.status(500).send({ message: "Missing request file" });
  }
}
export default UploadListener;
