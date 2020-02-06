INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'sebastianguerrra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Louisa Meyer', 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Dominic Parks', 'victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (4, 'Speed lamp', 'description', 'https://ima.ge/such-a-beautiful-thumbnail', 30500, 2, 2, 3, 'Canada', '200 Brick street', 'Missisauga', 'Ontario', 'A0B 1C2', TRUE ),
(5, 'Blank corner', 'description', 'https://ima.ge/such-a-beautiful-thumbnail2', 35000, 0, 2, 2, 'Canada', '44 Wood street', 'Scarborough', 'Ontario', 'D3E 4F5', TRUE ),
(6, 'Port out', 'description', 'https://ima.ge/such-a-beautiful-thumbnail3', 55000, 0, 1, 1, 'Canada', '57 Concrete street', 'Toronto', 'Ontario', 'G6H 7I8', TRUE );

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 3),
('2019-01-04', '2019-02-02', 2, 1),
('2014-10-21', '2014-10-22', 1, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 2, 1, 4, 'Yay!'),
(1, 2, 2, 4, 'Wow!'),
(2, 1, 3, 2, 'Boo!');