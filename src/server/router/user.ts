import { z } from "zod";
import { createProtectedRouter } from "./context";

export const userRouter = createProtectedRouter().mutation("update_theme", {
  input: z.object({ id: z.string(), dark_mode: z.boolean() }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.user.update({
      where: { id: input.id },
      data: { dark_mode: input.dark_mode },
    });
  },
});
