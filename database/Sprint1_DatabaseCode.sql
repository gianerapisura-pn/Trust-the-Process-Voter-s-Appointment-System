CREATE DATABASE StudentVoterAppointments;

USE StudentVoterAppointments;

CREATE TABLE Voter_Applicant (
    applicant_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    suffix VARCHAR(50),
    birthday DATE NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    home_address VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    mobile_number VARCHAR(20) NOT NULL
);

CREATE TABLE Appointment_Site (
    site_id INT PRIMARY KEY AUTO_INCREMENT,
    site_name VARCHAR(100),
    address VARCHAR(255),
    is_active BOOLEAN
);

CREATE TABLE Appointment_Slot (
    slot_id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT,
    bookings_count INT,
    
    FOREIGN KEY (site_id) REFERENCES Appointment_Site(site_id) ON DELETE CASCADE
);
    
CREATE TABLE Appointment (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    applicant_id INT NOT NULL,
    slot_id INT NOT NULL,
    appointment_code VARCHAR(10) UNIQUE NOT NULL,
    booking_datetime DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (applicant_id) REFERENCES Voter_Applicant(applicant_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES Appointment_Slot(slot_id)ON DELETE CASCADE
);

CREATE TABLE Admin_user (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Indexes for performance (Optional)

CREATE INDEX idx_voter_applicant_email ON Voter_Applicant(email_address);
CREATE INDEX idx_appointment_applicant ON Appointment(applicant_id);
CREATE INDEX idx_appointment_slot ON Appointment(slot_id);
CREATE INDEX idx_admin_username ON Admin_user(username);
