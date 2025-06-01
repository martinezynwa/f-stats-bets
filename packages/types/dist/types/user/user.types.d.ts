import { User } from '../../database.types';
export type RegisterUserResponse = {
    text: string;
    createdUser: User;
};
