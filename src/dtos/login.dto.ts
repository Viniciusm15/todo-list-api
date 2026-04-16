import { UserDto } from "../models";

export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    token: string;
    user: Omit<UserDto, "password">;
}
