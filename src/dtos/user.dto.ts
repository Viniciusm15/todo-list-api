import { UserDto } from "../models";

export type CreateUserDTO = Omit<UserDto, "id" | "createdAt" | "updatedAt">;
export type UserResponseDTO = Omit<UserDto, "password">;
