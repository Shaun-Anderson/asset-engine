// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { clientRouter } from "./client";
import { invoiceRouter } from "./invoice";
import { worklogRouter } from "./worklog";
import { expenseRouter } from "./expense";
import { userRouter } from "./user";
import { contractRouter } from "./contract";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("user.", userRouter)
  .merge("client.", clientRouter)
  .merge("invoice.", invoiceRouter)
  .merge("contract.", contractRouter)
  .merge("worklog.", worklogRouter)
  .merge("expense.", expenseRouter)
  .merge("auth.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
