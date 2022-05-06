function reviewSubmit(){
    console.log("Review has been submitted");
    let url = document.getElementById("summaryBox").innerHTML = window.location.href;
    console.log(url.slice(32));
    url = url.slice(32);

    let arr = [];

    let rating = document.getElementById("ratings").value;
    let summary = document.getElementById("summaryBox").value;
    let review = document.getElementById("reviewBox").value;

    if (summary==''){
        summary = 'None';
    }
    if (review===''){
        review = 'None';
    }

    arr.push(rating);
    arr.push(summary);
    arr.push(review);

    let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState===4 && this.status===201){
                console.log("saved");
                alert("Review saved!");
                window.location = "/movielist/"+url;
            }
        }
    req.open("POST",'/review/'+url,true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
}

function searchSubmit(){
    console.log("Search has been submitted");
    let url = "?page=1";
    let arr = [];
    let Title = document.getElementById("title").value;
    if (Title!=""){
        url += "&Title="+Title;
        arr.push(Title)
    }
    let Actor = document.getElementById("actor").value;
    if (Actor!=""){
        //if (Title!=""){
            url+="&Actor="+Actor;
        //}

    }
    let Genre = document.getElementById("genre").value;
    if (Genre!=""){
        url += "&Genre="+Genre;
        arr.push(Genre)
    }
    console.log(url);
    
    let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState===4 && this.status===201){
                document.getElementById("results").innerHTML = this.responseText;
                alert("Searching for movie or movies!");
            }
        }
    //req.open("GET",'/search/results'+url,true);
    req.open("GET",'/search/results'+url,true);
    //req.setRequestHeader("Content-Type", "application/json");
    req.send();
}

function watchlistSubmit(){
    console.log("Watchlist button has been submitted");
    let url = document.getElementById("summaryBox").innerHTML = window.location.href;
    console.log(url);
    url = url.slice(32);
    let arr = [];

    arr.push(url);
    let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState===4 && this.status===201){
                console.log("saved");
                alert("Added to watchlist!");
            }
        }
    req.open("POST",'/user/watchlist/'+url,true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
}

function personFollow(){
    console.log("Follow button has been submitted");
    let url = window.location.href;
    console.log(url);
    url = url.slice(39);
    console.log(url);
    let arr = [];

    arr.push(url);
    let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState===4 && this.status===201){
                console.log("saved");
                alert("Following!");
            }
        }
    req.open("POST",'/user/following_person/'+url,true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
}


function removeMovieFromWatchList(){
    let arr = [];
    let movieToRemove = document.getElementById("removeFromWatchList").value;
    arr.push(movieToRemove);

    let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState===4 && this.status===201){
                console.log("saved");
                alert("Removed from watchlist!")
                document.getElementById("watchlistMovies").innerHTML = "";
                document.getElementById("watchlistMovies").innerHTML = this.responseText;
            }
        }
    req.open("GET",'/user/remove_movie/'+movieToRemove,true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
    
}

function unfollowPerson(){
    let arr = [];
    let personToRemove = document.getElementById("removePerson").value;
    arr.push(personToRemove);

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState===4 && this.status===201){
            console.log("saved");
            alert("Removed!")
            document.getElementById("personFollowing").innerHTML = "";
            document.getElementById("personFollowing").innerHTML = this.responseText;
        }
    }
    req.open("GET",'/user/remove_person/'+personToRemove,true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
}

function userFollow(){
    console.log("Follow button has been submitted");
    let url = window.location.href;
    let arr = [];
    url = url.slice(31)
    console.log(url);
    arr.push(url);

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState===4 && this.status===201){
            console.log("saved");
            alert("Following!")
        }
    }
    req.open("POST",'/user/followUser/'+url,true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
}

function unfollowUser(){
    let arr = [];
    let userToRemove = document.getElementById("removeUser").value;
    arr.push(userToRemove);

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState===4 && this.status===201){
            console.log("saved");
            alert("Removed!")
            document.getElementById("usersFollowing").innerHTML = "";
            document.getElementById("usersFollowing").innerHTML = this.responseText;
        }
    }
    req.open("GET",'/user/remove_user/'+userToRemove,true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
}

function switchToContrib(){
    let req = new XMLHttpRequest();
    let arr = [];
    req.onreadystatechange = function() {
        if(this.readyState===4 && this.status===201){
            console.log("saved");
            alert("Swtiched to contribute!")
        }
    }
    req.open("POST",'/user/switchContrib',true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(arr));
}