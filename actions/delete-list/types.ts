import {z} from "zod";
import { List } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteListSchema } from "./schema";

export type InputType = z.infer<typeof DeleteListSchema>;
export type ReturnType = ActionState<InputType, List>;