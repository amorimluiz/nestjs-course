export const genSalt = jest.fn().mockImplementation(() => {
    return 'mockedSalt';
});

export const hash = jest.fn().mockImplementation((_password, _salt) => {
    return 'mockedHash';
});

export const compare = jest.fn().mockImplementation((_encrypted, _password) => {
    return true;
});

export default {
    genSalt,
    hash,
    compare
};