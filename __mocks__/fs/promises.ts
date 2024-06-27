// /c:/Users/luizf/Projects/nestjs/nestjs-course/api/__mocks__/fs/promises.ts

export const readFile = jest.fn();
export const writeFile = jest.fn();
export const appendFile = jest.fn();
export const deleteFile = jest.fn();

const fsPromises = {
    readFile,
    writeFile,
    appendFile,
    deleteFile,
};

export default fsPromises;