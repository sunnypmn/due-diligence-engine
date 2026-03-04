import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { UserInput } from "../../../lib/schemas/input";
import type { FinalScore } from "../../../lib/schemas/module";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const { email, input, score }: { email: string; input: UserInput; score: FinalScore } =
      await request.json();

    if (!email || !input || !score) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Store essential fields in Stripe metadata (500 char limit per value)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 9900, // $99.00
            product_data: {
              name: "Validate.ai Business Plan",
              description: `Full business plan for: ${input.idea_name}`,
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/`,
      metadata: {
        email,
        idea_name: input.idea_name.slice(0, 480),
        description: input.description.slice(0, 480),
        target_customer: input.target_customer.slice(0, 480),
        customer_pain: input.customer_pain.slice(0, 480),
        business_model: input.business_model,
        target_geo: input.target_geo.slice(0, 480),
        planned_pricing: (input.planned_pricing || "").slice(0, 480),
        timeline_months: String(input.timeline_months),
        budget_range: (input.budget_range || "").slice(0, 480),
        score_weighted: String(score.weighted_score),
        score_grade: score.grade,
        score_letter: score.letter_grade,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
