-- Sample Data Migration
-- This file contains sample data for testing the application

-- =============================================
-- 1. USERS (Sample Users)
-- =============================================
INSERT INTO users (username, email, password_hash, bio, avatar_id) VALUES
('ahmet_yilmaz', 'ahmet@example.com', '$2a$10$YourHashedPasswordHere', 'Film ve kitap tutkunu. Bilim kurgu severim! 🚀', 1),
('ayse_demir', 'ayse@example.com', '$2a$10$YourHashedPasswordHere', 'Klasik romanlar ve sanat sineması hayranı. 📚🎬', 2),
('mehmet_kaya', 'mehmet@example.com', '$2a$10$YourHashedPasswordHere', 'Fantastik edebiyat ve aksiyon filmleri benim işim! ⚔️', 3),
('zeynep_ozturk', 'zeynep@example.com', '$2a$10$YourHashedPasswordHere', 'Bağımsız filmler ve deneysel edebiyat okuyorum. 🎨', 4),
('can_arslan', 'can@example.com', '$2a$10$YourHashedPasswordHere', 'Polisiye ve gerilim türlerinin takipçisiyim. 🕵️', 5);

-- =============================================
-- 2. CONTENTS (Sample Movies and Books)
-- =============================================

-- Popular Movies
INSERT INTO contents (type, external_id, title, description, year, poster_url, metadata) VALUES
('movie', 'tmdb_550', 'Fight Club', 'Uykusuzluk çeken bir ofis çalışanı ve sabun satıcısı Tyler Durden, yeraltı dövüş kulübü kurar.', 1999, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', '{"runtime": 139, "genres": ["Drama", "Thriller"], "vote_average": 8.4, "vote_count": 26000}'),
('movie', 'tmdb_13', 'Forrest Gump', 'Düşük IQ''lu ama iyi kalpli Forrest Gump''ın olağanüstü yaşam hikayesi.', 1994, 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', '{"runtime": 142, "genres": ["Drama", "Romance"], "vote_average": 8.5, "vote_count": 24000}'),
('movie', 'tmdb_155', 'The Dark Knight', 'Batman, Joker ile mücadele ederken Gotham''ın geleceği için savaşır.', 2008, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '{"runtime": 152, "genres": ["Action", "Crime", "Drama"], "vote_average": 9.0, "vote_count": 30000}'),
('movie', 'tmdb_278', 'The Shawshank Redemption', 'Haksız yere hapis cezası alan bir bankacının umut dolu hikayesi.', 1994, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', '{"runtime": 142, "genres": ["Drama"], "vote_average": 9.3, "vote_count": 32000}'),
('movie', 'tmdb_238', 'The Godfather', 'Bir suç ailesinin güç mücadelesi ve aile bağları.', 1972, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', '{"runtime": 175, "genres": ["Crime", "Drama"], "vote_average": 9.2, "vote_count": 28000}');

-- Popular Books
INSERT INTO contents (type, external_id, title, description, year, poster_url, metadata) VALUES
('book', 'gb_wrOQLV6xB-wC', 'Harry Potter ve Felsefe Taşı', 'J.K. Rowling''in büyülü dünyasının başlangıcı. Harry Potter''ın Hogwarts''a kabul edilişi.', 1997, 'https://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1', '{"pages": 223, "author": "J.K. Rowling", "genres": ["Fantasy", "Young Adult"], "publisher": "YKY"}'),
('book', 'gb_1q_xAwAAQBAJ', '1984', 'George Orwell''ın distopik başyapıtı. Totaliter bir rejimde yaşayan Winston Smith''in hikayesi.', 1949, 'https://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1', '{"pages": 328, "author": "George Orwell", "genres": ["Dystopian", "Political Fiction"], "publisher": "Can Yayınları"}'),
('book', 'gb_yxv1LK5gyoQC', 'Suç ve Ceza', 'Dostoyevski''nin psikolojik ve felsefi başyapıtı. Raskolnikov''un iç hesaplaşması.', 1866, 'https://books.google.com/books/content?id=yxv1LK5gyoQC&printsec=frontcover&img=1&zoom=1', '{"pages": 671, "author": "Fyodor Dostoyevski", "genres": ["Classic", "Philosophical Fiction"], "publisher": "İş Bankası Kültür Yayınları"}'),
('book', 'gb_Knx0AwAAQBAJ', 'Yüzüklerin Efendisi', 'Tolkien''in fantastik dünyasında Orta Dünya''yı kurtarma mücadelesi.', 1954, 'https://books.google.com/books/content?id=Knx0AwAAQBAJ&printsec=frontcover&img=1&zoom=1', '{"pages": 1216, "author": "J.R.R. Tolkien", "genres": ["Fantasy", "Adventure"], "publisher": "Metis Yayınları"}'),
('book', 'gb_sJf1vmq9w0UC', 'Simyacı', 'Paulo Coelho''nun dünya çapında ünlü eseri. Kendini keşfetme yolculuğu.', 1988, 'https://books.google.com/books/content?id=sJf1vmq9w0UC&printsec=frontcover&img=1&zoom=1', '{"pages": 176, "author": "Paulo Coelho", "genres": ["Fiction", "Philosophy"], "publisher": "Can Yayınları"}');

-- =============================================
-- 3. RATINGS (Sample Ratings)
-- =============================================
-- User 1 ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
(1, 1, 9),  -- Fight Club
(1, 2, 8),  -- Forrest Gump
(1, 6, 10), -- Harry Potter
(1, 7, 9);  -- 1984

-- User 2 ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
(2, 1, 10), -- Fight Club
(2, 3, 9),  -- The Dark Knight
(2, 7, 10), -- 1984
(2, 8, 9);  -- Suç ve Ceza

-- User 3 ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
(3, 2, 9),  -- Forrest Gump
(3, 3, 10), -- The Dark Knight
(3, 4, 10), -- Shawshank Redemption
(3, 9, 9);  -- Yüzüklerin Efendisi

-- User 4 ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
(4, 5, 10), -- The Godfather
(4, 6, 8),  -- Harry Potter
(4, 8, 10), -- Suç ve Ceza
(4, 10, 7); -- Simyacı

-- User 5 ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
(5, 1, 8),  -- Fight Club
(5, 4, 10), -- Shawshank Redemption
(5, 5, 9),  -- The Godfather
(5, 7, 9);  -- 1984

-- =============================================
-- 4. REVIEWS (Sample Reviews)
-- =============================================
INSERT INTO reviews (user_id, content_id, text) VALUES
(1, 1, 'Fight Club sadece bir film değil, bir yaşam felsefesi! Tyler Durden karakteri unutulmaz. Fincher''ın görsel anlatımı mükemmel. Her izleyişte yeni detaylar keşfediyorum. Kesinlikle izlenmeli! 🎬'),
(2, 1, 'İlk izlediğimde şok olmuştum. Twist finali harika! Brad Pitt ve Edward Norton''ın kimyası inanılmaz. Senaryosu çok güçlü, diyaloglar akılda kalıcı. Sinemaya dair her şey var bu filmde.'),
(3, 3, 'The Dark Knight sadece bir süper kahraman filmi değil. Heath Ledger''ın Joker performansı tarihe geçti. Karanlık atmosferi, felsefi derinliği ile kült bir yapıt. Christopher Nolan deha! 🦇'),
(1, 7, '1984 bugün daha da güncel. Orwell''ın öngörüleri korkutucu derecede gerçekçi. Big Brother kavramı artık günlük hayatımızın parçası. Herkesin okuması gereken bir distopya klasiği. 📚'),
(4, 8, 'Dostoyevski''nin psikolojik derinliği inanılmaz. Raskolnikov''un iç çatışması o kadar iyi anlatılmış ki, sayfaları çevirdikçe kendinizi sorgulamaya başlıyorsunuz. Klasiklerin klasiği!'),
(2, 6, 'Harry Potter serisi çocukluğumu şekillendirdi. Hogwarts dünyası o kadar detaylı ki, gerçekmiş gibi hissediyorsun. J.K. Rowling''in hayal gücü sınırsız. Her yaştan okuyucuya hitap ediyor! ⚡'),
(5, 4, 'Shawshank Redemption umut üzerine bir film. Tim Robbins ve Morgan Freeman ikilisi mükemmel. Hapishane hayatını bu kadar iyi anlatan başka bir film yok. Final sahnesi gözyaşlarıma boğdu.'),
(3, 2, 'Forrest Gump hayata dair her şeyi öğretiyor. Tom Hanks''in performansı Oscar''ı hak ediyor. Savaş, aşk, dostluk... Her duyguyu yaşatıyor. "Hayat bir çikolata kutusu gibidir" sözü efsane! 🍫');

-- =============================================
-- 5. REVIEW LIKES (Sample Review Likes)
-- =============================================
-- Review 1 (Fight Club review by user 1) liked by users 2, 3, 4
INSERT INTO review_likes (user_id, review_id) VALUES
(2, 1),
(3, 1),
(4, 1);

-- Review 2 (Fight Club review by user 2) liked by users 1, 5
INSERT INTO review_likes (user_id, review_id) VALUES
(1, 2),
(5, 2);

-- Review 3 (Dark Knight review by user 3) liked by users 1, 2, 4, 5
INSERT INTO review_likes (user_id, review_id) VALUES
(1, 3),
(2, 3),
(4, 3),
(5, 3);

-- Review 4 (1984 review) liked by users 2, 3, 5
INSERT INTO review_likes (user_id, review_id) VALUES
(2, 4),
(3, 4),
(5, 4);

-- =============================================
-- 6. REVIEW REPLIES (Sample Replies)
-- =============================================
INSERT INTO review_replies (review_id, user_id, text) VALUES
(1, 2, 'Kesinlikle katılıyorum! Tyler Durden karakteri modern sinemanın en ikonik karakterlerinden biri.'),
(1, 3, 'Film hakkında çok şey söylenebilir ama bence asıl mesaj tüketim toplumuna karşı isyan. Harika analiz!'),
(3, 1, 'Heath Ledger gerçekten efsane bir performans sergiledi. Oscar''ı kesinlikle hak ediyordu.'),
(3, 2, 'Joker karakterini bu kadar iyi canlandıran başka bir aktör göremedim. RIP Heath Ledger 🙏'),
(4, 2, 'Orwell 1949''da yazmış ama 2025''te yaşıyormuş gibi geliyor. Teknoloji ve gözetim konusunda ne kadar haklıymış!'),
(6, 3, 'Ben de çocukken okumuştum, şimdi çocuğuma okuyorum. Nesiller boyu okunacak bir eser! 📖'),
(7, 4, 'Morgan Freeman''ın sesi bile film için yeterli bir sebep! 😄'),
(8, 1, 'Tom Hanks karakteri o kadar samimi oynuyor ki, Forrest gerçekten varmış gibi hissediyorsun.');

-- =============================================
-- 7. REVIEW REPLY LIKES (Sample Reply Likes)
-- =============================================
INSERT INTO review_reply_likes (user_id, reply_id) VALUES
(1, 1), -- User 1 likes reply 1
(3, 1),
(1, 2), -- User 1 likes reply 2
(2, 3), -- User 2 likes reply 3
(3, 3),
(4, 3),
(1, 4), -- User 1 likes reply 4
(3, 4),
(5, 4),
(1, 5), -- User 1 likes reply 5
(3, 5),
(4, 5);

-- =============================================
-- 8. FOLLOWS (Sample Follow Relationships)
-- =============================================
INSERT INTO follows (follower_id, following_id) VALUES
(1, 2), -- User 1 follows User 2
(1, 3), -- User 1 follows User 3
(1, 4), -- User 1 follows User 4
(2, 1), -- User 2 follows User 1
(2, 3), -- User 2 follows User 3
(2, 5), -- User 2 follows User 5
(3, 1), -- User 3 follows User 1
(3, 2), -- User 3 follows User 2
(3, 4), -- User 3 follows User 4
(4, 1), -- User 4 follows User 1
(4, 2), -- User 4 follows User 2
(4, 3), -- User 4 follows User 3
(5, 1), -- User 5 follows User 1
(5, 2), -- User 5 follows User 2
(5, 4); -- User 5 follows User 4

-- =============================================
-- 9. ACTIVITIES (Sample Feed Activities)
-- =============================================
INSERT INTO activities (user_id, type, content_id, metadata) VALUES
(1, 'rating', 1, '{"rating": 9}'),
(1, 'review', 1, '{"review_excerpt": "Fight Club sadece bir film değil, bir yaşam felsefesi! Tyler Durden karakteri unutulmaz."}'),
(2, 'rating', 1, '{"rating": 10}'),
(2, 'review', 1, '{"review_excerpt": "İlk izlediğimde şok olmuştum. Twist finali harika!"}'),
(3, 'rating', 3, '{"rating": 10}'),
(3, 'review', 3, '{"review_excerpt": "The Dark Knight sadece bir süper kahraman filmi değil. Heath Ledger tarihe geçti."}'),
(1, 'review', 7, '{"review_excerpt": "1984 bugün daha da güncel. Orwell''ın öngörüleri korkutucu derecede gerçekçi."}'),
(4, 'review', 8, '{"review_excerpt": "Dostoyevski''nin psikolojik derinliği inanılmaz. Raskolnikov''un iç çatışması..."}');

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Uncomment these to verify the data was inserted correctly:

-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_contents FROM contents;
-- SELECT COUNT(*) as total_ratings FROM ratings;
-- SELECT COUNT(*) as total_reviews FROM reviews;
-- SELECT COUNT(*) as total_review_likes FROM review_likes;
-- SELECT COUNT(*) as total_replies FROM review_replies;
-- SELECT COUNT(*) as total_reply_likes FROM review_reply_likes;
-- SELECT COUNT(*) as total_follows FROM follows;
-- SELECT COUNT(*) as total_activities FROM activities;

-- =============================================
-- CLEANUP (if needed)
-- =============================================
-- If you want to remove all sample data:
-- DELETE FROM activities;
-- DELETE FROM review_reply_likes;
-- DELETE FROM review_replies;
-- DELETE FROM review_likes;
-- DELETE FROM follows;
-- DELETE FROM reviews;
-- DELETE FROM ratings;
-- DELETE FROM list_items;
-- DELETE FROM lists WHERE type != 'custom';
-- DELETE FROM contents;
-- DELETE FROM users;
