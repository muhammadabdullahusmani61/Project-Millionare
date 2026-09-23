"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type DashboardActionResult = { ok: true } | { ok: false; error: string };

function todayInTimezone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function setDashboardTaskComplete(taskId: string, complete: boolean): Promise<DashboardActionResult> {
  if (!validId(taskId)) return { ok: false, error: "That task could not be identified." };

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return { ok: false, error: "Please sign in before updating tasks." };

  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", userId).maybeSingle<{ timezone: string }>();
  const completedOn = todayInTimezone(profile?.timezone || "UTC");

  if (complete) {
    const { error: completionError } = await supabase.from("task_completions").upsert({ user_id: userId, task_id: taskId, completed_on: completedOn }, { onConflict: "user_id,task_id,completed_on" });
    if (completionError) return { ok: false, error: "The task could not be marked complete. Please try again." };

    const { error: taskError } = await supabase.from("tasks").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", taskId).eq("user_id", userId);
    if (taskError) return { ok: false, error: "The completion was recorded, but the task status could not be updated." };
  } else {
    const { error: completionError } = await supabase.from("task_completions").delete().eq("user_id", userId).eq("task_id", taskId).eq("completed_on", completedOn);
    if (completionError) return { ok: false, error: "The task could not be reopened. Please try again." };

    const { error: taskError } = await supabase.from("tasks").update({ status: "planned", completed_at: null }).eq("id", taskId).eq("user_id", userId);
    if (taskError) return { ok: false, error: "The task history was updated, but the task could not be reopened." };
  }

  revalidatePath("/");
  return { ok: true };
}
