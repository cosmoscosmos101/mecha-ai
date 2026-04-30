export function SiteFooter() {
  return (
    <footer className="border-t border-cream-300/70 mt-24">
      <div className="container-page py-10 grid gap-6 md:grid-cols-3 text-sm text-ink-100">
        <div>
          <div className="font-serif text-xl text-ink-400 mb-2">Mecha.AI</div>
          <p className="leading-relaxed">
            แพลตฟอร์มเรียน-สอนวิชาวิศวกรรม ออกแบบ และทฤษฎี — สำหรับติวเตอร์ที่อยากแบ่งปัน
            พร้อมรับคอมมิชชั่นจากทุกดีล
          </p>
        </div>
        <div>
          <div className="font-medium text-ink-300 mb-2">สาขาที่เปิดสอน</div>
          <ul className="space-y-1.5">
            <li>วิศวกรรมเครื่องกล</li>
            <li>วิศวกรรมโยธา</li>
            <li>วิศวกรรมไฟฟ้า</li>
            <li>วิศวกรรมอุตสาหการ</li>
            <li>การออกแบบ &amp; ทฤษฎี</li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-ink-300 mb-2">ติดต่อ</div>
          <p>hello@mecha.ai</p>
          <p className="text-xs mt-3 text-ink-50">© {new Date().getFullYear()} Mecha.AI. โครงสร้างหลักสูตรอ้างอิงจาก odm-engineer.com</p>
        </div>
      </div>
    </footer>
  );
}
