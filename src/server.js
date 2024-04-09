
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
app.get("/exerciseRoutine", renderExercisePage);
app.post("/submitExerciseRoutine", renderExerciseRoutine);
app.get("/allClasses", renderClassPage); 
app.get("/bookASession", renderPrivateSession);
app.get("/healthInformation", renderHealthInformation);
app.post("/addMember", addNewMember); 
app.post("/updateWeight", updateWeight);
app.post("/updateHeight", updateHeight);
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
    let firstName = req.body.firstName;
    let lastName = req.body.lastName; 
    username = req.body.firstName;
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

function renderFitnessAchievements (req, res) {
    res.render('fitnessAchievements');
}

function renderClassPage (req, res) {
    res.render('classes'); 
}

function renderPrivateSession(req, res) {
    res.render('bookASession');
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

async function renderExerciseRoutine(req, res) {
    console.log("hello");
    let dateOfLift = req.body.dateOfLift;
    let nameOfLift = req.body.nameOfLift;
    let formOfCardio = req.body.formOfCardio;
    let duration = req.body.duration;
    let caloriesBurned;
    const memberIDResult = await db.query(`SELECT memberID FROM members WHERE username = '${username}'`);
    const memberID = memberIDResult.rows[0].memberid;

    if (formOfCardio === 'Walking'){
        caloriesBurned = 5 * duration; 
    }else if (formOfCardio === 'Running'){
        caloriesBurned = 10 * duration;
    }else if (formOfCardio === 'Swimming'){
        caloriesBurned = 8 * duration;
    }else{
        caloriesBurned = 0;
    }

    await db.query(`INSERT INTO exerciseRoutine (dateOfExercise, formOfCardio, nameOfLift, caloriesBurned, memberID, duration)
                    VALUES ('${dateOfLift}', '${formOfCardio}', '${nameOfLift}', ${caloriesBurned}, ${memberID}, ${duration})`);

    res.status(200).end();
}