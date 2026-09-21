"use client";

import { useState } from "react";

import { saveSiteSettings } from "@/lib/admin/actions";
import type { SiteContent } from "@/lib/content-types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({ site }: { site: SiteContent }) {
  const [error, setError] = useState<string | null>(null);
  const [avatars, setAvatars] = useState(site.avatars.join("\n"));

  async function action(formData: FormData) {
    formData.set("avatars", avatars);
    const result = await saveSiteSettings(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={site.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" name="domain" required defaultValue={site.domain} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" defaultValue={site.role} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={site.tagline} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" className="min-h-40" defaultValue={site.bio} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="college">College</Label>
        <Input id="college" name="college" defaultValue={site.college} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Input id="branch" name="branch" defaultValue={site.branch} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" name="year" defaultValue={site.year} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={site.location} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="resume">Resume URL</Label>
        <Input id="resume" name="resume" defaultValue={site.resume} />
      </div>
      <ImageUpload
        name="resume_file"
        folder="site"
        label="Upload resume (PDF) — then copy the URL into Resume URL"
        accept="application/pdf,image/*"
      />
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" name="linkedin" defaultValue={site.socials.linkedin} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        <Input id="github" name="github" defaultValue={site.socials.github} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={site.socials.email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatars">Avatar URLs (one per line)</Label>
        <Textarea
          id="avatars"
          value={avatars}
          onChange={(event) => setAvatars(event.target.value)}
        />
      </div>
      <ImageUpload
        name="avatar_upload"
        folder="site"
        label="Upload an avatar, then paste the URL into the list above"
      />
      <div className="space-y-2">
        <Label htmlFor="tech_stack">Tech stack (Label|icon per line)</Label>
        <Textarea
          id="tech_stack"
          name="tech_stack"
          className="min-h-40 font-mono text-sm"
          defaultValue={site.techStack
            .map((item) => `${item.label}|${item.icon}`)
            .join("\n")}
        />
        <p className="text-muted-foreground text-xs">
          Icon keys: typescript, nextjs, react, tailwindcss, nodejs, postgresql,
          git, github, python, html, css, javascript, numpy, pandas.
        </p>
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" className="h-11 w-full sm:w-auto">
        Save settings
      </Button>
    </form>
  );
}
