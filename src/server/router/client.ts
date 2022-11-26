import { z } from "zod";
import { createProtectedRouter } from "./context";

export const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().max(50),
  email: z.string().optional(),
  company: z.string().optional(),
  number: z.string().optional(),
});

// Example router with queries that can only be hit if the user requesting is signed in
export const clientRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx }) {
      return await ctx.prisma.client.findMany({ include: { invoices: true } });
    },
  })
  .query("getById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.client.findFirst({ where: { id: input.id } });
    },
  })
  .mutation("create", {
    input: ClientSchema,
    async resolve({ ctx, input }) {
      const newClient = {
        name: input.name,
        company: input.company,
        email: input.email,
        number: input.number,
      };
      return await ctx.prisma.client.create({
        data: {
          ...newClient,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.client.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
