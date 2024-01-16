import {z} from "zod";


export const DeleteListSchema = z.object({
    id: z.string(),
    boardId: z.string(),

})