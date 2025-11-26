# Dev notes

## Next features

- Add Arabic-facing text for all user-visible messages.
- Implement production templates (A/B/C, internal vs external) in `src/core/work/templates/templates.production.js`.
- Add status / loyalty system (قيادة، نواة، نشط، جاهزية، الدائرة المؤسسة...) in `src/core/people/status.js`.
- Wire templates + status into project creation flow.

## Architecture prep (phase 1)

- وثيقة `docs/ARCHITECTURE.md` توضّح حدود النواة مقابل محوّلات Discord وخطوات الفصل.
- سياق خدمات `createCoreContext` في `src/core/context.js` لجمع الاستخدامات الجاهزة لطبقة Discord.
- مجلد `src/discord/` مخصّص للمحوّلات القادمة دون تغيير السلوك الحالي.

## Architecture phase 2 (in progress)

- Project and task flows الآن تمر عبر خدمات النواة (`src/core/work/services` و`src/core/people/services`) مع طبقة محوّلات Discord (`src/discord/adapters`) مسؤولة عن التعامل مع discord.js.

## Phase 3 prep (templates + status)

- أوامر المشروع تدعم اختيار قالب إنتاج (A/B/C) مع ملخص عربي يظهر فور الإنشاء دون تغيير المسار الحالي.
- خدمة الحالة (`src/core/people/services/statusService.js`) تدعم أمر `/status` لعرض نظرة عامة أو حوافز النظام قبل ربط الأدوار فعلياً.

## Phase 4 (data + tests)

- طبقة تخزين موحدة عبر `createStore` في `src/core/store.js` مع إمكانية تغيير مسار البيانات أو استبدال المخزن لاحقاً.
- دوال المشاريع والمهام تدعم حقن المخزن (store) للحفاظ على السلوك الحالي واختبار التخزين بمعزل عن Discord.
- اختبارات وحدة أساسية (Node test runner) لقوالب المهام/الإنتاج، حالات الولاء، وتدفق المشاريع/المهام لضمان عدم الانحراف أثناء إعادة الهيكلة.
