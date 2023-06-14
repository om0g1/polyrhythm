let startTime = new Date().getTime();
let soundEnabled = false;
const themeSkin = "#90e4ba";


const paper = document.querySelector("#paper"),
    pen = paper.getContext("2d");

document.onvisibilitychange = () => {soundEnabled = false;};
paper.onclick = () => {soundEnabled = !soundEnabled;};

const notes = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24"
];

const calculateNextImpactTime = (cimpactTime, velocity) => {
    return cimpactTime + (Math.PI / velocity) * 1000;
};

const arcs = [
    "#ff0000",
    "#ff2200",
    "#ff4400",
    "#ff8800",
    "#ff5500",
    "#ffAA00",
    "#ffff00",
    "#448800",
    "#88ff00",
    "#00ff00",
    "#00AA44",
    "#008888",
    "#0044AA",
    "#0000ff",
    "#442222",
    "#884444",
    "#AA6666",
    "#ff8888",
    "#884488",
    "#AA22AA",
    "#ff00ff",
].map((color, index) => {
    const audio = new Audio("assets/keys/key"+notes[index]+".mp3");
        audio.volume = 0.5;
    const velocity = (Math.PI * (70-index)) / 360;// 720;
    return{
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity,
    };
})

const initialOrbitRadius = 50;

const draw = () => {
    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const center = {
        x: paper.width / 2,
        y: paper.height / 2,
    }

    const start = {
        x: paper.width * 0.01,
        y: paper.height * 0.01
    }
    const end = {
        x: paper.width * 0.99,
        y: paper.height * 0.99
    }

    const length = end.x - start.x;
    const spacing = (((length / 2) - initialOrbitRadius) / arcs.length);

    const currentTime = new Date().getTime();
    const timeElapsed = ((currentTime - startTime) / 1000);
    arcs.forEach((arc, index) => {
        const orbitRadius = initialOrbitRadius + (index * spacing);
        
        pen.strokeStyle = "#777777";
        pen.fillStyle = "#777777";
        if (currentTime >= arc.nextImpactTime - 2){
            pen.globalAlpha = 0.95;
            pen.strokeStyle = themeSkin;
            pen.fillStyle = themeSkin;
        }
        
        const offset = initialOrbitRadius * (1/3) / orbitRadius;
        pen.globalAlpha = 0.5;
        pen.lineWidth = 4;
        pen.beginPath();
        pen.arc(center.x, center.y, orbitRadius, Math.PI + offset, (2 * Math.PI - offset));
        pen.stroke();

        pen.beginPath();
        pen.arc(center.x, center.y, orbitRadius, offset, Math.PI - offset);
        pen.stroke();

        pen.beginPath();
        pen.arc(center.x - orbitRadius, center.y, 9, 0, 2 * Math.PI);
        pen.fill();

        pen.beginPath();
        pen.arc(center.x + orbitRadius, center.y, 9, 0, 2 * Math.PI);
        pen.fill();

        const distance = ((arc.velocity * timeElapsed) - Math.PI),
        x = center.x + orbitRadius * Math.cos(distance),
        y = center.y + orbitRadius * Math.sin(distance);

        if (currentTime >= arc.nextImpactTime - 2){
            pen.fillStyle = themeSkin;
        } else {
            pen.fillStyle = themeSkin;
        }

        pen.globalAlpha = 0.9;
        pen.beginPath();
        pen.arc(x, y, 9, 0, 2 * Math.PI);
        pen.fill();
        
        
        if (currentTime >= arc.nextImpactTime){
            if (soundEnabled){
                arc.audio.play();
            }
            arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);
        }
    });
    requestAnimationFrame(draw);
}

draw();