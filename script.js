document.addEventListener('DOMContentLoaded', function() {
    d3.csv('./data/top_scorers_by_team.csv').then(function(data) {
        data.forEach(function(d) {
            d.pts = +d.PTS;
            d.fg_perc = +d['FG%'];
            d.threep_perc = +d['3P%'];
            d.twop_perc = +d['2P%'];
            d.trb = +d.TRB;
            d.ast = +d.AST;
            d.stl = +d.STL;
        });

        // Scene 1: Scatterplot of 3P% vs 2P% with circle size representing average points and color representing position
        const svg1 = d3.select('#chart1')
            .append('svg')
            .attr('width', 800)
            .attr('height', 600);

        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.threep_perc), d3.max(data, d => d.threep_perc)])
            .range([50, 750]);

        const yScale = d3.scaleLinear()
            .domain([0.35, d3.max(data, d => d.twop_perc)])
            .range([550, 50]);

        const rScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.pts)])
            .range([5, 20]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip');

        svg1.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.threep_perc))
            .attr('cy', d => yScale(d.twop_perc))
            .attr('r', d => (rScale(d.pts)/2)**3)
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
            .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => d + "%"));

        svg1.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => d + "%"));

        svg1.append('text')
            .attr('x', 400)
            .attr('y', 590)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text('3-Point BOBOBOBOBOB Percentage');

        svg1.append('text')
            .attr('x', -350)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('transform', 'rotate(-90)')
            .text('2-Point Percentage');

        // Add legend
        const legend = svg1.selectAll('.legend')
            .data(colorScale.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend.append('rect')
            .attr('x', 700)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', colorScale);

        legend.append('text')
            .attr('x', 690)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);
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
