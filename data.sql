-- Thêm dữ liệu vào bảng users
INSERT INTO users (username, email, password, first_name, last_name, phone, avatar, role, created_at) VALUES
('admin', 'admin@gmail.com', '$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG', 'Admin', 'System', 123456789, 'https://res.cloudinary.com/druxxfmia/image/upload/v1751448454/f9l6og6hmofqfcqllvoj.png', 'ADMIN', NOW()),
('user1', 'user1@gamil.com', '$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG', 'User', 'One', 987654321, 'https://res.cloudinary.com/druxxfmia/image/upload/v1751448454/f9l6og6hmofqfcqllvoj.png', 'CUSTOMER', NOW());
