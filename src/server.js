//connect to the database on the server side 
const db = require ('./databaseConnection.js');
const express = require ('express'); 
const pug = require('pug');
const app = express(); 
const port = 3000;

app.listen(port, ()=>{
    console.log("Sever is now listening at port 3000");
});

app.set('views', './views'); 
app.set('view engine', 'pug');

app.use(express.json());

db.connect();

app.get("/", renderLogin); 
app.get("/newMember", renderSignUp); 
app.get("/fitnessAchievements", renderFitnessAchievements);
app.post("/addLiftProgression", addNewProgression);
app.get("/exerciseRoutine", renderExercisePage);
app.get("/trainerSchedule", renderManageSchedule);
app.get("/viewMemberProfile", renderMemberProfile);
app.post("/setSchedule", setTrainerSchedule);
app.get("/allClasses", renderClassPage); 
app.get("/bookASession", renderPrivateSession);
app.get("/healthInformation", renderHealthInformation);
app.get("/roomsPage", renderRoomPage); 
app.get("/processPayments", renderPaymentPage);
app.get("/equipmentPage", renderEquipmentPage); 
app.get("/updateClasses", renderUpdateClass); 
app.post("/changeClass", updateSpecClass);
app.post("/updateMachineCheckup", updateMachineCheckup); 
app.post("/addMember", addNewMember); 
app.post("/enrollMemberIntoClass", enrollMemberIntoClass); 
app.post("/updateWeight", updateWeight);
app.post("/updateHeight", updateHeight);
app.post("/memberBookSlot", memberBookSlot); 
app.post("/addNewClass", addNewClass);
app.post("/:username", validateLogin);
app.get("/:username", redirectDashboard);


let username; 
let password; 
let isTrainer;
let isAdmin;
//show the login page
function renderLogin (req, res){
    res.render('login');
    db.end;
}

//show the sign up page for new members
function renderSignUp (req, res){
    res.render('signupPage');
    db.end;
}

async function validateLogin(req, res){
    username = req.body.username; 
    password = req.body.password; 
    isTrainer = req.body.isTrainer;
    isAdmin = req.body.isAdmin;

    const trainerNameResult = await db.query(`SELECT username from trainers WHERE username = '${username}'`);
    if (trainerNameResult.rows.length != 0){
        isTrainer = "on"; 
    }

    const adminNameResult = await db.query(`SELECT username from admins WHERE username = '${username}'`);

    if (adminNameResult.rows.length != 0){
        isAdmin = "on"; 
    }

    let result = db.query(`SELECT * FROM members WHERE username = '${username}' and userpassword = '${password}'`);

    if(result){
        res.status(200); 
        res.end();
    }
}

async function redirectDashboard (req, res){
    if (isTrainer === "on"){
        res.render('trainerDashboard', {user: username});
    }else if(isAdmin === "on"){
        res.render('adminDashboard', {user: username});
    }else{
        res.render('dashboard', {user: username});
    }
}

async function addNewMember (req, res){
    firstName = req.body.firstName;
    lastName = req.body.lastName; 
    username = req.body.username; 
    password = req.body.password; 
    let height = req.body.height; 
    let weight = req.body.weight; 
    let dob = req.body.dob;
    let medication = req.body.medication;
    isTrainer = req.body.isTrainer;
    isAdmin = req.body.isAdmin;
    let trainerName;
    
    if (isTrainer === "on"){
        await db.query(`INSERT INTO trainers (username, userPassword) VALUES ('${username}', '${password}')`);
        const trainerIDResult = await db.query(`SELECT trainerID from trainers WHERE username = '${username}'`);
        const trainderID = trainerIDResult.rows[0].trainerid;
        await db.query(`INSERT INTO trainerInfo (firstName, lastName, dateOfBirth, trainerID) VALUES ('${firstName}', '${lastName}', '${dob}', '${trainderID}')`);
        // const trainerNameResult = await db.query(`SELECT username from trainers WHERE username = '${username}'`);
        // trainerName = trainerNameResult.rows[0].username;
        
    }else if (isAdmin === "on"){
        await db.query(`INSERT INTO admins (username, userPassword) VALUES ('${username}', '${password}')`);
        const staffIDResult = await db.query(`SELECT staffID from admins WHERE username = '${username}'`);
        const staffID = staffIDResult.rows[0].staffid;
        await db.query(`INSERT INTO adminInfo (firstName, lastName, dateOfBirth, staffID) VALUES ('${firstName}', '${lastName}', '${dob}', '${staffID}')`);
        
    }else{
        await db.query(`INSERT INTO members (username, userPassword) VALUES ('${username}', '${password}')`);

        const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
        const memberID = memberIDResult.rows[0].memberid;

        await db.query(`INSERT INTO medicationList (nameOfMedication, memberID) VALUES ('${medication}', ${memberID})`);

        const medicationIDResult = await db.query(`SELECT medicationID FROM medicationList WHERE memberID = ${memberID}`);
        const medicationID = medicationIDResult.rows[0].medicationid;

        await db.query(`INSERT INTO memberInfo (firstName, lastName, dateOfBirth, memberWeight, memberHeight, medicationID, memberID)
                        VALUES ('${firstName}', '${lastName}', '${dob}', ${weight}, ${height}, ${medicationID}, ${memberID})`);
    }
    res.status(200).send({ isTrainer, isAdmin});
    res.end();
}

async function renderHealthInformation (req, res) {
    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);  
    const memberID = memberIDResult.rows[0].memberid;
    const memberInfoResult = await db.query(`SELECT * FROM memberInfo WHERE memberID = ${memberID}`);
    const memberInfo = memberInfoResult.rows[0]; 
    const medicationIDResult = await db.query(`SELECT * FROM medicationList WHERE memberID = ${memberID}`)
    const medicationID = medicationIDResult.rows[0].nameofmedication;

    res.render('healthInformation', {
        firstName: memberInfo.firstname,
        lastName: memberInfo.lastname,
        dateOfBirth: memberInfo.dateofbirth.toString().split("00:00:00").slice(0, -1),
        weight: memberInfo.memberweight,
        height: memberInfo.memberheight, 
        medication: medicationID
    });
}

async function updateWeight(req, res) {
    let newWeight = req.body.newWeight;

    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    await db.query(`UPDATE memberInfo SET memberWeight = ${newWeight} WHERE memberID = ${memberID}`);

    res.sendStatus(200).end();
}

async function updateHeight(req, res) {
    let newHeight = req.body.newHeight;

    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    await db.query(`UPDATE memberInfo SET memberHeight = ${newHeight} WHERE memberID = ${memberID}`);

    res.sendStatus(200).end();
}

async function renderExercisePage (req, res){

    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    const results = await db.query(`SELECT * FROM exerciseRoutine WHERE memberID = ${memberID}`);

    const previousLogs = [];

    previousLogs.push(results.rows);
    res.render('exerciseRoutine', {
        previousLogs: previousLogs[0]
    });

}

async function renderFitnessAchievements (req, res) {
    //add log of previous weights 
    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    const weightGoals = await db.query(`SELECT * FROM memberGoals WHERE memberID = ${memberID}`); 
    const currentWeight = weightGoals.rows[0].currentweight; 
    const goalWeight = weightGoals.rows[0].goalweight; 

    const weight = {currentWeight : currentWeight, goalWeight : goalWeight}; 

    const liftProgressions = await db.query(`SELECT * FROM memberProgression WHERE memberID = ${memberID}`);
    
    const allLifts = liftProgressions.rows; 

    liftProgressions.rows.forEach((date) =>{ 
        date.dateoflift = date.dateoflift.toString().split("00:00:00").slice(0, -1);
    });

    res.render('fitnessAchievements', {weight, allLifts});

}

async function renderClassPage (req, res) {
    const allClasses = await db.query(`SELECT  * FROM class`); 

    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    //let enrolledClasses = {};
    let memberClassInformation = [];
    let memberEnrolledClasses = [];
    for(let i = 0; i < allClasses.rows.length; i++){
        const classMembers = (`SELECT * FROM classmembers WHERE classid = ${allClasses.rows[i].classid}`); 
        const enrolledClasses = await db.query(`SELECT * FROM (${classMembers}) WHERE memberID = ${memberID}`);
        if(enrolledClasses.rows.length != 0){
            memberClassInformation.push(enrolledClasses.rows[0]);
        }
        
    }

    let classes = []; 
    for(let i = 0; i < memberClassInformation.length; i++){
        let classQuery = await db.query(`SELECT * FROM class WHERE classid = ${memberClassInformation[i].classid}`);
        classes.push(classQuery.rows[0]);

    }
    
    
    classes[0].dateofclass = classes[0].dateofclass.toString().split("00:00:00").slice(0, -1);   
    res.render('classes', {allClasses, classes}); 

    
}

async function renderPrivateSession(req, res) {

    
    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    const allTrainers = await db.query(`SELECT * FROM trainerInfo`); 

    let trainerSchedules = []; 

    for(let i = 0; i < allTrainers.rows.length; i++){
        const trainerScheduleResult = await db.query(`SELECT * FROM trainerSchedule WHERE trainerid = ${allTrainers.rows[i].trainerid}`);

        trainerSchedules.push({trainerSchedule: trainerScheduleResult.rows, trainerFirst: allTrainers.rows[i].firstname, trainerLast: allTrainers.rows[i].lastname, trainerID: allTrainers.rows[i].trainerid, trainerFee: allTrainers.rows[i].sessionfee});

    }

    const memberClassesResult = await db.query(`SELECT * FROM privatesession WHERE memberid = ${memberID}`); 
    const trainersResult = await db.query(`SELECT DISTINCT *
    FROM (
        SELECT *
        FROM privatesession
        WHERE memberid = ${memberID}
    ) AS ps JOIN trainerInfo ON trainerInfo.trainerid IN (
        SELECT trainerid
        FROM privatesession
        WHERE memberid = ${memberID}
    );`); 
    let memberClasses = trainersResult.rows; 

    memberClasses.forEach((date) => {
        date.sessiondate = date.sessiondate.toString().split("00:00:00").slice(0, -1);
    })

    trainerSchedules.forEach((trainer) =>{ 
        trainer.trainerSchedule.forEach((date) =>{
            date.dateofavailability = date.dateofavailability.toString().split("00:00:00").slice(0, -1);
        });
    });

    
    res.render('bookASession', {trainerSchedules, memberClasses});
}

async function addNewProgression(req, res) {

    let nameLift = req.body.nameLift; 
    let dateLift = req.body.dateLift; 
    let weightLift = req.body.weightLift; 
   
    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;
   
    //if entry already exists in database and we need to add instead of updating
    const update = await db.query(`SELECT * FROM memberProgression WHERE memberID = ${memberID} AND nameOfLift = '${nameLift}'`); 
    console.log(update.rows);
    if(update.rows.length != 0){ 
        const lastWeightResult = await db.query(`SELECT currentweight FROM memberProgression WHERE memberID = ${memberID} AND nameOfLift = '${nameLift}'`);
        const lastWeightRecorded = lastWeightResult.rows[0].currentweight; 
        await db.query(`UPDATE memberProgression SET dateoflift =  '${dateLift}', nameoflift = '${nameLift}', currentweight = ${weightLift}, originalweight = ${lastWeightRecorded}, memberid = ${memberID} WHERE memberID = ${memberID} AND nameOfLift = '${nameLift}'`); 
    }else{
        await db.query(`INSERT INTO memberProgression (dateoflift, nameoflift, currentweight, originalweight, memberid) VALUES ('${dateLift}', '${nameLift}', ${weightLift}, ${weightLift}, ${memberID})`);
    }
    res.status(200).end();
}

async function enrollMemberIntoClass(req, res){

    let className = req.body.currentClassName; 
    console.log(className);
    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    const classIDResult = await db.query(`SELECT classid FROM class WHERE classname = '${className}'`); 
    const classID = classIDResult.rows[0].classid; 

    const memberInfoResult = await db.query(`SELECT * FROM memberinfo WHERE memberid = ${memberID}`); 
    const firstname = memberInfoResult.rows[0].firstname; 
    const lastname = memberInfoResult.rows[0].lastname; 

    await db.query(`INSERT INTO classMembers (memberFirstName, memberLastName, classID, memberID) VALUES ('${firstname}', '${lastname}', ${classID}, ${memberID})`); 

    res.status(200).end();
}

async function memberBookSlot(req, res){
    let firstName = req.body.firstName; 
    let lastName = req.body.lastName;
    let date = req.body.date; 
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;  

    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    const findBooking = await db.query(`SELECT * FROM trainerschedule WHERE dateofavailability = '${date}' AND starttime = '${startTime}' AND endtime = '${endTime}'`); 
    await db.query(`INSERT INTO privatesession (sessiondate, sessiontime, duration, trainerid, memberid) VALUES ('${date}', '${startTime}', ${120}, ${findBooking.rows[0].trainerid}, ${memberID})`);
    await db.query(`DELETE FROM trainerschedule WHERE dateofavailability = '${date}' AND starttime = '${startTime}' AND endtime = '${endTime}'`);

    res.status(200).end();  
}

function renderManageSchedule(req, res){
    res.render('trainerSchedule');
}

async function setTrainerSchedule(req, res){
    let dateOfAvailability = req.body.dateOfAvailability;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    const trainerIDResult = db.query(`SELECT trainerID FROM trainers WHERE username = '${username}'`);
    const trainerID = trainerIDResult.rows[0].trainerid;

    await db.query(`INSERT INTO trainerSchedule (dateOfAvailiability, startTime, endTime, trainerID) VALUES ('${dateOfAvailability}', '${startTime}', '${endTime}', ${trainerID}`);

    res.status(200).end();
}

function renderMemberProfile(req, res){
    res.render('viewMemberProfile');
}

async function renderRoomPage(req, res){
    res.render('manageRooms'); 
}

async function renderUpdateClass(req, res){
    
    const allClasses = await db.query(`SELECT  * FROM class`);
    const allRooms = await db.query(`SELECT roomtype FROM rooms`); 
    const allTrainers = await db.query(`SELECT firstname, lastname FROM trainerInfo`);

    allClasses.rows.forEach((currentClass) => {
        currentClass.dateofclass = currentClass.dateofclass.toString().split("00:00:00").slice(0, -1);
    }); 


    for(let i = 0; i < allClasses.rowCount; i++){
        const roomInformation = await db.query(`SELECT * FROM rooms WHERE roomid = ${allClasses.rows[i].roomid}`); 
        allClasses.rows[i].roomName =  roomInformation.rows[0].roomtype;
        const trainerInformation = await db.query(`SELECT * FROM trainerInfo WHERE trainerid = ${allClasses.rows[i].trainerid}`);
        allClasses.rows[i].trainerFirst = trainerInformation.rows[0].firstname; 
        allClasses.rows[i].trainerLast = trainerInformation.rows[0].lastname; 
    }


    res.render('updateClass', {allClasses: allClasses.rows, allRooms: allRooms.rows, allTrainers: allTrainers.rows});
}

async function renderEquipmentPage(req, res){

    const equipmentResult = await db.query(`SELECT * FROM fitnessequipment`); 
    const equipment = equipmentResult.rows; 

    equipment.forEach((currentEquipment) => {
        currentEquipment.nextcheckup = currentEquipment.nextcheckup.toString().split("00:00:00").slice(0, -1);
        currentEquipment.lastcheckup = currentEquipment.lastcheckup.toString().split("00:00:00").slice(0, -1);

    })

    res.render('manageEquipment', {equipment}); 
}

async function renderPaymentPage(req, res){

    const allSessionPaymentsResult = await db.query(`SELECT * FROM sessionPayment`); 
    const allSessionPayment = allSessionPaymentsResult.rows; 

    res.render('processPayments', {allSessionPayment}); 

}

async function updateSpecClass(req, res){
    let currentclassname = req.body.currentclassname;          
    let currentStartTime = req.body.currentStartTime;
    let currentRoom = req.body.currentRoom;
    let newname = req.body.newName; 
    let newdescription = req.body.newDescription; 
    let newdate = req.body.newDate; 
    let newstarttime = req.body.newStartTime; 
    let newendtime = req.body.newEndTime; 
    let newroomtype = req.body.newroomtype;
    let newtrainer = req.body.newtrainer; 

    console.log(currentRoom); 
    console.log(newroomtype);
    newtrainer = newtrainer.split(" "); 

    if(newname != ""){
        await db.query(`UPDATE class SET classname = '${newname}' WHERE classname = '${currentclassname}'`); 
    }
    if(newdescription != ""){
        await db.query(`UPDATE class SET description = '${newdescription}' WHERE classname = '${currentclassname}'`); 
    }
    if(newdate != null){
        await db.query(`UPDATE class SET dateofclass = '${newdate}' WHERE classname = '${currentclassname}'`); 
    }
    if(newstarttime != ""){
        await db.query(`UPDATE class SET starttime = '${newstarttime}' WHERE classname = '${currentclassname}'`); 
    }
    if(newendtime != ""){
        await db.query(`UPDATE class SET endtime = '${newendtime}' WHERE classname = '${currentclassname}'`); 
    }
    console.log(newroomtype != currentRoom);
    if(newroomtype != currentRoom){
        const roomIDResult = await db.query(`SELECT roomid FROM rooms WHERE roomtype = '${newroomtype}'`); 
        const roomID = roomIDResult.rows[0].roomid; 

        const duplicateRoom = await db.query(`SELECT * FROM class WHERE roomid = ${roomID} AND starttime = '${currentStartTime}'`); 
        console.log(duplicateRoom);
        if(duplicateRoom.rowCount != 0){
            res.status(500).end();
        }else{
            const currentClass = await db.query(`SELECT * from class WHERE classname = '${currentclassname}'`); 

            let date = currentClass.rows[0].dateofclass; 
            const description = currentClass.rows[0].description;
            const starttime = currentClass.rows[0].starttime; 
            const endtime = currentClass.rows[0].endtime; 
            const duration = currentClass.rows[0].duration; 
            const trainerID = currentClass.rows[0].trainerid; 

            date = date.toISOString();
            date = date.toString().split("T"); 
            date = date[0];

            await db.query(`DELETE FROM class WHERE classname = '${currentclassname}' AND dateofclass = '${date}' AND duration = ${duration}`); 
            await db.query(`INSERT INTO class (className, description, dateOfClass, startTime, endTime, duration, trainerID, roomID)
            VALUES ('${currentclassname}', '${description}', '${date}', '${starttime}', '${endtime}', ${duration}, ${trainerID}, ${roomID})`);

        }
    }
    if(newtrainer != ""){
        const currentClass = await db.query(`SELECT * from class WHERE classname = '${currentclassname}'`); 

        let date = currentClass.rows[0].dateofclass; 
        const description = currentClass.rows[0].description;
        const starttime = currentClass.rows[0].starttime; 
        const endtime = currentClass.rows[0].endtime; 
        const duration = currentClass.rows[0].duration; 
        const roomID = currentClass.rows[0].roomid;

        console.log(newtrainer[0]); 
        const trainerIDResult = await db.query(`SELECT trainerid FROM trainerInfo WHERE firstname = '${newtrainer[0]}'`);
        const trainerID = trainerIDResult.rows[0].trainerid; 

        console.log(trainerID);

        date = date.toISOString();
        date = date.toString().split("T"); 
        date = date[0];

        console.log(date + description + starttime + endtime + duration + roomID + currentclassname)
        console.log(trainerID);
        
        await db.query(`DELETE FROM class WHERE classname = '${currentclassname}' AND dateofclass = '${date}' AND duration = ${duration}`); 
        await db.query(`INSERT INTO class (className, description, dateOfClass, startTime, endTime, duration, trainerID, roomID)
        VALUES ('${currentclassname}', '${description}', '${date}', '${starttime}', '${endtime}', ${duration}, ${trainerID}, ${roomID})`);
        
    }

    res.status(200).end();
}

async function updateMachineCheckup(req, res){

    let machineName = req.body.nameofmachine; 

    let notableIssues = ['Resistance malfunctions disrupt workouts', 
    'Poorly adjusted seats cause strain.',
    'Worn cables compromise safety.',
    'Inaccurate weights mislead progress.',
    'Lack of maintenance leads to noise.',
    'Unstable frames risk injury.',
    'Inadequate padding causes discomfort.',
    'Improper alignment limits motion.',
    'Outdated tech restricts exercises.',
    'Insufficient instruction leads to misuse', 
    'No notable issues']

    let issueNumber = Math.floor(Math.random() * 11); 

    let currentDate = new Date();

    const pastDateResult = await db.query(`SELECT nextcheckup FROM fitnessequipment WHERE nameofmachine = '${machineName}'`); 
    const pastDate = pastDateResult.rows[0].nextcheckup; 

    let nextCheckup = new Date(); 
    nextCheckup.setMonth(nextCheckup.getMonth()+6); 
    currentDate = currentDate.toISOString();
    nextCheckup = nextCheckup.toISOString();

    currentDate.toString();
    currentDate = currentDate.split("T"); 
    currentDate = currentDate[0];

    nextCheckup.toString();
    nextCheckup = nextCheckup.split("T"); 
    nextCheckup = nextCheckup[0];

    await db.query(`UPDATE fitnessequipment SET lastcheckup = '${currentDate}', nextcheckup = '${nextCheckup}', notableissues = '${notableIssues[issueNumber]}' WHERE nameofmachine = '${machineName}'`); 
    
    res.status(200).end();
}

async function addNewClass(req, res){
    console.log(req.body);
    let classname = req.body.classInformation.classname; 
    let classdescription = req.body.classInformation.classdescription; 
    let classdate = req.body.classInformation.classdate;
    let classstarttime = req.body.classInformation.classstarttime; 
    let classendtime = req.body.classInformation.classendtime; 
    let room = req.body.classInformation.classroom; 

    if(classname === "" || classdate === "" || classstarttime === "" || classendtime === ""){
        res.status(500).end();
    }

 
    const roomIDResult = await db.query(`SELECT roomid FROM rooms WHERE roomtype = '${room}'`); 
    const roomID = roomIDResult.rows[0].roomid;

    await db.query(`INSERT INTO class (className, description, dateOfClass, startTime, endTime, duration, trainerID, roomID)
            VALUES ('${classname}', '${classdescription}', '${classdate}', '${classstarttime}', '${classendtime}', ${60}, ${1}, ${roomID})`);

    res.status(200).end();
}