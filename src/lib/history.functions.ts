import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";

export type CookingHistoryRecord = Tables<"cooking_history">;

export const getCookingHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CookingHistoryRecord[]> => {
    const { data, error } = await context.supabase
      .from("cooking_history")
      .select("*")
      .eq("user_id", context.userId)
      .order("cooked_at", { ascending: false });
    if (error) throw new Error("Could not load cooking history");
    return data;
  });

const completionInput = z.object({
  recipeId: z.string().min(1).max(120),
  recipeName: z.string().trim().min(1).max(160),
  recipeImage: z.string().max(2048),
  servings: z.number().int().min(1).max(100),
  estimatedMinMinutes: z.number().int().positive().max(1000),
  estimatedMaxMinutes: z.number().int().positive().max(1000),
  completionKey: z.string().uuid(),
}).refine((value) => value.estimatedMaxMinutes >= value.estimatedMinMinutes, {
  message: "Maximum cooking time must be at least the minimum",
});

export const saveCookingHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: z.input<typeof completionInput>) => completionInput.parse(input))
  .handler(async ({ data, context }): Promise<{ record: CookingHistoryRecord; duplicate: boolean }> => {
    const { data: inserted, error } = await context.supabase
      .from("cooking_history")
      .insert({
        user_id: context.userId,
        recipe_id: data.recipeId,
        recipe_name: data.recipeName,
        recipe_image: data.recipeImage,
        servings: data.servings,
        estimated_min_minutes: data.estimatedMinMinutes,
        estimated_max_minutes: data.estimatedMaxMinutes,
        completion_key: data.completionKey,
        status: "Completed",
      })
      .select("*")
      .single();

    if (!error && inserted) return { record: inserted, duplicate: false };

    if (error?.code === "23505") {
      const { data: existing, error: readError } = await context.supabase
        .from("cooking_history")
        .select("*")
        .eq("user_id", context.userId)
        .eq("completion_key", data.completionKey)
        .single();
      if (!readError && existing) return { record: existing, duplicate: true };
    }
    throw new Error("Could not save this cooking activity");
  });

export const clearCookingHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ cleared: number }> => {
    const { data, error } = await context.supabase
      .from("cooking_history")
      .delete()
      .eq("user_id", context.userId)
      .select("id");
    if (error) throw new Error("Could not clear cooking history");
    return { cleared: data.length };
  });

export const updateDisplayName = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { displayName: string }) => z.object({
    displayName: z.string().trim().min(1, "Enter a display name").max(60, "Use 60 characters or fewer"),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: profile, error } = await context.supabase
      .from("profiles")
      .update({ display_name: data.displayName, updated_at: new Date().toISOString() })
      .eq("id", context.userId)
      .select("id, display_name, created_at, updated_at")
      .single();
    if (error) throw new Error("Could not update your display name");
    return profile;
  });
