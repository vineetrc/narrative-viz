document.addEventListener('DOMContentLoaded', function() {
    d3.csv('./data/top_scorers_by_team.csv').then(function(data) {
        data.forEach(function(d) {
            d.pts = +d.PTS;
            d.fg_perc = +d['FG%'] * 100;
            d.threep_perc = +d['3P%'] * 100;
            d.twop_perc = +d['2P%'] * 100;
            d.trb = +d.TRB;
            d.ast = +d.AST;
            d.stl = +d.STL;
            d.mp = +d.MP;
            d.fta = +d.FTA;
        });

        // Scene 1: Scatterplot of 3P% vs 2P% with circle size representing average points and color representing position
        const svg1 = d3.select('#chart1')
            .append('svg')
            .attr('width', 800)
            .attr('height', 600);

        const xScale1 = d3.scaleLinear()
            .domain([d3.min(data, d => d.threep_perc), 45])
            .range([50, 750]);

        const yScale1 = d3.scaleLinear()
            .domain([30, 70])
            .range([550, 50]);

        const rScale1 = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.pts)])
            .range([5, 20]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip');

        svg1.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale1(d.threep_perc))
            .attr('cy', d => yScale1(d.twop_perc))
            .attr('r', d => rScale1((d.pts / 2) ** 1.5))
            .attr('fill', d => colorScale(d.Pos))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .on('mouseover', function(event, d) {
                tooltip.html(`
                    <strong>Player:</strong> ${d.Player}<br/>
                    <strong>Team:</strong> ${d.Tm}<br/>
                    <strong>Points:</strong> ${d.pts}<br/>
                    <strong>Rebounds:</strong> ${d.trb}<br/>
                    <strong>Assists:</strong> ${d.ast}<br/>
                    <strong>Steals:</strong> ${d.stl}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px')
                .style('visibility', 'visible');
            })
            .on('mouseout', function() {
                tooltip.style('visibility', 'hidden');
            });

        svg1.append('g')
            .attr('transform', 'translate(0, 550)')
            .call(d3.axisBottom(xScale1).ticks(10).tickFormat(d => d + "%"));

        svg1.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScale1).ticks(10).tickFormat(d => d + "%"));

        svg1.append('text')
            .attr('x', 400)
            .attr('y', 590)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text('3-Point Percentage');

        svg1.append('text')
            .attr('x', -400)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('transform', 'rotate(-90)')
            .text('2-Point Percentage');

        // Add legend
        const legend1 = svg1.selectAll('.legend')
            .data(colorScale.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend1.append('rect')
            .attr('x', 700)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', colorScale);

        legend1.append('text')
            .attr('x', 690)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);

        // Add annotations for Anthony Davis and Damian Lillard
        const annotations1 = [
            {
                note: {
                    label: "Anthony Davis",
                    title: "High 2P%/Low 3P%"
                },
                x: xScale1(data.find(d => d.Player === "Anthony Davis").threep_perc),
                y: yScale1(data.find(d => d.Player === "Anthony Davis").twop_perc),
                dx: 60,
                dy: 60
            },
            {
                note: {
                    label: "Damian Lillard",
                    title: "High 3P%/Low 2P%"
                },
                x: xScale1(data.find(d => d.Player === "Damian Lillard").threep_perc),
                y: yScale1(data.find(d => d.Player === "Damian Lillard").twop_perc),
                dx: -90,
                dy: 40
            },
            {
                note: {
                    label: "Joel Embiid",
                    title: "Highest Scorer"
                },
                x: xScale1(data.find(d => d.Player === "Joel Embiid").threep_perc),
                y: yScale1(data.find(d => d.Player === "Joel Embiid").twop_perc),
                dx: -10,
                dy: 40
            }
        ];

        const makeAnnotations1 = d3.annotation()
            .annotations(annotations1);

        svg1.append('g')
            .call(makeAnnotations1);

        // Scene 2: Bar chart of players and their average points, ordered from most points to lowest points
        const svg2 = d3.select('#chart2')
            .append('svg')
            .attr('width', 800)
            .attr('height', 600);

        data.sort((a, b) => b.pts - a.pts);

        const xScale2 = d3.scaleBand()
            .domain(data.map(d => d.Player))
            .range([50, 750])
            .padding(0.1);

        const yScale2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.pts)])
            .range([550, 50]);

        svg2.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale2(d.Player))
            .attr('y', d => yScale2(d.pts))
            .attr('width', xScale2.bandwidth())
            .attr('height', d => 550 - yScale2(d.pts))
            .attr('fill', d => colorScale(d.Pos))
            .on('mouseover', function(event, d) {
                tooltip.html(`
                    <strong>Player:</strong> ${d.Player}<br/>
                    <strong>Team:</strong> ${d.Tm}<br/>
                    <strong>Points:</strong> ${d.pts}<br/>
                    <strong>Rebounds:</strong> ${d.trb}<br/>
                    <strong>Assists:</strong> ${d.ast}<br/>
                    <strong>Steals:</strong> ${d.stl}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px')
                .style('visibility', 'visible');
            })
            .on('mouseout', function() {
                tooltip.style('visibility', 'hidden');
            });

        svg2.append('g')
            .attr('transform', 'translate(0, 550)')
            .call(d3.axisBottom(xScale2).tickFormat(d => d));

        svg2.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScale2).ticks(10));

        svg2.append('text')
            .attr('x', 400)
            .attr('y', 590)
            .attr('text-anchor', 'middle')
            .attr('font-size', '8px')
            .text('Players');

        svg2.append('text')
            .attr('x', -300)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('transform', 'rotate(-90)')
            .text('Points');

        // Add legend for second scene
        const legend2 = svg2.selectAll('.legend')
            .data(colorScale.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend2.append('rect')
            .attr('x', 700)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', colorScale);

        legend2.append('text')
            .attr('x', 690)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);

        // Add annotations for the second scene
        const annotations2 = [
            {
                note: {
                    label: "Nikola Jokic",
                    title: "High Points"
                },
                x: xScale2(data.find(d => d.Player === "Nikola Joki?").Player) + xScale2.bandwidth() / 2,
                y: yScale2(data.find(d => d.Player === "Nikola Joki?").pts),
                dx: -90,
                dy: -40
            },
            {
                note: {
                    label: "Joel Embiid",
                    title: "Most Avg Points"
                },
                x: xScale2(data.find(d => d.Player === "Joel Embiid").Player) + xScale2.bandwidth() / 2,
                y: yScale2(data.find(d => d.Player === "Joel Embiid").pts),
                dx: -10,
                dy: -40
            }
        ];

        const makeAnnotations2 = d3.annotation()
            .annotations(annotations2);

        svg2.append('g')
            .call(makeAnnotations2);
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
