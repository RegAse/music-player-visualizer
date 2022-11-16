
export function Visualizer() {
    let audio = document.getElementById("audio");
    let canvas = document.getElementById("main-visuals");
    canvas.width = document.getElementById("canvas-container").clientWidth;
    canvas.height = canvas.width;
    let ctx = canvas.getContext("2d");
    let audioContext;
    let src = null;
    let analyser;
    let bufferLength = 0;
    let dataArray = null;
    let animationContext;

    // Render First frame
    circleVisualizer(ctx, canvas.width, canvas.height, [], 0);

    function setVolume(volume) {
        audio = document.getElementById("audio");
        audio.volume = volume;
    }

    function seek(time) {
        audio = document.getElementById("audio");
        audio.currentTime = audio.duration * time;
    }

    function onChange(volume) {
        if(!audioContext) {
            audioContext = new AudioContext();
        }

        audio = document.getElementById("audio");
        if (audio == null) {
            // Nothing to be played...
            return;
        }
        if(src != null) {
            src.disconnect();
            analyser.disconnect();
        }

        if(dataArray == null) {
            src = audioContext.createMediaElementSource(audio);
        }
        audio.load();
        analyser = audioContext.createAnalyser();
        src.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 512;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        function frameUpdate() {
            animationContext = requestAnimationFrame(frameUpdate);

            analyser.getByteFrequencyData(dataArray);

            // Render the data with a visualizer, possibly change to a different one here
            circleVisualizer(ctx, canvas.width, canvas.height, dataArray, bufferLength);
        }
        audio.volume = volume;
        audio.play();
        cancelAnimationFrame(animationContext);
        frameUpdate();
    }

    function circleVisualizer(ctx, w, h, data, bufferSize) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let r1 = Math.min(w, h) * 0.25;
        let r0 = r1 - 1;
        let n = 200;
        let theta = 2 * Math.PI / n;
        let phi = theta * 0.25;
        let baseColorValue = 12;

        ctx.save();

        ctx.fillStyle = '#c0c0c0';
        ctx.translate(w / 2, h / 2);

        let grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "rgba(55,122,44,0.1)");
        grd.addColorStop(1, "rgba(33,55,36,0.1)");

        // let r = 12 * data[1] + (1 * (3 / bufferSize));
        // let g = 12 * data[3];
        // let b = 12 * data[1];

        // Circle inside fill
        // ctx.beginPath();
        // ctx.arc(0, 0, r0 - 2, 0, 2 * Math.PI, false);
        // ctx.fillStyle = 'rgb(122,122,122)';
        // // ctx.shadowBlur = 33;
        // // ctx.shadowColor = "rgb(" + r + "," + g + "," + b + ",0.75)";
        // // ctx.fillStyle = grd;
        // ctx.fill();
        // ctx.shadowBlur = 0;

        // circle stroke
        ctx.beginPath();
        ctx.arc(0, 0, r0 - 1, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;

        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        // ctx.shadowBlur = 33;
        // ctx.shadowColor = "rgb(" + r + "," + g + "," + b + ",0.75)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        let wraparound = 100;
        // console.log("Ran now: " + n);
        for (var i = 0; i < n - wraparound; ++i) {
            let boxHeight = data[i * 1] * 0.6;
            if (boxHeight == undefined || i > bufferSize || boxHeight < 10) {
                boxHeight = 10;
            }
            if(boxHeight > 300) {
                boxHeight = 300;
            }


            ctx.beginPath();
            ctx.arc(0, 0, r0, -phi, phi);
            ctx.arc(0, 0, r1 + boxHeight / 2, phi, -phi, true);

            let r = baseColorValue + 3 * boxHeight + (1 * (i / bufferSize));
            let g = baseColorValue + 2 * boxHeight;
            let b = baseColorValue + 4 * boxHeight;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ",0.75)";
            ctx.fill();
            ctx.rotate(theta);
        }
        for (var i = 0; i < wraparound; ++i) {
            let boxHeight = data[wraparound - i] * 0.6;
            if (boxHeight == undefined || boxHeight < 10) {
                boxHeight = 10;
            }
            if(boxHeight > 300) {
                boxHeight = 300;
            }

            ctx.beginPath();
            ctx.arc(0, 0, r0, -phi, phi);
            ctx.arc(0, 0, r1 + boxHeight / 1, phi, -phi, true);

            let r = baseColorValue + 3 * boxHeight + (1 * (i / bufferSize));
            let g = baseColorValue + 2 * boxHeight;
            let b = baseColorValue + 4 * boxHeight;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ",0.75)";
            ctx.fill();
            ctx.rotate(theta);
        }

        ctx.restore();
    }

    return {
        onChange: onChange,
        setVolume: setVolume,
        seek: seek
    };
}