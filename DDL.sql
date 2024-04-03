create TABLE admins (
    staffID        SERIAL PRIMARY KEY, 
    username       TEXT NOT NULL, 
    userPassword   TEXT NOT NULL    
);

create TABLE trainers (
    trainerID       SERIAL PRIMARY KEY, 
    username        TEXT NOT NULL,
    userPassword    TEXT NOT NULL,
    foreign key (memberID) references members
        on delete set null
);

create TABLE members (
    memberID        SERIAL PRIMARY KEY, 
    username        TEXT NOT NULL, 
    userPassword    TEXT NOT NULL
);

create TABLE medicationList (
    medicationID        SERIAL PRIMARY KEY,
    nameOfMedication    TEXT NOT NULL,
    foreign key (memberID) references members
        on delete set null     
);

create TABLE memberInfo (
    firstName       TEXT NOT NULL,
    lastName        TEXT NOT NULL, 
    dateOfBirth     DATE,
    memberWeight    FLOAT,
    memberHeight    FLOAT, 
    foreign key (medicationID) references medicationList  
        on delete set null, 
    foreign key (memberID) references members
        on delete set null
);

create TABLE memberGoals (
    checkIn         DATE,
    currentWeight   FLOAT,
    goalWeight      FLOAT,
    foreign key (memberID) references members
        on delete set null
);

create TABLE routine (
    dateOfExercise  DATE,
    formOfCardio    TEXT NOT NULL, 
    nameOfLift      TEXT NOT NULL, 
    caloriesBurned  FLOAT,
    foreign key (memberID) references members
        on delete set null
);

create TABLE memberProgression (
    dateOfLift      DATE,
    nameOfLift      TEXT NOT NULL, 
    currentWeight   FLOAT,
    originalWeight  FLOAT,
    foreign key (memberID) references members
        on delete set null
);

create table rooms (
    roomID     SERIAL  PRIMARY KEY, 
    roomType   TEXT NOT NULL,
    dateBooked DATE, 
    startTime  TIME NOT NULL, 
    endTime    TIME, NOT NULL 
);

create table fitnessEquipment(
    equipmentID     SERIAL PRIMARY KEY
    lastCheckUp     DATE, 
    nextCheckUp     DATE, 
    notableIssues   TEXT
);

create table membersEnrolled(
    membersEnrolledID   SERIAL PRIMARY KEY
    memberFirstName     TEXT NOT NULL, 
    memberLastName      TEXT NOT NULL, 
    foreign key (classID) references class
		on delete set null,
    foreign key (memberID) references members
		on delete set null
);

create table class(
    classID     SERIAL PRIMARY KEY,
    className   TEXT NOT NULL,
    description TEXT, 
    dateOfClass DATE, 
    startTime   TIME, 
    endTime     TIME, 
    duration    INT, 
    foreign key (trainerID) references trainers
		on delete set null,
    foreign key (membersEnrolledID) references membersEnrolled
		on delete set null
);

create table privateSession(
    sessionDate     DATE,
    sessionTime     TIME, 
    duration        INT
    foreign key (trainerID) references trainers
		on delete set null,
    foreign key (memberID) references members
		on delete set null
); 

create table trainerSchedule(
    dateOfAvailability  DATE, 
    startTime           TIME, 
    endTime             TIME,
    foreign key (trainerID) references trainers
		on delete set null  
);

create table paymentProcess(
    memberFirstName     TEXT NOT NULL, 
    memberLastName      TEXT NOT NULL, 
    paymentAmount       FLOAT, 
    billingDate         DATE,
    foreign key (memberID) references members
		on delete set null
);

