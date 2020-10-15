var DUR = 30

const state = {NOTDONE: 0, CURRENT: 1, DONE: 2};

var workout = {
    list: [],
    addExercise: function(name) {
        newEx = {name: name, state:state.NOTDONE}
        this.list.push(newEx)
    }
};

var handlers = {
    timer: function(seconds) {
        start = Date.now();
        do {
            elapsedTime = Math.floor(Date.now() - start) / 1000; 
        } while (elapsedTime < seconds);

        return true;
    },
    resetWorkout: function() {
        for(i = 0; i < workout.list.length; i++) workout.list[i].state = state.NOTDONE;
    },
    beginWorkout: function(id) {
        // disable startButton
        var startButton = document.querySelector("#startButton");
        startButton.className = "btn btn-primary btn-large btn-block disabled";
        startButton.disabled = true;
    
        // get current exercise li
        var exLi = document.querySelector("#n" + id);
        exLi.className = "list-group-item active";
    
        // init countdown + badge
        var secondsLeft = DUR;
        var badge = exLi.querySelector(".badge");
        badge.textContent = secondsLeft;
    
        // start countdown
        var refreshIntervalId = setInterval(function() {
            secondsLeft--;
            if(secondsLeft > 0) {
                badge.textContent = secondsLeft;
            } else {
                clearInterval(refreshIntervalId);
                badge.textContent = "done";
                exLi.className = "list-group-item list-group-item-success";
                id++;
                if (id < workout.list.length) handlers.beginWorkout(id);
                else {
                    startButton.className = "btn btn-primary btn-large btn-block";
                    startButton.disabled = false
                }
            }
        }, 1000);

        function pauseInterval() {
            console.log("I am paused lmao");
            //clearInterval(refreshIntervalId);
        }


  },
};

var view = {
    displayWorkout: function() {
        // reset <ul>
        var exUl = document.querySelector('ul');
        exUl.innerHTML = '';
    
        workout.list.forEach( function(ex, pos) {
            // make <li> and <span>
            var exLi = document.createElement('li');
            var statusSpan = document.createElement('span');
            
            switch(ex.state) {
                case state.NOTDONE:
                    statusSpan.textContent = "not done"
                    exLi.className = "list-group-item list-group-item-warning"
                    break;
                case state.CURRENT:
                    exLi.className = "list-group-item active"
                    break;
                case state.DONE:
                    statusSpan.textContent = "done"
                    exLi.className = "list-group-item list-group-item-success"
                    break;
            }
            exLi.id = "n" + pos;
            exLi.textContent = ex.name;
            statusSpan.className = "badge";

            // append stuff
            exLi.appendChild(statusSpan);
            exUl.appendChild(exLi); 
        }, this);
    },
    setUpEventListeners: function() {
        //listen for start
        var startButton = document.querySelector("#startButton");
        startButton.addEventListener("click", function(e) { 
            if(!e.target.disabled) handlers.beginWorkout(0);
        });
    
    //var pauseButton = document.querySelector("#pauseButton");
    //pauseButton.addEventListener("click", function() { ihandlers.beginWorkout().pauseInterval(); });
  }
};


absWorkout = ["Leg Drops", "Flutter Kicks", "Scissor Kicks", "Mountain Climbers", "V-Crunches", "Alternating Toe Touches", "Russian Twists", "Plank", "Side Plank (R)", "Side Plank (L)"];

for (i = 0; i< absWorkout.length; i++) {
    workout.addExercise(absWorkout[i]);
}

view.displayWorkout();
view.setUpEventListeners();
