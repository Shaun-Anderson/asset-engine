import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const endpointSecret =
  "whsec_95dfecab0397952771f311ed09463f8f304915f2c26bb93eec72a592cbb0e8d9"; // YOUR ENDPOINT SECRET copied from the Stripe CLI start-up earlier, should look like 'whsec_xyz123...'

export const config = {
  api: {
    bodyParser: false, // don't parse body of incoming requests because we need it raw to verify signature
  },
};

const prisma = new PrismaClient();

const StripeWebhooks = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const requestBuffer = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2022-08-01",
    });

    let event;

    try {
      // Use the Stripe SDK and request info to verify this Webhook request actually came from Stripe
      event = stripe.webhooks.constructEvent(
        requestBuffer.toString(), // Stringify the request for the Stripe library
        sig,
        endpointSecret
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook signature verification failed.`);
    }

    // Handle the event
    switch (event.type) {
      // Handle successful subscription creation
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        if (
          subscription.status === "unpaid" ||
          subscription.status === "canceled"
        )
          await prisma.user.update({
            where: {
              stripeCustomerId: subscription.customer as string,
            },
            data: {
              isActive: false,
            },
          });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(subscription.customer);
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            isActive: false,
          },
        });
        break;
      }
      case "invoice.paid": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            isActive: true,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
        break;
      }
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            isActive: true,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
        break;
      }
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    // Return a 500 error
    console.log(err);
    res.status(500).end();
  }
};
export default StripeWebhooks;
