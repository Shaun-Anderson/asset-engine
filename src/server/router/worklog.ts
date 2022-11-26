import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const WorklogSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().optional(),
  description: z.string(),
  value: z.number(),
  rate: z.number().optional(),
  recorded_at: z.date(),
});

// Example router with queries that can only be hit if the user requesting is signed in
export const worklogRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx }) {
      return await ctx.prisma.worklog.findMany({
        include: { client: true, invoice: true },
      });
    },
  })
  .query("get_paged", {
    input: z.object({ cursor: z.string().optional() }),
    async resolve({ ctx, input }) {
      const results = await ctx.prisma.worklog.findMany({
        take: 4,
        ...(input.cursor && {
          skip: 1,
        }),
        ...(input.cursor && {
          cursor: { id: input.cursor },
        }),
        orderBy: {
          id: "asc",
        },
      });
      const lastPostInResults = results[3];
      const cursor = lastPostInResults?.id ?? undefined;
      return { data: results, cursor };
    },
  })
  .query("getById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.worklog.findFirst({ where: { id: input.id } });
    },
  })
  .query("getByClientId", {
    input: z.object({ clientId: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.worklog.findMany({
        where: { client_id: input.clientId },
        include: { client: true },
      });
    },
  })
  .query("getByInvoice", {
    input: z.object({ invoice_id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.worklog.findMany({
        where: { invoice_id: input.invoice_id },
        // include: { invoice: true },
      });
    },
  })
  .query("getAvaliableForClient", {
    input: z.object({ clientId: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.worklog.findMany({
        where: { client_id: input.clientId, invoice_id: null },
      });
    },
  })
  .mutation("create", {
    input: WorklogSchema,
    async resolve({ ctx, input }) {
      const newInvoice = {
        user_id: ctx.session.user.id,
        client_id: input.client_id,
        description: input.description,
        recorded_at: input.recorded_at,
        value: input.value,
        rate: input.rate,
      };

      const consumingInvoice = await ctx.prisma.invoice.findFirst({
        where: { client_id: input.client_id, consume_worklogs: true },
      });

      return await ctx.prisma.worklog.create({
        data: {
          ...newInvoice,
          invoice_id: consumingInvoice?.id,
        },
      });
    },
  })
  .mutation("update", {
    input: WorklogSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.worklog.update({
        where: { id: input.id },
        data: {
          description: input.description,
          rate: input.rate,
          recorded_at: input.recorded_at,
          client_id: input.client_id,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.worklog.findFirst({
        where: { id: input.id },
      });
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Worklog not found.",
        });
      }
      if (data.invoice_id) {
        const invoice = await ctx.prisma.invoice.findFirst({
          where: { id: data.invoice_id },
        });

        if (invoice?.status != "Draft") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Worklog not cannot be delete, it is attached to a non draft invoice`,
          });
        }
      }

      return await ctx.prisma.worklog.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
