import { TestingModule, Test } from "@nestjs/testing";
import { FileService } from "../../../src/file/file.service";
import { writeFile } from "fs/promises";

jest.mock('fs/promises');

describe('file service suite', () => {
    let fileService: FileService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileService
            ]
        }).compile();

        fileService = module.get<FileService>(FileService);
    });

    it('should upload a file', async () => {
        // Arrange
        const file = {
            buffer: 'mockedBuffer'
        } as any;
        const path = 'mockedPath';

        // Act
        await fileService.upload(file, path);

        // Assert
        expect(writeFile).toHaveBeenCalledWith(path, file.buffer);
    });

});