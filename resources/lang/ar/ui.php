<?php

return [
    // Home Page
    'home' => [
        'hero' => [
            'title' => 'مرحباً بك في رحلتك التعليمية',
            'subtitle' => 'اكتشف آلاف الدورات من أفضل المنصات وطور مهاراتك من خلال مواردنا التعليمية المنتقاة بعناية.',
            'browse_courses' => 'تصفح جميع الدورات',
            'quick_search' => 'بحث سريع',
        ],
        'stats' => [
            'total_courses' => 'إجمالي الدورات',
            'categories' => 'الفئات',
            'platforms' => 'المنصات',
            'with_certificates' => 'مع شهادات',
        ],
        'quick_search_section' => [
            'title' => 'بحث وتصفية سريعة',
            'search_button' => 'البحث عن الدورات',
        ],
        'featured' => [
            'title' => 'الدورات المميزة',
            'subtitle' => 'دورات منتقاة بعناية لمساعدتك على البدء في رحلتك التعليمية',
            'view_all' => 'عرض جميع الدورات',
            'no_courses' => 'لا توجد دورات مميزة بعد',
            'no_courses_desc' => 'ستظهر الدورات المميزة هنا بمجرد إضافتها إلى المنصة.',
        ],
        'popular_categories' => 'الفئات الشائعة',
        'course_count' => ':count دورة|:count دورات',
    ],

    // Courses Index Page
    'courses' => [
        'hero' => [
            'badge' => 'اكتشف رحلتك التعليمية التالية',
            'title' => 'استكشف الدورات',
            'subtitle' => 'ابحث عن الدورة المثالية لتطوير مهاراتك. من الدروس الملائمة للمبتدئين إلى الفصول المتقدمة.',
        ],
        'stats' => [
            'total_courses' => 'إجمالي الدورات',
            'free_courses' => 'دورات مجانية',
            'categories' => 'الفئات',
            'platforms' => 'المنصات',
        ],
        'filters' => [
            'title' => 'خيارات التصفية',
            'clear_all' => 'مسح جميع التصفيات',
            'active_filters' => 'التصفيات النشطة',
            'clear' => 'مسح الكل',
            'reset_all' => 'إعادة تعيين الكل',
        ],
        'results' => [
            'courses_found' => 'تم العثور على :count دورة|تم العثور على :count دورات',
            'no_courses' => 'لم يتم العثور على دورات',
            'showing' => 'عرض :from - :to من :total نتيجة',
                'no_match_hint' => 'لم نجد دورات مطابقة لمعاييرك. جرّب تعديل التصفيات أو كلمات البحث.',

        ],
        'sort' => [
            'label' => 'ترتيب حسب:',
            'newest' => 'الأحدث أولاً',
            'oldest' => 'الأقدم أولاً',
            'price_low' => 'السعر: من الأقل للأعلى',
            'price_high' => 'السعر: من الأعلى للأقل',
            'title' => 'العنوان أ-ي',
            'popularity' => 'الأكثر شهرة',
        ],
        'quick_stats' => [
            'title' => 'إحصائيات سريعة',
            'results_found' => 'النتائج المعثور عليها',
            'free_courses' => 'دورات مجانية',
            'categories' => 'الفئات',
        ],
    ],

    // Search Page
    'search' => [
        'badge' => 'نتائج البحث',
        'subtitle' => 'قم بتحسين بحثك أدناه باستخدام الفئات والمنصات والمستويات والعلامات والسعر وخيارات الشهادة.',
        'no_results' => 'لا توجد نتائج لـ ":query"',
        'reset_filters' => 'إعادة تعيين التصفيات',
    ],

    // Course Show Page
    'course_show' => [
        'back' => 'العودة إلى الدورات',
        'back_mobile' => 'رجوع',
        'not_found' => 'الدورة غير موجودة',
        'not_found_desc' => 'الدورة التي تبحث عنها غير موجودة أو تم إزالتها.',
        'browse_all' => 'تصفح جميع الدورات',
        'duration' => 'المدة',
        'level' => 'المستوى',
        'platform' => 'المنصة',
        'price' => 'السعر',
        'free' => 'مجاني',
        'enroll' => [
            'price_label' => 'سعر الدورة',
            'enroll_now' => 'التسجيل الآن',
            'start_free' => 'ابدأ التعلم مجاناً',
            'start_course' => 'ابدأ الدورة مجاناً',
            'preview_question' => 'هل تريد المعاينة أولاً؟',
            'free_preview' => 'معاينة مجانية',
        ],
        'includes' => [
            'title' => 'تشمل هذه الدورة',
            'full_access' => 'وصول كامل مدى الحياة',
            'certificate' => 'شهادة إتمام',
            'learn_anywhere' => 'تعلم بالسرعة التي تناسبك',
            'platform_access' => 'الوصول على :platform',
        ],
        'description' => [
            'title' => 'وصف الدورة',
            'what_learn' => 'ما الذي ستتعلمه',
            'requirements' => 'المتطلبات',
            'level' => 'مستوى المهارة',
        ],
        'tags' => 'علامات الدورة',
        'related' => [
            'title' => 'دورات ذات صلة',
            'subtitle' => 'قد تكون مهتماً أيضاً بهذه الدورات',
            'no_related' => 'لا توجد دورات ذات صلة متاحة في الوقت الحالي.',
        ],
    ],

    // Payment Page
    'payment' => [
        'not_found' => 'الدورة غير موجودة',
        'not_found_desc' => 'الدورة التي تبحث عنها غير موجودة أو تم إزالتها.',
        'course_free' => 'هذه الدورة مجانية!',
        'course_free_desc' => ':title متاحة مجاناً. يمكنك البدء في التعلم على الفور!',
        'back_course' => 'العودة إلى الدورة',
        'start_learning' => 'ابدأ التعلم',
        'title' => 'الدفع للدورة',
        'subtitle' => 'أكمل تسجيلك في هذه الدورة. سيساعدك فريقنا في عملية الدفع.',
        'course_info' => [
            'title' => 'معلومات الدورة',
            'price_label' => 'سعر الدورة',
            'certificate' => 'شهادة',
        ],
        'form' => [
            'title' => 'معلومات الاتصال',
            'subtitle' => 'يرجى تقديم تفاصيلك وسنتواصل معك لإكمال الدفع.',
            'full_name' => 'الاسم الكامل',
            'full_name_placeholder' => 'أدخل اسمك الكامل',
            'phone' => 'رقم الهاتف',
            'phone_placeholder' => 'أدخل رقم هاتفك',
            'email' => 'عنوان البريد الإلكتروني',
            'email_placeholder' => 'أدخل بريدك الإلكتروني',
            'message' => 'رسالة إضافية',
            'message_placeholder' => 'أي أسئلة أو طلبات خاصة؟ (اختياري)',
            'submit' => 'إرسال طلب الدفع',
            'submitting' => 'جاري الإرسال...',
            'identity_image' => 'صورة الهوية',
    'identity_click_to_upload' => 'انقر لرفع صورة الهوية',
    'identity_formats' => 'PNG أو JPG أو JPEG حتى 10MB',
    'identity_preview_alt' => 'معاينة الهوية',
    'reason' => 'لماذا ترغب بشراء هذه الدورة؟',
    'reason_placeholder' => 'يرجى توضيح سبب اهتمامك بهذه الدورة وكيف ستساعدك...',
    'contact_notice' => 'بعد إرسال هذا النموذج سيتواصل معك فريقنا عبر واتساب أو البريد الإلكتروني للمساعدة في الدفع.',
        ],
        'security' => [
            'title' => 'عملية دفع آمنة',
            'desc' => 'معلوماتك محمية وسيتم استخدامها فقط لمعالجة تسجيلك في الدورة.',
        ],
    ],

    // Payment Success Page
    'payment_success' => [
        'title' => 'تم إرسال طلب الدفع بنجاح!',
        'subtitle' => 'شكراً لاهتمامك بهذه الدورة. لقد تلقينا طلب الدفع الخاص بك وسنتواصل معك قريباً لإكمال تسجيلك.',
        'response_time' => 'وقت الاستجابة المتوقع: 2-4 ساعات',
        'course_details' => 'تفاصيل الدورة',
        'submission_details' => [
            'title' => 'تفاصيل إرسالك',
            'full_name' => 'الاسم الكامل:',
            'phone' => 'رقم الهاتف:',
            'email' => 'عنوان البريد الإلكتروني:',
        ],
        'next_steps' => [
            'title' => 'ماذا يحدث بعد ذلك؟',
            'review' => [
                'title' => 'عملية المراجعة',
                'desc' => 'سيقوم فريقنا بمراجعة طلب الدفع وتفاصيل تسجيلك في الدورة للتأكد من أن كل شيء على ما يرام.',
            ],
            'whatsapp' => [
                'title' => 'التواصل عبر واتساب',
                'desc' => 'سنتواصل معك عبر واتساب خلال 2-4 ساعات لمناقشة خيارات الدفع واستكمال تسجيلك.',
            ],
            'email' => [
                'title' => 'المتابعة عبر البريد الإلكتروني',
                'desc' => 'ستتلقى رسالة تأكيد عبر البريد الإلكتروني تحتوي على تعليمات الدفع التفصيلية ومعلومات الوصول إلى الدورة.',
            ],
        ],
        'actions' => [
            'browse_more' => 'تصفح المزيد من الدورات',
            'view_details' => 'عرض تفاصيل الدورة',
        ],
        'help' => [
            'title' => 'هل تحتاج مساعدة؟',
            'desc' => 'إذا كان لديك أي أسئلة حول طلب الدفع الخاص بك أو تحتاج إلى مساعدة فورية، فلا تتردد في الاتصال بفريق الدعم لدينا.',
        ],
    ],

    // Filters Component
    'filters' => [
        'search_placeholder' => 'ابحث عن الدورات بالعنوان أو الوصف أو المدرب...',
        'advanced_filters' => 'تصفيات متقدمة',
        'refine_search' => 'قم بتحسين بحثك بخيارات تفصيلية',
        'active' => ':count نشط',
        'filter_options' => 'خيارات التصفية',
        'course_type' => [
            'label' => 'نوع الدورة',
            'all' => 'جميع الدورات',
            'free' => 'دورات مجانية',
            'paid' => 'دورات مدفوعة',
        ],
        'category' => [
            'label' => 'الفئات',
            'selected' => 'تم تحديد :count',
        ],
        'platform' => [
            'label' => 'المنصات',
            'selected' => 'تم تحديد :count',
        ],
        'level' => [
            'label' => 'مستويات الصعوبة',
            'selected' => 'تم تحديد :count',
            'beginner' => 'مبتدئ',
            'intermediate' => 'متوسط',
            'advanced' => 'متقدم',
        ],
        'certificate' => [
            'label' => 'خيارات الشهادة',
            'checkbox_label' => 'إظهار الدورات مع الشهادات فقط',
        ],
        'tags' => [
            'label' => 'العلامات الشائعة',
            'selected' => 'تم تحديد :count',
        ],
        'more_options' => 'المزيد من الخيارات',
        'with_certificate' => 'مع شهادة',
    ],

    // Sidebar Filters
    'sidebar_filters' => [
        'filters' => 'التصفيات',
        'refine_results' => 'تحسين نتائجك',
        'course_type' => 'نوع الدورة',
        'category' => 'الفئة',
        'all_categories' => 'جميع الفئات',
        'platform' => 'المنصة',
        'all_platforms' => 'جميع المنصات',
        'level' => 'المستوى',
        'all_levels' => 'جميع المستويات',
        'more_options' => 'المزيد من الخيارات',
        'popular_tags' => 'العلامات الشائعة',
        'clear_filters' => 'مسح التصفيات',
    ],

    // Badges & Labels
    'badges' => [
        'free' => 'مجاني',
        'certificate' => 'شهادة',
        'beginner' => 'مبتدئ',
        'intermediate' => 'متوسط',
        'advanced' => 'متقدم',
    ],

    // Common
    'common' => [
        'loading' => 'جاري التحميل...',
        'back' => 'رجوع',
        'close' => 'إغلاق',
        'submit' => 'إرسال',
        'cancel' => 'إلغاء',
        'save' => 'حفظ',
        'delete' => 'حذف',
        'edit' => 'تعديل',
        'view' => 'عرض',
        'search' => 'بحث',
        'filter' => 'تصفية',
        'clear' => 'مسح',
        'reset' => 'إعادة تعيين',
        'select' => 'اختيار',
        'all' => 'الكل',
        'home' => 'الرئيسية',
        'courses' => 'الدورات',
        'site_name' => 'سويداء التعليمية',
        'welcome' => 'مرحباً',
        'dashboard' => 'لوحة التحكم',
        'logout' => 'تسجيل الخروج',
        'login' => 'تسجيل الدخول',
        'sign_up' => 'إنشاء حساب',
    ],

    // Footer
    'footer' => [
        'platform' => 'المنصة',
        'browse_courses' => 'تصفح الدورات',
        'featured' => 'المميزة',
        'support' => 'الدعم',
        'help_center' => 'مركز المساعدة',
        'description' => 'اكتشف واستكشف أفضل الدورات التدريبية عبر الإنترنت من أفضل المنصات. تعلم مهارات جديدة، وطور مسيرتك المهنية، وحقق أهدافك.',
        'copyright' => '© :year منصة سويداء التعليمية. جميع الحقوق محفوظة.',
    ],
    'sponsor' => [
    'students_supported' => 'الطلاب المدعومون',
    'total_allocations' => 'إجمالي التخصيصات',
        'change_password' => 'تغيير كلمة المرور',
  'title' => 'بوابة الراعي',
  'welcome' => 'مرحباً، :name',
  'last_login' => 'آخر تسجيل دخول:',
  'none' => '—',
  'contact' => 'معلومات التواصل',
  'email' => 'البريد الإلكتروني',
  'phone' => 'رقم الهاتف',
  'initial_amount' => 'المبلغ الابتدائي',
  'current_balance' => 'الرصيد الحالي',
  'external' => 'خارجي',
  'allocations' => [
    'title' => 'التخصيصات',
    'recipient' => 'المستفيد',
    'course' => 'الدورة',
    'amount' => 'المبلغ',
    'date' => 'التاريخ',
    'empty' => 'لا توجد تخصيصات بعد.',
  ],
  'transactions' => [
    'title' => 'المعاملات',
    'type' => 'النوع',
    'amount' => 'المبلغ',
    'reference' => 'المرجع',
    'notes' => 'ملاحظات',
    'date' => 'التاريخ',
    'empty' => 'لا توجد معاملات بعد.',
    'types' => [
      'top_up' => 'إيداع',
      'adjustment' => 'تسوية',
      'refund' => 'استرداد',
    ],
  ],
],
'sponsor_login' => [
    'title' => 'تسجيل دخول الراعي',
    'email' => 'البريد الإلكتروني',
    'password' => 'كلمة المرور',
    'remember' => 'تذكرني',
    'submit' => 'تسجيل الدخول',
    'submitting' => 'جاري تسجيل الدخول...',
    'need_help' => 'هل تحتاج مساعدة؟',
    'contact_support' => 'تواصل مع الدعم.',
],
'sponsor_change_password' => [
    'title' => 'تغيير كلمة المرور',
    'subtitle' => 'لأسباب أمنية، يرجى تعيين كلمة مرور جديدة قبل المتابعة.',
    'current' => 'كلمة المرور الحالية',
    'new' => 'كلمة المرور الجديدة',
    'confirm' => 'تأكيد كلمة المرور الجديدة',
    'update' => 'تحديث كلمة المرور',
    'updating' => 'جاري التحديث...',
],
'pagination' => [
  'previous' => 'السابق',
  'next' => 'التالي',
],
'course_card' => [
    'self_paced' => 'ذاتي التعلم',
    'under_1_hour' => 'أقل من ساعة',
    'one_hour' => 'ساعة واحدة',
    'hours' => ':count ساعات', // اختر الصياغة المناسبة حسب نظام الجمع لديك
    'course_preview' => 'معاينة الدورة',
    'preview' => 'معاينة',
    'certificate_included' => 'تشمل شهادة',
    'more_tags' => '+:count المزيد',
    'view_details' => 'عرض التفاصيل',
    'view_course' => 'عرض الدورة',
],

];
