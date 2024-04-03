create TABLE admins (
    staffID        SERIAL PRIMARY KEY, 
    username       TEXT NOT NULL, 
    userPassword   TEXT NOT NULL    
);

create TABLE members (
    memberID        SERIAL PRIMARY KEY, 
    username        TEXT NOT NULL, 
    userPassword    TEXT NOT NULL
);

create TABLE trainers (
    trainerID       SERIAL PRIMARY KEY, 
    username        TEXT NOT NULL,
    userPassword    TEXT NOT NULL,
    memberID        INT,
    foreign key (memberID) references members
        on delete set null
);

create TABLE medicationList (
    medicationID        SERIAL PRIMARY KEY,
    nameOfMedication    TEXT NOT NULL,
    memberID            INT, 
    foreign key (memberID) references members
        on delete set null     
);

create TABLE memberInfo (
    firstName       TEXT NOT NULL,
    lastName        TEXT NOT NULL, 
    dateOfBirth     DATE,
    memberWeight    FLOAT,
    memberHeight    FLOAT, 
    medicationID    INT, 
    memberID        INT, 
    foreign key (medicationID) references medicationList  
        on delete set null, 
    foreign key (memberID) references members
        on delete set null
);

create TABLE memberGoals (
    checkIn         DATE,
    currentWeight   FLOAT,
    goalWeight      FLOAT,
    memberID        INT,
    foreign key (memberID) references members
        on delete set null
);

create TABLE excersiseRoutine (
    dateOfExercise  DATE,
    formOfCardio    TEXT NOT NULL, 
    nameOfLift      TEXT NOT NULL, 
    caloriesBurned  FLOAT,
    memberID        INT, 
    foreign key (memberID) references members
        on delete set null
);

create TABLE memberProgression (
    dateOfLift      DATE,
    nameOfLift      TEXT NOT NULL, 
    currentWeight   FLOAT,
    originalWeight  FLOAT,
    memberID        INT,
    foreign key (memberID) references members
        on delete set null
);

create table rooms (
    roomID     SERIAL  PRIMARY KEY, 
    roomType   TEXT NOT NULL,
    dateBooked DATE, 
    startTime  TIME, 
    endTime    TIME 
);

create table fitnessEquipment(
    equipmentID     SERIAL PRIMARY KEY,
    lastCheckUp     DATE, 
    nextCheckUp     DATE, 
    notableIssues   TEXT
);

create table membersEnrolled(
    membersEnrolledID   SERIAL PRIMARY KEY,
    memberFirstName     TEXT NOT NULL, 
    memberLastName      TEXT NOT NULL, 
    memberID            INT,
    foreign key (memberID) references members
		on delete set null
);

create table class(
    classID           SERIAL PRIMARY KEY,
    className         TEXT NOT NULL,
    description       TEXT, 
    dateOfClass       DATE, 
    startTime         TIME, 
    endTime           TIME, 
    duration          INT, 
    trainerID         INT, 
    membersEnrolledID INT,
    foreign key (trainerID) references trainers
		on delete set null,
    foreign key (membersEnrolledID) references membersEnrolled
		on delete set null
);

create table privateSession(
    sessionDate     DATE,
    sessionTime     TIME, 
    duration        INT,
    trainerID       INT, 
    memberID        INT,
    foreign key (trainerID) references trainers
		on delete set null,
    foreign key (memberID) references members
		on delete set null
); 

create table trainerSchedule(
    dateOfAvailability  DATE, 
    startTime           TIME, 
    endTime             TIME,
    trainerID           INT, 
    foreign key (trainerID) references trainers
		on delete set null  
);

create table paymentProcess(
    memberFirstName     TEXT NOT NULL, 
    memberLastName      TEXT NOT NULL, 
    paymentAmount       FLOAT, 
    billingDate         DATE,
    memberID            INT,
    foreign key (memberID) references members
		on delete set null
);

