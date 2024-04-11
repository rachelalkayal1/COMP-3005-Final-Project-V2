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
app.get("/allClasses", renderClassPage); 
app.get("/bookASession", renderPrivateSession);
app.get("/healthInformation", renderHealthInformation);
app.post("/addMember", addNewMember); 
app.post("/enrollMemberIntoClass", enrollMemberIntoClass); 
app.post("/updateWeight", updateWeight);
app.post("/updateHeight", updateHeight);
app.post("/memberBookSlot", memberBookSlot); 
app.post("/:username", validateLogin);
app.get("/:username", redirectDashboard);


let username; 
let password; 
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

function validateLogin(req, res){
    username = req.body.username; 
    password = req.body.password; 

    let result = db.query(`SELECT * FROM members WHERE username = '${username}' and userpassword = '${password}'`);

    if(result){
        res.status(200); 
        res.end();
    }
}

function redirectDashboard (req, res){
    res.render('dashboard', {user: username});
}

async function addNewMember (req, res){
    firstName = req.body.firstName;
    lastName = req.body.lastName; 
    username = req.body.username; 
    password = req.body.password; 
    let height = req.body.height; 
    let weight = req.body.weight; 
    let dob = req.body.dob;
    let medication = req.body.medication
    
    await db.query(`INSERT INTO members (username, userPassword) VALUES ('${username}', '${password}')`);

    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    await db.query(`INSERT INTO medicationList (nameOfMedication, memberID) VALUES ('${medication}', ${memberID})`);

    const medicationIDResult = await db.query(`SELECT medicationID FROM medicationList WHERE memberID = ${memberID}`);
    const medicationID = medicationIDResult.rows[0].medicationid;

    await db.query(`INSERT INTO memberInfo (firstName, lastName, dateOfBirth, memberWeight, memberHeight, medicationID, memberID)
                    VALUES ('${firstName}', '${lastName}', '${dob}', ${weight}, ${height}, ${medicationID}, ${memberID})`);

    res.status(200).send({ memberID, medicationID });
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

        trainerSchedules.push({trainerSchedule: trainerScheduleResult.rows, trainerFirst: allTrainers.rows[i].firstname, trainerLast: allTrainers.rows[i].lastname, trainerID: allTrainers.rows[i].trainerid});

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

    console.log(trainersResult); 



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

