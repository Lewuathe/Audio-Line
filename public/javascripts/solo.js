function Notes(){
    var self = this;
    self.noteList = [];
}

Notes.prototype.push = function(note) {
    var self = this;
    self.noteList.push(note);
}

Notes.prototype.keep = function() {
    var self = this;
    for (var i = 0; i < self.noteList.length; i++) {
        self.noteList[i].keep();
    }
}

Notes.prototype.sound = function(gPhase) {
    var self = this;
    if (gPhase < 60 ) {
        // Do 60
        return self.noteList[0].sound();
    }
    else if (gPhase < 102 ) {
        // None 42
        return 0.25;
    }
    else if (gPhase < 150 ) {
        // Do 48
        return self.noteList[0].sound();
    }
    else if (gPhase < 250) {
        // Re 100
        return self.noteList[1].sound();
    }
    else if (gPhase < 360) {
        // Do 110
        return self.noteList[0].sound();
    }
    else if (gPhase < 460) {
        // Fa 100
        return self.noteList[3].sound();
    }
    else if (gPhase < 740 ) {
        // Mi 140
        return self.noteList[2].sound();
    }
    else if (gPhase < 800) {
        return 0.25;
    }
    else if (gPhase < 860 ) {
        // Do 60
        return self.noteList[0].sound();
    }
    else if (gPhase < 902 ) {
        // None 42
        return 0.25;
    }
    else if (gPhase < 950 ) {
        // Do 48
        return self.noteList[0].sound();
    }
    else if (gPhase < 1050) {
        // Re 100
        return self.noteList[1].sound();
    }
    else if (gPhase < 1160) {
        // Do 110
        return self.noteList[0].sound();
    }
    else if (gPhase < 1260) {
        // So 100
        return self.noteList[4].sound();
    }
    else if (gPhase < 1500 ) {
        // Fa 
        return self.noteList[3].sound();
    }
    else if (gPhase < 1550) {
        return self.noteList[0].sound();
    }
    else if (gPhase < 1600) {
        return 0.25;
    }
    else if (gPhase < 1650) {
        return self.noteList[0].sound();
    }
    else if (gPhase < 1750) {
        // Do2
        return self.noteList[7].sound();
    }
    else if (gPhase < 1850) {
        return self.noteList[5].sound();
    }
    else if (gPhase < 1950) {
        return self.noteList[4].sound();
    }
    else if (gPhase < 2000) {
        return self.noteList[3].sound();
    }
    else if (gPhase < 2050) {
        return 0.25;
    }
    else if (gPhase < 2090) {
        return self.noteList[3].sound();
    }
    else if (gPhase < 2500) {
        return self.noteList[1].sound();
    }


    else if (gPhase < 2550) {
        return self.noteList[10].sound();
    }
    else if (gPhase < 2600) {
        return 0.25;
    }
    else if (gPhase < 2650) {
        return self.noteList[10].sound();
    }
    else if (gPhase < 2760) {
        return self.noteList[9].sound();
    }
    else if (gPhase < 2870) {
        return self.noteList[7].sound();
    }
    else if (gPhase < 2990) {
        return self.noteList[8].sound();
    }
    else if (gPhase < 3500 ){
        return self.noteList[7].sound();
    }
    else {
        return 0.25;
    }
}

function Note(freq) {
    var self = this;
    self.phase = 0;
    self.phaseStep = freq / pico.samplerate;
}

Note.prototype.keep = function(){
    var self = this;
    self.phase += self.phaseStep;
}

Note.prototype.sound = function() {
    var self = this;
    return Math.sin(6.28318 * self.phase) * 0.50;
}



function oneliner(tweets) {
    var freqList = [262, 294, 330, 349, 392, 440, 494, 262*2, 294*2, 330*2, 349*2, 392*2, 440*2, 494*2];
    notes = new Notes();
    for (var i = 0; i < freqList.length; i++) {
        notes.push(new Note(freqList[i]));
    }
    
    var gPhase = 0;
    return {
        process: function(L, R) {
            for (var i = 0; i < L.length; i++) {
                L[i] = R[i] = notes.sound(gPhase);
                notes.keep();
                gPhase += 0.005;
                if (gPhase > 4000){
                    gPhase = 0;
                }
            }
        }
    };
}

