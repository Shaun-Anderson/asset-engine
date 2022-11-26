import ReactPDF from "@react-pdf/renderer";
import { z } from "zod";
import { createProtectedRouter } from "./context";
import sendgrid from "@sendgrid/mail";
import { TRPCError } from "@trpc/server";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export const ContractSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string(),
  rate: z.number(),
  status: z.string().optional(),
});

// Example router with queries that can only be hit if the user requesting is signed in
export const contractRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx }) {
      return await ctx.prisma.contract.findMany({ include: { client: true } });
    },
  })
  .query("getById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.contract.findFirst({
        where: { id: input.id },
        include: { client: true },
      });
    },
  })
  .query("getByClientId", {
    input: z.object({ clientId: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.contract.findMany({
        where: { client_id: input.clientId },
        include: { client: true },
      });
    },
  })
  .mutation("create", {
    input: ContractSchema,
    async resolve({ ctx, input }) {
      const newContract = {
        client_id: input.client_id,
        status: "Draft",
        rate: input.rate,
      };
      // await ctx.prisma.worklog.updateMany({where: {id: }, data: {contract_id: }})
      return await ctx.prisma.contract.create({
        data: {
          ...newContract,
        },
      });
    },
  })
  // Send the contract to the recipient and ensure
  .mutation("update_send", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.contract.findFirst({
        where: { id: input.id },
      });
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "contract not found.",
        });
      }

      //TODO: Render contract to pdf
      // const pdfStream = await ReactPDF.renderToStream(<MyDocument />);

      // TODO: Send pdf using send grid
      try {
        console.log("BEFORE SEND");
        await sendgrid.send({
          to: "shaun.anderson@outlook.com",
          from: "shaun.anderson@outlook.com",
          subject: `GIG Contract - ${data.id}`,
          html: `<div>You've got a mail</div>`,
        });
        console.log("SEND GRID SUCCESS ");
        return await ctx.prisma.contract.update({
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
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      console.log(input.id);
      return await ctx.prisma.contract.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
