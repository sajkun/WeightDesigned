<?php

return [
    'superadmin' => 'superadmin',
    'admin_roles' => ['admin', 'superadmin'],
    'customer_admin_roles' => ['user_control'],
    'customer_register_role' => 'user_control',
    'customer_roles' => ['user_control',  'user_security', 'apk_user', 'user_storage', 'user_director'],
    'roles_nice_names' => [
        'superadmin' => 'Супер администратор',
        'admin' => 'Администратор Системы',
        'user_control' => 'Администратор Агрохозяйства',
        'user_security' => 'Служба безопасности',
        'user_storage' => 'Оператор склада',
        'user_director' => 'Директор агрохозяйства',
        'apk_user' => 'Пользователь мобильного приложения',
    ]
];
