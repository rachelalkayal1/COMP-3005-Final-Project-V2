function sendMachine(number){

    let nameofmachine = document.getElementById("nameequip" + number).innerText; 
    
    
    let updateRequest = new XMLHttpRequest(); 

    updateRequest.open('POST', '/updateMachineCheckup'); 
    updateRequest.setRequestHeader('Content-Type', 'application/JSON');

    let machineName = {nameofmachine : nameofmachine}; 

    updateRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("Machine Sent for Checkup!"); 
            window.location.reload();
        }
    }

    updateRequest.send(JSON.stringify(machineName));
}