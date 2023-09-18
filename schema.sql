CREATE DATABASE joining_hands;
USE joining_hands;

CREATE TABLE users (
  id integer PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  address VARCHAR(255),
  m_no VARCHAR(20),
  v_type VARCHAR(20),
  id_num VARCHAR(20),
  role VARCHAR(20),
  created TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(username)
);

CREATE TABLE donations (
  food_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  food_name VARCHAR(255) NOT NULL,
  quantity VARCHAR(255) NOT NULL,
  donor_id INTEGER(20) NOT NULL,
  donor_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  donor_phone_no VARCHAR(20) NOT NULL,
  food_img VARCHAR(255),
  rider_id VARCHAR(20),
  rider_name VARCHAR(255),
  address VARCHAR(255),
  stage VARCHAR(20),
  requested_seeker_id INTEGER(20),
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);