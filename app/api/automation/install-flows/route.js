import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kfydsuuelaxaffntdjxh.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey || "");

export async function POST(request) {
  try {
    // 1. Seed Templates
    const initialTemplates = [
      {
        name: "0machine — Welcome",
        subject: "⚙️ Welcome to 0machine — Your Laser Workshop Operating Hub",
        category: "welcome",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px; border-radius: 16px;">
            <h1 style="color: #FE7733;">Welcome to 0machine! ⚙️</h1>
            <p>Hi {{first_name}},</p>
            <p>Welcome to 0machine — the internal operating console built specifically for laser cutter & CNC workshop owners.</p>
            <p>With 0machine, you can calculate job costs accurately, track materials inventory, generate client quotes, and optimize laser nesting.</p>
            <a href="https://app.0machine.com" style="background: #FE7733; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 16px;">Launch Workshop Console →</a>
          </div>
        `
      },
      {
        name: "0machine — Introduction",
        subject: "💡 How 0machine saves 4+ hours per laser project",
        category: "educational",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px; border-radius: 16px;">
            <h2 style="color: #FE7733;">Streamline Your Laser Workshop</h2>
            <p>Hi {{first_name}},</p>
            <p>Did you know manual laser cost calculations often misjudge material waste by 25%?</p>
            <p>0machine automatically factors machine hourly rates, tube wear, power consumption, and material kerf loss in seconds.</p>
          </div>
        `
      },
      {
        name: "0machine — Why makers are switching",
        subject: "🚀 Why 1,000+ workshop owners use 0machine",
        category: "educational",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px;">
            <h2 style="color: #FE7733;">Built for Real Laser Makers</h2>
            <p>From CO2 lasers to Fiber CNCs, 0machine manages your full client lifecycle.</p>
          </div>
        `
      },
      {
        name: "0machine — Nest Introduction",
        subject: "🧩 Save 35% on sheet material with 0machine Nesting",
        category: "product_launch",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px;">
            <h2 style="color: #FE7733;">Optimize Material Yield</h2>
            <p>Hi {{first_name}}, stop wasting acrylic and plywood sheets. Use 0machine automatic nesting engine.</p>
          </div>
        `
      },
      {
        name: "0machine — Pro Offer",
        subject: "🎉 Exclusive 20% OFF 0machine Pro Workshop Upgrade",
        category: "promotional_offer",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px;">
            <h2 style="color: #FE7733;">Unlock Unlimited Workshop Power</h2>
            <p>Upgrade to 0machine Pro today and get 20% OFF your annual license.</p>
          </div>
        `
      },
      {
        name: "0machine — Feature Announcement",
        subject: "✨ New Feature: Automated Invoice Export & PDF Quotes",
        category: "announcement",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px;">
            <h2 style="color: #FE7733;">Professional Client Quotes</h2>
            <p>Generate styled PDF quotes directly for your laser customers in 1-click.</p>
          </div>
        `
      },
      {
        name: "0machine — Win Back",
        subject: "👋 We miss you at 0machine — New features added!",
        category: "re_engagement",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px;">
            <h2 style="color: #FE7733;">We've upgraded 0machine!</h2>
            <p>Hi {{first_name}}, come back and see what's new in the laser operating hub.</p>
          </div>
        `
      },
      {
        name: "0machine — Final Reminder",
        subject: "⏰ Final Hours: Your 0machine Pro discount expires tonight",
        category: "promotional_offer",
        body_html: `
          <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px;">
            <h2 style="color: #FE7733;">Don't miss out</h2>
            <p>Claim 20% off 0machine Pro before the offer expires.</p>
          </div>
        `
      }
    ];

    for (const t of initialTemplates) {
      const { data: existing } = await supabase
        .from("templates")
        .select("id")
        .eq("name", t.name)
        .single();
      if (!existing) {
        await supabase.from("templates").insert([t]);
      }
    }

    // 2. Seed Segments
    const initialSegments = [
      { name: "Free Users", description: "All contacts on free plan", is_system: true, rules: [{ field: "plan", operator: "equals", value: "free" }] },
      { name: "Pro Users", description: "Active 0machine Pro subscribers", is_system: true, rules: [{ field: "plan", operator: "equals", value: "pro" }] },
      { name: "Inactive 7 Days", description: "No activity in last 7 days", is_system: true, rules: [{ field: "last_activity_at", operator: "greater_than_days", value: 7 }] },
      { name: "Inactive 30 Days", description: "No activity in last 30 days", is_system: true, rules: [{ field: "last_activity_at", operator: "greater_than_days", value: 30 }] },
      { name: "Nest Users", description: "Users who used laser nesting tool", is_system: true, rules: [{ field: "used_nesting", operator: "equals", value: true }] },
      { name: "Calculator Users", description: "Users who used cost calculator", is_system: true, rules: [{ field: "used_calculator", operator: "equals", value: true }] }
    ];

    for (const seg of initialSegments) {
      const { data: existing } = await supabase
        .from("segments")
        .select("id")
        .eq("name", seg.name)
        .single();
      if (!existing) {
        await supabase.from("segments").insert([seg]);
      }
    }

    // 3. Seed Growth Workflows
    const growthFlows = [
      {
        name: "Welcome Flow",
        description: "Enrolls new 0machine signups with welcome sequence",
        trigger_type: "event",
        trigger_event: "user_signed_up",
        status: "draft"
      },
      {
        name: "Free → Pro Conversion",
        description: "Converts active free users to Pro with timed offer",
        trigger_type: "event",
        trigger_event: "used_calculator",
        status: "draft"
      },
      {
        name: "Inactive User Win-Back",
        description: "Re-engages users inactive for 7+ days",
        trigger_type: "event",
        trigger_event: "inactive_7_days",
        status: "draft"
      },
      {
        name: "Nest Onboarding Flow",
        description: "Introduces sheet material nesting capabilities",
        trigger_type: "event",
        trigger_event: "used_nesting",
        status: "draft"
      }
    ];

    let installedWorkflowsCount = 0;
    for (const flow of growthFlows) {
      const { data: existing } = await supabase
        .from("workflows")
        .select("id")
        .eq("name", flow.name)
        .single();

      if (!existing) {
        const { data: createdWf } = await supabase
          .from("workflows")
          .insert([flow])
          .select()
          .single();

        if (createdWf) {
          installedWorkflowsCount++;
          // Insert sample nodes & edges for visual builder
          await supabase.from("workflow_nodes").insert([
            { id: `node-trigger-${createdWf.id}`, workflow_id: createdWf.id, type: "trigger", data: { label: `Trigger: ${flow.trigger_event}` }, position_x: 250, position_y: 50 },
            { id: `node-email-${createdWf.id}`, workflow_id: createdWf.id, type: "action_email", data: { label: "Send Welcome Email", template: "0machine — Welcome" }, position_x: 250, position_y: 200 }
          ]);
          await supabase.from("workflow_edges").insert([
            { id: `edge-1-${createdWf.id}`, workflow_id: createdWf.id, source: `node-trigger-${createdWf.id}`, target: `node-email-${createdWf.id}` }
          ]);
        }
      }
    }

    // Log action
    await supabase.from("email_activity_logs").insert([{
      action: "INSTALL_GROWTH_FLOWS",
      description: `Installed 0machine Growth Flows (Templates, Segments & Workflows in DRAFT mode)`,
      metadata: { installed_workflows: installedWorkflowsCount }
    }]);

    return NextResponse.json({
      success: true,
      message: "0machine Growth Flows successfully installed in DRAFT mode.",
      installedWorkflows: installedWorkflowsCount
    });
  } catch (err) {
    console.error("[INSTALL GROWTH FLOWS ERROR]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
