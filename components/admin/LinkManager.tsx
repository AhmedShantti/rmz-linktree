"use client";

import { useState } from "react";
import type { Link as LinkRecord } from "@prisma/client";
import { LinkTable } from "./LinkTable";
import { LinkForm, type LinkFormValues } from "./LinkForm";
import { Modal } from "./Modal";

interface LinkManagerProps {
  initialLinks: LinkRecord[];
}

export function LinkManager({ initialLinks }: LinkManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LinkRecord | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (link: LinkRecord) => {
    setEditing(link);
    setModalOpen(true);
  };

  const handleSubmit = async (values: LinkFormValues) => {
    const payload = {
      type: values.type,
      title: values.title,
      url: values.url,
      subtitle: values.subtitle || null,
      icon: values.icon || null,
      active: values.active,
      featured: values.featured,
    };

    if (editing) {
      const res = await fetch(`/api/admin/links/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save link");
      const updated = await res.json();
      setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    } else {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add link");
      const created = await res.json();
      setLinks((prev) => [...prev, created]);
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, active } : l)));
    await fetch(`/api/admin/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, featured } : l)));
    await fetch(`/api/admin/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
  };

  const handleReorder = async (orderedIds: string[]) => {
    setLinks((prev) => {
      const byId = new Map(prev.map((l) => [l.id, l]));
      return orderedIds.map((id) => byId.get(id)!);
    });
    await fetch("/api/admin/links/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rmz-black">Links</h1>
          <p className="text-sm text-rmz-black/50">Drag to reorder. Changes go live immediately.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-rmz-red px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add link
        </button>
      </div>

      <LinkTable
        links={links}
        onReorder={handleReorder}
        onToggleActive={handleToggleActive}
        onToggleFeatured={handleToggleFeatured}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit link" : "Add link"}>
        <LinkForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
