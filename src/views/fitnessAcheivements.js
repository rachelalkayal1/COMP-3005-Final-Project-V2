function toggleAdd(){

    var button = document.getElementById("addingNewPR");
    button.style.display = "block";
     
}

function addNewProgression(){
    //make the input invisible 
    var button = document.getElementById("addingNewPR");
    button.style.display = "none";

    let nameLift = document.getElementById("nameOfLift").value; 
    let dateLift = document.getElementById("dateoflift").value; 
    let weightLift = document.getElementById("weight").value;

    let liftInformation = {nameLift : nameLift, dateLift : dateLift, weightLift : weightLift}; 
    let addRequest = new XMLHttpRequest(); 

    addRequest.open('POST', '/addLiftProgression'); 
    addRequest.setRequestHeader('Content-Type', 'application/JSON');

    addRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("New PR Added!"); 
            var liftList = document.getElementById("liftSection");
            liftList.style.display = "none"; 
            liftList.style.display = "block"; 
            window.location.reload();
        }
    }
        addRequest.send(JSON.stringify(liftInformation))

}

function addNewGoalWeight(){
    let newgoal = document.getElementById("newgoalweight").value; 

    let goalRequest = new XMLHttpRequest(); 

    goalRequest.open("POST", "/updateGoalWeight", true);
    goalRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    goalRequest.onreadystatechange = function () {
        if (goalRequest.readyState === 4 && goalRequest.status === 200) {
            window.location.reload();
        }
    };
    
    goalRequest.send(JSON.stringify({newgoal}));
}