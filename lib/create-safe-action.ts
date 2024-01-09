import {z} from "zod";

export type FieldErrors<T>  = {
    [K in keyof T]?: string[];
}

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error? : string | null;
    data?: TOutput;
}