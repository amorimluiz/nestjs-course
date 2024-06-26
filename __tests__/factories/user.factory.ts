import { faker } from '@faker-js/faker';
import { User } from '../../src/user/entity/user.entity';


export class UserFactory {
    public static create(id: number): User {
        const user = new User();
        user.id = id;
        user.name = faker.person.fullName();
        user.email = faker.internet.email();
        user.password = faker.internet.password();
        user.role = faker.number.int({max: 1});
        user.birthdate = faker.date.birthdate();
        user.createdAt = faker.date.recent();
        user.updatedAt = faker.date.recent();

        return user;
    }

    public static createMany(count: number): User[] {
        const users: User[] = [];

        for (let i = 0; i < count; i++) {
            users.push(this.create(i + 1));
        }

        return users;
    }
}