"use client";

import { useEffect, useState, useTransition } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";

import { uploadMediaFile } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  name,
  defaultHtml = "",
}: {
  name: string;
  defaultHtml?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [html, setHtml] = useState(defaultHtml);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({
        placeholder: "Start writing. Use the toolbar for formatting…",
      }),
    ],
    content: defaultHtml || "<p></p>",
    editorProps: {
      attributes: {
        class: "tiptap blog-content min-h-[22rem] px-4 py-3 sm:min-h-[28rem]",
      },
    },
    onUpdate: ({ editor: instance }) => {
      setHtml(instance.getHTML());
    },
  });

  useEffect(() => {
    if (editor && defaultHtml && editor.isEmpty) {
      editor.commands.setContent(defaultHtml);
    }
  }, [defaultHtml, editor]);

  function addLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", previous ?? "https://");
    if (href === null) return;
    if (href === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const data = new FormData();
      data.set("file", file);
      data.set("folder", "posts");
      startTransition(async () => {
        const result = await uploadMediaFile(data);
        if (result.url) {
          editor.chain().focus().setImage({ src: result.url }).run();
        }
      });
    };
    input.click();
  }

  return (
    <div className="border-input bg-card overflow-hidden rounded-2xl border">
      <div className="border-border bg-muted/30 sticky top-0 z-10 flex flex-wrap gap-0.5 border-b p-1.5">
        <ToolbarButton
          active={editor?.isActive("heading", { level: 1 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          label="Heading 1"
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Heading 2"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          label="Heading 3"
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          label="Bold"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          label="Italic"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("strike")}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          label="Strikethrough"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("code")}
          onClick={() => editor?.chain().focus().toggleCode().run()}
          label="Inline code"
        >
          <Code className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          label="Bulleted list"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          label="Numbered list"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          label="Quote"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("codeBlock")}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          label="Code block"
        >
          <span className="font-mono text-[10px] font-semibold">{"{ }"}</span>
        </ToolbarButton>
        <Divider />
        <ToolbarButton active={editor?.isActive("link")} onClick={addLink} label="Link">
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} label="Insert image" disabled={pending}>
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          label="Undo"
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          label="Redo"
        >
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>
      {pending ? (
        <p className="text-muted-foreground px-4 py-2 text-xs">Uploading image…</p>
      ) : null}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Divider() {
  return <span className="bg-border mx-1 hidden h-6 w-px sm:block" />;
}

function ToolbarButton({
  children,
  onClick,
  active,
  label,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn("size-9 sm:size-8", active && "bg-muted text-foreground")}
    >
      {children}
    </Button>
  );
}
