"use client";

import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

const pathOptions = [
  ["opportunity", "I own an opportunity"],
  ["operator", "I can operate a venture"],
  ["capital", "I represent capital"],
  ["corporate", "I represent an organization"],
] as const;

export function OpportunityForm() {
  const searchParams = useSearchParams();
  const initialPath = searchParams.get("path") || "opportunity";
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = `Realization opportunity brief — ${form.get("path")}`;
    const body = [
      `Name: ${form.get("name")}`,
      `Email: ${form.get("email")}`,
      `Organization: ${form.get("organization") || "—"}`,
      `Path: ${form.get("path")}`,
      `Geography: ${form.get("geography") || "—"}`,
      "",
      "Opportunity / capability:",
      form.get("brief"),
      "",
      "Rights, evidence or constraints:",
      form.get("context"),
    ].join("\n");
    window.location.href = `mailto:hello@realization.world?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Your email application has opened with a structured brief. Please review it before sending.");
  }

  return (
    <form className="opportunity-form" onSubmit={submit}>
      <fieldset>
        <legend className="eyebrow">Choose your path</legend>
        <div className="path-options">
          {pathOptions.map(([value, label]) => (
            <label className="path-option" key={value}>
              <input name="path" type="radio" value={value} defaultChecked={initialPath === value} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-grid">
        <label><span>Name *</span><input name="name" type="text" autoComplete="name" required /></label>
        <label><span>Email *</span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Organization</span><input name="organization" type="text" autoComplete="organization" /></label>
        <label><span>Geography</span><input name="geography" type="text" placeholder="Country or market" /></label>
      </div>
      <label>
        <span>What is the opportunity or capability? *</span>
        <textarea name="brief" rows={5} required placeholder="Describe the physical asset, system, venture or operating capability." />
      </label>
      <label>
        <span>What rights, evidence or constraints already exist?</span>
        <textarea name="context" rows={4} placeholder="Ownership, users, data, licenses, partners, timing or capital context." />
      </label>
      <div className="form-submit">
        <button className="button button--dark" type="submit">Prepare email brief <ArrowRight aria-hidden="true" size={17} /></button>
        <p>This form opens your email client. Nothing is stored on this website.</p>
      </div>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  );
}
