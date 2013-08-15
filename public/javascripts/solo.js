/*
window.f1 = function(t) {
    return Math.sin(t*(0.001+Math.sin(t>>10)))*64;
};
window.f2 = function(t) {
    return (t>>9)&((t<<5)|(Math.sin(t*1.4142)*3000))+(t>>3);
};

function oneliner(tweets) {
    var t = 0, dt = 8000 / pico.samplerate;
    var dlyL = new pico.DelayNode({time:225, feedback:0.8});
    var dlyR = new pico.DelayNode({time:225, feedback:0.8});
    return {
        process: function(L, R) {
            for (var i = 0; i < L.length; i++) {
                L[i] = (window.f1(t|0) % 256) / 512;
                R[i] = (window.f2(t|0) % 256) / 512;
                t += dt;
            }
            dlyL.process(L, true);
            dlyR.process(R, true);
        }
    };
}
*/

function oneliner(tweets) {
	var freq = 880;
    var phase = 0,
        phaseStep = freq / pico.samplerate;
    return {
        process: function(L, R) {
            for (var i = 0; i < L.length; i++) {
				var index = Math.floor(i / tweets.length);
				L[i] = R[i] = Math.sin(6.28318 * tweets[index][0] * phase) * 0.25;
//                L[i] = R[i] = Math.sin(6.28318 * phase) * 0.25;
                phase += phaseStep;
            }
        }
    };
}

