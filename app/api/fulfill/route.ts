import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateBusinessPlan } from "../../../lib/businessplan";
import { sendBusinessPlanEmail } from "../../../lib/email";
import type { UserInput } from "../../../lib/schemas/input";
import type { FinalScore } from "../../../lib/schemas/module";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();
    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Verify payment
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const m = session.metadata!;

    const input: UserInput = {
      idea_name: m.idea_name,
      description: m.description,
      target_customer: m.target_customer,
      customer_pain: m.customer_pain,
      business_model: m.business_model as UserInput["business_model"],
      target_geo: m.target_geo,
      planned_pricing: m.planned_pricing || undefined,
      timeline_months: parseInt(m.timeline_months),
      budget_range: m.budget_range || undefined,
    };

    const score: FinalScore = {
      weighted_score: parseInt(m.score_weighted),
      grade: m.score_grade as FinalScore["grade"],
      confidence: "Medium",
      risk_deduction: 0,
      top_reasons: [],
      top_risks: [],
    };

    // Generate business plan
    const businessPlan = await generateBusinessPlan(input, score);

    // Email it
    const email = m.email || session.customer_email!;
    await sendBusinessPlanEmail(email, m.idea_name, businessPlan);

    return NextResponse.json({ success: true, email });
  } catch (err) {
    console.error("Fulfill error:", err);
    const message = err instanceof Error ? err.message : "Fulfillment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
