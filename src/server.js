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
app.post("/addMember", addNewMember); 
app.post("/enrollMemberIntoClass", enrollMemberIntoClass); 
app.post("/updateWeight", updateWeight);
app.post("/updateHeight", updateHeight);
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
        console.log(enrolledClasses.rows.length);

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
    const scheduleInformation = await db.query(`SELECT * FROM trainerschedule`); 
    let trainerSchedule = []; 

    for(let i = 0; i < scheduleInformation.rows.length; i++){
        const trainerInformation = await db.query(`SELECT * FROM trainers WHERE trainerid = ${scheduleInformation.rows[i].trainerid}`); 
        trainerSchedule.push(trainerInformation.rows[i]);
    }

    console.log(trainerSchedule); 
    res.render('bookASession');
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

function renderManageSchedule(req, res){
    res.render('trainerSchedule');
}

async function setTrainerSchedule(req, res){
    let dateOfAvailability = req.body.dateOfAvailability;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    const trainerIDResult = db.query(`SELECT trainerID FROM trainers WHERE username = '${username}'`);
    console.log("Trainer ID Result:", trainerIDResult);
    const trainerID = trainerIDResult.rows[0].trainerid;

    await db.query(`INSERT INTO trainerSchedule (dateOfAvailiability, startTime, endTime, trainerID) VALUES ('${dateOfAvailability}', '${startTime}', '${endTime}', ${trainerID}`);

    res.status(200).end();
}

function renderMemberProfile(req, res){
    res.render('viewMemberProfile');
}
