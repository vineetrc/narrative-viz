document.addEventListener('DOMContentLoaded', function() {
    d3.csv('./data/cleaned_nba_playoff_stats.csv', function(d) {
        return {
            player: d.Player,
            pts: +d.PTS,
            fg_perc: +d['FG%'],
            threep_perc: +d['3P%'],
            trb: +d.TRB,
            ast: +d.AST,
            stl: +d.STL
        };
    }).then(function(data) {
        // Scene 1: Overview of Player Statistics
        const topPlayers = data.sort((a, b) => b.pts - a.pts).slice(0, 10);
        
        const svg1 = d3.select('#chart1')
            .append('svg')
            .attr('width', 800)
            .attr('height', 400);
        
        const xScale1 = d3.scaleBand()
            .domain(topPlayers.map(d => d.player))
            .range([0, 800])
            .padding(0.1);

        const yScale1 = d3.scaleLinear()
            .domain([0, d3.max(topPlayers, d => d.pts)])
            .range([400, 0]);

        svg1.selectAll('rect')
            .data(topPlayers)
            .enter()
            .append('rect')
            .attr('x', d => xScale1(d.player))
            .attr('y', d => yScale1(d.pts))
            .attr('width', xScale1.bandwidth())
            .attr('height', d => 400 - yScale1(d.pts))
            .attr('fill', 'steelblue');

        svg1.append('g')
            .attr('transform', 'translate(0, 400)')
            .call(d3.axisBottom(xScale1));

        svg1.append('g')
            .call(d3.axisLeft(yScale1));

        // Scene 2: Shooting Efficiency
        const svg2 = d3.select('#chart2')
            .append('svg')
            .attr('width', 800)
            .attr('height', 400);

        const xScale2 = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 800]);

        const yScale2 = d3.scaleLinear()
            .domain([0, 100])
            .range([400, 0]);

        svg2.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale2(d.fg_perc))
            .attr('cy', d => yScale2(d.threep_perc))
            .attr('r', 5)
            .attr('fill', 'orange');

        svg2.append('g')
            .attr('transform', 'translate(0, 400)')
            .call(d3.axisBottom(xScale2));

        svg2.append('g')
            .call(d3.axisLeft(yScale2));

        // Scene 3: Player Contributions
        const topContributors = data.sort((a, b) => (b.trb + b.ast + b.stl) - (a.trb + a.ast + a.stl)).slice(0, 10);

        const svg3 = d3.select('#chart3')
            .append('svg')
            .attr('width', 800)
            .attr('height', 400);

        const xScale3 = d3.scaleBand()
            .domain(topContributors.map(d => d.player))
            .range([0, 800])
            .padding(0.1);

        const yScale3 = d3.scaleLinear()
            .domain([0, d3.max(topContributors, d => d.trb + d.ast + d.stl)])
            .range([400, 0]);

        svg3.selectAll('rect')
            .data(topContributors)
            .enter()
            .append('rect')
            .attr('x', d => xScale3(d.player))
            .attr('y', d => yScale3(d.trb + d.ast + d.stl))
            .attr('width', xScale3.bandwidth())
            .attr('height', d => 400 - yScale3(d.trb + d.ast + d.stl))
            .attr('fill', 'green');

        svg3.append('g')
            .attr('transform', 'translate(0, 400)')
            .call(d3.axisBottom(xScale3));

        svg3.append('g')
            .call(d3.axisLeft(yScale3));
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