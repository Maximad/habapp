// src/core/units.js
// Defines HabApp units and their pipelines independent of Discord wiring.

const units = [
  {
    key: 'production',
    name_ar: 'الإنتاج',
    description_ar: 'مسؤولة عن الفيديوهات، الوثائقيات، والمشاريع المرئية.',
    pipelines: [
      'production.video_basic',
      'production.video_doc_interviews',
      'production.video_premium'
    ]
  },
  {
    key: 'think',
    name_ar: 'فِكر',
    description_ar: 'مختبر الأبحاث والدعم المنهجي للوحدات الأخرى.',
    pipelines: [
      'think.research_brief',
      'think.support_investigation',
      'think.forum_design'
    ]
  },
  {
    key: 'media',
    name_ar: 'الإعلام',
    description_ar: 'تكتب وتنشر المقالات والقصص المصوّرة والمحتوى الاجتماعي.',
    pipelines: [
      'media.lab90_cycle',
      'media.article_short',
      'media.article_long',
      'media.photo_story',
      'media.data_brief',
      'media.short_video_social',
      'media.podcast_short',
      'media.translation_adapt'
    ]
  },
  {
    key: 'people',
    name_ar: 'الناس',
    description_ar: 'تنظّم الفعاليات والحوارات والسهرات الثقافية.',
    pipelines: [
      'people.volunteer_onboarding',
      'people.partner_mapping',
      'people.event_small',
      'people.event_music',
      'people.event_forum',
      'people.training_mini',
      'people.event_shihan_black_hall',
      'people.event_music_cycle',
      'people.event_open_mic',
      'people.exhibition_cycle'
    ]
  },
  {
    key: 'geeks',
    name_ar: 'الجيكس',
    description_ar: 'تطوّر المواقع والأدوات والتطبيقات الصغيرة.',
    pipelines: [
      'geeks.site_basic',
      'geeks.app_small',
      'geeks.app_accessibility',
      'geeks.automation_stack',
      'geeks.discord_infra'
    ]
  }
];

const pipelines = [
  {
    key: 'production.video_basic',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'فيديو داخلي بسيط',
    description_ar: 'فيديوهات صغيرة داخلية (قالب A) للاستخدام السريع.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'video_basic',
    defaultTemplateIds: [
      'prod_crew_list',
      'prod_call_sheet',
      'prod_location_package',
      'prod_gear_log_thread',
      'prod_edit_plan',
      'prod_rough_cut_delivery',
      'prod_subtitles',
      'prod_color_grading',
      'prod_sound_mix',
      'prod_final_delivery',
      'prod_archive_metadata',
      'prod_post_shoot_report'
    ],
    supportTemplateIds: ['prod_camera_tests', 'prod_sound_library', 'prod_export_presets', 'prod_emergency_plan']
  },
  {
    key: 'production.video_doc_interviews',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'فيديو مقابلات وثائقية',
    description_ar: 'إنتاج فيديو وثائقي مبني على مقابلات ميدانية.',
    stages: [
      { key: 'research', name_ar: 'بحث وتحرير' },
      { key: 'prep', name_ar: 'تحضير وتصميم خطة التصوير' },
      { key: 'shoot', name_ar: 'التصوير' },
      { key: 'edit', name_ar: 'المونتاج' },
      { key: 'post', name_ar: 'صوت ولون وترجمة' },
      { key: 'delivery', name_ar: 'تسليم وأرشفة' }
    ],
    templateKeys: [
      // research
      'prod.research.editorial_brief',
      'prod.research.risk_check',
      // prep
      'prod.prep.crew_list',
      'prod.prep.call_sheet',
      'prod.prep.location_permits',
      'prod.prep.gear_thread',
      'prod.prep.emergency_plan',
      // shoot
      'prod.shoot.camera_tests',
      'prod.shoot.daily_log',
      // edit
      'prod.edit.plan',
      'prod.edit.rough_cut',
      // post
      'prod.post.subtitles',
      'prod.post.color_grade',
      'prod.post.sound_mix',
      // delivery
      'prod.delivery.export_presets',
      'prod.delivery.final_exports',
      'prod.delivery.archive_metadata',
      'prod.delivery.postmortem_report'
    ]
  },
  {
    key: 'think.research_brief',
    unitKey: 'think',
    unit: 'think',
    name_ar: 'مذكرة بحثية لسؤال مدني',
    description_ar:
      'تحويل سؤال مدني او سياسي معقّد الى مذكرة بحثية قابلة للاستخدام من فريق التحرير او الانتاج.',
    stages: [
      { key: 'intake', name_ar: 'استقبال السؤال' },
      { key: 'scoping', name_ar: 'تحديد نطاق البحث' },
      { key: 'collection', name_ar: 'جمع البيانات والمصادر' },
      { key: 'analysis', name_ar: 'تحليل وصياغة الفرضيات' },
      { key: 'peer_review', name_ar: 'مراجعة أقران' },
      { key: 'handoff', name_ar: 'تسليم وتوثيق' }
    ],
    templateKeys: [
      'think.brief.intake_question',
      'think.brief.scope_note',
      'think.brief.sources_map',
      'think.brief.data_collection',
      'think.brief.analysis_memo',
      'think.brief.peer_review',
      'think.brief.methods_handoff'
    ]
  },
  {
    key: 'think.support_investigation',
    unitKey: 'think',
    unit: 'think',
    name_ar: 'دعم بحثي لتحقيق او قصة كبرى',
    description_ar: 'تقديم دعم بحثي وتدقيق معلومات ومنهجية لقصة تعمل عليها وحدة الميديا او الانتاج.',
    stages: [
      { key: 'brief_sync', name_ar: 'مواءمة مع التحرير' },
      { key: 'research_sprint', name_ar: 'سباق بحث مكثف' },
      { key: 'risk_bias_check', name_ar: 'مراجعة المخاطر والانحياز' },
      { key: 'factcheck_round', name_ar: 'جولة تدقيق معلومات' },
      { key: 'methods_note', name_ar: 'ملاحظة منهجية مرافقة' }
    ],
    templateKeys: [
      'think.support.brief_sync',
      'think.support.research_sprint',
      'think.support.risk_bias_check',
      'think.support.factcheck_round',
      'think.support.methods_note'
    ]
  },
  {
    key: 'think.forum_design',
    unitKey: 'think',
    unit: 'think',
    name_ar: 'تصميم منتدى مدني او سلسلة حوارات',
    description_ar: 'تصميم الاسئلة والهيكل والمنهجية لسلسلة حوارات مدنية تنفذها وحدة الناس.',
    stages: [
      { key: 'question_map', name_ar: 'خريطة الاسئلة' },
      { key: 'stakeholder_scan', name_ar: 'مسح الاطراف والجمهور' },
      { key: 'format_design', name_ar: 'تصميم الشكل' },
      { key: 'materials', name_ar: 'المواد والاسئلة الافتتاحية' },
      { key: 'debrief_templates', name_ar: 'قوالب استخلاص التعلّم' }
    ],
    templateKeys: [
      'think.forum.question_map',
      'think.forum.stakeholder_scan',
      'think.forum.format_design',
      'think.forum.materials_pack',
      'think.forum.debrief_templates'
    ]
  },
  {
    key: 'media.lab90_cycle',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'برنامج حبق لاب 90 للإعلام المدني',
    description_ar: 'برنامج لمدة ٩٠ يوماً لتدريب المشاركين على الصحافة العامة التشاركية وتشغيل ثلاث ديسكات إنتاجية.',
    stages: [
      { key: 'recruit', name_ar: 'استقطاب واختيار' },
      { key: 'train_clinics', name_ar: 'عيادات النزاهة والمهارات' },
      { key: 'train_tools', name_ar: 'مختبرات الأدوات' },
      { key: 'desks', name_ar: 'إنتاج عبر الديسكات' },
      { key: 'forums', name_ar: 'حوارات مدنية' },
      { key: 'methods_mel', name_ar: 'المنهجية والمتابعة والتعلّم' }
    ],
    templateKeys: [
      // recruit and onboarding
      'media.lab90.recruitment_cohort',
      'media.lab90.onboarding_code_of_conduct',
      'media.lab90.baseline_assessment',

      // clinics and tools
      'media.lab90.clinics_schedule',
      'media.lab90.tool_labs_schedule',

      // desks and publishing quotas
      'media.lab90.daily_desk_quota',
      'media.lab90.features_desk_quota',
      'media.lab90.explainers_desk_quota',

      // civic forums
      'media.lab90.forums_plan',
      'media.lab90.forums_delivery',

      // methods and safeguards
      'media.lab90.methods_and_corrections',
      'media.lab90.visual_sensitivity_standard',

      // MEL and final learning
      'media.lab90.mel_cycle_report'
    ]
  },
  {
    key: 'production.video_premium',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'فيديو بريميوم بجودة عالية',
    description_ar: 'مقابلات أو إنتاجات بريميوم (قالب C) بمعايير مرجعية.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'video_premium',
    defaultTemplateIds: [
      'prod_crew_list',
      'prod_call_sheet',
      'prod_location_package',
      'prod_gear_log_thread',
      'prod_edit_plan',
      'prod_rough_cut_delivery',
      'prod_subtitles',
      'prod_color_grading',
      'prod_sound_mix',
      'prod_final_delivery',
      'prod_archive_metadata',
      'prod_post_shoot_report'
    ],
    inheritTemplatePipelineKeys: ['production.video_basic'],
    supportTemplateIds: ['prod_camera_tests', 'prod_sound_library', 'prod_export_presets', 'prod_emergency_plan']
  },
  {
    key: 'production.support',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'مهام دعم الإنتاج',
    description_ar: 'مهام البنية التحتية والدعم المتكرر للإنتاج.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'production_support',
    defaultTemplateIds: ['prod_camera_tests', 'prod_sound_library', 'prod_export_presets', 'prod_emergency_plan'],
    hidden: true
  },
  {
    key: 'media.article_short',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'مقال قصير',
    description_ar: 'مادة تحريرية من ٨٠٠ إلى ١٢٠٠ كلمة، مبنية على مقابلة أو اثنتين ومراجعة أساسية.',
    stages_ar: [
      'فكرة',
      'تكليف',
      'جمع مادة',
      'مسودة',
      'تحرير',
      'تدقيق حقائق',
      'وصول وأسلوب',
      'جاهز للنشر',
      'منشور',
      'مؤرشف / مصحح'
    ],
    suggestedStages: ['idea', 'assignment', 'research', 'draft', 'edit', 'factcheck', 'accessibility', 'publish', 'archive'],
    typical_length_words: [800, 1200],
    typical_turnaround_days: 5,
    defaultTaskTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_quick_interview',
      'media_short_article_write',
      'media_factcheck_bundle',
      'media_accessibility_check',
      'media_social_cut_3x',
      'media_corrections_log_entry'
    ],
    defaultTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_quick_interview',
      'media_short_article_write',
      'media_factcheck_bundle',
      'media_accessibility_check',
      'media_social_cut_3x',
      'media_corrections_log_entry'
    ]
  },
  {
    key: 'media.article_long',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'مادة مطوّلة',
    description_ar: 'تحقيق أو مادة معمّقة من ١٥٠٠ إلى ٢٠٠٠ كلمة مع مصادر متعددة.',
    stages_ar: [
      'فكرة',
      'تكليف',
      'جمع مادة',
      'خريطة بناء',
      'مسودة أولى',
      'مسودة نهائية',
      'تدقيق حقائق متقدّم',
      'وصول وأسلوب',
      'جاهز للنشر',
      'منشور',
      'مؤرشف / مصحح'
    ],
    suggestedStages: ['idea', 'assignment', 'research', 'structure', 'draft', 'final', 'factcheck', 'accessibility', 'publish', 'archive'],
    typical_length_words: [1500, 2200],
    typical_turnaround_days: 10,
    defaultTaskTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_research_background',
      'media_long_article_write',
      'media_factcheck_bundle',
      'media_risk_ethics_review',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ],
    defaultTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_research_background',
      'media_long_article_write',
      'media_factcheck_bundle',
      'media_risk_ethics_review',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ]
  },
  {
    key: 'media.photo_story',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'مقال بصري مصوّر',
    description_ar: 'قصة مصورة من ٦ إلى ٨ صور مع تسميات ونص مرافِق.',
    stages_ar: [
      'فكرة',
      'تكليف',
      'تصوير',
      'اختيار وتحرير بصري',
      'كتابة تسميات ونص مرافِق',
      'تدقيق حقائق أساسي',
      'وصول وأسلوب',
      'جاهز للنشر',
      'منشور',
      'مؤرشف'
    ],
    suggestedStages: ['idea', 'assignment', 'shoot', 'edit', 'publish', 'archive'],
    typical_length_words: [400, 800],
    typical_turnaround_days: 6,
    defaultTaskTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_photo_story_package',
      'media_factcheck_bundle',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ],
    defaultTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_photo_story_package',
      'media_factcheck_bundle',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ]
  },
  {
    key: 'media.data_brief',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'موجز مدعوم بالبيانات',
    description_ar: '٥ نقاط رئيسية مع رسم بياني أو خريطة ومراجع بيانات.',
    stages_ar: [
      'فكرة',
      'تكليف',
      'جمع بيانات',
      'تنظيف وتحليل أولي',
      'صياغة نقاط موجزة',
      'مراجعة منهجية',
      'تدقيق حقائق',
      'وصول وأسلوب',
      'منشور',
      'مؤرشف'
    ],
    suggestedStages: ['idea', 'assignment', 'analysis', 'draft', 'review', 'publish', 'archive'],
    typical_length_words: [600, 1200],
    typical_turnaround_days: 7,
    defaultTaskTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_data_brief',
      'media_method_memo',
      'media_factcheck_bundle',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ],
    defaultTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_data_brief',
      'media_method_memo',
      'media_factcheck_bundle',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ]
  },
  {
    key: 'media.short_video_social',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'فيديو قصير اجتماعي',
    description_ar: 'فيديو قصير من ٦٠ إلى ١٢٠ ثانية مهيأ للشبكات الاجتماعية.',
    stages_ar: [
      'فكرة',
      'تكليف',
      'سكريبت أو بنية',
      'مونتاج أولي',
      'مراجعة تحريرية',
      'ترجمة وترجمات',
      'وصول وأسلوب',
      'منشور',
      'مؤرشف'
    ],
    suggestedStages: ['idea', 'assignment', 'script', 'edit', 'review', 'publish', 'archive'],
    typical_length_seconds: [60, 120],
    typical_turnaround_days: 5,
    defaultTaskTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_short_video_script',
      'media_short_video_edit',
      'media_social_cut_3x',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ],
    defaultTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_short_video_script',
      'media_short_video_edit',
      'media_social_cut_3x',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ]
  },
  {
    key: 'media.podcast_short',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'حلقة بودكاست قصيرة',
    description_ar: 'حلقة من ٥ إلى ٨ دقائق مع ملاحظات الحلقة ونص مختصر.',
    stages_ar: [
      'فكرة',
      'تكليف',
      'خط حلقة',
      'تسجيل',
      'مونتاج صوت',
      'مراجعة تحريرية',
      'وصول وأسلوب',
      'منشور',
      'مؤرشف'
    ],
    suggestedStages: ['idea', 'assignment', 'outline', 'record', 'edit', 'review', 'publish', 'archive'],
    typical_length_minutes: [5, 8],
    typical_turnaround_days: 10,
    defaultTaskTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_podcast_outline',
      'media_podcast_edit',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ],
    defaultTemplateIds: [
      'media_ideas_round',
      'media_assignment_memo',
      'media_podcast_outline',
      'media_podcast_edit',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ]
  },
  {
    key: 'media.translation_adapt',
    unitKey: 'media',
    unit: 'media',
    name_ar: 'ترجمة أو تكييف',
    description_ar: 'نقل مادة بين العربية والإنجليزية مع تكييف سياقي أساسي.',
    stages_ar: [
      'تخصيص',
      'مسودة ترجمة',
      'مراجعة تحريرية',
      'مطابقة مع الأصل',
      'وصول وأسلوب',
      'منشور',
      'مؤرشف'
    ],
    suggestedStages: ['assignment', 'draft', 'edit', 'review', 'publish', 'archive'],
    typical_length_words: [800, 2000],
    typical_turnaround_days: 4,
    defaultTaskTemplateIds: [
      'media_translation',
      'media_editor_review',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ],
    defaultTemplateIds: [
      'media_translation',
      'media_editor_review',
      'media_accessibility_check',
      'media_corrections_log_entry'
    ]
  },
  {
    key: 'people.volunteer_onboarding',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'مسار اندماج المتطوعين',
    description_ar: 'من أول تواصل إلى إدماج المتطوع في مسار واضح مع ٣ مهام صغيرة ومُرشِد ومسؤول متابعة.',
    stages_ar: [
      'استمارة أو تواصل أولي',
      'مكالمة أو لقاء ترحيبي',
      'مواءمة مهارات وتفضيلات',
      'مهام تجريبية قصيرة',
      'تقييم أول دورة',
      'إدماج في المسار المناسب'
    ],
    suggestedStages: ['intake', 'welcome', 'alignment', 'trial', 'review', 'integration'],
    defaultTaskTemplateIds: [
      'people_volunteer_intake_match',
      'people_volunteer_onboarding_path',
      'people_welcome_calls_5',
      'people_mini_training_30min',
      'people_recognition_system'
    ],
    defaultTemplateIds: [
      'people_volunteer_intake_match',
      'people_volunteer_onboarding_path',
      'people_welcome_calls_5',
      'people_mini_training_30min',
      'people_recognition_system'
    ]
  },
  {
    key: 'people.partner_mapping',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'دفتر الشركاء المحليين والشتات',
    description_ar: 'بناء دفتر تواصل مع شركاء وداعمين محتملين من داخل السويداء والشتات، مع حالة العلاقة ومسؤول المتابعة.',
    stages_ar: [
      'حصر أولي للجهات المحتملة',
      'تواصل أولي وتعريف حبق',
      'تسجيل الاهتمامات المتبادلة',
      'اقتراحات تعاون أولية',
      'متابعة وتثبيت التفاهمات',
      'اتفاقات نشطة وتحديث دوري'
    ],
    suggestedStages: ['mapping', 'outreach', 'intake', 'proposal', 'followup', 'active'],
    defaultTaskTemplateIds: [
      'people_partner_directory_10',
      'people_partner_book_20',
      'people_recognition_system'
    ],
    defaultTemplateIds: [
      'people_partner_directory_10',
      'people_partner_book_20',
      'people_recognition_system'
    ]
  },
  {
    key: 'people.event_small',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'فعالية مجتمعية صغيرة',
    description_ar: 'لقاء صغير أو جلسة إصغاء أو نشاط مجتمعي ضمن مساحة محدودة، مع تخطيط بسيط لكن محترم للحضور.',
    stages_ar: [
      'فكرة ومحور',
      'تخطيط أولي',
      'دعوات وتأكيدات',
      'تجهيز المكان والوصول',
      'تنفيذ',
      'تجميع تغذية راجعة',
      'ملخص ما بعد الفعالية'
    ],
    suggestedStages: ['idea', 'plan', 'invite', 'logistics', 'execute', 'feedback', 'wrapup'],
    defaultTaskTemplateIds: [
      'people_salon_topic_planning',
      'people_event_access_guide',
      'people_tech_rehearsal',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_listening_session',
      'people_event_debrief',
      'people_coc_reminder_pack',
      'people_accessibility_checklist_event'
    ],
    defaultTemplateIds: [
      'people_salon_topic_planning',
      'people_event_access_guide',
      'people_tech_rehearsal',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_listening_session',
      'people_event_debrief',
      'people_coc_reminder_pack',
      'people_accessibility_checklist_event'
    ]
  },
  {
    key: 'people.event_music',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'فعالية موسيقية / ليلة موسيقى',
    description_ar: 'أمسية موسيقية أو عرض حي مع جمهور، من اختيار البرنامج إلى التوثيق وما بعد الفعالية.',
    stages_ar: [
      'فكرة وبرنامج مبدئي',
      'تأكيد المكان والفنانين',
      'خطة الوصول والسلامة',
      'الترويج',
      'تنفيذ',
      'تغذية راجعة',
      'ملخص ما بعد الفعالية'
    ],
    suggestedStages: ['idea', 'booking', 'accessibility', 'promo', 'execute', 'feedback', 'wrapup'],
    defaultTaskTemplateIds: [
      'people_salon_topic_planning',
      'people_event_access_guide',
      'people_tech_rehearsal',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_event_debrief',
      'people_coc_reminder_pack',
      'people_accessibility_checklist_event'
    ],
    defaultTemplateIds: [
      'people_salon_topic_planning',
      'people_event_access_guide',
      'people_tech_rehearsal',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_event_debrief',
      'people_coc_reminder_pack',
      'people_accessibility_checklist_event'
    ]
  },
  {
    key: 'people.event_forum',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'صالون أو منتدى حواري',
    description_ar: 'جلسة حوار أو صالون فكري مع متحدثين وجمهور، مع تنظيم للكلمة، السلامة، والوصول.',
    stages_ar: [
      'فكرة ومحور',
      'اختيار المتحدثين',
      'خط تشغيل وتوزيع وقت',
      'الترويج',
      'تنفيذ',
      'تغذية راجعة',
      'ملخص ما بعد الفعالية'
    ],
    suggestedStages: ['idea', 'speakers', 'run_of_show', 'promo', 'execute', 'feedback', 'wrapup'],
    defaultTaskTemplateIds: [
      'people_salon_topic_planning',
      'people_speakers_roster',
      'people_event_access_guide',
      'people_tech_rehearsal',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_event_debrief',
      'people_coc_reminder_pack',
      'people_accessibility_checklist_event'
    ],
    defaultTemplateIds: [
      'people_salon_topic_planning',
      'people_speakers_roster',
      'people_event_access_guide',
      'people_tech_rehearsal',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_event_debrief',
      'people_coc_reminder_pack',
      'people_accessibility_checklist_event'
    ]
  },
  {
    key: 'people.event_music_cycle',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'سلسلة أمسيات موسيقية (مثل Thursday Live Notes)',
    description_ar:
      'تخطيط وتنفيذ دورة من أمسيات موسيقية مدفوعة تخلق دورة اقتصادية وثقافية للفنانين والتقنيين.',
    stages: [
      { key: 'concept', name_ar: 'الفكرة والاتفاق مع المكان' },
      { key: 'booking', name_ar: 'حجوزات الفنانين والطاقم' },
      { key: 'logistics', name_ar: 'اللوجستيات والصوت والضيافة' },
      { key: 'comms_ticketing', name_ar: 'الإعلان والتذاكر' },
      { key: 'event_run', name_ar: 'تنفيذ الأمسيات' },
      { key: 'settlement_report', name_ar: 'التسوية والتقرير' }
    ],
    templateKeys: [
      'people.music.concept_and_venue',
      'people.music.artist_booking',
      'people.music.tech_and_safety_plan',
      'people.music.comms_and_ticketing',
      'people.music.run_sheet_cycle',
      'people.music.revenue_split_report'
    ]
  },
  {
    key: 'people.event_open_mic',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'مواسم الأوبن مايك والاكتشاف',
    description_ar:
      'تنظيم مواسم أمسيات أوبن مايك مجانية لاحتضان وتجريب المواهب الجديدة وتغذيتها نحو أمسيات أكبر.',
    stages: [
      { key: 'frame', name_ar: 'الإطار والقواعد' },
      { key: 'signup_system', name_ar: 'نظام المشاركة' },
      { key: 'support_safety', name_ar: 'الدعم والسلامة' },
      { key: 'event_run', name_ar: 'إدارة الأمسيات' },
      { key: 'documentation', name_ar: 'التوثيق واختيار المواهب' }
    ],
    templateKeys: [
      'people.openmic.guidelines',
      'people.openmic.signup_system',
      'people.openmic.safety_roles',
      'people.openmic.event_log',
      'people.openmic.talent_followup'
    ]
  },
  {
    key: 'people.exhibition_cycle',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'دورة معرض فني مع برنامج موازٍ',
    description_ar:
      'تنظيم معرض فني مع هوية كوريتورية وبرنامج حواري وموسيقي وطبقة رقمية بالتنسيق مع وحدة الجيكس.',
    stages: [
      { key: 'curation', name_ar: 'الاختيار والهوية' },
      { key: 'works_intake', name_ar: 'استلام الأعمال والبيانات' },
      { key: 'space_flow', name_ar: 'تصميم الفضاء ومسار الزائر' },
      { key: 'programming', name_ar: 'البرنامج الموازي' },
      { key: 'digital_layer', name_ar: 'الطبقة التفاعلية والبيع أونلاين' },
      { key: 'wrap_report', name_ar: 'الإغلاق والتقرير' }
    ],
    templateKeys: [
      'people.exhibit.curatorial_concept',
      'people.exhibit.artist_intake',
      'people.exhibit.space_and_flow',
      'people.exhibit.program_schedule',
      'people.exhibit.digital_coordination',
      'people.exhibit.wrap_report'
    ]
  },
  {
    key: 'people.training_mini',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'جلسة تدريب قصيرة',
    description_ar: 'تدريب بسيط من ٣٠ إلى ٩٠ دقيقة لأعضاء أو متطوعين، مع مواد مرافقة وتغذية راجعة.',
    stages_ar: [
      'تحديد الهدف والجمهور',
      'تصميم المحتوى',
      'دعوات وتسجيل',
      'تنفيذ الجلسة',
      'تغذية راجعة',
      'متابعة بسيطة أو مهام تطبيقية'
    ],
    suggestedStages: ['goal', 'content', 'invite', 'deliver', 'feedback', 'followup'],
    defaultTaskTemplateIds: [
      'people_mini_training_30min',
      'people_event_access_guide',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_event_debrief'
    ],
    defaultTemplateIds: [
      'people_mini_training_30min',
      'people_event_access_guide',
      'people_event_visual_assets',
      'people_event_feedback_form',
      'people_event_debrief'
    ]
  },
  {
    key: 'people.event_shihan_black_hall',
    unitKey: 'people',
    unit: 'people',
    name_ar: 'مهرجان شيحان / Black HALL',
    description_ar:
      'مهرجان موسيقي وفنون تجريبية في مقلع تل شيحان وقاعة بلاك هول مع برنامج حواري وتوثيقي.',
    stages: [
      'curatorial_concept',
      'partners_and_support',
      'artist_booking',
      'site_and_safety',
      'tech_and_logistics',
      'comms_and_ticketing',
      'festival_days',
      'documentation',
      'report_and_debrief'
    ],
    stages_ar: [
      'مفهوم وبرمجة',
      'شركاء ودعم',
      'حجوزات وفِرق',
      'الموقع والسلامة',
      'تقني ولوجستيات',
      'تواصل وتذاكر',
      'أيام المهرجان',
      'توثيق',
      'تقرير وخاتمة'
    ],
    suggestedStages: [
      'curatorial_concept',
      'partners_and_support',
      'artist_booking',
      'site_and_safety',
      'tech_and_logistics',
      'comms_and_ticketing',
      'festival_days',
      'documentation',
      'report_and_debrief'
    ],
    defaultTemplates: [
      'people.shihan.curatorial_brief',
      'people.shihan.partner_matrix',
      'people.shihan.artist_contracts',
      'people.shihan.site_plan_quarry',
      'people.shihan.site_plan_hall',
      'people.shihan.safety_plan',
      'people.shihan.tech_rider_master',
      'people.shihan.schedule_run_sheet',
      'people.shihan.comms_campaign',
      'people.shihan.ticketing_and_entry',
      'people.shihan.documentation_plan',
      'people.shihan.post_report'
    ],
    defaultTaskTemplateIds: [
      'people.shihan.curatorial_brief',
      'people.shihan.partner_matrix',
      'people.shihan.artist_contracts',
      'people.shihan.site_plan_quarry',
      'people.shihan.site_plan_hall',
      'people.shihan.safety_plan',
      'people.shihan.tech_rider_master',
      'people.shihan.schedule_run_sheet',
      'people.shihan.comms_campaign',
      'people.shihan.ticketing_and_entry',
      'people.shihan.documentation_plan',
      'people.shihan.post_report'
    ],
    defaultTemplateIds: [
      'people.shihan.curatorial_brief',
      'people.shihan.partner_matrix',
      'people.shihan.artist_contracts',
      'people.shihan.site_plan_quarry',
      'people.shihan.site_plan_hall',
      'people.shihan.safety_plan',
      'people.shihan.tech_rider_master',
      'people.shihan.schedule_run_sheet',
      'people.shihan.comms_campaign',
      'people.shihan.ticketing_and_entry',
      'people.shihan.documentation_plan',
      'people.shihan.post_report'
    ],
    defaultChannels: {
      main: 'people.shihan_black_hall',
      ops: 'production.shihan_ops',
      media: 'media.shihan_docs',
      geeks: 'geeks.shihan_acoustics'
    }
  },
  {
    key: 'geeks.site_basic',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'موقع بسيط (مؤسسة أو مشروع)',
    description_ar:
      'موقع بسيط من صفحة إلى ثلاث صفحات لتعريف مؤسسة أو مشروع، مع بنية واضحة وسهلة الصيانة.',
    stages_ar: [
      'اكتشاف وملخص احتياج',
      'هيكل الصفحات والمحتوى',
      'التنفيذ والتكويد',
      'اختبار وتجربة',
      'إطلاق',
      'تسليم وتوثيق'
    ],
    suggestedStages: ['discovery', 'structure', 'build', 'test', 'launch', 'handoff'],
    profile: 'site_basic',
    defaultTaskTemplateIds: [
      'geeks_site_brief',
      'geeks_site_structure',
      'geeks_site_setup',
      'geeks_site_qc',
      'geeks_site_launch_doc'
    ],
    defaultTemplateIds: [
      'geeks_site_brief',
      'geeks_site_structure',
      'geeks_site_setup',
      'geeks_site_qc',
      'geeks_site_launch_doc'
    ]
  },
  {
    key: 'geeks.app_small',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'تطبيق صغير لكن جدي',
    description_ar: 'تطوير تطبيقات صغيرة تخدم حبق او المجتمع مثل الألعاب البسيطة، أدوات الوصول، او لوحات التحكم.',
    stages: [
      { key: 'discovery', name_ar: 'فهم الحاجة' },
      { key: 'design', name_ar: 'تصميم بسيط للتجربة' },
      { key: 'build_mvp', name_ar: 'بناء نسخة أولى' },
      { key: 'field_test', name_ar: 'اختبار ميداني' },
      { key: 'deploy', name_ar: 'النشر الأولي' },
      { key: 'handover_maintain', name_ar: 'التسليم او الصيانة' }
    ],
    templateKeys: [
      'geeks.app.discovery',
      'geeks.app.spec',
      'geeks.app.milestone_mvp',
      'geeks.app.field_test',
      'geeks.app.deploy',
      'geeks.app.handover_maintain'
    ],
    defaultTemplateIds: [
      'geeks.app.discovery',
      'geeks.app.spec',
      'geeks.app.milestone_mvp',
      'geeks.app.field_test',
      'geeks.app.deploy',
      'geeks.app.handover_maintain'
    ]
  },
  {
    key: 'geeks.app_accessibility',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'تحسين وصول تطبيق أو أداة قائمة',
    description_ar:
      'مسار تدقيق وتحسين وصول لتطبيق أو أداة موجودة، مع خطة إصلاح واختبارات قارئ الشاشة وإطلاق آمن.',
    stages_ar: [
      'تقييم وصول',
      'خطة إصلاح',
      'تنفيذ وتوثيق',
      'اختبار مستخدمين/قارئ شاشة',
      'إطلاق وتحذيرات',
      'مراقبة وتعلّم'
    ],
    suggestedStages: ['audit', 'plan', 'fix', 'user_test', 'rollout', 'monitor'],
    profile: 'app_accessibility',
    defaultTemplates: [
      'geeks_accessibility_audit',
      'geeks_accessibility_fix_plan',
      'geeks_accessibility_fix_round',
      'geeks_accessibility_user_test',
      'geeks_app_launch_note'
    ],
    defaultTaskTemplateIds: [
      'geeks_accessibility_audit',
      'geeks_accessibility_fix_plan',
      'geeks_accessibility_fix_round',
      'geeks_accessibility_user_test',
      'geeks_app_launch_note'
    ],
    defaultTemplateIds: [
      'geeks_accessibility_audit',
      'geeks_accessibility_fix_plan',
      'geeks_accessibility_fix_round',
      'geeks_accessibility_user_test',
      'geeks_app_launch_note'
    ],
    defaultChannels: {
      audit: 'geeks.qa',
      plan: 'geeks.apps',
      fixes: 'geeks.apps',
      testing: 'geeks.qa',
      feedback: 'people.feedback',
      docs: 'admin.docs'
    }
  },
  {
    key: 'geeks.automation_stack',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'حزمة الأتمتة والبيانات',
    description_ar: 'تصميم وبناء الأتمتة بين ديسكورد، ووردبريس، أدوات التحليل، وHabApp لتخفيف العمل اليدوي.',
    stages: [
      { key: 'intake_prioritize', name_ar: 'استقبال الطلب وترتيب الأولوية' },
      { key: 'flow_design', name_ar: 'تصميم تدفق الأتمتة' },
      { key: 'implementation', name_ar: 'التنفيذ' },
      { key: 'sandbox_test', name_ar: 'اختبار في بيئة تجريبية' },
      { key: 'rollout', name_ar: 'إطلاق تدريجي' },
      { key: 'docs', name_ar: 'توثيق للمستخدمين' }
    ],
    templateKeys: [
      'geeks.stack.intake_prioritize',
      'geeks.stack.flow_design',
      'geeks.stack.implementation',
      'geeks.stack.sandbox_test',
      'geeks.stack.rollout',
      'geeks.stack.docs'
    ],
    defaultTemplateIds: [
      'geeks.stack.intake_prioritize',
      'geeks.stack.flow_design',
      'geeks.stack.implementation',
      'geeks.stack.sandbox_test',
      'geeks.stack.rollout',
      'geeks.stack.docs'
    ]
  },
  {
    key: 'geeks.discord_infra',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'بنية ديسكورد والبوتات',
    description_ar: 'مراجعة وتصميم بنية الخادم، الصلاحيات، الأونبوردنغ، وربط HabApp وباقي البوتات.',
    stages: [
      { key: 'audit', name_ar: 'مراجعة الوضع الحالي' },
      { key: 'design', name_ar: 'تصميم البنية الجديدة' },
      { key: 'staging', name_ar: 'تطبيق تجريبي' },
      { key: 'migration', name_ar: 'نقل التعديلات للسيرفر الأساسي' },
      { key: 'habapp_integration', name_ar: 'دمج HabApp والأتمتة' },
      { key: 'docs_training', name_ar: 'شرح وتدريب للفريق' }
    ],
    templateKeys: [
      'geeks.discord.audit_current',
      'geeks.discord.new_structure_design',
      'geeks.discord.staging_setup',
      'geeks.discord.migration_plan',
      'geeks.discord.habapp_integration',
      'geeks.discord.moderator_guide'
    ],
    defaultTemplateIds: [
      'geeks.discord.audit_current',
      'geeks.discord.new_structure_design',
      'geeks.discord.staging_setup',
      'geeks.discord.migration_plan',
      'geeks.discord.habapp_integration',
      'geeks.discord.moderator_guide'
    ]
  }
];

function getUnitByKey(key) {
  const normalized = String(key || '').toLowerCase();
  return units.find(u => u.key === normalized) || null;
}

function getPipelineByKey(key) {
  const normalized = String(key || '').toLowerCase();
  return pipelines.find(p => p.key === normalized) || null;
}

function listPipelinesByUnit(unitKey) {
  const normalized = String(unitKey || '').toLowerCase();
  return pipelines.filter(p => p.unitKey === normalized);
}

module.exports = {
  units,
  pipelines,
  getUnitByKey,
  getPipelineByKey,
  listPipelinesByUnit
};
