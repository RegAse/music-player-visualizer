
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
        if (!audioContext) {
            audioContext = new AudioContext();
        }

        audio = document.getElementById("audio");
        if (audio == null) {
            // Nothing to be played...
            return;
        }
        if (src != null) {
            src.disconnect();
            analyser.disconnect();
        }

        if (dataArray == null) {
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

        // Frequencybands
        let count = 0;
        let frequencybands = [0, 0, 0, 0, 0, 0, 0];
        let freq = 0.0001;
        for (let i = 0; i < frequencybands.length; i++) {
            let average = 0;
            let sampleCount = Math.pow(2, i) * 2;
            if (i === 7) {
                sampleCount += 2;
            }
            for (let j = 0; j < sampleCount; j++) {
                average += data[count] * (count + 1);
                count++;
            }

            average /= count;
            frequencybands[i] = average * 10;
        }

        ctx.save();

        ctx.fillStyle = "#c0c0c0";
        ctx.translate(w / 2, h / 2);

        let grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "rgba(55,122,44,0.1)");
        grd.addColorStop(1, "rgba(33,55,36,0.1)");

        // let r = 12 * data[1] + (1 * (3 / bufferSize));
        // let g = 12 * data[3];
        // let b = 12 * data[1];

        // Circle inside fill
        let circleSize = 256;
        let calculatedSize = Math.max(0.5, Math.min(circleSize * frequencybands[1] * freq * 0.002, 1.5)) * circleSize;
        calculatedSize = 128 * 1.4;
        // console.log(calculatedSize);

        // Main circle render
        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "black";
        ctx.arc(0, 0, calculatedSize, 0, 2 * Math.PI, false);
        // ctx.fillStyle = "rgb(0,0,0,0.7)";
        // ctx.shadowBlur = 33;
        // ctx.shadowColor = "rgb(" + r + "," + g + "," + b + ",0.75)";
        // ctx.fillStyle = grd;

        let mainGlowPower = 130;
        let r2 = frequencybands[5] * freq * mainGlowPower;
        let g2 = frequencybands[3] * freq * mainGlowPower;
        let b2 = frequencybands[4] * freq * mainGlowPower;
        console.log(r2 + " : " + g2 + " : " + b2);
        // let r = 1 * boxHeight + (1 * (i / bufferSize));
        // let g = 2 * boxHeight;
        // let b = 3 * boxHeight;
        ctx.shadowBlur = frequencybands[1] * 0.03;
        ctx.shadowColor = "rgb(" + r2 + "," + g2 + "," + b2 + ",0.75)";
        ctx.fillStyle = "rgba(0,0,0,0.5)";

        ctx.fill();
        ctx.shadowBlur = 0;

        // circle stroke
        ctx.beginPath();
        ctx.arc(0, 0, calculatedSize + 1, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;

        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        let wraparound = 100;
        let boxHeightStrength = 0.7;

        // Bottom
        for (var i = 0; i < wraparound; ++i) {
            let boxHeight = data[i] * boxHeightStrength;
            if (boxHeight === undefined || i > bufferSize || boxHeight < 10) {
                boxHeight = 10;
            }
            if (boxHeight > 300) {
                boxHeight = 300;
            }

            ctx.beginPath();
            ctx.arc(0, 0, calculatedSize, -phi, phi);
            ctx.arc(0, 0, calculatedSize + boxHeight / 2, phi, -phi, true);

            // Bottom
            let r = frequencybands[2] * freq * boxHeight;
            let g = frequencybands[3] * freq * boxHeight;
            let b = frequencybands[4] * freq * boxHeight;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ",0.75)";
            ctx.fill();
            ctx.rotate(theta);
        }

        // Top
        for (var i = wraparound; i > 0; --i) {
            let boxHeight = data[i] * boxHeightStrength;
            if (boxHeight === undefined || i > bufferSize || boxHeight < 10) {
                boxHeight = 10;
            }
            if (boxHeight > 300) {
                boxHeight = 300;
            }

            ctx.beginPath();
            ctx.arc(0, 0, calculatedSize, -phi, phi);
            ctx.arc(0, 0, calculatedSize + boxHeight / 2, phi, -phi, true);

            // Top
            let r = frequencybands[5] * freq * boxHeight;
            let g = frequencybands[3] * freq * boxHeight;
            let b = frequencybands[4] * freq * boxHeight;

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