export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
