import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../../enums/role.enum";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn({
        unsigned: true
    })
    id: number;

    @Column({type: 'text'})
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true
    })
    email: string;

    @Column({type: 'text'})
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @Column({
        nullable: true,
        default: null,
        type: 'date'
    })
    birthdate: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}