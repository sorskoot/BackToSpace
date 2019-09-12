let explosiontexture;
(function () {
    let canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    let ctx = canvas.getContext("2d");
    let gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, '#ffffffff');
    gradient.addColorStop(1, '#ffffff00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(64, 64, 100, 0, 2 * Math.PI);
    ctx.fill();
    explosiontexture = new THREE.CanvasTexture(ctx.canvas);
})();

export default AFRAME.registerComponent('explosion', {
    schema: {
        color: {
            type: 'color'
        }
    },
    init: function () {
        this.tick = AFRAME.utils.throttleTick(this.tick, 1/30, this)

        this.particleCount = 100;
        this.particles = new THREE.BufferGeometry();
        this.velocities = [];
        let vertices = [];

        this.material = new THREE.PointsMaterial(
            {
                size: 4, map: explosiontexture, transparent: true,
                color: new THREE.Color(this.data.color)
            });

        for (var p = 0; p < this.particleCount; p++) {
            let velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 64,
                (Math.random() - 0.5) * 64,
                (Math.random() - 0.5) * 64);
            // add it to the geometry
            vertices.push(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
            this.velocities.push(velocity);
        }
        this.particles.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // create the particle system
        this.particleSystem = new THREE.Points(
            this.particles,
            this.material);

        // add it to the scene
        this.el.setObject3D('particle-system', this.particleSystem);
        this.el.setAttribute('selfdestruct', { timer: 1640 });
    },
    tick: function (time, timeDelta) {
        this.material.size = Math.max(this.material.size - (timeDelta / 500), 0);
        var positions = this.particleSystem.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            var px = positions.getX(i);
            var py = positions.getY(i);
            var pz = positions.getZ(i);
            positions.setXYZ(
                i,
                px + (this.velocities[i].x * timeDelta / 1000),
                py + (this.velocities[i].y * timeDelta / 1000),
                pz + (this.velocities[i].z * timeDelta / 1000)
            );
            this.velocities[i].y -= (64 * timeDelta / 1000);
        }
        positions.needsUpdate = true;

    }
});