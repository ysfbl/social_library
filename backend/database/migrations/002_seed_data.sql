-- Seed Data for Social Library Platform
-- Run this after 001_initial_schema.sql

-- Insert sample users

INSERT INTO users (username, email, password_hash, bio, avatar) VALUES
    ('ahmet_yilmaz', 'ahmet@example.com', '$2b$10$rKxN8KpvPaJQzKqZ1qHqI.xJF6qKqGzqXqZ1qHqI.xJF6qKqGzqXO', 'Sinema ve edebiyat tutkunu. Özellikle bilim kurgu severim.', 'https://i.pravatar.cc/150?img=12'),
    ('zeynep_kaya', 'zeynep@example.com', '$2b$10$rKxN8KpvPaJQzKqZ1qHqI.xJF6qKqGzqXqZ1qHqI.xJF6qKqGzqXO', 'Klasik romanlar ve drama filmleri favorim.', 'https://i.pravatar.cc/150?img=45'),
    ('mehmet_demir', 'mehmet@example.com', '$2b$10$rKxN8KpvPaJQzKqZ1qHqI.xJF6qKqGzqXqZ1qHqI.xJF6qKqGzqXO', 'Marvel hayranı ve fantastik roman okuyucusu.', 'https://i.pravatar.cc/150?img=33'),
    ('ayse_ozturk', 'ayse@example.com', '$2b$10$rKxN8KpvPaJQzKqZ1qHqI.xJF6qKqGzqXqZ1qHqI.xJF6qKqGzqXO', 'Korku ve gerilim türlerinin bağımlısıyım.', 'https://i.pravatar.cc/150?img=28'),
    ('can_arslan', 'can@example.com', '$2b$10$rKxN8KpvPaJQzKqZ1qHqI.xJF6qKqGzqXqZ1qHqI.xJF6qKqGzqXO', 'Anime izleyici ve manga okuyucusu.', 'https://i.pravatar.cc/150?img=51');

-- Insert sample movies (from TMDb-like data)
INSERT INTO contents (type, external_id, title, description, year, poster_url, metadata) VALUES
    ('movie', 'tmdb_550', 'Fight Club', 'Uykusuzluk çeken sigorta müfettişi, sabun satıcısıyla tanışır ve yeraltı dövüş kulübü kurar.', 1999, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', '{"director": "David Fincher", "genres": ["Drama", "Thriller"], "cast": ["Brad Pitt", "Edward Norton"], "runtime": 139}'),
    ('movie', 'tmdb_13', 'Forrest Gump', 'Düşük IQ''lu ama iyi kalbli Forrest Gump''ın olağanüstü hayat hikayesi.', 1994, 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', '{"director": "Robert Zemeckis", "genres": ["Drama", "Romance"], "cast": ["Tom Hanks"], "runtime": 142}'),
    ('movie', 'tmdb_155', 'The Dark Knight', 'Batman, Joker''in Gotham''ı kaosa sürüklemesini durdurmaya çalışır.', 2008, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '{"director": "Christopher Nolan", "genres": ["Action", "Crime", "Drama"], "cast": ["Christian Bale", "Heath Ledger"], "runtime": 152}'),
    ('movie', 'tmdb_27205', 'Inception', 'Bir hırsız, fikirleri çalmak yerine zihne fikir yerleştirme görevi alır.', 2010, 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg', '{"director": "Christopher Nolan", "genres": ["Action", "Sci-Fi", "Thriller"], "cast": ["Leonardo DiCaprio"], "runtime": 148}'),
    ('movie', 'tmdb_278', 'The Shawshank Redemption', 'Haksız yere hüküm giyen bir bankacının hapisteki hayatı.', 1994, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', '{"director": "Frank Darabont", "genres": ["Drama"], "cast": ["Tim Robbins", "Morgan Freeman"], "runtime": 142}'),
    ('movie', 'tmdb_238', 'The Godfather', 'Güçlü bir mafya ailesinin patriği, kontrolü isteksiz oğluna devretmeye çalışır.', 1972, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', '{"director": "Francis Ford Coppola", "genres": ["Crime", "Drama"], "cast": ["Marlon Brando", "Al Pacino"], "runtime": 175}'),
    ('movie', 'tmdb_424', 'Schindler''s List', 'Holokost sırasında 1100''den fazla Yahudi''yi kurtaran Alman iş adamının hikayesi.', 1993, 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', '{"director": "Steven Spielberg", "genres": ["Biography", "Drama", "History"], "cast": ["Liam Neeson"], "runtime": 195}'),
    ('movie', 'tmdb_680', 'Pulp Fiction', 'İç içe geçmiş suç hikayelerinin anlatıldığı kült film.', 1994, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', '{"director": "Quentin Tarantino", "genres": ["Crime", "Drama"], "cast": ["John Travolta", "Samuel L. Jackson"], "runtime": 154}'),
    ('movie', 'tmdb_19404', 'Interstellar', 'Astronotlar, insanlığı kurtarmak için solucan deliğinden geçerek yeni bir gezegen ararlar.', 2014, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '{"director": "Christopher Nolan", "genres": ["Adventure", "Drama", "Sci-Fi"], "cast": ["Matthew McConaughey"], "runtime": 169}'),
    ('movie', 'tmdb_122', 'The Lord of the Rings: The Return of the King', 'Yüzük Kardeşliği''nin Orta Dünya''yı kötülükten kurtarma mücadelesinin finali.', 2003, 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', '{"director": "Peter Jackson", "genres": ["Action", "Adventure", "Fantasy"], "cast": ["Elijah Wood", "Viggo Mortensen"], "runtime": 201}');

-- Insert sample books (from Google Books-like data)
INSERT INTO contents (type, external_id, title, description, year, poster_url, metadata) VALUES
    ('book', 'gb_zyTCAlFPjgYC', '1984', 'George Orwell''ın distopik başyapıtı. Totaliter bir rejimin hakimiyetindeki dünyada geçer.', 1949, 'https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1', '{"author": "George Orwell", "genres": ["Dystopian", "Political Fiction"], "pages": 328, "publisher": "Penguin Books"}'),
    ('book', 'gb_yDtCuQEACAAJ', 'Suç ve Ceza', 'Dostoyevski''nin başyapıtı. Bir cinayetin ardından vicdanla mücadele eden genç adamın hikayesi.', 1866, 'https://books.google.com/books/content?id=yDtCuQEACAAJ&printsec=frontcover&img=1&zoom=1', '{"author": "Fyodor Dostoyevski", "genres": ["Psychological Fiction", "Philosophical Novel"], "pages": 671, "publisher": "İletişim Yayınları"}'),
    ('book', 'gb_wrOQLV6xB-wC', 'Harry Potter ve Felsefe Taşı', 'J.K. Rowling''in büyülü dünyasının başlangıcı. Harry Potter''ın Hogwarts''a kabul edilişi.', 1997, 'https://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1', '{"author": "J.K. Rowling", "genres": ["Fantasy", "Young Adult"], "pages": 223, "publisher": "YKY"}'),
    ('book', 'gb_sazytgAACAAJ', 'Yüzüklerin Efendisi: Yüzük Kardeşliği', 'Tolkien''in fantastik dünyasında geçen destansı macera. Yüzüğü yok etme görevinin başlangıcı.', 1954, 'https://books.google.com/books/content?id=sazytgAACAAJ&printsec=frontcover&img=1&zoom=1', '{"author": "J.R.R. Tolkien", "genres": ["Fantasy", "Adventure"], "pages": 423, "publisher": "Metis Yayınları"}'),
    ('book', 'gb_buc0AAAAMAAJ', 'Küçük Prens', 'Antoine de Saint-Exupéry''nin felsefik masalı. Bir çocuğun gözünden evren.', 1943, 'https://books.google.com/books/content?id=buc0AAAAMAAJ&printsec=frontcover&img=1&zoom=1', '{"author": "Antoine de Saint-Exupéry", "genres": ["Novella", "Children''s Literature"], "pages": 96, "publisher": "Can Yayınları"}'),
    ('book', 'gb_gNdbDwAAQBAJ', 'Kürk Mantolu Madonna', 'Sabahattin Ali''nin aşk ve özlem dolu klasik romanı.', 1943, 'https://books.google.com/books/content?id=gNdbDwAAQBAJ&printsec=frontcover&img=1&zoom=1', '{"author": "Sabahattin Ali", "genres": ["Romance", "Drama"], "pages": 160, "publisher": "Yapı Kredi Yayınları"}'),
    ('book', 'gb_FDJbAAAAMAAJ', 'İnce Memed', 'Yaşar Kemal''in ünlü eseri. Ağalığa başkaldıran Memed''in hikayesi.', 1955, 'https://books.google.com/books/content?id=FDJbAAAAMAAJ&printsec=frontcover&img=1&zoom=1', '{"author": "Yaşar Kemal", "genres": ["Novel", "Social Fiction"], "pages": 423, "publisher": "Yapı Kredi Yayınları"}'),
    ('book', 'gb_Kq4REAAAQBAJ', 'Tutunamayanlar', 'Oğuz Atay''ın modern Türk edebiyatının başyapıtlarından biri.', 1971, 'https://books.google.com/books/content?id=Kq4REAAAQBAJ&printsec=frontcover&img=1&zoom=1', '{"author": "Oğuz Atay", "genres": ["Postmodern", "Psychological Fiction"], "pages": 724, "publisher": "İletişim Yayınları"}'),
    ('book', 'gb_5HTwBgAAQBAJ', 'Sefiller', 'Victor Hugo''nun dev romanı. 19. yüzyıl Fransa''sında sosyal adaletsizlik.', 1862, 'https://books.google.com/books/content?id=5HTwBgAAQBAJ&printsec=frontcover&img=1&zoom=1', '{"author": "Victor Hugo", "genres": ["Historical Fiction", "Social Commentary"], "pages": 1463, "publisher": "İş Bankası Kültür Yayınları"}'),
    ('book', 'gb_PfjQtAEACAAJ', 'Beyaz Zambaklar Ülkesinde', 'Grigory Petrov''un barış ve huzur dolu Finlandiya izlenimlerini anlattığı eser.', 1910, 'https://books.google.com/books/content?id=PfjQtAEACAAJ&printsec=frontcover&img=1&zoom=1', '{"author": "Grigory Petrov", "genres": ["Travel Literature", "Non-fiction"], "pages": 108, "publisher": "Şule Yayınları"}');

-- Insert ratings
-- User 1 (ahmet_yilmaz) ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
    (1, 1, 10), -- Fight Club
    (1, 2, 9),  -- Forrest Gump
    (1, 4, 10), -- Inception
    (1, 9, 9),  -- Interstellar
    (1, 11, 9), -- 1984
    (1, 13, 8), -- Harry Potter
    (1, 14, 10); -- LOTR

-- User 2 (zeynep_kaya) ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
    (2, 2, 10), -- Forrest Gump
    (2, 5, 9),  -- Shawshank
    (2, 6, 10), -- Godfather
    (2, 12, 10), -- Suç ve Ceza
    (2, 15, 9),  -- Küçük Prens
    (2, 16, 10), -- Kürk Mantolu Madonna
    (2, 19, 8);  -- Sefiller

-- User 3 (mehmet_demir) ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
    (3, 3, 10), -- Dark Knight
    (3, 4, 9),  -- Inception
    (3, 10, 10), -- LOTR Movie
    (3, 13, 10), -- Harry Potter
    (3, 14, 10), -- LOTR Book
    (3, 17, 8);  -- İnce Memed

-- User 4 (ayse_ozturk) ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
    (4, 1, 9),  -- Fight Club
    (4, 7, 10), -- Schindler's List
    (4, 8, 9),  -- Pulp Fiction
    (4, 11, 10), -- 1984
    (4, 12, 9),  -- Suç ve Ceza
    (4, 18, 9);  -- Tutunamayanlar

-- User 5 (can_arslan) ratings
INSERT INTO ratings (user_id, content_id, rating) VALUES
    (5, 3, 10), -- Dark Knight
    (5, 9, 10), -- Interstellar
    (5, 10, 10), -- LOTR Movie
    (5, 13, 9),  -- Harry Potter
    (5, 14, 10); -- LOTR Book

-- Insert reviews
INSERT INTO reviews (user_id, content_id, text) VALUES
    (1, 1, 'Fight Club modern sinemanın şaheseri. David Fincher''ın yönetimi, Brad Pitt ve Edward Norton''ın oyunculuğu kusursuz. Tüketim toplumuna muhteşem bir eleştiri.'),
    (1, 4, 'Inception akılalmaz bir senaryo ve görsel efektler. Christopher Nolan yine harikalar yaratmış. Her izleyişte yeni detaylar keşfediyorsun.'),
    (1, 11, 'Orwell''ın öngörüsü bugün daha da geçerli. Totaliter rejimlerin psikolojik etkilerini bu kadar iyi anlatan başka bir kitap yok.'),

    (2, 2, 'Forrest Gump her izlediğimde ağlatıyor. Tom Hanks muhteşem bir performans sergilemiş. Hayat dersi niteliğinde bir film.'),
    (2, 6, 'Godfather sinema tarihinin en iyi filmi. Marlon Brando efsane. Mafya filmleri için çıta bu film ile çok yükseğe çıktı.'),
    (2, 12, 'Dostoyevski''nin걸작. İnsan psikolojisini bu kadar derinlemesine inceleyen başka bir roman görmedim. Mutlaka okunmalı.'),
    (2, 16, 'Kürk Mantolu Madonna Türk edebiyatının en güzel aşk hikayesi. Sabahattin Ali''nin kalemi muhteşem.'),

    (3, 3, 'Heath Ledger''ın Joker performansı sinema tarihine geçti. Nolan üçlemesinin en iyisi. Aksiyon, drama ve felsefe mükemmel harmanlanmış.'),
    (3, 10, 'Return of the King destansı bir final. 3 saatlik süre hiç uzun gelmiyor. Sinema tarihinin en iyi fantastik film serisi.'),
    (3, 13, 'Harry Potter serisinin ilk kitabı hala sihirli. J.K. Rowling muhteşem bir dünya yaratmış. Çocuklar ve yetişkinler için harika.'),
    (3, 14, 'Tolkien''in yarattığı dünya benzersiz. Yüzüklerin Efendisi fantastik edebiyatın babası. Her fantasy severinin okuması şart.'),

    (4, 1, 'Fight Club''ın twist''i ilk izleyişte şok etti. Çok katmanlı bir film, tekrar tekrar izlemeye değer.'),
    (4, 7, 'Schindler''s List insanlık tarihinin en karanlık dönemini anlatan muhteşem bir film. Spielberg''in걸작.'),
    (4, 11, '1984 distopya edebiyatının zirvesi. Big Brother kavramı artık günlük dilimizde. Orwell dahi bir yazardı.'),

    (5, 9, 'Interstellar bilim kurgunun zirvesi. Nolan fizik ve duyguyu mükemmel birleştirmiş. IMAX''te izlemek bambaşka bir deneyimdi.'),
    (5, 10, 'LOTR üçlemesinin finali harika. Ödülleri hak etti. Peter Jackson efsane bir iş çıkarmış.'),
    (5, 14, 'Tolkien''in hayal gücü sınır tanımıyor. Orta Dünya o kadar detaylı ki gerçek gibi hissediyorsun. Fantastik edebiyatın걸작.');

-- Insert follows (social connections)
INSERT INTO follows (follower_id, following_id) VALUES
    (1, 2), -- ahmet follows zeynep
    (1, 3), -- ahmet follows mehmet
    (1, 5), -- ahmet follows can
    (2, 1), -- zeynep follows ahmet
    (2, 4), -- zeynep follows ayse
    (3, 1), -- mehmet follows ahmet
    (3, 5), -- mehmet follows can
    (4, 2), -- ayse follows zeynep
    (4, 1), -- ayse follows ahmet
    (5, 1), -- can follows ahmet
    (5, 3); -- can follows mehmet

-- Add items to user lists
-- Note: Default lists (watched, to_watch, read, to_read) are automatically created by trigger
-- We need to get the list IDs and add items to them

-- User 1 (ahmet_yilmaz) - Add to "İzlediklerim" (watched movies)
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 1 AND l.type = 'watched' AND c.id IN (1, 2, 4, 9);

-- User 1 (ahmet_yilmaz) - Add to "İzlenecekler" (to_watch movies)
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 1 AND l.type = 'to_watch' AND c.id IN (3, 6, 7);

-- User 1 (ahmet_yilmaz) - Add to "Okuduklarım" (read books)
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 1 AND l.type = 'read' AND c.id IN (11, 13, 14);

-- User 1 (ahmet_yilmaz) - Add to "Okunacaklar" (to_read books)
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 1 AND l.type = 'to_read' AND c.id IN (12, 18);

-- User 2 (zeynep_kaya) lists
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 2 AND l.type = 'watched' AND c.id IN (2, 5, 6);

INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 2 AND l.type = 'read' AND c.id IN (12, 15, 16, 19);

-- User 3 (mehmet_demir) lists
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 3 AND l.type = 'watched' AND c.id IN (3, 4, 10);

INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 3 AND l.type = 'read' AND c.id IN (13, 14);

INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 3 AND l.type = 'to_watch' AND c.id IN (1, 9);

-- User 4 (ayse_ozturk) lists
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 4 AND l.type = 'watched' AND c.id IN (1, 7, 8);

INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 4 AND l.type = 'read' AND c.id IN (11, 12, 18);

-- User 5 (can_arslan) lists
INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 5 AND l.type = 'watched' AND c.id IN (3, 9, 10);

INSERT INTO list_items (list_id, content_id)
SELECT l.id, c.id
FROM lists l
CROSS JOIN contents c
WHERE l.user_id = 5 AND l.type = 'read' AND c.id IN (13, 14);

-- Insert activities (social feed)
-- Activities are created when users rate, review, or add items to lists
-- We'll create some activities based on the data above

INSERT INTO activities (user_id, type, content_id, metadata) VALUES
    (1, 'rating', 1, '{"rating": 10, "content_title": "Fight Club"}'),
    (1, 'review', 1, '{"review_excerpt": "Fight Club modern sinemanın şaheseri..."}'),
    (1, 'rating', 4, '{"rating": 10, "content_title": "Inception"}'),
    (1, 'review', 4, '{"review_excerpt": "Inception akılalmaz bir senaryo..."}'),
    (1, 'list_add', 11, '{"list_name": "Okuduklarım", "content_title": "1984"}'),

    (2, 'rating', 2, '{"rating": 10, "content_title": "Forrest Gump"}'),
    (2, 'review', 2, '{"review_excerpt": "Forrest Gump her izlediğimde ağlatıyor..."}'),
    (2, 'rating', 6, '{"rating": 10, "content_title": "The Godfather"}'),
    (2, 'review', 16, '{"review_excerpt": "Kürk Mantolu Madonna Türk edebiyatının..."}'),

    (3, 'rating', 3, '{"rating": 10, "content_title": "The Dark Knight"}'),
    (3, 'review', 3, '{"review_excerpt": "Heath Ledger''ın Joker performansı..."}'),
    (3, 'rating', 10, '{"rating": 10, "content_title": "The Lord of the Rings"}'),
    (3, 'review', 14, '{"review_excerpt": "Tolkien''in yarattığı dünya benzersiz..."}'),

    (4, 'rating', 7, '{"rating": 10, "content_title": "Schindler''s List"}'),
    (4, 'review', 11, '{"review_excerpt": "1984 distopya edebiyatının zirvesi..."}'),
    (4, 'rating', 11, '{"rating": 10, "content_title": "1984"}'),

    (5, 'rating', 9, '{"rating": 10, "content_title": "Interstellar"}'),
    (5, 'review', 9, '{"review_excerpt": "Interstellar bilim kurgunun zirvesi..."}'),
    (5, 'rating', 14, '{"rating": 10, "content_title": "Yüzüklerin Efendisi"}');

-- Summary of seed data:
-- ✅ 5 users (all password: password123)
-- ✅ 10 movies (popular/classic films)
-- ✅ 10 books (Turkish and world classics)
-- ✅ 31 ratings
-- ✅ 16 reviews
-- ✅ 11 follow relationships
-- ✅ Multiple list items for each user
-- ✅ 19 activity feed entries

SELECT 'Seed data inserted successfully!' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS content_count FROM contents;
SELECT COUNT(*) AS rating_count FROM ratings;
SELECT COUNT(*) AS review_count FROM reviews;
SELECT COUNT(*) AS follow_count FROM follows;
SELECT COUNT(*) AS list_count FROM lists;
SELECT COUNT(*) AS list_item_count FROM list_items;
SELECT COUNT(*) AS activity_count FROM activities;
