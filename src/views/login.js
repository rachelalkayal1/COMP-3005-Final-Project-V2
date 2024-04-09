function loginInfo(){

    //get the username and the password of the existing member 
    let username = document.getElementById("username").value; 
    let password = document.getElementById("password").value; 

    //handle empty inputs
    if(!username){
        document.getElementById('userError').innerHTML = `<p id="userError">Please enter your username`; 
    }else{
        document.getElementById('userError').innerHTML = " ";
    }

    if(!password){
        document.getElementById('passError').innerHTML = `<p id="userError">Please enter your password`; 
    }else{
        document.getElementById('passError').innerHTML = " ";
    }

    if(username && password){
        let loginInformation = {username : username, password : password}; 
        let loginRequest = new XMLHttpRequest(); 

        loginRequest.open("POST", "/" + username); 
        loginRequest.setRequestHeader('Content-Type', 'application/JSON');

        loginRequest.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                //redirect user to the dashboard once they are logged in
                window.location = "http://localhost:3000/" + username;
            }
        }
        loginRequest.send(JSON.stringify(loginInformation));
    }

}

function signupPage() {
    let signupRequest = new XMLHttpRequest(); 

    signupRequest.open("GET", "/newMember"); 
    signupRequest.setRequestHeader('Content-Type', 'application/JSON');

    signupRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            window.location = "http://localhost:3000/newMember/";
        }
    }   

    signupRequest.send();
}

function create(){
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let dob = document.getElementById('dob').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let height = document.getElementById('height').value;
    let weight = document.getElementById('weight').value;
    let medication = document.getElementById('medicine').value;
    let isTrainer = document.getElementById

    if(!firstName){
        document.getElementById('firstNameError').innerHTML = `<p id="firstNameError">Please enter your first name`; 
    }else{
        document.getElementById('firstNameError').innerHTML = " ";
    }

    if(!lastName){
        document.getElementById('lastNameError').innerHTML = `<p id="lastNameError">Please enter your last name`; 
    }else{
        document.getElementById('lastNameError').innerHTML = " ";
    }

    if(!username){
        document.getElementById('usernameError').innerHTML = `<p id="usernameError">Please enter a Username`; 
    }else{
        document.getElementById('usernameError').innerHTML = " ";
    }

    if(!dob){
        document.getElementById('dateError').innerHTML = `<p id="dateError">Please enter your date of birth`; 
    }else{
        document.getElementById('dateError').innerHTML = " ";
    }
    
    if(!password){
        document.getElementById('passError').innerHTML = `<p id="passError">Please enter a password`; 
    }else{
        document.getElementById('passError').innerHTML = " ";
    }

    if(!height){
        document.getElementById('heightError').innerHTML = `<p id="heightError">Please enter your height`; 
    }else{
        document.getElementById('heightError').innerHTML = " ";
    }

    if(!weight){
        document.getElementById('weightError').innerHTML = `<p id="weightError">Please enter your weight`; 
    }else{
        document.getElementById('weightError').innerHTML = " ";
    }

    if(!medication){
        document.getElementById('medicineError').innerHTML = `<p id="medicineError">Please enter your medication or N/A`; 
    }else{
        document.getElementById('medicineError').innerHTML = " ";
    }

    let userInformation = {firstName : firstName, lastName : lastName, dob : dob, username : username, password : password, height : height, weight : weight, medication : medication};
    let addMemberRequest = new XMLHttpRequest();
    addMemberRequest.open("POST", "/addMember", true);
    addMemberRequest.setRequestHeader("Content-Type", "application/json");

    addMemberRequest.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            //redirect user to the dashboard once they are logged in
            window.location = "http://localhost:3000/" + username;
            let response = this.responseText; 
            console.log(response);
        }
    }
    addMemberRequest.send(JSON.stringify(userInformation));

}

function addTrainer(){
    let checkBox = document.getElementById('isTrainer');
    if(checkBox.checked){

    }
}
    

