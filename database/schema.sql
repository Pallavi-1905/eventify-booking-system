-- Eventify Database Schema
CREATE DATABASE IF NOT EXISTS eventify;
USE eventify;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER','ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    price DOUBLE NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    image VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(150),
    seats INT NOT NULL,
    total_amount DOUBLE NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('CONFIRMED','CANCELLED') DEFAULT 'CONFIRMED',
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(150) NOT NULL,
    preferred_category VARCHAR(100),
    preferred_location VARCHAR(100),
    last_booked_category VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO events (name,category,location,event_date,price,total_seats,available_seats,image,description) VALUES
('RCB vs CSK - IPL 2025','Sports','Bengaluru','2025-04-15',1500,50,50,'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600','Experience the thrill of IPL cricket live at Chinnaswamy Stadium. RCB takes on CSK in this epic rivalry!'),
('Arijit Singh Live Concert','Music','Mumbai','2025-04-20',2500,40,40,'https://images.unsplash.com/photo-1501386761578-eaa54b8b3b51?w=600','An unforgettable evening with the soulful voice of Arijit Singh. Experience his greatest hits live!'),
('Pushpa 2 - The Rule','Movies','Hyderabad','2025-04-10',350,60,60,'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600','The mega-blockbuster Pushpa 2 continues the story of Pushpa Raj in this action-packed sequel.'),
('Mumbai Indians vs KKR','Sports','Mumbai','2025-04-18',1200,50,50,'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600','Watch Mumbai Indians battle Kolkata Knight Riders at Wankhede Stadium.'),
('Diljit Dosanjh - Dil-Luminati Tour','Music','Delhi','2025-05-01',3500,40,40,'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600','Diljit Dosanjh brings his sensational Dil-Luminati tour to Delhi!'),
('Kalki 2898 AD','Movies','Chennai','2025-04-12',400,60,60,'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600','A mythological science-fiction epic set in a futuristic dystopian world.'),
('Sunburn Festival 2025','Music','Goa','2025-05-10',5000,40,40,'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600','Asia biggest EDM festival returns to Goa. 3 days of non-stop electronic music!'),
('India vs Australia Test Match','Sports','Hyderabad','2025-05-05',800,50,50,'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600','The iconic India vs Australia Test series continues in Hyderabad.'),
('Comedy Night with Zakir Khan','Comedy','Pune','2025-04-25',999,60,60,'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=600','Zakir Khan brings his new stand-up special to Pune. An evening of big laughs!'),
('Stree 2 - Fear Is Back','Movies','Delhi','2025-04-22',380,60,60,'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600','The horror-comedy franchise returns with Stree 2. Shraddha Kapoor and Rajkummar Rao reprise their iconic roles.');
