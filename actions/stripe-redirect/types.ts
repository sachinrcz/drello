import {z} from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { StripeRedirectSchema } from "./schema";

export type InputType = z.infer<typeof StripeRedirectSchema>;
export type ReturnType = ActionState<InputType, String>;