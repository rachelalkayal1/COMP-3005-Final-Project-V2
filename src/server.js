
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
app.get("/healthInformation", redirectHealthInformation);
app.get("/exerciseRoutine", renderExercisePage); 
app.get("/fitnessAchievements", renderFitnessAchievements);
app.get("/allClasses", renderClassPage); 
app.get("/bookASession", renderPrivateSession);
app.post("/addMember", addNewMember); 
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
    //let username = req.body.username; 
    //let password = req.body.password;
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

    res.status(200).send({ memberID, medicationID });
    res.end();
}
   
function redirectHealthInformation (req, res) {
    res.render('healthInformation');
}

function renderExercisePage (req, res){
    res.render('exerciseRoutine'); 
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