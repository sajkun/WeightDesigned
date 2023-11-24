<?php

return [
    'superadmin' => 'superadmin',
    'admin_roles' => ['admin', 'superadmin'],
    'customer_admin_roles' => ['user_control'],
    'customer_register_role' => 'user_control',
    'customer_roles' => ['user_control',  'user_control_vehicles', 'user_control_employees', 'user_manager', 'user_director'],
    'roles_nice_names' => [
        'superadmin' => 'Супер администратор',
        'admin' => 'Администратор Системы',
        'user_control' => 'Администратор Агрохозяйства',
        'user_director' => 'Директор агрохозяйства',
        'user_control_vehicles' => 'Ответственный за технику',
        'user_control_employees' => 'Ответственный за персонал',
        'user_manager' => 'Менеджер',
    ]
];
