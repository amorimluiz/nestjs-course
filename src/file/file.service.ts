import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises";
import { join } from "path";

@Injectable()
export class FileService {

    public async upload(file: Express.Multer.File, path: string): Promise<void> {
        return writeFile(path, file.buffer);
    }
}