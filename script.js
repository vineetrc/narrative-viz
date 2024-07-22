document.addEventListener('DOMContentLoaded', function() {
    // Data for the visualization
    const data = [10, 15, 20, 25, 30];
    
    // Scene 1: Introduction
    const svg1 = d3.select('#chart1')
        .append('svg')
        .attr('width', 500)
        .attr('height', 300);
    
    svg1.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => (i + 1) * 80)
        .attr('cy', 150)
        .attr('r', d => d)
        .attr('fill', 'steelblue');

    // Scene 2: Details
    const svg2 = d3.select('#chart2')
        .append('svg')
        .attr('width', 500)
        .attr('height', 300);

    svg2.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 100)
        .attr('y', d => 300 - d * 10)
        .attr('width', 80)
        .attr('height', d => d * 10)
        .attr('fill', 'orange');

    // Scene 3: Conclusion
    const svg3 = d3.select('#chart3')
        .append('svg')
        .attr('width', 500)
        .attr('height', 300);

    svg3.selectAll('line')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', (d, i) => i * 100)
        .attr('y1', 0)
        .attr('x2', (d, i) => i * 100)
        .attr('y2', d => d * 10)
        .attr('stroke', 'green')
        .attr('stroke-width', 2);

    // Add interactivity (e.g., tooltips)
    svg1.selectAll('circle')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('fill', 'red');
        })
        .on('mouseout', function(event, d) {
            d3.select(this).attr('fill', 'steelblue');
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
