"use client";

import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createBlogCategory,
  deleteBlogCategory,
  moveBlogCategory,
  renameBlogCategory,
} from "@/lib/admin/actions";
import { CATEGORY_COLORS, categoryDot } from "@/lib/blog";
import type { BlogCategory } from "@/lib/content-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function ColorSwatches({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`${color} swatch`}
          aria-pressed={value === color}
          onClick={() => onChange(color)}
          className={cn(
            "ring-offset-background size-6 rounded-full transition-shadow",
            categoryDot(color),
            value === color
              ? "ring-foreground ring-2 ring-offset-2"
              : "opacity-70 hover:opacity-100",
          )}
        />
      ))}
    </div>
  );
}

function AddCategoryForm({
  onCreated,
  nextSortOrder,
}: {
  onCreated: (category: BlogCategory) => void;
  nextSortOrder: number;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const data = new FormData();
      data.set("name", trimmed);
      data.set("color", color);
      const result = await createBlogCategory(data);
      if (result.error || !result.id) {
        setError(result.error ?? "Could not create category.");
        return;
      }
      onCreated({
        id: result.id,
        name: trimmed,
        color,
        sortOrder: nextSortOrder,
        postCount: 0,
      });
      setName("");
      setColor(CATEGORY_COLORS[0]);
    });
  }

  return (
    <div className="border-border bg-card space-y-3 rounded-2xl border p-4 sm:p-5">
      <h2 className="text-sm font-medium">New category</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Travel"
          className="h-10 sm:max-w-64"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
        />
        <ColorSwatches value={color} onChange={setColor} />
        <Button
          type="button"
          size="sm"
          className="sm:ml-auto"
          disabled={pending}
          onClick={submit}
        >
          {pending ? <LoaderCircle className="animate-spin" /> : <Plus />}
          Add category
        </Button>
      </div>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}

function CategoryRow({
  category,
  isFirst,
  isLast,
  onRenamed,
  onDeleted,
  onMoved,
}: {
  category: BlogCategory;
  isFirst: boolean;
  isLast: boolean;
  onRenamed: (id: string, name: string, color: string) => void;
  onDeleted: (id: string) => void;
  onMoved: (id: string, direction: "up" | "down") => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [movePending, startMove] = useTransition();

  function saveRename() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const data = new FormData();
      data.set("id", category.id);
      data.set("name", trimmed);
      data.set("color", color);
      const result = await renameBlogCategory(data);
      if (result.error) {
        setError(result.error);
        return;
      }
      onRenamed(category.id, trimmed, color);
      setEditing(false);
    });
  }

  function remove() {
    const count = category.postCount ?? 0;
    const warning =
      count > 0
        ? `Delete "${category.name}"? ${count} ${count === 1 ? "post" : "posts"} using it will become Uncategorized.`
        : `Delete "${category.name}"?`;
    if (!window.confirm(warning)) return;
    startTransition(async () => {
      const data = new FormData();
      data.set("id", category.id);
      const result = await deleteBlogCategory(data);
      if (result.error) {
        setError(result.error);
        return;
      }
      onDeleted(category.id);
    });
  }

  function move(direction: "up" | "down") {
    startMove(async () => {
      const data = new FormData();
      data.set("id", category.id);
      data.set("direction", direction);
      const result = await moveBlogCategory(data);
      if (result.error) {
        setError(result.error);
        return;
      }
      onMoved(category.id, direction);
    });
  }

  if (editing) {
    return (
      <li className="border-border bg-muted/20 space-y-3 rounded-xl border p-3 sm:p-4">
        <Input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-9"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              saveRename();
            }
            if (event.key === "Escape") {
              setEditing(false);
              setName(category.name);
              setColor(category.color);
              setError(null);
            }
          }}
        />
        <ColorSwatches value={color} onChange={setColor} />
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={saveRename}
          >
            {pending ? <LoaderCircle className="animate-spin" /> : null}
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditing(false);
              setName(category.name);
              setColor(category.color);
              setError(null);
            }}
          >
            <X />
            Cancel
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="border-border flex items-center gap-3 rounded-xl border p-3 sm:p-4">
      <div className="flex flex-col">
        <button
          type="button"
          aria-label="Move up"
          disabled={isFirst || movePending}
          onClick={() => move("up")}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Move down"
          disabled={isLast || movePending}
          onClick={() => move("down")}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
      <span
        aria-hidden
        className={cn(
          "size-3 shrink-0 rounded-full",
          categoryDot(category.color),
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{category.name}</p>
        <p className="text-muted-foreground text-xs">
          {category.postCount ?? 0}{" "}
          {(category.postCount ?? 0) === 1 ? "post" : "posts"}
        </p>
        {error ? (
          <p className="text-destructive mt-1 text-xs">{error}</p>
        ) : null}
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setEditing(true)}
      >
        <Pencil />
        Rename
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={remove}
      >
        {pending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
      </Button>
    </li>
  );
}

export function CategoryManager({
  categories: initialCategories,
}: {
  categories: BlogCategory[];
}) {
  const [categories, setCategories] = useState(
    [...initialCategories].sort((a, b) => a.sortOrder - b.sortOrder),
  );

  function moveLocal(id: string, direction: "up" | "down") {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <AddCategoryForm
        nextSortOrder={categories.length}
        onCreated={(created) => setCategories((prev) => [...prev, created])}
      />

      {categories.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-2xl border border-dashed px-6 py-12 text-center text-sm">
          No categories yet. Add one above, or create one while writing a post.
        </p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
              onRenamed={(id, name, color) =>
                setCategories((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, name, color } : c)),
                )
              }
              onDeleted={(id) =>
                setCategories((prev) => prev.filter((c) => c.id !== id))
              }
              onMoved={moveLocal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
