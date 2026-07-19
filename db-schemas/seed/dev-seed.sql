INSERT INTO iam.user_types (user_types_code, user_types_name, user_types_desc) VALUES
    ('owner', 'Şirket Sahibi', 'Tüm şirket ve şubeleri yöneten ana yetkili'),
    ('manager', 'Şube Yöneticisi', 'Bağlı olduğu şubeyi yöneten yetkili'),
    ('barber', 'Berber/Personel', 'Randevuları karşılayan ve hizmet veren çalışan'),
    ('customer', 'Müşteri', 'Hizmet alan kullanıcı')
ON CONFLICT (user_types_code) DO NOTHING;
