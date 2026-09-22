"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Plus } from "lucide-react";

import { createBlogCategory } from "@/lib/admin/actions";
import { CATEGORY_COLORS, categoryDot } from "@/lib/blog";
import type { BlogCategory } from "@/lib/content-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NEW_VALUE = "__new__";

/**
 * A category <select> plus an inline "+ New category" flow, so assigning a
 * post to a category it doesn't have yet is one step, not a trip to a
 * separate admin page.
 */
export function CategoryPicker({
  id,
  name,
  categories,
  value,
  onChange,
  onCategoryCreated,
}: {
  id?: string;
  name: string;
  categories: BlogCategory[];
  value: string;
  onChange: (name: string) => void;
  onCategoryCreated: (category: BlogCategory) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = categories.find(
    (c) => c.name.toLowerCase() === value.toLowerCase(),
  );
  // A category assigned on the post but since renamed/deleted elsewhere:
  // keep it selectable rather than silently dropping the value.
  const isUnknownValue = value !== "" && !selected;

  function submitNewCategory() {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const data = new FormData();
      data.set("name", trimmed);
      data.set("color", newColor);
      const result = await createBlogCategory(data);
      if (result.error || !result.id) {
        setError(result.error ?? "Could not create category.");
        return;
      }
      onCategoryCreated({
        id: result.id,
        name: trimmed,
        color: newColor,
        sortOrder: categories.length,
      });
      onChange(trimmed);
      setCreating(false);
      setNewName("");
      setNewColor(CATEGORY_COLORS[0]);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "size-2.5 shrink-0 rounded-full",
            selected || value ? categoryDot(selected?.color) : "bg-transparent",
          )}
        />
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => {
            if (event.target.value === NEW_VALUE) {
              setCreating(true);
              return;
            }
            onChange(event.target.value);
          }}
          className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm"
        >
          <option value="">Uncategorized</option>
          {isUnknownValue ? <option value={value}>{value}</option> : null}
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
          <option value={NEW_VALUE}>+ New category…</option>
        </select>
      </div>

      {creating ? (
        <div className="border-input bg-muted/20 space-y-3 rounded-lg border p-3">
          <Input
            autoFocus
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Category name"
            className="h-9"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitNewCategory();
              }
              if (event.key === "Escape") {
                setCreating(false);
                setError(null);
              }
            }}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`${color} swatch`}
                aria-pressed={newColor === color}
                onClick={() => setNewColor(color)}
                className={cn(
                  "ring-offset-background size-6 rounded-full transition-shadow",
                  categoryDot(color),
                  newColor === color
                    ? "ring-foreground ring-2 ring-offset-2"
                    : "opacity-70 hover:opacity-100",
                )}
              />
            ))}
          </div>
          {error ? <p className="text-destructive text-xs">{error}</p> : null}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={submitNewCategory}
            >
              {pending ? <LoaderCircle className="animate-spin" /> : <Plus />}
              Add category
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setCreating(false);
                setError(null);
                setNewName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
