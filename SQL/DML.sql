-- Sample data for admins table
INSERT INTO admins (username, userPassword)
VALUES 
    ('rachelalkayal', 'RachelLovesCat123'),
    ('youssefbedeirhussein', 'Smelly234'),
    ('lucychen', 'IamAcop34'),
    ('paulbedeir', 'abrother');

-- Sample data for members table
INSERT INTO members (username, userPassword)
VALUES 
    ('sherifdad', 'iamtousefsdad'),
    ('moufiddad2', 'hiveveryone123'),
    ('juliaLovesGym', 'iLoveGym'),
    ('gymbrojack', 'password123');

-- Sample data for trainers table
INSERT INTO trainers (username, userPassword)
VALUES 
    ('mohammadAli', 'boxer'),
    ('mikeTyson', 'boxer2'),
    ('noel', 'trainer1'),
    ('joefrazier', 'hello');

-- Sample data for medicationList table
INSERT INTO medicationList (nameOfMedication, memberID)
VALUES 
    ('Spirolactone', 1),
    ('Tylenol', 2),
    ('Ozempic', 3),
    ('N/A', 4); 

-- Sample data for memberInfo table
INSERT INTO memberInfo (firstName, lastName, dateOfBirth, memberWeight, memberHeight, medicationID, memberID)
VALUES 
    ('Sherif', 'Bedeir Hussein', '1974-01-20', 70.5, 180, 1, 1),
    ('Moufid', 'Al Kayal', '1964-03-05', 65.2, 165, 2, 2),
    ('Julia', 'Johnson', '1992-12-20', 55.8, 170, 3, 3),
    ('Jack', 'Black', '1988-03-10', 80.3, 175, 4, 4);


INSERT INTO trainerInfo (firstName, lastName, dateOfBirth, sessionFee, trainerID)
VALUES
    ('Mohammad', 'Ali', '1942-01-17', 45, 1),
    ('Mike', 'Tyson', '1966-06-30', 60, 2), 
    ('Mike', 'Tyson', '1966-06-30' ,60, 2), 
    ('Noel', 'Job', '2003-09-05', 20, 3), 
    ('Joe', 'Frazier', '1944-01-12', 30, 4);


INSERT INTO adminInfo (firstName, lastName, dateOfBirth, staffID)
VALUES
    ('Rachel', 'Al Kayal', '2001-01-23', 1), 
    ('Youssef', 'Bedeir Hussein', '2003-01-11', 2), 
    ('Lucy', 'Chen', '1978-04-30', 3), 
    ('Paul', 'Bedier', '2004-12-12', 4); 

-- Sample data for memberGoals table
INSERT INTO memberGoals (checkIn, currentWeight, goalWeight, memberID)
VALUES 
    ('2024-03-01', 75.2, 70, 1),
    ('2024-03-01', 70.5, 65, 2),
    ('2024-03-01', 60.0, 55, 3),
    ('2024-03-01', 85.0, 80, 4);

-- Sample data for exerciseRoutine table
INSERT INTO exerciseRoutine (dateOfExercise, formOfCardio, nameOfLift, caloriesBurned, duration, memberID)
VALUES 
    ('2024-03-01', 'Running', 'Squats', 200, 24, 1),
    ('2024-03-01', 'Walking', 'Bench Press', 150, 30, 2),
    ('2024-03-01', 'Swimming', 'Deadlifts', 300, 15, 3),
    ('2024-03-01', 'Walking', 'Pull-ups', 100, 10, 4);

-- Sample data for memberProgression table
INSERT INTO memberProgression (dateOfLift, nameOfLift, currentWeight, originalWeight, memberID)
VALUES 
    ('2024-03-01', 'Squats', 280, 160, 1),
    ('2024-03-01', 'Bench Press', 170, 90, 2),
    ('2024-03-01', 'Deadlifts', 100, 80, 3),
    ('2024-03-01', 'Pull-ups', 290, 270, 4);

-- Sample data for rooms table
INSERT INTO rooms (roomType)
VALUES  
    ('Group Exercise Studio'), 
    ('Spin Studio'), 
    ('Yoga Studio'), 
    ('Cardio Room'), 
    ('Weightlighting Area'),
    ('Functional Training Area'), 
    ('Meditation Room'), 
    ('Boxing/Martial Arts'), 
    ('Aquatic Center'), 
    ('Multipurpose Room'); 

-- Sample data for fitnessEquipment table
INSERT INTO fitnessEquipment (nameOfMachine, lastCheckUp, nextCheckUp, notableIssues)
VALUES 
    ('Bench Press','2024-01-01', '2024-07-01', 'None reported'),
    ('Leg Extension', '2024-02-01', '2024-08-01', 'Needs maintenance'),
    ('Leg Press', '2024-03-01', '2024-09-01', 'Needs calibration'),
    ('Treadmill', '2024-04-01', '2024-10-01', 'Working fine');

-- Sample data for class table
INSERT INTO class (className, description, dateOfClass, startTime, endTime, duration, trainerID, roomID)
VALUES 
    ('Yoga', 'Relaxing yoga session', '2024-03-01', '10:00:00', '11:00:00', 60, 1, 3),
    ('Zumba', 'High-energy dance workout', '2024-03-01', '11:00:00', '12:00:00', 60, 2, 1),
    ('Pilates', 'Core-strengthening exercises', '2024-03-01', '14:00:00', '15:00:00', 60, 3, 1),
    ('Spin', 'Indoor cycling session', '2024-03-01', '15:00:00', '16:00:00', 60, 4, 2);

-- Sample data for membersEnrolled table
INSERT INTO classMembers (memberFirstName, memberLastName, classID, memberID)
VALUES 
    ('Sherif', 'Bedeir Hussein', 2, 1),
    ('Moufid', 'Al Kayal', 2, 2),
    ('Julia', 'Johnson', 3, 3),
    ('Jack', 'Black', 4, 4);

-- Sample data for privateSession table
INSERT INTO privateSession (sessionDate, sessionTime, duration, trainerID, memberID)
VALUES 
    ('2024-03-01', '13:00:00', 120, 1, 1),
    ('2024-03-01', '14:00:00', 120, 2, 2),
    ('2024-03-01', '15:00:00', 120, 3, 3),
    ('2024-03-01', '16:00:00', 120, 4, 4);

-- Sample data for trainerSchedule table
INSERT INTO trainerSchedule (dateOfAvailability, startTime, endTime, trainerID)
VALUES 
    ('2024-03-01', '08:00:00', '9:00:00', 1),
    ('2024-03-01', '09:00:00', '10:00:00', 2),
    ('2024-03-01', '10:00:00', '11:00:00', 3),
    ('2024-03-01', '11:00:00', '12:00:00', 4);

INSERT INTO paymentProcess (memberFirstName, memberLastName, paymentAmount, billingDate, memberID)
VALUES 
    ('Sherif', 'Bedeir Hussein', 100.0, '2024-04-01', 1),
    ('Moufid', 'Al Kayal', 80.0, '2024-04-03', 2),
    ('Julia', 'Johnson', 120.0, '2024-04-05', 3),
    ('Jack', 'Black', 150.0, '2024-04-07', 4);


INSERT INTO sessionPayment (memberFirstName, memberLastName, paymentAmount, paymentDue, paidForClasses, paidForMonthly, monthlyPayment, monthlyPaymentDue, memberID)
VALUES 
    ('Sherif', 'Bedeir Hussein', 90, '2024-04-28', FALSE, FALSE, 69.99, '2024-05-28', 1),
    ('Moufid', 'Al Kayal', 120, '2024-04-28', FALSE, FALSE, 69.99, '2024-05-28', 2),
    ('Julia', 'Johnson', 40, '2024-04-28', FALSE, FALSE, 69.99, '2024-05-28', 3),
    ('Jack', 'Black', 60, '2024-04-28', FALSE, FALSE, 69.99, '2024-05-28', 4);
