import z from "zod";

export const memberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),
  joined_date: z.string().optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

