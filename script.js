document.addEventListener('DOMContentLoaded', function() {
    d3.csv('./data/cleaned_nba_playoff_stats.csv').then(function(data) {
        data.forEach(function(d) {
            d.pts = +d.PTS;
            d.fg_perc = +d['FG%'];
            d.threep_perc = +d['3P%'];
            d.twop_perc = +d['2P%'];
            d.trb = +d.TRB;
            d.ast = +d.AST;
            d.stl = +d.STL;
        });

        // Scene 1: Scatterplot of 3P% vs 2P% with circle size representing average points and color representing team
        const svg1 = d3.select('#chart1')
            .append('svg')
            .attr('width', 800)
            .attr('height', 600);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.threep_perc)])
            .range([50, 750]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.twop_perc)])
            .range([550, 50]);

        const rScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.pts)])
            .range([5, 20]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        svg1.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.threep_perc))
            .attr('cy', d => yScale(d.twop_perc))
            .attr('r', d => rScale(d.pts))
            .attr('fill', d => colorScale(d.Tm))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .append('title')
            .text(d => `${d.Player}: ${d.pts} points`);

        svg1.append('g')
            .attr('transform', 'translate(0, 550)')
            .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => d + "%"));

        svg1.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => d + "%"));

        svg1.append('text')
            .attr('x', 400)
            .attr('y', 590)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text('3-Point Percentage');

        svg1.append('text')
            .attr('x', -350)  // Adjusted for more space
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('transform', 'rotate(-90)')
            .text('2-Point Percentage');

        // Adding annotations to two circles
        const annotations = [
            {
                note: {
                    label: "Top Scorer",
                    title: "Player A"
                },
                x: xScale(data[0].threep_perc),
                y: yScale(data[0].twop_perc),
                dy: -30,
                dx: 30
            },
            {
                note: {
                    label: "High Accuracy",
                    title: "Player B"
                },
                x: xScale(data[1].threep_perc),
                y: yScale(data[1].twop_perc),
                dy: -30,
                dx: 30
            }
        ];

        const makeAnnotations = d3.annotation()
            .annotations(annotations);

        svg1.append('g')
            .call(makeAnnotations);
    });
});

let currentScene = 1;

function showScene(sceneNumber) {
    document.querySelectorAll('.scene').forEach((scene, index) => {
        if (index === sceneNumber - 1) {
            scene.style.display = 'block';
        } else {
            scene.style.display = 'none';
        }
    });
}

function nextScene() {
    if (currentScene < 3) {
        currentScene++;
        showScene(currentScene);
    }
}

function prevScene() {
    if (currentScene > 1) {
        currentScene--;
        showScene(currentScene);
    }
}

// Initially show the first scene
showScene(currentScene);