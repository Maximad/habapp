// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const cfg = require('./config.json');
const { pipelines } = require('./src/core/work/units');

const pipelineChoices = pipelines
  .filter(p => !p.hidden)
  .map(p => ({ name: p.name_ar, value: p.key }));

const commands = [
  {
    name: 'ping',
    description: 'اختبار استجابة HabApp',
    dm_permission: false,
    type: 1
  },
  {
    name: 'habapp_start',
    description: 'إرسال رسالة الترحيب التفاعلية في هذه القناة',
    dm_permission: false,
    type: 1
  },
  {
    name: 'project',
    description: 'إنشاء أو إدارة مشروع إنتاج',
    dm_permission: false,
    type: 1,
    options: [
      {
        type: 1,
        name: 'create',
        description: 'إنشاء مشروع جديد',
        options: [
          { type: 3, name: 'name', description: 'اسم المشروع', required: true },
          { type: 3, name: 'due', description: 'تاريخ التسليم (YYYY-MM-DD)', required: true },
          { type: 3, name: 'slug', description: 'رمز قصير للمشروع (اختياري)', required: false },
          {
            type: 3,
            name: 'pipeline',
            description: 'مسار العمل (اختر المسار المناسب)',
            required: false,
            choices: pipelineChoices
          },
          {
            type: 3,
            name: 'unit',
            description: 'الوحدة الأساسية إذا لم تكن القناة تفرض وحدة محددة',
            required: false,
            choices: [
              { name: 'الإنتاج', value: 'production' },
              { name: 'الإعلام', value: 'media' },
              { name: 'الناس', value: 'people' },
              { name: 'الجيكس', value: 'geeks' }
            ]
          },
          {
            type: 3,
            name: 'units',
            description: 'وحدات المشروع (مفصولة بفواصل مثل production,media)',
            required: false
          },
          {
            type: 3,
            name: 'template',
            description: 'قالب الإنتاج (A/B/C)',
            required: false,
            choices: [
              { name: 'قالب A - بسيط/داخلي', value: 'A' },
              { name: 'قالب B - وثائقي قياسي', value: 'B' },
              { name: 'قالب C - معيار عميل مرتفع', value: 'C' },
              { name: 'بدون قالب محدد', value: 'none' }
            ]
          }
        ]
      },
      {
        type: 1,
        name: 'scaffold',
        description: 'توليد مهام تلقائية من قوالب المسار',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          {
            type: 3,
            name: 'pipeline',
            description: 'مسار العمل (اختياري، يستخدم مسار المشروع إذا تُرك فارغاً)',
            required: false,
            choices: pipelineChoices
          }
        ]
      },
      {
        type: 1,
        name: 'stage',
        description: 'تحديث مرحلة المشروع',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          {
            type: 3,
            name: 'stage',
            description: 'مرحلة المشروع',
            required: true,
            choices: [
              { name: 'التخطيط', value: 'planning' },
              { name: 'التصوير', value: 'shooting' },
              { name: 'المونتاج', value: 'editing' },
              { name: 'المراجعة', value: 'review' },
              { name: 'مؤرشف', value: 'archived' }
            ]
          }
        ]
      },
      {
        type: 1,
        name: 'delete',
        description: 'حذف مشروع بالكامل',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          {
            type: 5,
            name: 'confirm',
            description: 'اكتب true إذا كنت متأكداً من الحذف',
            required: true
          }
        ]
      },
      {
        type: 1,
        name: 'tasks',
        description: 'عرض مهام المشروع',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          {
            type: 3,
            name: 'status',
            description: 'حالة المهام',
            required: false,
            choices: [
              { name: 'مفتوحة', value: 'open' },
              { name: 'منجزة', value: 'done' },
              { name: 'الكل', value: 'all' }
            ]
          }
        ]
      }
    ]
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
          {
            type: 3,
            name: 'pipeline',
            description: 'مسار العمل المرتبط',
            required: true,
            choices: pipelineChoices
          },
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
    name: 'profile',
    description: 'تحديث مهارات واهتمامات الأعضاء',
    dm_permission: false,
    type: 1,
    options: [
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
  },
  {
    name: 'task',
    description: 'إدارة مهام مشروع',
    dm_permission: false,
    type: 1,
    options: [
      {
        type: 1,
        name: 'add',
        description: 'إضافة مهمة جديدة',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          { type: 3, name: 'title', description: 'عنوان المهمة', required: true },
          {
            type: 3,
            name: 'unit',
            description: 'الوحدة المسؤولة',
            required: false,
            choices: [
              { name: 'الإعلام', value: 'media' },
              { name: 'الإنتاج', value: 'production' },
              { name: 'فِكر', value: 'think' },
              { name: 'الناس', value: 'people' },
              { name: 'الأكاديمية', value: 'academy' },
              { name: 'الجيكس', value: 'geeks' },
              { name: 'الإدارة', value: 'admin' }
            ]
          },
          { type: 6, name: 'owner', description: 'تعيين المنفّذ (اختياري)', required: false },
          { type: 3, name: 'due', description: 'تاريخ التسليم (اختياري)', required: false },
          {
            type: 3,
            name: 'template_id',
            description: 'معرّف قالب مهمة (اختياري)',
            required: false
          }
        ]
      },
      {
        type: 1,
        name: 'complete',
        description: 'وضع مهمة كمنجزة',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          { type: 4, name: 'task_id', description: 'رقم المهمة', required: true }
        ]
      },
      {
        type: 1,
        name: 'delete',
        description: 'حذف مهمة',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          { type: 4, name: 'task_id', description: 'رقم المهمة', required: true }
        ]
      },
      {
        type: 1,
        name: 'list',
        description: 'عرض مهام المشروع',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          {
            type: 3,
            name: 'status',
            description: 'حالة المهام',
            required: false,
            choices: [
              { name: 'مفتوحة', value: 'open' },
              { name: 'منجزة', value: 'done' },
              { name: 'الكل', value: 'all' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'template',
    description: 'قوالب جاهزة للمهام',
    dm_permission: false,
    type: 1,
    options: [
      {
        type: 1,
        name: 'task-list',
        description: 'عرض قوالب المهام',
        options: [
          {
            type: 3,
            name: 'unit',
            description: 'حصر القوالب بوحدة معيّنة (اختياري)',
            required: false,
            choices: [
              { name: 'الكل', value: 'all' },
              { name: 'الإعلام', value: 'media' },
              { name: 'الإنتاج', value: 'production' },
              { name: 'فِكر', value: 'think' },
              { name: 'الناس', value: 'people' },
              { name: 'الأكاديمية', value: 'academy' },
              { name: 'الجيكس', value: 'geeks' },
              { name: 'الإدارة', value: 'admin' }
            ]
          }
        ]
      },
      {
        type: 1,
        name: 'task-spawn',
        description: 'إنشاء مهمة من قالب',
        options: [
          { type: 3, name: 'slug', description: 'رمز المشروع', required: true },
          { type: 3, name: 'template_id', description: 'معرّف القالب', required: true },
          { type: 6, name: 'owner', description: 'تعيين المنفّذ (اختياري)', required: false },
          { type: 3, name: 'due', description: 'تاريخ التسليم (اختياري)', required: false }
        ]
      }
    ]
  },
  {
    name: 'status',
    description: 'عرض معلومات حالات حبق',
    dm_permission: false,
    type: 1,
    options: [
      {
        type: 1,
        name: 'info',
        description: 'عرض نظرة عامة على الحالات والمبادئ'
      },
      {
        type: 1,
        name: 'rewards',
        description: 'عرض الحوافز والمكافآت المقترحة لكل حالة'
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const appId = cfg.applicationId;
const guildId = cfg.guildId;

async function main() {
  try {
    console.log(
      `[HabApp] نشر ${commands.length} أمراً من أوامر HabApp إلى الخادم ${guildId} ...`
    );
    await rest.put(
      Routes.applicationGuildCommands(appId, guildId),
      { body: commands }
    );
    console.log('[HabApp] تم تحديث أوامر HabApp بنجاح.');
  } catch (err) {
    console.error('Failed to deploy commands', err);
  }
}

main();
