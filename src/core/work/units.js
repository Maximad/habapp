// src/core/units.js
// Defines HabApp units and their pipelines independent of Discord wiring.

const units = [
  {
    key: 'production',
    name_ar: 'وحدة الإنتاج',
    description_ar: 'مسؤولة عن الفيديوهات، الوثائقيات، والمشاريع المرئية.',
    pipelines: ['production.video_basic', 'production.video_doc', 'production.video_premium']
  },
  {
    key: 'media',
    name_ar: 'وحدة الإعلام',
    description_ar: 'تكتب وتنشر المقالات والقصص المصوّرة والمحتوى الاجتماعي.',
    pipelines: [
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
    name_ar: 'وحدة الناس',
    description_ar: 'تنظّم الفعاليات والحوارات والسهرات الثقافية.',
    pipelines: [
      'people.volunteer_onboarding',
      'people.partner_mapping',
      'people.event_small',
      'people.event_music',
      'people.event_forum',
      'people.training_mini',
      'people.event_shihan_black_hall'
    ]
  },
  {
    key: 'geeks',
    name_ar: 'وحدة الجيكس',
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
    key: 'production.video_doc',
    unitKey: 'production',
    unit: 'production',
    name_ar: 'فيديو مقابلات وثائقية',
    description_ar: 'مقابلات وثائقية قياسية (قالب B) مع مسار مراجعة واضح.',
    suggestedStages: ['idea', 'prep', 'execution', 'review', 'archive'],
    profile: 'video_doc',
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
    name_ar: 'تطبيق أو أداة صغيرة',
    description_ar:
      'أداة صغيرة أو Bot أو سكربت أتمتة يخدم وحدة واحدة أو عملية محددة داخل حبق.',
    stages_ar: [
      'تعريف المشكلة والاحتياج',
      'تصميم بسيط للحل',
      'تنفيذ أولي',
      'اختبار داخلي',
      'إطلاق تجريبي',
      'تحسين وصيانة'
    ],
    suggestedStages: ['problem', 'design', 'build', 'test', 'beta', 'improve'],
    profile: 'app_small',
    defaultTaskTemplateIds: [
      'geeks_app_brief',
      'geeks_app_architecture_note',
      'geeks_app_prototype',
      'geeks_app_internal_test',
      'geeks_app_launch_note',
      'geeks_app_maintenance_log'
    ],
    defaultTemplateIds: [
      'geeks_app_brief',
      'geeks_app_architecture_note',
      'geeks_app_prototype',
      'geeks_app_internal_test',
      'geeks_app_launch_note',
      'geeks_app_maintenance_log'
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
    name_ar: 'أتمتة وتكاملات داخلية',
    description_ar:
      'مشاريع أتمتة تربط ووردبريس وDiscord وDrive وأنظمة أخرى، مع نسخ احتياطي وتسمية ملفات منضبطة.',
    stages_ar: [
      'حصر الاحتياج ووصف التدفق',
      'تصميم مسار الأتمتة',
      'تنفيذ وربط الخدمات',
      'اختبارات على بيانات حقيقية',
      'توثيق وتدريب الفريق',
      'مراقبة وصيانة'
    ],
    suggestedStages: ['intake', 'design', 'implement', 'test', 'document', 'maintain'],
    profile: 'automation_stack',
    defaultTaskTemplateIds: [
      'geeks_formsbot_to_onboarding',
      'geeks_wp_webhook_bridge',
      'geeks_wp_to_announcements_webhook',
      'geeks_filename_alert_bot',
      'geeks_filename_naming_bot',
      'geeks_monthly_backup_routine',
      'geeks_attachments_backup',
      'geeks_media_compression_presets'
    ],
    defaultTemplateIds: [
      'geeks_formsbot_to_onboarding',
      'geeks_wp_webhook_bridge',
      'geeks_wp_to_announcements_webhook',
      'geeks_filename_alert_bot',
      'geeks_filename_naming_bot',
      'geeks_monthly_backup_routine',
      'geeks_attachments_backup',
      'geeks_media_compression_presets'
    ]
  },
  {
    key: 'geeks.discord_infra',
    unitKey: 'geeks',
    unit: 'geeks',
    name_ar: 'بنية ديسكورد والأمان الرقمي',
    description_ar: 'مشاريع تضبط بنية ديسكورد، صلاحيات الأدوار، استجابات البوتات، وسلامة القنوات.',
    stages_ar: [
      'حصر الوضع الحالي والأخطار',
      'تخطيط الأدوار والقنوات',
      'تحديث إعدادات البوتات',
      'اختبار صلاحيات ومنبهات',
      'توثيق وتدريب مختصر',
      'مراجعة دورية'
    ],
    suggestedStages: ['audit', 'plan_roles', 'update_bots', 'test', 'document', 'review'],
    profile: 'discord_infra',
    defaultTaskTemplateIds: [
      'geeks_carl_roles_audit',
      'geeks_pins_update_script',
      'geeks_permissions_audit_script',
      'geeks_security_audit_tokens',
      'geeks_formsbot_to_onboarding'
    ],
    defaultTemplateIds: [
      'geeks_carl_roles_audit',
      'geeks_pins_update_script',
      'geeks_permissions_audit_script',
      'geeks_security_audit_tokens',
      'geeks_formsbot_to_onboarding'
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
