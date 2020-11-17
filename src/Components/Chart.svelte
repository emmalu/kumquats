<script>

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