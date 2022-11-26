import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { createProtectedRouter } from "./context";
import { TRPCError } from "@trpc/server";

export const ExpenseSchema = z.object({
  id: z.string().uuid().optional(),
  invoice_id: z.string(),
  description: z.string(),
  cost: z.number(),
  quantity: z.number(),
});

export const expenseRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx }) {
      return await ctx.prisma.expense.findMany({ include: { invoice: true } });
    },
  })
  .query("getById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.expense.findFirst({ where: { id: input.id } });
    },
  })
  .query("getByInvoice", {
    input: z.object({ invoice_id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.expense.findMany({
        where: { invoice_id: input.invoice_id },
        // include: { invoice: true },
      });
    },
  })
  .mutation("create", {
    input: ExpenseSchema,
    async resolve({ ctx, input }) {
      const newInvoice = {
        invoice_id: input.invoice_id,
        cost: input.cost,
        quantity: input.quantity,
        description: input.description,
      };
      // update invoice cost total
      await ctx.prisma.invoice.update({
        where: { id: input.invoice_id },
        data: { totalCost: { increment: input.quantity * input.cost } },
      });
      return await ctx.prisma.expense.create({
        data: {
          ...newInvoice,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.expense.findFirst({
        where: { id: input.id },
      });
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "expense not found.",
        });
      }

      // update invoice cost total
      await ctx.prisma.invoice.update({
        where: { id: data?.invoice_id },
        data: { totalCost: { decrement: data.quantity * data.cost } },
      });
      return await ctx.prisma.expense.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
