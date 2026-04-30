# Mecha.AI — แพลตฟอร์มเรียน-สอนวิศวกรรม

ติววิศวกรรม ออกแบบ และทฤษฎี (เครื่องกล / โยธา / ไฟฟ้า / อุตสาหการ / ออกแบบ / ทฤษฎี) — สร้างด้วย Next.js 15 (App Router) + Framer Motion + GSAP ธีมแบบ Anthropic (cream + coral)

โครงสร้างหลักสูตรอ้างอิงจาก [odm-engineer.com](https://www.odm-engineer.com/)

---

**Production:** https://mecha-ai.vercel.app

## วิธีรัน (Local)

```bash
# 1) ติดตั้ง deps
npm install

# 2) ดึง env vars จาก Vercel (DATABASE_URL, BLOB_READ_WRITE_TOKEN, AUTH_SECRET)
vercel link --yes
vercel env pull .env.local --yes

# 3) (ครั้งแรก) push schema + seed เข้า Neon
npm run db:push
npm run db:seed

# 4) สตาร์ท dev server
npm run dev
```

จากนั้นเปิด **http://localhost:3000**

> Local dev เชื่อมเข้า Neon Postgres ตัวเดียวกับ prod — ระวังการแก้ data ตรงๆ. ถ้าต้องการแยก สร้าง Neon dev branch แล้ว override `DATABASE_URL` ใน `.env.development.local`

### จัดการข้อมูลฝั่ง DB ตรงๆ (Drizzle Studio)

```bash
npm run db:studio
```

เปิด **https://local.drizzle.studio** — ได้ Table Editor เต็มรูปแบบ (เพิ่ม/แก้/ลบ row, รัน SQL, filter/sort) — connect ตรงเข้า Neon

### บัญชีตัวอย่าง (seed อัตโนมัติเมื่อรันครั้งแรก)

| Role  | Email           | Password    |
| ----- | --------------- | ----------- |
| Admin | admin@mecha.ai  | `admin1234` |
| Tutor | tutor@mecha.ai  | `tutor1234` |

---

## ฟีเจอร์หลัก

### หน้า Public
- **/** — Hero พร้อม GSAP word-stagger + Framer Motion blob animation
- **/courses** — กรองตามสาขา + ค้นหา (18 คอร์สเริ่มต้น)
- **/courses/[slug]** — รายละเอียดคอร์ส + ML recommendations + คลิปติวจากชุมชน
- **/login**, **/signup** — รองรับ referral code (`?ref=CODE`)

### หน้า Member (ต้อง login)
- **/upload** — ลากวาง MP4/WebM/MOV (≤200MB) พร้อม **live ML auto-tagging** ขณะพิมพ์
- **/dashboard** — กราฟ 7 วัน (สมัครผ่านโค้ด, ยอดชม) + รายได้สะสม + คลิปของฉัน

### Admin (`/admin`)
- ภาพรวมระบบ — รายได้รวม / คอมมิชชั่นที่จ่าย / กำไรสุทธิ
- CRUD คอร์ส (เพิ่ม / แก้ราคา-หัวข้อ / ลบ)
- จัดการผู้ใช้ — ปรับ role และ commission rate ได้รายคน
- จัดการคลิป — ตรวจ tag, ลบ

### ML (`src/lib/ml.ts`)
- `embed(topics)` — bag-of-vocab vector (84 มิติ) จากคำศัพท์วิศวกรรม → เก็บไว้กับคอร์สแต่ละตัว
- `recommend(courses, views, videos, k)` — cosine similarity ระหว่าง user-profile vector กับคอร์ส; cold-start fallback = top-rated × enrolled
- `autoTag(text)` — keyword extraction จาก vocabulary เดียวกัน ใช้ตอน live preview ใน upload form และตอนบันทึกคลิป

> ออกแบบให้ deterministic + dependency-free — รันบน Fluid Compute ได้โดยไม่ต้องโหลดโมเดล สลับไป AI Gateway ได้ง่าย

### Commission flow
1. ติวเตอร์ได้ `referralCode` ตอนสมัคร (default 30%, นักเรียน 10%)
2. แชร์ลิงก์ `signup?ref=CODE` หรือคัดลอกจากแดชบอร์ด
3. คนที่สมัครจากลิงก์ → ตอน enroll API จะคำนวณ `course.price × commissionRate` แล้วเพิ่มเข้า `user.earnings`

---

## โครงสร้างโปรเจกต์

```
src/
├── app/                       # App Router pages + API routes
│   ├── api/
│   │   ├── auth/{login,signup,logout}/route.ts
│   │   ├── enroll/route.ts             # commission calc
│   │   ├── upload/route.ts             # multipart → storage
│   │   ├── media/[name]/route.ts       # local-dev media server
│   │   ├── ml/{recommend,tag}/route.ts
│   │   ├── track/route.ts              # view events
│   │   └── admin/{courses,users,videos}/[id]/route.ts
│   ├── courses/[slug]/page.tsx
│   ├── upload/page.tsx
│   ├── dashboard/page.tsx
│   ├── admin/{courses,users,videos}/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/                # UI (animations, forms, tables)
├── lib/
│   ├── auth.ts                # JWT (jose) + bcryptjs
│   ├── db.ts                  # JSON file store + cache
│   ├── seed.ts                # 18 starter courses
│   ├── ml.ts                  # embed / cosine / autoTag / recommend
│   ├── storage.ts             # Local FS in dev → Vercel Blob in prod
│   ├── admin.ts               # requireAdmin guard
│   ├── types.ts
│   └── utils.ts
├── proxy.ts                   # Next 16 routing (auth gate /dashboard /upload /admin)
└── middleware.ts              # Next 15 shim → re-exports proxy

scripts/
└── seed.ts                    # seed admin/tutor + 18 courses
```

## Stack ที่ใช้

| ฝั่ง | เทคโนโลยี | ที่ provision |
|---|---|---|
| **Database** | Postgres (Drizzle ORM) | Neon ผ่าน Vercel Marketplace |
| **Storage** | Vercel Blob (public) | `vercel blob create-store` |
| **Auth** | jose JWT + bcryptjs (custom) | `AUTH_SECRET` ใน Vercel env |
| **Hosting** | Vercel Functions (Fluid Compute) | `vercel deploy --prod` |

Schema อยู่ที่ [src/lib/schema.ts](src/lib/schema.ts) — แก้แล้วรัน `npm run db:push` เพื่อ sync เข้า Neon

---

## การ deploy

```bash
git push        # GitHub auto-deploys preview ผ่าน Vercel integration
vercel deploy --prod    # หรือ deploy prod ตรงๆ จาก CLI
```

ตั้งค่าครั้งแรก (ทำเสร็จแล้ว):
1. `vercel link --yes --project mecha-ai`
2. `vercel integration add neon -m region=sin1 -n mecha-ai-db` (Postgres)
3. `vercel blob create-store mecha-ai-blob --access public --yes` (Storage)
4. `vercel env add AUTH_SECRET production` (jose JWT secret)

---

## ปัญหาที่อาจเจอ

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| Dev server ค้างที่ "Starting…" >2 นาที | Next ไป trace `/Users/cosmosx/` (มี lockfile อยู่) | `outputFileTracingRoot` ตั้งให้แล้วใน `next.config.ts` |
| Error: bcryptjs cannot resolve | ใช้ Bun/Edge runtime กับ route ที่ hash password | route อยู่ใน Node runtime (default) อยู่แล้ว |
| Upload ไม่ persist หลัง redeploy | Local FS บน serverless = ephemeral | ดู section "deploy" ด้านบน |
| Drizzle Studio ขึ้น "no data" | DB ยังไม่ seed | รัน `npm run db:push && npm run db:seed` |
| `DATABASE_URL is not set` ตอนรัน script | `.env.local` ยังไม่ดึง | `vercel env pull .env.local --yes` |
| `BLOB_READ_WRITE_TOKEN missing` | ยังไม่ link Blob store | `vercel blob create-store ... --yes` |

```
หากต้องการให้ผมสลับไป Vercel Blob + Neon ตอนนี้เลย แค่บอก
```
