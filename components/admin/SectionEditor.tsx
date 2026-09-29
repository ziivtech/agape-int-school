"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronDown, ExternalLink, Plus, RotateCcw, Trash2 } from "lucide-react";
import ImageField from "./ImageField";
import { Button, Card, api, inputClass, labelClass, useToast } from "./ui";
import { emptyValue, type Field, type ImageValue, type ListField } from "../../lib/content/fields";

type Data = Record<string, unknown>;

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function TextInput({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  if (field.type === "textarea") {
    return (
      <textarea
        className={`${inputClass} min-h-[96px] resize-y leading-6`}
        value={value}
        rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      className={inputClass}
      value={value}
      placeholder={field.type === "url" ? "/page#section or https://…" : undefined}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function StringsInput({ value, onChange, itemLabel = "Item" }: { value: string[]; onChange: (v: string[]) => void; itemLabel?: string }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          {item.length > 80 ? (
            <textarea
              className={`${inputClass} min-h-[80px] resize-y leading-6`}
              value={item}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
            />
          ) : (
            <input className={inputClass} value={item} onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))} />
          )}
          <RowControls
            index={i}
            length={value.length}
            onMove={(to) => onChange(move(value, i, to))}
            onRemove={() => onChange(value.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-[#6C0798] hover:text-[#4B075F]"
      >
        <Plus size={15} /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

function RowControls({ index, length, onMove, onRemove }: { index: number; length: number; onMove: (to: number) => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 items-start gap-0.5">
      <button type="button" disabled={index === 0} onClick={() => onMove(index - 1)} className="rounded p-2 text-[#19151C]/50 hover:bg-[#19151C]/5 disabled:opacity-25" aria-label="Move up">
        <ArrowUp size={15} />
      </button>
      <button type="button" disabled={index === length - 1} onClick={() => onMove(index + 1)} className="rounded p-2 text-[#19151C]/50 hover:bg-[#19151C]/5 disabled:opacity-25" aria-label="Move down">
        <ArrowDown size={15} />
      </button>
      <button type="button" onClick={onRemove} className="rounded p-2 text-red-600/70 hover:bg-red-50 hover:text-red-700" aria-label="Remove">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ListInput({ field, value, onChange, folder }: { field: ListField; value: Data[]; onChange: (v: Data[]) => void; folder: string }) {
  const [open, setOpen] = useState<number | null>(value.length === 1 ? 0 : null);

  const blank = () => Object.fromEntries(field.fields.map((f) => [f.name, emptyValue(f)]));
  const titleOf = (item: Data, i: number) => {
    const t = item.title || item.name || item.question || item.label || item.level || item.value;
    return typeof t === "string" && t.trim() ? t : `${field.itemLabel} ${i + 1}`;
  };

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="rounded-lg border border-[#19151C]/10 bg-white">
          <div className="flex items-center gap-2 px-3 py-2">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
              <ChevronDown size={16} className={`shrink-0 text-[#19151C]/40 transition ${open === i ? "rotate-180" : ""}`} />
              <span className="truncate font-sans text-sm font-medium">{titleOf(item, i)}</span>
            </button>
            <RowControls
              index={i}
              length={value.length}
              onMove={(to) => {
                onChange(move(value, i, to));
                setOpen(to);
              }}
              onRemove={() => {
                if (confirm(`Remove “${titleOf(item, i)}”?`)) onChange(value.filter((_, j) => j !== i));
              }}
            />
          </div>
          {open === i && (
            <div className="space-y-4 border-t border-[#19151C]/10 px-4 py-4">
              {field.fields.map((sub) => (
                <FieldInput
                  key={sub.name}
                  field={sub}
                  value={item[sub.name]}
                  folder={folder}
                  onChange={(v) => onChange(value.map((it, j) => (j === i ? { ...it, [sub.name]: v } : it)))}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          onChange([...value, blank()]);
          setOpen(value.length);
        }}
        className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-[#6C0798] hover:text-[#4B075F]"
      >
        <Plus size={15} /> Add {field.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

function FieldInput({ field, value, onChange, folder }: { field: Field; value: unknown; onChange: (v: unknown) => void; folder: string }) {
  let input: React.ReactNode;
  switch (field.type) {
    case "image":
      input = (
        <ImageField
          value={(value as ImageValue) ?? { url: "", alt: "" }}
          onChange={onChange}
          label={field.label}
          aspect={field.aspect}
          uploadFolder={folder}
        />
      );
      break;
    case "strings":
      input = <StringsInput value={(value as string[]) ?? []} onChange={onChange} itemLabel={field.itemLabel} />;
      break;
    case "list":
      input = <ListInput field={field} value={(value as Data[]) ?? []} onChange={onChange} folder={folder} />;
      break;
    default:
      input = <TextInput field={field} value={(value as string) ?? ""} onChange={onChange} />;
  }
  return (
    <div>
      <label className={labelClass}>{field.label}</label>
      {input}
      {field.help && <p className="mt-1 font-sans text-xs text-[#19151C]/45">{field.help}</p>}
    </div>
  );
}

export default function SectionEditor({
  sectionKey,
  page,
  label,
  description,
  fields,
  initial,
  customised,
  viewUrl,
}: {
  sectionKey: string;
  page: string;
  label: string;
  description?: string;
  fields: Field[];
  initial: Data;
  customised: boolean;
  viewUrl?: string;
}) {
  const [data, setData] = useState<Data>(initial);
  const [saved, setSaved] = useState<string>(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [isCustom, setIsCustom] = useState(customised);
  const toast = useToast();
  const router = useRouter();
  const dirty = JSON.stringify(data) !== saved;
  const folder = sectionKey.split(".")[0];

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api<{ data: Data }>("/api/admin/content", { method: "PUT", json: { key: sectionKey, data } });
      setData(res.data);
      setSaved(JSON.stringify(res.data));
      setIsCustom(true);
      toast("success", "Saved — the website is updated.");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Put this section back to its original wording and photos? Your changes will be lost.")) return;
    setSaving(true);
    try {
      const res = await api<{ data: Data }>(`/api/admin/content?key=${encodeURIComponent(sectionKey)}`, { method: "DELETE" });
      setData(res.data);
      setSaved(JSON.stringify(res.data));
      setIsCustom(false);
      toast("success", "Section reset.");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not reset.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="mb-6">
        <Link href="/admin/content" className="font-sans text-sm text-[#19151C]/55 hover:text-[#6C0798]">
          ← Website content
        </Link>
        <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-wide text-[#6C0798]">{page}</p>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{label}</h1>
        {description && <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-[#19151C]/60">{description}</p>}
      </div>

      <Card className="space-y-6 p-5 sm:p-7">
        {fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={data[field.name]}
            folder={folder}
            onChange={(v) => setData((d) => ({ ...d, [field.name]: v }))}
          />
        ))}
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#19151C]/10 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-8 lg:px-10">
          <span className="font-sans text-sm text-[#19151C]/55">{dirty ? "You have unsaved changes." : "All changes saved."}</span>
          <div className="ml-auto flex flex-wrap gap-2">
            {viewUrl && (
              <Link href={viewUrl} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 font-sans text-sm text-[#19151C]/60 hover:bg-[#19151C]/5">
                View on site <ExternalLink size={13} />
              </Link>
            )}
            {isCustom && (
              <Button variant="ghost" onClick={reset} disabled={saving}>
                <RotateCcw size={14} /> Reset
              </Button>
            )}
            {dirty && (
              <Button variant="secondary" onClick={() => setData(JSON.parse(saved))} disabled={saving}>
                Discard
              </Button>
            )}
            <Button onClick={save} loading={saving} disabled={!dirty}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
