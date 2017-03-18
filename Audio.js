//Brian Sutton Audio JavaScript File For Browser based Guitar Effects

var $ = function (id) {
    return document.getElementById(id);
};
var selectedInput;
var current;
var isGain = false;
var isDistortion = false;
var isDelay = false;
var isDelayDown = false;
var isReverb = false;
var isComp = false;
var iscompAttackDown = false;
var isChorus = false;
var isChorusSpeedDown = false;
var gainDown = false;
var disDown = false;
var isDistortionLevelDown = false;
var delayDown = false;
var delayDecayDown = false;
var audio_context = new (window.AudioContext || window.webkitAudioContext);
var input;
var context_state = "off";
var reverb = audio_context.createConvolver();
var reverbBuffer;
var gain = audio_context.createGain();
var DelayGain = audio_context.createGain(.8);
var distortion = audio_context.createWaveShaper();
var delayNode = audio_context.createDelay();
var chorusNode = audio_context.createDelay();
var count = .01;
var source = new Audio();
var sample;
var compresor = audio_context.createDynamicsCompressor();
var isGoingUP = true;
var isChorusLevelDown = false;
var chorusRangeDown = false;
var isCompThresholdDown = false;
var isReverbDown = false;
//volume nodes
var delayLevel = audio_context.createGain();
var chorusLevel = audio_context.createGain();
var distortionLevel = audio_context.createGain();
var reverbLevel = audio_context.createGain();
//knob Variables
var isKnobDown = false;
var knob;
var yPos = 0;
var pos = 0;
var prePos = 0;
var selected = null;
var z = 0;

//stored variables

var chorusSpeed = 40;
var chorusMaxRange = .07;

// variables for local storage
var volumeDial;
var distortionAmountDial;
var distortionLevelDial;
var chorusLevelDial;
var chorusSpeedDial;
var chorusRangeDial;
var delayTimeDial;
var delayDecayDial;
var delayLevelDial;
var compAttackDial;
var compThresholdDial;
var reverbLevelDial;

var saveLevels = function () {
    localStorage.volumeDial = volumeDial;
    localStorage.distortionLevelDial = distortionLevelDial;
    localStorage.distortionAmountDial = distortionAmountDial;
    localStorage.chorusSpeedDial = chorusSpeedDial;
    localStorage.chorusRangeDial = chorusRangeDial;
    localStorage.chorusLevelDial = chorusLevelDial;
    localStorage.delayTimeDial = delayTimeDial;
    localStorage.delayDecayDial = delayDecayDial;
    localStorage.delayLevelDial = delayLevelDial;
    localStorage.compThresholdDial = compThresholdDial;
    localStorage.compAttackDial = compAttackDial;
    localStorage.reverbLevelDial = reverbLevelDial;
};

var play = function () {
    setFlowOrder();
};
var stop = function () {
    disconnect();
};

var useGuitar = function () {
    selectedInput = input;
    disconnect();
    setFlowOrder();
};

var useSample = function () {
    selectedInput = sample;
    disconnect();
    setFlowOrder();
};

var chorusTimeUpdate = function () {

    if (!isChorus) {
        return 0;
    }
    setTimeout(function () {

        if (isGoingUP) {
            count += .0001;
            if (count > chorusMaxRange) {
                isGoingUP = false;
            }
        } else {
            count -= .0001;
            if (count < .01) {
                isGoingUP = true;
            }
        }

        chorusNode.delayTime.value = count;
        chorusTimeUpdate();
    }, chorusSpeed);
};
var chorusSpeedSliderUp = function () {
    isChorusSpeedDown = false;
    var x = $("chorusDial1").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    chorusSpeedDial = x;
    chorusSpeed = 100 - (x / 2);
    isChorusSpeedDown = false;
};
var chorusSpeedDown = function () {
    isChorusSpeedDown = true;
};
var chorusSpeedMove = function () {
    if (isChorusSpeedDown) {
        var x = $("chorusDial1").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }

        chorusSpeed = 100 - (x / 2);
    }
};
var chorusRangeSliderUp = function () {
    var x = $("chorusDial2").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }

    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    chorusRangeDial = x;
    chorusMaxRange = (x / 2) / 1000;
    chorusRangeDown = false;
};
var chorusRangeSliderDown = function () {
    chorusRangeDown = true;
};
var chorusRangeMove = function () {
    if (chorusRangeDown) {
        var x = $("chorusDial2").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        chorusMaxRange = (x / 2) / 1000;
    }
};
var compAttackSliderDown = function () {
    iscompAttackDown = true;
};
var compAttackSliderMove = function () {
    if (iscompAttackDown) {
        var x = $("compDial1").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        compresor.attack.value = (x / 2) / 1000;
    }
};
var compAttackSliderUp = function () {
    iscompAttackDown = false;
    var x = $("compDial1").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    compAttackDial = x;
    compresor.attack.value = (x / 2) / 1000;
};
var compThresholdSliderUp = function () {

    var x = $("compDial2").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);

    if (x >= 200) {
        x = 199;
    }

    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    compThresholdDial = x;
    compresor.threshold.value = (x / 2) - 100;
    isCompThresholdDown = false;
};
var compThresholdSliderDown = function () {
    isCompThresholdDown = true;
};
var compThresholdSliderMove = function () {
    if (isCompThresholdDown) {
        var x = $("compDial2").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);

        if (x >= 200) {
            x = 199;
        }

        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        compresor.threshold.value = (x / 2) - 100;
    }
};

var volumeSliderup = function () {
    var x = $("volumeDial").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    volumeDial = x;
    gain.gain.value = (x / 2) / 100;
    gainDown = false;
};
var volumeSliderMove = function () {
    if (gainDown) {
        var x = $("volumeDial").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        gain.gain.value = (x / 2) / 100;
    }
};
var volumeSliderDown = function () {
    gainDown = true;
};
//////////////////////////////////////////////////////////////////////////////////
var disSliderup = function () {

    var x = $("distortionDial1").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    distortionAmountDial = x;
    distortion.curve = distortionAmount(x * 2);
    disDown = false;
};
var disSliderMove = function () {
    if (disDown) {
        var x = $("distortionDial1").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }

        distortionAmountLevel = distortionAmount(x * 2);
        distortion.curve = distortionAmount(x * 2);
    }
};
var disSliderDown = function () {
    disDown = true;
};
//////////////////////////////////////////////////////////////////////////////////
var delaySliderup = function () {
    var x = $("delayDial1").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    delayTimeDial = x;
    delayNode.delayTime.value = (x / 2) / 100;
    delayDown = false;
};
var delaySliderMove = function () {
    if (delayDown) {
        var x = $("delayDial1").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        delayNode.delayTime.value = (x / 2) / 100;
    }
};
var delaySliderDown = function () {
    delayDown = true;
};
//////////////////////////////////////////////////////////////////////////////////

var delayDecayMove = function () {
    if (delayDecayDown) {
        var x = $("delayDial2").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        DelayGain.gain.value = (x / 2) / 100;
    }
};
var delayDecaySliderup = function () {

    delayDecayDown = false;
    var x = $("delayDial2").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x === 0) {
        x = 2;
    }
    delayDecayDial = x;
    DelayGain.gain.value = (x / 2) / 100;

};
var delayDecaySliderDown = function () {
    delayDecayDown = true;
};
//////////////////////////////////////////////////////////////////////////////////
var distortionAmount = function (amount) {

    var n_samples = audio_context.sampleRate,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            x;
    for (var i = 0; i < n_samples; ++i) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
    }
    return curve;
};
//////////////////////////////////////////////////////////////////////////////////

var chorusLevelSliderUp = function () {
    isChorusLevelDown = false;
    var x = $("chorusDial3").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    chorusLevelDial = x;
    chorusLevel.gain.value = (x / 2) / 100;
};

var chorusLevelDown = function () {
    isChorusLevelDown = true;
};

var chorusLevelMove = function () {
    if (chorusLevelDown) {
        var x = $("chorusDial3").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        chorusLevel.gain.value = (x / 2) / 100;
    }

};
//////////////////////////////////////////////////////////////////////////////////
var distortionLevelSliderUp = function () {
    isDistortionLevelDown = false;
    var x = $("distortionDial2").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    distortionLevelDial = x;
    distortionLevel.gain.value = (x / 2) / 100;
};

var distortionLevelDown = function () {
    isDistortionLevelDown = true;
};

var distortionLevelMove = function () {
    if (isDistortionLevelDown) {
        var x = $("distortionDial2").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        distortionLevel.gain.value = (x / 2) / 100;
    }
};
//////////////////////////////////////////////////////////////////////////////////
var delayLevelSliderUp = function () {
    isDelayDown = false;
    var x = $("delayDial3").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    delayLevelDial = x;
    delayLevel.gain.value = (x / 2) / 100;
};
var delayLevelDown = function () {
    isDelayDown = true;
};
var delayLevelMove = function () {
    if (isDelayDown) {
        var x = $("delayDial3").style.transform.valueOf("rotatez");
        x = x.substring(8);
        x = parseInt(x);
        if (x >= 200) {
            x = 199;
        }
        if (isNaN(x) || x <= 0) {
            x = 2;
        }
        delayLevel.gain.value = (x / 2) / 100;
    }
};

var reverbLevelDown = function (){
  isReverbDown = true;  
};

var reverbLevelUp = function (){
    var x = $("reverbDial").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    reverbLevelDial = x; 
    reverbLevel.gain.value = (x / 2) / 100;
    isReverbDown = false;
};

var reverbLevelMove = function (){
    if(isReverbDown){
        var x = $("reverbDial").style.transform.valueOf("rotatez");
    x = x.substring(8);
    x = parseInt(x);
    if (x >= 200) {
        x = 199;
    }
    if (isNaN(x) || x <= 0) {
        x = 2;
    }
    reverbLevelDial = x; 
    reverbLevel.gain.value = (x / 2) / 100;
    }
};

var gainToggle = function () {
    if (isGain) {
        isGain = false;
        $("volumeLight").src = "offLight.png";
        disconnect();
        setFlowOrder();
    } else {
        isGain = true;
        $("volumeLight").src = "onLight.png";
        disconnect();
        setFlowOrder();
    }
};
var distortionToggle = function () {
    if (isDistortion) {
        isDistortion = false;
        $("distortionLight").src = "offLight.png";
        disconnect();
        setFlowOrder();
    } else {
        isDistortion = true;
        $("distortionLight").src = "onLight.png";
        disconnect();
        setFlowOrder();
    }
};
var delayToggle = function () {
    if (isDelay) {
        isDelay = false;
        $("delayLight").src = "offLight.png";
        disconnect();
        setFlowOrder();
    } else {
        isDelay = true;
        $("delayLight").src = "onLight.png";
        disconnect();
        setFlowOrder();
    }
};
var chorusToggle = function () {
    if (isChorus) {
        isChorus = false;
        $("chorusLight").src = "offLight.png";
        disconnect();
        setFlowOrder();
    } else {
        isChorus = true;
        $("chorusLight").src = "onLight.png";
        disconnect();
        setFlowOrder();
    }
};
var compToggle = function () {
    if (isComp) {
        isComp = false;
        $("compLight").src = "offLight.png";
        disconnect();
        setFlowOrder();
    } else {
        isComp = true;
        $("compLight").src = "onLight.png";
        disconnect();
        setFlowOrder();
    }
};

function disconnect() {
    try {
        sample.disconnect();
        input.disconnect();
        gain.disconnect();
        distortion.disconnect();
        delayNode.disconnect();
        compresor.disconnect();
        chorusNode.disconnect();
        DelayGain.disconnect();
        chorusLevel.disconnect();
        delayLevel.disconnect();
        distortionLevel.disconnect();
        reverbLevel.disconnect();
        reverb.disconnect();
    } catch (e) {
        console.log(e.toString());
    }
}


function setFlowOrder() {

    try {
        current = selectedInput;
        if (isGain) {
            current.connect(gain);
            current = gain;
        }
        if (isComp) {
            current.connect(compresor);
            current = compresor;
        }
        if (isDistortion) {
            current.connect(distortion);
            current = distortion;
            current.connect(distortionLevel);
            current = distortionLevel;
        }
        if (isChorus) {

            chorusTimeUpdate();
            current.connect(chorusNode);
            chorusNode.connect(chorusLevel);
            chorusLevel.connect(audio_context.destination);
            current.connect(audio_context.destination);

        }
        if (isDelay) {

            current.connect(delayNode);
            current.connect(audio_context.destination);
            delayNode.connect(DelayGain);
            delayNode.connect(delayLevel);
            delayLevel.connect(audio_context.destination);
            DelayGain.connect(delayNode);

        }
        if (isReverb) {
            
            current.connect(reverb);
            reverb.connect(reverbLevel);
            reverbLevel.connect(audio_context.destination);
            
        }
        current.connect(audio_context.destination);
    } catch (err) {
        console.log(err.message);
    }

}

function setReverb() {

    ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open('GET', 'reverb.mp3', true);
    ajaxRequest.responseType = 'arraybuffer';

    ajaxRequest.onload = function () {
        var audioData = ajaxRequest.response;
        audio_context.decodeAudioData(audioData, function (buffer) {
            reverb.buffer = buffer;
        }, function (e) {
            alert("Error with decoding audio data" + e.err);
        });
    };

    ajaxRequest.send();



}

var reverbToggle = function () {
    if (isReverb) {
        isReverb = false;
        $("reverbLight").src = "offLight.png";
        disconnect();
        setFlowOrder();

    } else {
        isReverb = true;
        $("reverbLight").src = "onLight.png";
        disconnect();
        setFlowOrder();
    }
};

var setUpLevals = function () {
    var rotate;
    if (localStorage.chorusLevelDial) {
        chorusLevelDial = parseInt(localStorage.chorusLevelDial);
        rotate = "rotatez(" + chorusLevelDial + "deg)";
        $("chorusDial3").style.transform = rotate;
    }
    if (localStorage.chorusSpeedDial) {
        chorusSpeedDial = parseInt(localStorage.chorusSpeedDial);
        rotate = "rotatez(" + chorusSpeedDial + "deg)";
        $("chorusDial1").style.transform = rotate;
    }
    if (localStorage.chorusRangeDial) {
        chorusRangeDial = parseInt(localStorage.chorusRangeDial);
        rotate = "rotatez(" + chorusRangeDial + "deg)";
        $("chorusDial2").style.transform = rotate;
    }
    if (localStorage.compAttackDial) {
        compAttackDial = parseInt(localStorage.compAttackDial);
        rotate = "rotatez(" + compAttackDial + "deg)";
        $("compDial1").style.transform = rotate;
    }
    if (localStorage.compThresholdDial) {
        compThresholdDial = parseInt(localStorage.compThresholdDial);
        rotate = "rotatez(" + compThresholdDial + "deg)";
        $("compDial2").style.transform = rotate;
    }
    if (localStorage.delayTimeDial) {
        delayTimeDial = parseInt(localStorage.delayTimeDial);
        rotate = "rotatez(" + delayTimeDial + "deg)";
        $("delayDial1").style.transform = rotate;
    }
    if (localStorage.delayDecayDial) {
        delayDecayDial = parseInt(localStorage.delayDecayDial);
        rotate = "rotatez(" + delayDecayDial + "deg)";
        $("delayDial2").style.transform = rotate;
    }
    if (localStorage.delayLevelDial) {
        delayLevelDial = parseInt(localStorage.delayLevelDial);
        rotate = "rotatez(" + delayLevelDial + "deg)";
        $("delayDial3").style.transform = rotate;
    }
    if (localStorage.distortionAmountDial) {
        distortionAmountDial = parseInt(localStorage.distortionAmountDial);
        rotate = "rotatez(" + distortionAmountDial + "deg)";
        $("distortionDial1").style.transform = rotate;
    }
    if (localStorage.distortionLevelDial) {
        distortionLevelDial = parseInt(localStorage.distortionLevelDial);
        rotate = "rotatez(" + distortionLevelDial + "deg)";
        $("distortionDial2").style.transform = rotate;
    }
    if (localStorage.volumeDial) {
        volumeDial = parseInt(localStorage.volumeDial);
        rotate = "rotatez(" + volumeDial + "deg)";
        $("volumeDial").style.transform = rotate;
    }
    if (localStorage.reverbLevelDial) {
        reverbLevelDial = parseInt(localStorage.reverbLevelDial);
        rotate = "rotatez(" + reverbLevelDial + "deg)";
        $("reverbDial").style.transform = rotate;
    }

    chorusLevelSliderUp();
    chorusRangeSliderUp();
    chorusSpeedSliderUp();
    compAttackSliderUp();
    compThresholdSliderUp();
    delayDecaySliderup();
    delayLevelSliderUp();
    delaySliderup();
    disSliderup();
    distortionLevelSliderUp();
    volumeSliderup();
    reverbLevelUp();

};

var setFocus = function () {
    this.focus();
};

var leaveFocus = function () {
    this.blur();
};

var knobClick = function (e) {
    selected = document.activeElement;

    if (selected.alt === "knob") {

        yPos = parseInt(e.screenY);
        isKnobDown = true;
        z = selected.style.transform.valueOf("rotatez");
        z = z.substring(8);
        z = parseInt(z);

        if (z > 200) {
            z = 200;
        }
        if (z < 0) {
            z = 0;
        }

        if (isNaN(z)) {
            pos = 0;
        } else {
            pos = z;
        }
        
        if (selected === $("delayDial1")) {
            delaySliderDown();
        } else if (selected === $("delayDial2")) {
            delayDecaySliderDown();
        } else if (selected === $("delayDial3")) {
            delayLevelDown();
        } else if (selected === $("chorusDial1")) {//speed
            chorusSpeedDown();
        } else if (selected === $("chorusDial2")) {//rate
            chorusRangeSliderDown();
        } else if (selected === $("chorusDial3")) {//level
            chorusLevelDown();
        } else if (selected === $("distortionDial1")) {//speed
            disSliderDown();
        } else if (selected === $("distortionDial2")) {//level
            distortionLevelDown();
        } else if (selected === $("volumeDial")) {//level
            volumeSliderDown();
        } else if (selected === $("compDial1")) {//attack
            compAttackSliderDown();
        } else if (selected === $("compDial2")) {//threshold
            compThresholdSliderDown();
        } else if(selected === $("reverbDial")){//reverb Level
            reverbLevelDown();
        }
    }
};
var knobUp = function () {
    isKnobDown = false;
    if (selected === $("delayDial1")) {
        delaySliderup();
    } else if (selected === $("delayDial2")) {
        delayDecaySliderup();
    } else if (selected === $("delayDial3")) {
        delayLevelSliderUp();
    } else if (selected === $("chorusDial1")) {//speed
        chorusSpeedSliderUp();
    } else if (selected === $("chorusDial2")) {//rate
        chorusRangeSliderUp();
    } else if (selected === $("chorusDial3")) {//level
        chorusLevelSliderUp();
    } else if (selected === $("distortionDial1")) {//speed
        disSliderup();
    } else if (selected === $("distortionDial2")) {//level
        distortionLevelSliderUp();
    } else if (selected === $("compDial1")) {//attack
        compAttackSliderUp();
    } else if (selected === $("compDial2")) {//threshold
        compThresholdSliderUp();
    } else if (selected === $("volumeDial")) {//volume
        volumeSliderup();
    }else if(selected === $("reverbDial")){
        reverbLevelUp();
    }


};
var knobMove = function (e) {

    if (isKnobDown && selected !== null && selected.alt === "knob") {
        yPos = parseInt(e.screenY);
        if (yPos < prePos && pos <= 200) {
            pos += 4;
        } else if (yPos > prePos && pos >= 0) {
            pos -= 4;
        } else {
        }
        var rotate = "rotatez(" + pos + "deg)";
        selected.style.transform = rotate;
        prePos = yPos;
        if (selected === $("delayDial1")) {//time
            delaySliderMove();
        } else if (selected === $("delayDial2")) {//decay
            delayDecayMove();
        } else if (selected === $("delayDial3")) {//level
            delayLevelMove();
        } else if (selected === $("chorusDial1")) {//speed
            chorusSpeedMove();
        } else if (selected === $("chorusDial2")) {//rate
            chorusRangeMove();
        } else if (selected === $("chorusDial3")) {//level
            chorusLevelMove();
        } else if (selected === $("distortionDial1")) {//amount
            disSliderMove();
        } else if (selected === $("distortionDial2")) {//level
            distortionLevelMove();
        } else if (selected === $("volumeDial")) {//volume
            volumeSliderMove();
        } else if (selected === $("compDial1")) {//attack
            compAttackSliderMove();
        } else if (selected === $("compDial2")) {//threshold
            compThresholdSliderMove();
        } else if (selected === $("reverbDial")){//reverbLevel
            reverbLevelMove();
        }

    }

};

var infoClicked = function () {
    if ($("info").innerHTML === "") {
        $("infoButton").value = "Hide Info";
        $("info").innerHTML = "<p>This website is intended to be an online guitar effects processor.\n\
To use this site, connect a guitar to your computer and select Use Guitar. There is also the \n\
Use Sample option. This allows you to experiment with the different effects using a prerecorded sample.\n\
I recommend using a Mac with an audio interface while using the Chrome browser for best performance.</p>";
    } else {
        $("infoButton").value = "Info";
        $("info").innerHTML = "";
    }

};

window.onload = function () {
    try {

        $("playButton").onclick = play;
        $("stopButton").onclick = stop;
        $("guitarButton").onclick = useGuitar;
        $("sampleButton").onclick = useSample;
        $("volumeButton").onclick = gainToggle;
        $("distortionButton").onclick = distortionToggle;
        $("delayButton").onclick = delayToggle;
        $("compButton").onclick = compToggle;
        $("chorusButton").onclick = chorusToggle;
        $("reverbButton").onclick = reverbToggle;

        setReverb();
        distortion.curve = distortionAmount(50);

        distortion.oversample = "4x";
        source.src = "guitar.mp3";
        source.loop = true;
        source.controls = true;
        source.autoplay = true;
        sample = audio_context.createMediaElementSource(source);

        document.onmousedown = knobClick;
        document.onmouseup = knobUp;
        document.onmousemove = knobMove;

        $("delayDial1").onmouseover = setFocus;
        $("delayDial2").onmouseover = setFocus;
        $("delayDial3").onmouseover = setFocus;
        $("delayDial1").onmouseout = leaveFocus;
        $("delayDial2").onmouseout = leaveFocus;
        $("delayDial3").onmouseout = leaveFocus;
        $("reverbDial").onmouseout = leaveFocus;

        $("reverbDial").onmouseover = setFocus;
        $("chorusDial1").onmouseover = setFocus;
        $("chorusDial2").onmouseover = setFocus;
        $("chorusDial3").onmouseover = setFocus;
        $("chorusDial1").onmouseout = leaveFocus;
        $("chorusDial2").onmouseout = leaveFocus;
        $("chorusDial3").onmouseout = leaveFocus;

        $("distortionDial1").onmouseover = setFocus;
        $("distortionDial2").onmouseover = setFocus;
        $("distortionDial1").onmouseout = leaveFocus;
        $("distortionDial2").onmouseout = leaveFocus;

        $("compDial1").onmouseover = setFocus;
        $("compDial2").onmouseover = setFocus;
        $("compDial1").onmouseout = leaveFocus;
        $("compDial2").onmouseout = leaveFocus;

        $("volumeDial").onmouseover = setFocus;
        $("volumeDial").onmouseout = leaveFocus;

        $("saveButton").onclick = saveLevels;

        $("infoButton").onclick = infoClicked;
        $("info").innerHTML = "";

        setUpLevals();

    } catch (err) {
        console.log(err.message);
    }

    try {
        navigator.mediaDevices.getUserMedia({audio: true}).then(function (mediaStream) {  //gets permission to access audio and then assigns it to var input
            input = audio_context.createMediaStreamSource(mediaStream);
        });
    } catch (err) {
        console.log("No input detected." + err.message);
    }
};