"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Save, Plus } from "lucide-react";

// ----- Courses -----

interface CourseRow {
  id: string;
  slug: string;
  titleTh: string;
  discipline: string;
  price: number;
  priceFmt: string;
  enrolled: number;
  enrolledFmt: string;
  rating: number;
}

export function CourseAdminTable({ rows }: { rows: CourseRow[] }) {
  const [data, setData] = useState(rows);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<CourseRow>>({});
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    titleTh: "", title: "", discipline: "mechanical", price: 2500, hours: 20, level: "intro", topics: "",
  });

  async function save(id: string) {
    const res = await fetch(`/api/admin/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      setData((d) => d.map((r) => (r.id === id ? { ...r, ...draft } as CourseRow : r)));
      setEditing(null);
    }
  }
  async function remove(id: string) {
    if (!confirm("ลบคอร์สนี้?")) return;
    const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    if (res.ok) setData((d) => d.filter((r) => r.id !== id));
  }
  async function create() {
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newCourse,
        topics: newCourse.topics.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      const c = await res.json();
      setData((d) => [...d, c.row]);
      setCreating(false);
      setNewCourse({ titleTh: "", title: "", discipline: "mechanical", price: 2500, hours: 20, level: "intro", topics: "" });
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setCreating((v) => !v)} className="btn-accent text-sm">
          <Plus className="size-4" /> เพิ่มคอร์ส
        </button>
      </div>
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="card p-5 mb-4 grid sm:grid-cols-2 gap-3"
          >
            <input className="input" placeholder="ชื่อไทย" value={newCourse.titleTh} onChange={(e) => setNewCourse({ ...newCourse, titleTh: e.target.value })} />
            <input className="input" placeholder="Title (EN)" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
            <select className="input" value={newCourse.discipline} onChange={(e) => setNewCourse({ ...newCourse, discipline: e.target.value })}>
              {["mechanical","civil","electrical","industrial","design","theory"].map((d) => <option key={d}>{d}</option>)}
            </select>
            <select className="input" value={newCourse.level} onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}>
              {["intro","intermediate","advanced"].map((d) => <option key={d}>{d}</option>)}
            </select>
            <input className="input" type="number" placeholder="ราคา" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: +e.target.value })} />
            <input className="input" type="number" placeholder="ชั่วโมง" value={newCourse.hours} onChange={(e) => setNewCourse({ ...newCourse, hours: +e.target.value })} />
            <input className="input sm:col-span-2" placeholder="topics (คั่นด้วย ,)" value={newCourse.topics} onChange={(e) => setNewCourse({ ...newCourse, topics: e.target.value })} />
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <button onClick={() => setCreating(false)} className="btn-ghost text-sm">ยกเลิก</button>
              <button onClick={create} className="btn-primary text-sm">บันทึก</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-200/60">
            <tr className="text-left text-xs uppercase text-ink-100">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">สาขา</th>
              <th className="px-4 py-3 text-right">ราคา</th>
              <th className="px-4 py-3 text-right">ผู้สมัคร</th>
              <th className="px-4 py-3 text-right">เรตติ้ง</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-300">
            {data.map((r) => {
              const isEdit = editing === r.id;
              return (
                <tr key={r.id} className="hover:bg-cream-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-ink-100">{r.id}</td>
                  <td className="px-4 py-3">
                    {isEdit ? (
                      <input className="input py-1.5" defaultValue={r.titleTh} onChange={(e) => setDraft((d) => ({ ...d, titleTh: e.target.value }))} />
                    ) : <span className="font-medium text-ink-300">{r.titleTh}</span>}
                  </td>
                  <td className="px-4 py-3">{r.discipline}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {isEdit ? (
                      <input className="input py-1.5 text-right w-24" type="number" defaultValue={r.price} onChange={(e) => setDraft((d) => ({ ...d, price: +e.target.value }))} />
                    ) : r.priceFmt}
                  </td>
                  <td className="px-4 py-3 text-right">{r.enrolledFmt}</td>
                  <td className="px-4 py-3 text-right">{r.rating}</td>
                  <td className="px-4 py-3 text-right">
                    {isEdit ? (
                      <button onClick={() => save(r.id)} className="btn-accent text-xs py-1 px-3">
                        <Save className="size-3" /> บันทึก
                      </button>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditing(r.id); setDraft(r); }} className="btn-ghost text-xs py-1 px-2">แก้ไข</button>
                        <button onClick={() => remove(r.id)} className="btn-ghost text-xs py-1 px-2 text-red-600">
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----- Users -----

interface UserRow { id: string; name: string; email: string; role: string; referralCode: string; commissionRate: number; earnings: number }

export function UserAdminTable({ rows }: { rows: UserRow[] }) {
  const [data, setData] = useState(rows);

  async function patch(id: string, patch: Partial<UserRow>) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) setData((d) => d.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-cream-200/60">
          <tr className="text-left text-xs uppercase text-ink-100">
            <th className="px-4 py-3">ชื่อ</th>
            <th className="px-4 py-3">อีเมล</th>
            <th className="px-4 py-3">บทบาท</th>
            <th className="px-4 py-3">โค้ด</th>
            <th className="px-4 py-3 text-right">คอมมิชชั่น</th>
            <th className="px-4 py-3 text-right">รายได้</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-300">
          {data.map((u) => (
            <tr key={u.id} className="hover:bg-cream-50/50">
              <td className="px-4 py-3 font-medium">{u.name}</td>
              <td className="px-4 py-3 text-ink-100">{u.email}</td>
              <td className="px-4 py-3">
                <select
                  defaultValue={u.role}
                  onChange={(e) => patch(u.id, { role: e.target.value })}
                  className="input py-1 text-xs"
                >
                  {["student","tutor","admin"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{u.referralCode}</td>
              <td className="px-4 py-3 text-right">
                <input
                  type="number" step="0.05" min="0" max="1"
                  defaultValue={u.commissionRate}
                  onChange={(e) => patch(u.id, { commissionRate: +e.target.value })}
                  className="input py-1 text-right w-20"
                />
              </td>
              <td className="px-4 py-3 text-right font-mono text-coral-500">฿{u.earnings.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----- Videos -----

interface VideoRow { id: string; title: string; uploaderName: string; course: string; autoTags: string[]; views: number; createdAt: string }

export function VideoAdminTable({ rows }: { rows: VideoRow[] }) {
  const [data, setData] = useState(rows);
  async function remove(id: string) {
    if (!confirm("ลบคลิปนี้?")) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) setData((d) => d.filter((r) => r.id !== id));
  }
  if (data.length === 0)
    return <div className="card p-10 text-center text-ink-100">ยังไม่มีคลิปในระบบ</div>;
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-cream-200/60">
          <tr className="text-left text-xs uppercase text-ink-100">
            <th className="px-4 py-3">ชื่อคลิป</th>
            <th className="px-4 py-3">ผู้อัปโหลด</th>
            <th className="px-4 py-3">วิชา</th>
            <th className="px-4 py-3">Auto-tags</th>
            <th className="px-4 py-3 text-right">ยอดชม</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-300">
          {data.map((v) => (
            <tr key={v.id}>
              <td className="px-4 py-3 font-medium max-w-xs truncate">{v.title}</td>
              <td className="px-4 py-3 text-ink-100">{v.uploaderName}</td>
              <td className="px-4 py-3">{v.course}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {v.autoTags.slice(0, 4).map((t) => <span key={t} className="pill text-[10px]">{t}</span>)}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono">{v.views}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => remove(v.id)} className="btn-ghost text-xs text-red-600">
                  <Trash2 className="size-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
