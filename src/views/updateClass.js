function toggleEdit(number){

    var button = document.getElementById("editingClass" + number);
    button.style.display = "block";

}

function changeClass(number){

    var button = document.getElementById("editingClass" + number);
    button.style.display = "none";

    let classInformation = document.getElementById("currentClass" + number).innerText; 
    classInformation = classInformation.split("\n");

    let newName = document.getElementById("classname" + number).value; 
    let newDescription = document.getElementById("description" + number).value;
    let date = document.getElementById("dateofclass" + number).value; 
    let newStartTime = document.getElementById("starttime" + number).value; 
    let newEndTime = document.getElementById("endtime" + number).value; 
    let newroomtype = document.getElementById("room" + number).value; 
    let newtrainer = document.getElementById("trainer" + number).value; 
    

    let newDate = new Date(date);
    if(date != ""){
        newDate = newDate.toISOString(); 
        newDate.toString();
        newDate = newDate.split("T"); 
        newDate = newDate[0];
    }

    let starttime = classInformation[6].split(" "); 
    let room = classInformation[10].split(": ");
    let classObject = {currentclassname : classInformation[0], 
                    currentclassdescription : classInformation[2],
                    currentStartTime: starttime[1], 
                    currentRoom: room[1],
                    newName : newName, 
                    newDescription : newDescription, 
                    newDate: newDate,
                    newStartTime : newStartTime, 
                    newEndTime: newEndTime,
                    newroomtype: newroomtype, 
                    newtrainer: newtrainer}; 
                    
    let changeRequest = new XMLHttpRequest(); 
   
    changeRequest.open('POST', '/changeClass'); 
    changeRequest.setRequestHeader('Content-Type', 'application/JSON');


    changeRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("Class Changed!"); 
            window.location.reload();
        }else if (changeRequest.status === 500){
            alert('Class information clashes with another, cannot make changes'); 
        }
    }

    changeRequest.send(JSON.stringify(classObject));

}

function addClass(){
    let classname = document.getElementById("newclassname").value; 
    let classdescription = document.getElementById("newclassdescription").value; 
    let date = document.getElementById("newclassdate").value; 
    let classstarttime = document.getElementById("starttime").value; 
    let classendtime = document.getElementById("endtime").value; 
    let room = document.getElementById("chosenroom").value; 
    let trainer = document.getElementById("chosentrainer").value; 

    let classdate = new Date(date);
    classdate = classdate.toISOString(); 
    classdate.toString();
    classdate = classdate.split("T"); 
    classdate = classdate[0];

  
    let classInformation = {classname: classname, 
                            classdescription: classdescription, 
                            classdate: classdate, 
                            classstarttime: classstarttime, 
                            classendtime: classendtime,
                            classroom: room,
                            classtrainer: trainer}; 

    let addRequest = new XMLHttpRequest(); 

    addRequest.open("POST", "/addNewClass", true);
    addRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    addRequest.onreadystatechange = function () {
        if (addRequest.readyState === 4 && addRequest.status === 200) {
            window.location.reload();
        }else if (addRequest.status === 500){
            alert("Empty inputs, please fill out all class inputs");
        }
    };

    addRequest.send(JSON.stringify({classInformation}));
}