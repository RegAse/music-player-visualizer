
export function Visualizer() {

    // var file = document.getElementById("thefile");

    let canvas = document.getElementById("main-visuals");
    canvas.width = document.getElementById("canvas-container").clientWidth;
    canvas.height = canvas.width;
    // canvas.width = 800;
    // canvas.height = 800;
    let ctx = canvas.getContext("2d");

    circleVisualizer(ctx, canvas.width, canvas.height, [], 0);

    function onChange() {
        let audio = document.getElementById("audio");
        if (audio == null) {
            // Nothing to be played...
            return;
        }
        console.log("Change music file being played");

        audio.load();
        audio.play();
        audio.volume = 0.1;
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 512;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            // Render the data with a visualizer, possibly change to a different one here
            circleVisualizer(ctx, canvas.width, canvas.height, dataArray, bufferLength);
        }
        audio.play();
        renderFrame();
    }

    function circleVisualizer(ctx, w, h, data, bufferSize) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let r1 = Math.min(w, h) * 0.25;
        let r0 = r1 - 1;
        let n = 200;
        let theta = 2 * Math.PI / n;
        let phi = theta * 0.25;
        let baseColorValue = 72;

        ctx.save();

        ctx.fillStyle = '#c0c0c0';
        ctx.translate(w / 2, h / 2);

        let grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "rgba(55,122,44,0.1)");
        grd.addColorStop(1, "rgba(33,55,36,0.1)");

        let r = 12 * data[1] + (1 * (3 / bufferSize));
        let g = 12 * data[3];
        let b = 12 * data[1];

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

        for (var i = 0; i < n - wraparound; ++i) {
            let boxHeight = data[i * 1] * 0.8;
            if (boxHeight == undefined || boxHeight < 10) {
                boxHeight = 10;
            }

            ctx.beginPath();
            ctx.arc(0, 0, r0, -phi, phi);
            ctx.arc(0, 0, r1 + boxHeight / 2, phi, -phi, true);

            let r = baseColorValue + 2 * boxHeight + (1 * (i / bufferSize));
            let g = baseColorValue + 2 * boxHeight;
            let b = baseColorValue + 3 * boxHeight;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ",0.75)";
            ctx.fill();
            ctx.rotate(theta);
        }
        for (var i = 0; i < wraparound; ++i) {
            let boxHeight = data[wraparound - i] * 0.8;
            if (boxHeight == undefined || boxHeight < 10) {
                boxHeight = 10;
            }

            ctx.beginPath();
            ctx.arc(0, 0, r0, -phi, phi);
            ctx.arc(0, 0, r1 + boxHeight / 1, phi, -phi, true);

            let r = baseColorValue + 2 * boxHeight + (1 * (i / bufferSize));
            let g = baseColorValue + 2 * boxHeight;
            let b = baseColorValue + 3 * boxHeight;
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ",0.75)";
            ctx.fill();
            ctx.rotate(theta);
        }

        ctx.restore();
    }

    return {
        onChange: onChange
    };
}