USE concerts_attended;

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

/* Create Users and Concerts tables*/
CREATE OR REPLACE TABLE concerts_attended.Users (
    userID INT UNIQUE NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    PRIMARY KEY (userID)
);

CREATE OR REPLACE TABLE concerts_attended.Concerts (
    concertID INT UNIQUE NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    artist VARCHAR(50) NOT NULL,
    venue VARCHAR(50) NOT NULL,
    dateAttended date NOT NULL,
    notes TEXT NULL,
    PRIMARY KEY (concertID),
    CONSTRAINT FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

/* Populate tables with data */
INSERT INTO Users (firstName, lastName)
VALUES ('Brian', 'Ware'),
('Michaela', 'Allison'),
('Elias', 'Huffman');

INSERT INTO Concerts (userID, artist, venue, dateAttended, notes)
VALUES (1, 'Green Day', 'Globe Life Field', '2024-09-11', NULL),
(1, 'Taylor Swift', 'AT&T Stadium', '2023-03-31', NULL), 
(1, 'Dying Wish', 'The Studio at The Factory', '2024-10-10', NULL),
(1, 'Test', 'Test', '2025-01-01', NULL);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;