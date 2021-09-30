<script>
    const data = [
        { x: 0,  y: 0 },
        { x: 1,  y: 1 },
        { x: 2,  y: 4 },
        { x: 3,  y: 9 },
        { x: 4,  y: 16 },
        { x: 5,  y: 25 },
        { x: 6,  y: 36 },
        { x: 7,  y: 49 },
        { x: 8,  y: 64 },
        { x: 9,  y: 81 },
        { x: 10, y: 100 }
    ];
    
    function scale(domain, range) {
        const m = (range[1] - range[0]) / (domain[1] - domain[0]);
        return num => range[0] + m * (num - domain[0]);
    }

    const x = scale([0, Math.max(...data.map(d => d.x))], [0, 300]);
    const y = scale([0, Math.max(...data.map(d => d.y))], [100, 0]);

    const points = data.map(d => `${x(d.x)},${y(d.y)}`).join(' ');

    const chart = `
    <svg width="300" height="100">
    <polyline points="${points}"></polyline>
    </svg>
    `;

</script>