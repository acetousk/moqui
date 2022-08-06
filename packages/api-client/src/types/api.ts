import { Context } from './context';
import { Store } from './models/store';
import { AxiosResponseHeaders } from 'axios';
import { User } from './models/user';

/*
    getStore
*/
export interface GetStoreParams {
    productStoreId?: string;
}

export type GetStoreResponse = Store;

/*
    Register
*/
export interface RegisterUserParams {
    emailAddress: string;
    firstName: string;
    lastName: string;
    password: string;
}
export type RegisterUserReponse = User;

/*
    Login
*/
export interface LoginUserParams {
    username: string;
    password: string;
}
export type LoginUserResponse = User;

/*
    Logout
*/
export type LogoutUserParams = Record<string, never>;
export type LogoutUserResponse = Record<string, never>;

/*
    Load
*/
export type LoadUserParams = Record<string, never>;
export type LoadUserResponse = User;

export type Endpoints = {
    getStore: (context: Context, params: GetStoreParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: GetStoreResponse
    }>,
    registerUser: (context: Context, params: RegisterUserParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: RegisterUserReponse
    }>,
    loginUser: (context: Context, params: LoginUserParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: LoginUserResponse
    }>,
    logoutUser: (context: Context, params: LogoutUserParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: LogoutUserResponse
    }>
    loadUser: (context: Context, params: LoadUserParams) => Promise<{
        headers: AxiosResponseHeaders,
        data: LoadUserResponse
    }>
}
