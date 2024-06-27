import { Provider } from "@nestjs/common";
import { FileService } from "../../src/file/file.service";

export const FileServiceMock: Provider = {
    provide: FileService,
    useValue: {
        upload: jest.fn()
    }
};
