function memberBookSlot(number){

    let trainerName = document.getElementById('trainerName').innerText; 

    trainerName = trainerName.split(" "); 
    let trainerFirst = trainerName[1]; 
    let trainerLast = trainerName[2]; 

    let dateDocument = document.getElementById('date' + number).innerText; 
    dateDocument = dateDocument.split(" ");
    let date = dateDocument[1] + " " + dateDocument[2] + " " + dateDocument[3] + " "  + dateDocument[4]; 
    
    let accDate = new Date(date);
    accDate = accDate.toISOString(); 
    accDate.toString();
    accDate = accDate.split("T"); 
    accDate = accDate[0];     

    let startTime = document.getElementById('start' + number).innerText; 
    startTime = startTime.split(" "); 
    let start = startTime[2]; 

    let endTime = document.getElementById('end' + number).innerText; 
    endTime = endTime.split(" "); 
    let end = endTime[2];

    let sessionInformation = {firstName: trainerFirst, lastName: trainerLast, date: accDate, startTime: start, endTime: end}; 

    let bookingRequest = new XMLHttpRequest(); 

    bookingRequest.open('POST', '/memberBookSlot'); 
    bookingRequest.setRequestHeader('Content-Type', 'application/JSON');


    bookingRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("Slot Booked!"); 
            window.location.reload();
        }
    }

    bookingRequest.send(JSON.stringify(sessionInformation));

}