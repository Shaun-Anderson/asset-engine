import ReactPDF from "@react-pdf/renderer";
import { z } from "zod";
import { createProtectedRouter } from "./context";
import sendgrid from "@sendgrid/mail";
import { TRPCError } from "@trpc/server";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export const InvoiceSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string(),
  due_date: z.date(),
  status: z.string().optional(),
  consume_worklogs: z.boolean(),
  expenses: z
    .object({
      description: z.string().min(1, { message: "Required" }),
      quantity: z.number(),
      cost: z.number(),
    })
    .array(),
  worklogs: z
    .object({
      id: z.string().min(1, { message: "Required" }),
      value: z.number(),
      rate: z.number().nullable(),
    })
    .array(),
});

// Example router with queries that can only be hit if the user requesting is signed in
export const invoiceRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx }) {
      return await ctx.prisma.invoice.findMany({ include: { client: true } });
    },
  })
  .query("getById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.invoice.findFirst({
        where: { id: input.id },
        include: { client: true },
      });
    },
  })
  .query("getForInvoice", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.invoice.findFirst({
        where: { id: input.id },
        include: { client: true, worklogs: true, expenses: true },
      });
    },
  })
  .query("getByClientId", {
    input: z.object({ clientId: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.invoice.findMany({
        where: { client_id: input.clientId },
        include: { client: true },
      });
    },
  })
  .mutation("create", {
    input: InvoiceSchema,
    async resolve({ ctx, input }) {
      // calc total costs
      const totalExpenseCost = input.expenses.reduce(
        (total, current) => (total += current.quantity * current.cost),
        0
      );

      if (input.consume_worklogs) {
        // add all valid worklogs to the invoice
        const validWorklogs = await ctx.prisma.worklog.findMany({
          where: { client_id: input.client_id, invoice_id: null },
        });
        input.worklogs = input.worklogs.concat(
          validWorklogs.map((x) => ({
            id: x.id,
            value: x.value,
            rate: x.rate,
          }))
        );
      }

      const totalWorklogCost = input.worklogs.reduce(
        (total, current) =>
          (total += (current.value / 3600.0) * (current?.rate ?? 0)),
        0
      );

      const newInvoice = {
        client_id: input.client_id,
        status: "Draft",
        due_date: input.due_date,
        consume_worklogs: input.consume_worklogs,
        expenses: {
          create: input.expenses,
        },
        worklogs: {
          connect: input.worklogs.map((x) => ({ id: x.id })) || [],
        },
        totalCost: totalExpenseCost + totalWorklogCost,
      };
      // await ctx.prisma.worklog.updateMany({where: {id: }, data: {invoice_id: }})
      return await ctx.prisma.invoice.create({
        data: {
          ...newInvoice,
        },
      });
    },
  })
  .mutation("insert_worklogs", {
    input: z.object({ invoice_id: z.string(), worklogs: z.string().array() }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.invoice.findFirst({
        where: { id: input.invoice_id },
      });
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "invoice not found.",
        });
      }

      return await ctx.prisma.invoice.update({
        where: { id: input.invoice_id },
        data: {
          worklogs: { connect: input.worklogs.map((x) => ({ id: x })) },
        },
      });
    },
  })
  // Send the invoice to the recipient and ensure
  .mutation("update_send", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.invoice.findFirst({
        where: { id: input.id },
      });
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "invoice not found.",
        });
      }

      //TODO: Render invoice to pdf
      // const pdfStream = await ReactPDF.renderToStream(<MyDocument />);

      // TODO: Send pdf using send grid
      try {
        console.log("BEFORE SEND");
        await sendgrid.send({
          to: "shaun.anderson@outlook.com",
          from: "shaun.anderson@outlook.com",
          subject: `GIG Invoice - ${data.id}`,
          html: `<div>You've got a mail</div>`,
        });
        console.log("SEND GRID SUCCESS ");
        return await ctx.prisma.invoice.update({
          where: { id: input.id },
          data: {
            status: "PENDING",
          },
        });
      } catch (error: any) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }
    },
  })
  .mutation("update_paid", {
    input: z.object({ id: z.string(), paid_date: z.date() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.invoice.update({
        where: { id: input.id },
        data: {
          status: "PAID",
          paid_date: input.paid_date,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      console.log(input.id);
      return await ctx.prisma.invoice.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
