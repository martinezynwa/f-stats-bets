import { User } from '../../database.types';
export type RegisterUserResponse = {
    text: string;
    createdUser: User;
};
export type UserWithName = {
    userId: string;
    name: string;
};
