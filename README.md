# HabApp

Internal bot for Habaq Collective.

- `src/index.js` – main Discord bot entrypoint
- `src/core/` – core logic (projects, tasks, status, templates, etc.)
- `src/commands/` – slash command definitions
- `data/` – JSON storage for projects/tasks
- `npm test` – runs Node's built-in test runner over core logic (storage, templates، الحالة)
- انظر أيضًا: `docs/ARCHITECTURE.md` لخرائط البنية الطبقية بين النواة وطبقة Discord.
- أوامر المشروع تدعم اختيار قالب إنتاج (A/B/C) لعرض ملخص عربي فور الإنشاء، وهناك أمر `/status` لعرض نظرة عامة أو حوافز الحالات.

## أمثلة أوامر سريعة

- `/project create name:"لقاء مع موسيقيين شباب" slug:"youth-musicians" pipeline:"production.video_basic" units:"production,media"`
- `/project scaffold slug:"youth-musicians"`
