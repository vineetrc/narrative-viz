document.addEventListener('DOMContentLoaded', function() {
    const player_lead_data = [
        "Jayson Tatum",
        "Donovan Mitchell",
        "Luka Don?i?",
        "Nikola Joki?",
        "Pascal Siakam",
        "James Harden",
        "Anthony Davis",
        "Bam Adebayo",
        "Damian Lillard",
        "Anthony Edwards",
        "CJ McCollum",
        "Jalen Brunson",
        "Shai Gilgeous-Alexander",
        "Paolo Banchero",
        "Joel Embiid",
        "Devin Booker"
    ];

    d3.csv('./data/cleaned_nba_playoff_stats.csv').then(function(data) {
        // Data parsing
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
            d.efg_perc = +d['eFG%'] * 100;
        });

        // Filter the data for the first scene
        const TopPlayerData = data.filter(d => player_lead_data.includes(d.Player));
        console.log("Top players", TopPlayerData);

        // Chart 1: 3P% vs 2P%
        const svg1 = d3.select('#chart1').append('svg')
            .attr('width', 1000)
            .attr('height', 700);

        const xScale1 = d3.scaleLinear()
            .domain([d3.min(TopPlayerData, d => d.threep_perc), 45])
            .range([50, 950]);

        const yScale1 = d3.scaleLinear()
            .domain([30, 70])
            .range([650, 50]);

        const rScale1 = d3.scaleSqrt()
            .domain([0, d3.max(TopPlayerData, d => d.pts)])
            .range([5, 20]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip');

        svg1.selectAll('circle')
            .data(TopPlayerData)
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
            .attr('transform', 'translate(0, 650)')
            .call(d3.axisBottom(xScale1).ticks(10).tickFormat(d => d + "%"));

        svg1.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScale1).ticks(10).tickFormat(d => d + "%"));

        svg1.append('text')
            .attr('x', 500)
            .attr('y', 690)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text('3-Point Percentage');

        svg1.append('text')
            .attr('x', -350)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('transform', 'rotate(-90)')
            .text('2-Point Percentage');

        const legend1 = svg1.selectAll('.legend')
            .data(colorScale.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend1.append('rect')
            .attr('x', 900)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', colorScale);

        legend1.append('text')
            .attr('x', 880)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);

        const annotations1 = [
            {
                note: {
                    label: "Anthony Davis",
                    title: "High 2P%/Low 3P%"
                },
                x: xScale1(TopPlayerData.find(d => d.Player === "Anthony Davis").threep_perc),
                y: yScale1(TopPlayerData.find(d => d.Player === "Anthony Davis").twop_perc),
                dx: 60,
                dy: 60
            },
            {
                note: {
                    label: "Damian Lillard",
                    title: "High 3P%/Low 2P%"
                },
                x: xScale1(TopPlayerData.find(d => d.Player === "Damian Lillard").threep_perc),
                y: yScale1(TopPlayerData.find(d => d.Player === "Damian Lillard").twop_perc),
                dx: -90,
                dy: 40
            },
            {
                note: {
                    label: "Joel Embiid",
                    title: "Highest Scorer"
                },
                x: xScale1(TopPlayerData.find(d => d.Player === "Joel Embiid").threep_perc),
                y: yScale1(TopPlayerData.find(d => d.Player === "Joel Embiid").twop_perc),
                dx: -10,
                dy: 40
            }
        ];

        const makeAnnotations1 = d3.annotation()
            .annotations(annotations1);

        svg1.append('g')
            .call(makeAnnotations1);

        console.log("Data", data);
        // Chart 2: Points by Team
        const svgScene2 = d3.select('#chart2').append('svg')
            .attr('width', 1000)
            .attr('height', 700);

        // Nest data by team
        const nestedDataScene2 = d3.groups(data, d => d.Tm);

        const teamsScene2 = nestedDataScene2.map(d => d[0]);

        const xScaleScene2 = d3.scaleBand()
            .domain(teamsScene2)
            .range([50, 950])
            .padding(0.1);

        const yScaleScene2 = d3.scaleLinear()
            .domain([0, d3.max(nestedDataScene2, d => d3.sum(d[1], v => v.pts))])
            .range([650, 50]);

        const colorScaleScene2 = d3.scaleOrdinal(d3.schemeCategory10);

        nestedDataScene2.forEach(d => {
            const team = d[0];
            const players = d[1];

            let y0 = 0;

            players.forEach(player => {
                const y1 = y0 + player.pts;

                svgScene2.append('rect')
                    .attr('x', xScaleScene2(team))
                    .attr('y', yScaleScene2(y1))
                    .attr('width', xScaleScene2.bandwidth())
                    .attr('height', yScaleScene2(y0) - yScaleScene2(y1))
                    .attr('fill', colorScaleScene2(player.Pos))
                    .on('mouseover', function(event) {
                        tooltip.html(`
                            <strong>Player:</strong> ${player.Player}<br/>
                            <strong>Team:</strong> ${player.Tm}<br/>
                            <strong>Points:</strong> ${player.pts}<br/>
                            <strong>Rebounds:</strong> ${player.trb}<br/>
                            <strong>Assists:</strong> ${player.ast}<br/>
                            <strong>Steals:</strong> ${player.stl}
                        `)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px')
                        .style('visibility', 'visible');
                    })
                    .on('mouseout', function() {
                        tooltip.style('visibility', 'hidden');
                    });

                y0 = y1;
            });
        });

        svgScene2.append('g')
            .attr('transform', 'translate(0, 650)')
            .call(d3.axisBottom(xScaleScene2).tickFormat(d => d).tickSizeOuter(0))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('font-size', '10px');

        svgScene2.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScaleScene2).ticks(10));

        svgScene2.append('text')
            .attr('x', 500)
            .attr('y', 690)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text('Teams');

        svgScene2.append('text')
            .attr('x', -300)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('transform', 'rotate(-90)')
            .text('Total Points');

        const legendScene2 = svgScene2.selectAll('.legend')
            .data(colorScaleScene2.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendScene2.append('rect')
            .attr('x', 900)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', colorScaleScene2);

        legendScene2.append('text')
            .attr('x', 880)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);

        const bosTeamData = nestedDataScene2.find(d => d[0] === "BOS");
        const bosTotalPoints = d3.sum(bosTeamData[1], d => d.pts);

        const annotationsScene2 = [
            {
                note: {
                    label: "",
                    title: "23-24 NBA Champions"
                },
                x: xScaleScene2("BOS") + xScaleScene2.bandwidth() / 2,
                y: yScaleScene2(bosTotalPoints),
                dx: -60,
                dy: -60
            },
        ];

        const makeAnnotationsScene2 = d3.annotation()
            .annotations(annotationsScene2);

        svgScene2.append('g')
            .call(makeAnnotationsScene2);

        // Chart 3: Effective Field Goal Percentage vs Points
        const svg3 = d3.select('#chart3').append('svg')
            .attr('width', 1000)
            .attr('height', 700);

        const xScale3 = d3.scaleLinear()
            .domain([d3.min(data, d => d.efg_perc), d3.max(data, d => d.efg_perc)])
            .range([50, 950]);

        const yScale3 = d3.scaleLinear()
            .domain([d3.min(data, d => d.pts), d3.max(data, d => d.pts)])
            .range([650, 50]);

        svg3.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale3(d.efg_perc))
            .attr('cy', d => yScale3(d.pts))
            .attr('r', 10)
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

        svg3.append('g')
            .attr('transform', 'translate(0, 650)')
            .call(d3.axisBottom(xScale3).ticks(10).tickFormat(d => d + "%"));

        svg3.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(d3.axisLeft(yScale3).ticks(10));

        svg3.append('text')
            .attr('x', 500)
            .attr('y', 690)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text('Effective Field Goal Percentage');

        svg3.append('text')
            .attr('x', -300)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('transform', 'rotate(-90)')
            .text('Points');

        const legend3 = svg3.selectAll('.legend')
            .data(colorScale.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend3.append('rect')
            .attr('x', 900)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', colorScale);

        legend3.append('text')
            .attr('x', 880)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => d);

        const annotations3 = [
            {
                note: {
                    label: "",
                    title: "League MVP: Nikola Jokic"
                },
                x: xScale3(data.find(d => d.Player === "Nikola Joki?").efg_perc),
                y: yScale3(data.find(d => d.Player === "Nikola Joki?").pts),
                dx: 60,
                dy: 60
            },
        ];

        const makeAnnotations3 = d3.annotation()
            .annotations(annotations3);

        svg3.append('g')
            .call(makeAnnotations3);

        const positions = Array.from(new Set(data.map(d => d.Pos)));
        const positionFilter = d3.select('#positionFilter');

        positionFilter.selectAll('option')
            .data(positions)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

        const teams = Array.from(new Set(data.map(d => d.Tm)));
        const teamFilter = d3.select('#teamFilter');

        teamFilter.selectAll('option')
            .data(teams)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

        positionFilter.on('change', function() {
            updateChart();
        });

        teamFilter.on('change', function() {
            updateChart();
        });

        function updateChart() {
            const selectedPosition = positionFilter.node().value;
            const selectedTeam = teamFilter.node().value;

            const filteredData = data.filter(d => {
                return (selectedPosition === 'All' || d.Pos === selectedPosition) &&
                       (selectedTeam === 'All' || d.Tm === selectedTeam);
            });

            if (!filteredData.some(d => d.Player === 'Nikola Joki?')) {
                const nikolaJokicData = data.find(d => d.Player === 'Nikola Joki?');
                if (nikolaJokicData) {
                    filteredData.push(nikolaJokicData);
                }
            }
            
            svg3.selectAll('circle')
                .data(filteredData, d => d.Player)
                .join(
                    enter => enter.append('circle')
                        .attr('cx', d => xScale3(d.efg_perc))
                        .attr('cy', d => yScale3(d.pts))
                        .attr('r', 10)
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
                        }),
                    update => update
                        .transition()
                        .duration(750)
                        .attr('cx', d => xScale3(d.efg_perc))
                        .attr('cy', d => yScale3(d.pts)),
                    exit => exit.remove()
                );
        }

        function resetFilters() {
            positionFilter.property('value', 'All');
            teamFilter.property('value', 'All');
            updateChart();
        }

        function showScene(sceneNumber) {
            document.querySelectorAll('.scene').forEach((scene, index) => {
                if (index === sceneNumber - 1) {
                    scene.style.display = 'block';
                } else {
                    scene.style.display = 'none';
                }
            });

            if (sceneNumber === 3) {
                resetFilters();
            }
        }

        let currentScene = 1;

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

        // Expose nextScene and prevScene to the global scope so they can be called from HTML
        window.nextScene = nextScene;
        window.prevScene = prevScene;
    });
});
