-- Database User
DROP USER IF EXISTS 'ctf'@'localhost';
CREATE USER 'ctf'@'localhost' IDENTIFIED BY 'ctf';

-- Database
CREATE DATABASE ctf;

-- Privileges
GRANT SUPER ON *.* TO 'ctf'@'localhost';
GRANT ALL PRIVILEGES ON ctf.* TO 'ctf'@'localhost';
