// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const cfg = require('./config.json');

const commandModules = [
  require('./src/commands/ping'),
  require('./src/commands/profile'),
  require('./src/commands/project'),
  require('./src/commands/task'),
  require('./src/commands/status'),
  require('./src/commands/remind')
];

const builtCommands = commandModules.map(c => c.data.toJSON());

const extraCommands = [
  {
    name: 'habapp_start',
    description: 'إرسال رسالة الترحيب التفاعلية في هذه القناة',
    dm_permission: false,
    type: 1
  },
  {
    name: 'task_review',
    description: 'تقييم الجودة أو الأخلاقيات لمهمة',
    dm_permission: false,
    type: 1,
    options: [
      {
        type: 1,
        name: 'quality',
        description: 'تسجيل تقييم جودة لمهمة',
        options: [
          { type: 3, name: 'task_id', description: 'معرّف المهمة', required: true },
          {
            type: 4,
            name: 'score',
            description: 'الدرجة (1 ضعيف، 2 مقبول، 3 قوي)',
            required: true,
            choices: [
              { name: '1', value: 1 },
              { name: '2', value: 2 },
              { name: '3', value: 3 }
            ]
          },
          { type: 3, name: 'tags', description: 'وسوم مفصولة بفواصل', required: false },
          { type: 3, name: 'notes', description: 'ملاحظات قصيرة', required: false }
        ]
      },
      {
        type: 1,
        name: 'ethics',
        description: 'تسجيل مراجعة أخلاقيات لمهمة',
        options: [
          { type: 3, name: 'task_id', description: 'معرّف المهمة', required: true },
          {
            type: 3,
            name: 'status',
            description: 'الحالة الأخلاقية',
            required: true,
            choices: [
              { name: 'سليم', value: 'ok' },
              { name: 'يحتاج نقاش', value: 'needs_discussion' },
              { name: 'مخالفة', value: 'violation' }
            ]
          },
          { type: 3, name: 'tags', description: 'وسوم مفصولة بفواصل', required: false },
          { type: 3, name: 'notes', description: 'ملاحظات قصيرة', required: false }
        ]
      }
    ]
  },
  {
    name: 'work_backfill',
    description: 'تسجيل أعمال سابقة للمراجعة والاعتماد',
    dm_permission: false,
    type: 1,
    options: [
      {
        type: 1,
        name: 'add',
        description: 'إضافة إدخال عمل سابق',
        options: [
          {
            type: 3,
            name: 'unit',
            description: 'الوحدة ذات الصلة',
            required: true,
            choices: [
              { name: 'الإعلام', value: 'media' },
              { name: 'الإنتاج', value: 'production' },
              { name: 'الناس', value: 'people' },
              { name: 'الجيكس', value: 'geeks' },
              { name: 'فِكر', value: 'think' },
              { name: 'الأكاديمية', value: 'academy' },
              { name: 'الإدارة', value: 'admin' }
            ]
          },
          { type: 3, name: 'pipeline', description: 'مسار العمل المرتبط', required: true },
          { type: 3, name: 'title', description: 'عنوان مختصر', required: true },
          { type: 3, name: 'description', description: 'وصف مختصر', required: true },
          { type: 3, name: 'completed_at', description: 'تاريخ الإنجاز (YYYY-MM أو يوم)', required: true },
          { type: 3, name: 'links', description: 'روابط أو ملاحظات مفصولة بفواصل', required: false }
        ]
      },
      {
        type: 1,
        name: 'verify',
        description: 'تحديث حالة التحقق لإدخال سابق',
        options: [
          { type: 3, name: 'entry_id', description: 'معرّف السجل', required: true },
          { type: 5, name: 'verified', description: 'تم التأكيد؟', required: true }
        ]
      }
    ]
  },
  {
    name: 'profile_update',
    description: 'تحديث مهارات واهتمامات الأعضاء',
    dm_permission: false,
    type: 1,
    options: [
      {
        type: 1,
        name: 'summary',
        description: 'عرض ملفك في حبق بناءً على الأدوار الحالية في ديسكورد'
      },
      {
        type: 1,
        name: 'skills',
        description: 'إضافة أو تحديث مهارة',
        options: [
          { type: 3, name: 'key', description: 'معرّف المهارة', required: true },
          {
            type: 3,
            name: 'level',
            description: 'المستوى',
            required: true,
            choices: [
              { name: 'مبتدئ', value: 'beginner' },
              { name: 'متوسط', value: 'intermediate' },
              { name: 'متقدم', value: 'advanced' }
            ]
          },
          { type: 3, name: 'examples', description: 'روابط أو أمثلة مفصولة بفواصل', required: false }
        ]
      },
      {
        type: 1,
        name: 'learning',
        description: 'تسجيل اهتمام تعلم جديد',
        options: [
          { type: 3, name: 'key', description: 'المجال أو المهارة', required: true },
          { type: 3, name: 'notes', description: 'ملاحظات اختيارية', required: false }
        ]
      }
    ]
  }
];

const commands = [...builtCommands, ...extraCommands];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  try {
    console.log('Deploying slash commands...');
    await rest.put(Routes.applicationGuildCommands(cfg.clientId, cfg.guildId), { body: commands });
    console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
}

main();
