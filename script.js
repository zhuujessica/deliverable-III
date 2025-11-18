let margin = 50;
let graphWidth = 400;
let graphHeight = 480;

let myFont;

async function setup() {
    myFont = await loadFont("IMFellGreatPrimer-Regular.ttf");

    createCanvas(600, 600);
    background(180, 211, 178);

    translate(150, 60);

    // fractal for fun

    push();
    function branch(len) {
        stroke(205, 226, 210);
        line(0, 0, len, 0);
        translate(len, 0);
        if (len > 6) {
            push();
            rotate(PI/4);
            branch(len*0.67);
            pop();
            push();
            rotate(-PI/4);
            branch(len*0.67);
            pop();
        } 
    }
    pop();

    push();
    translate(-100, -100);
    rotate(PI/4);
    branch(100);
    pop();

    push();
    translate(500, 600);
    rotate(-PI*3/4);
    branch(100);
    pop();

    // draw paper 
    fill(235, 222, 207);
    noStroke();
    rect(margin/2, 0, graphWidth-margin, graphHeight+margin*0.5);

    // draw text
    fill(49, 67, 59);
    textFont(myFont);
    textSize(16);
    text("My dear Skies,", margin, margin*0.65);
    let closingSalutation = "With love, UT Trees";
    text(closingSalutation, graphWidth-textWidth(closingSalutation)-margin, graphHeight);

    // load data
    let data = await d3.csv("plantData.csv", d3.autoType);
    console.log(data);

    // add images to data
    let baldCypress = await loadImage("treeLeaves/baldCypressRow.png");
    data[1].image = baldCypress;
    let laceyOak = await loadImage("treeLeaves/laceyOakRow.png");
    data[3].image = laceyOak;
    let mexicanPlum = await loadImage("treeLeaves/mexicanPlumRow.png");
    data[4].image = mexicanPlum;
    let montereyOak = await loadImage("treeLeaves/montereyOakRow.png");
    data[5].image = montereyOak;
    let southernLiveOak = await loadImage("treeLeaves/southernLiveOakRow.png");
    data[0].image = southernLiveOak;
    let texasRedOak = await loadImage("treeLeaves/texasRedOakRow.png");
    data[2].image = texasRedOak;


    // sort data by height
    data = d3.sort(data, (a, b) => d3.descending(a.height, b.height));
    console.log(data);

    // x scale - feed it a plant name, it gives an x position for each cat
    let yScale = d3.scaleBand(d3.map(data, (d) => d.number), [margin, graphHeight-margin]).padding(0.2);
    console.log(yScale(1236));

    // y scale - plant carbon mapped to size of rectangles;
    let xScaleSize = d3.scaleLinear([0, d3.max(data, (d) => d.carbon)], [0, graphWidth-margin*2]);
    let xScaleCoord = d3.scaleLinear([0, d3.max(data, (d) => d.carbon)], [margin, graphWidth-margin]);

    textAlign(RIGHT);

    // draw axis
    let ticks =  xScaleCoord.ticks();
    console.log(ticks);
    stroke(0);
    textSize(12);

    ticks.forEach((d => {
        let brown = color(202, 179, 160);
        noStroke();
        fill(brown);
        text(d, xScaleCoord(d)+4.5, graphHeight-margin*0.6);

        stroke(brown);
        line(xScaleCoord(d), margin, xScaleCoord(d), graphHeight-margin);
    }))

    noStroke();
    text("Carbon Sequestered (Lbs)", margin+120, graphHeight-10);

    noStroke();


    // for each plant, create label and bar
    data.forEach((d) => {
        push()
        translate(margin*0.75, yScale(d.number)+yScale.bandwidth()/2);
        fill(49, 67, 59);
        text("#"+d.number, -margin/2, 0);
        text(d.species, -margin/2, 14);
        pop();
        // create bar
        noStroke();
       image(d.image, xScaleCoord(0), yScale(d.number)+yScale.bandwidth()/3, xScaleSize(d.carbon), yScale.bandwidth()/2, 0, 0, d.image.width, d.image.height, COVER, LEFT);
        push();

    })

}



function draw() {
}