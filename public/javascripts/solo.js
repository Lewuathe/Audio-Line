var gSound;

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
    var ret;
    var tweetIndex = Math.floor(gPhase % 200) + 13;
    if (gPhase < 60 ) {
        // Do 60
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 102 ) {
        // None 42
        ret = 0.25;
    }
    else if (gPhase < 150 ) {
        // Do 48
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 250) {
        // Re 100
        ret = self.noteList[1].sound();
    }
    else if (gPhase < 360) {
        // Do 110
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 460) {
        // Fa 100
        ret = self.noteList[3].sound();
    }
    else if (gPhase < 740 ) {
        // Mi 140
        ret = self.noteList[2].sound();
    }
    else if (gPhase < 800) {
        ret = 0.25;
    }
    else if (gPhase < 860 ) {
        // Do 60
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 902 ) {
        // None 42
        ret = 0.25;
    }
    else if (gPhase < 950 ) {
        // Do 48
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 1050) {
        // Re 100
        ret = self.noteList[1].sound();
    }
    else if (gPhase < 1160) {
        // Do 110
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 1260) {
        // So 100
        ret = self.noteList[4].sound();
    }
    else if (gPhase < 1500 ) {
        // Fa 
        ret = self.noteList[3].sound();
    }
    else if (gPhase < 1550) {
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 1600) {
        ret = 0.25;
    }
    else if (gPhase < 1650) {
        ret = self.noteList[0].sound();
    }
    else if (gPhase < 1750) {
        // Do2
        ret = self.noteList[7].sound();
    }
    else if (gPhase < 1850) {
        ret = self.noteList[5].sound();
    }
    else if (gPhase < 1950) {
        ret = self.noteList[4].sound();
    }
    else if (gPhase < 2000) {
        ret = self.noteList[3].sound();
    }
    else if (gPhase < 2050) {
        ret = 0.25;
    }
    else if (gPhase < 2090) {
        ret = self.noteList[3].sound();
    }
    else if (gPhase < 2500) {
        ret = self.noteList[1].sound();
    }


    else if (gPhase < 2550) {
        ret = self.noteList[10].sound() + self.noteList[3].sound();
    }
    else if (gPhase < 2600) {
        ret = 0.25;
    }
    else if (gPhase < 2650) {
        ret = self.noteList[10].sound() + self.noteList[3].sound();
    }
    else if (gPhase < 2760) {
        ret = self.noteList[9].sound() + self.noteList[2].sound();
    }
    else if (gPhase < 2870) {
        ret = self.noteList[7].sound() + self.noteList[0].sound();
    }
    else if (gPhase < 2990) {
        ret = self.noteList[8].sound() + self.noteList[1].sound();
    }
    else if (gPhase < 3500 ){
        ret = self.noteList[7].sound() + self.noteList[0].sound();
    }
    else {
        ret = 0.25;
    }

    ret += self.noteList[tweetIndex-1].sound() * 0.1 + self.noteList[tweetIndex].sound() * 0.1 + self.noteList[tweetIndex-2].sound() * 0.1;
    return ret;
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
    return Math.sin(6.28318 * self.phase) * 0.6;
}


function average(list) {
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return sum / list.length;
}

function oneliner(tweets) {
    var freqList = [262, 294, 330, 349, 392, 440, 494, 262*2, 294*2, 330*2, 349*2, 392*2, 440*2, 494*2];
    notes = new Notes();
    for (var i = 0; i < freqList.length; i++) {
        notes.push(new Note(freqList[i]));
    }

    var tweetAves = [];
    for (var i = 0; i < tweets.length; i++) {
        var aveFreq = Math.abs(average(tweets[i])) * 50;
        notes.push(new Note(aveFreq));
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



$(function(){

	var camera, scene, renderer;
	var geometry, material, mesh;

	var boid = new Boid( 900, 450 );
    var centerX = 500;
    var centerY = 400;


    $("body").on("mousemove", "canvas", function(e){
        var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
        var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
        camera.position.x =  1000*Math.sin(0.002*(e.clientX - centerX));
        camera.position.z =  1000*Math.cos(0.002*(e.clientX - centerX));
        camera.position.y =  1000*Math.sin(-0.001*(e.clientY - centerY));
        console.log("x: " + camera.position.x + ", z: " + camera.position.z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    });
	function init() {
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.z = 1000;
        camera.position.y = 100;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
		
		scene = new THREE.Scene();
		
        geometry = new THREE.SphereGeometry(15);
		material = new THREE.MeshBasicMaterial( { color: 0x33ccff, wireframe: true } );
        
        var wingGeometry = new THREE.PlaneGeometry(25, 25);

        var plane = new THREE.TorusGeometry(500, 40, 8, 20);
        var stage = new THREE.Mesh(plane, material);
        stage.rotation.x = 3.14159 * 0.5;
        
		scene.add(stage);
        for (var i = 0; i < 30; i++) {
		    mesh = new THREE.Mesh( geometry, material );
            mesh.rWing = new THREE.Mesh(wingGeometry, material);
            mesh.lWing = new THREE.Mesh(wingGeometry, material);
            scene.add(mesh);
            scene.add(mesh.rWing);
            scene.add(mesh.lWing);
            boid.addMesh(mesh);
        }

		renderer = new THREE.CanvasRenderer();
		renderer.setSize( 900, 450 );
		
		document.body.appendChild( renderer.domElement );
		
	}
	
	function animate() {
		// note: three.js includes requestAnimationFrame shim
		requestAnimationFrame( animate );
	    boid.update();
        
	    for (var i = 0; i < boid.objects.length; i++) {
            var mesh = boid.objects[i];
//		    mesh.rotation.x += 0.01;
//		    mesh.rotation.y = mesh.vy;
//            mesh.rotation.z = mesh.vz;
        }
		renderer.render( scene, camera );
		
	}
	
    
	pico.play(oneliner(tweets));

	init();
	animate();


});
