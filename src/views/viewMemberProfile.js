function view(){
    let memberName = document.getElementById("memberToView").value; 

    memberName = memberName.split(" "); 

    let firstName = memberName[0]; 
    let lastName = memberName[1]; 

    let name = {firstName: firstName, lastName, lastName}; 

    let viewRequest = new XMLHttpRequest(); 

    viewRequest.open("POST", "/viewMemberInformation", true);
    viewRequest.setRequestHeader("Content-Type", "application/json");

    viewRequest.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            let information = (JSON.parse(this.response).information);
            console.log(information); 
            let memberName = information[0][0].firstname + information[0][0].lastname;
            window.location = "http://localhost:3000/memberProfile";

        }
    }
    viewRequest.send(JSON.stringify(name));
}