function enrollMember(number){

    let currClass = document.getElementById("nameofclass" + number).innerText; 
    let currentClassName = {currentClassName : currClass};

    console.log(currentClassName);
    
    let enrollMemberRequest = new XMLHttpRequest(); 

    enrollMemberRequest.open('POST', '/enrollMemberIntoClass'); 
    enrollMemberRequest.setRequestHeader('Content-Type', 'application/JSON');


    enrollMemberRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("You are now enrolled!"); 
            var currentClasses = document.getElementById("currentClasses");
            currentClasses.style.display = "none"; 
            currentClasses.style.display = "block"; 
            window.location.reload();
        }
    }

    enrollMemberRequest.send(JSON.stringify(currentClassName)); 

}