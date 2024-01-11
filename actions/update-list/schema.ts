import {z} from "zod";


export const updateListSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error:" Title is required"
    }).min(2,{
        message: "Title is too short",
    }),
    id: z.string(),
    boardId: z.string(),

})