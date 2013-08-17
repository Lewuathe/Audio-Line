function Boid(width, height) {
    var self = this;
    self.objects = [];
    self.width   = width * 2;
    self.height  = height * 2;
    self.depth   = height;
}

Boid.calcDistance = function(meshA, meshB) {
    var dx = Math.pow(meshA.position.x - meshB.position.x, 2);
    var dy = Math.pow(meshA.position.y - meshB.position.y, 2);
    var dz = Math.pow(meshA.position.z - meshB.position.z, 2);
    return Math.sqrt(dx + dy + dz);
}

Boid.normalize = function(x, y, z) {
    var norm = Math.sqrt(x*x + y*y + z*z);
    var vec = [];
    vec.push(x / norm);
    vec.push(y / norm);
    vec.push(z / norm);
    return vec;
}

Boid.prototype.addMesh = function(mesh) {
    var self = this;
    self.objects.push(mesh);

    mesh.position.x = Math.random() * self.width - self.width / 2;
    mesh.position.y = Math.random() * self.height - self.height / 2;
    mesh.position.z = Math.random() * self.depth - self.depth / 2;

    mesh.vx         = Math.random()*10 - 5;
    mesh.vy         = Math.random()*10 - 5;
    mesh.vz         = Math.random()*10 - 5;
}

Boid.prototype.update = function() {
    var self = this;
    for (var i = 0; i < self.objects.length; i++) {
        var mesh = self.objects[i];


        // For average accelaration of escape near node
        var ac = 0;
        var ax = 0;
        var ay = 0;
        var az = 0;

        // For average accelaration of approach far node
        var bc = 0;
        var bx = 0;
        var by = 0;
        var bz = 0;

        // For the same direction bias
        var cc = 0;
        var cx = 0;
        var cy = 0;
        var cz = 0;
        
        for (var j = 0; j < self.objects.length; j++) {
            var meshB = self.objects[j];
            if (i != j) {
                var d = Boid.calcDistance(mesh, meshB);
                if (d < 200) {
                    var dx = mesh.position.x - meshB.position.x;
                    var dy = mesh.position.y - meshB.position.y;
                    var dz = mesh.position.z - meshB.position.z;
                    var vec = Boid.normalize(dx, dy, dz);
                    ax += vec[0];
                    ay += vec[1];
                    az += vec[2];
                    ac++;
                }
                else if (d > 500) {
                    var dx = mesh.position.x - meshB.position.x;
                    var dy = mesh.position.y - meshB.position.y;
                    var dz = mesh.position.z - meshB.position.z;
                    var vec = Boid.normalize(dx, dy, dz);
                    bx += vec[0];
                    by += vec[1];
                    bz += vec[2];
                    bc++;
                }
                else {
                    var vec = Boid.normalize(meshB.vx, meshB.vy, meshB.vz);
                    cx += vec[0];
                    cy += vec[1];
                    cz += vec[2];
                    cc++;
                }
            }
        }
        if (ac) {
            mesh.vx += ax / ac;
            mesh.vy += ay / ac;
            mesh.vz += az / ac;
        }
        if (bc) {
            mesh.vx -= bx / bc;
            mesh.vy -= by / bc;
            mesh.vz -= bz / bc;
        }
        if (cc) {
            mesh.vx += cx / cc;
            mesh.vy += cy / cc;
            mesh.vz += cz / cc;
        }

        

        // Bounce against wall
        if (mesh.position.x < -self.width/2) {
            mesh.position.x = -self.width/2;
            mesh.vx         = -mesh.vx;
        }
        else if (mesh.position.x > self.width/2) {
            mesh.position.x = self.width/2;
            mesh.vx         = -mesh.vx;
        }

        if (mesh.position.y < -self.height/2) {
            mesh.position.y = -self.height/2;
            mesh.vy         = -mesh.vy;
        }
        else if (mesh.position.y > self.height/2) {
            mesh.position.y = self.height/2;
            mesh.vy         = -mesh.vy;
        }

        if (mesh.position.z < -self.depth/2) {
            mesh.position.z = -self.depth/2;
            mesh.vz         = -mesh.vz;
        }
        else if (mesh.position.z > self.depth/2) {
            mesh.position.z = self.depth/2;
            mesh.vz         = -mesh.vz;
        }

        // Restrict max speed
        var velocity = Math.sqrt(mesh.vx*mesh.vx + mesh.vy*mesh.vy + mesh.vz*mesh.vz);
        if (velocity > 7) {
            var vec = Boid.normalize(mesh.vx, mesh.vy, mesh.vz);
            mesh.vx = vec[0] * 7;
            mesh.vy = vec[1] * 7;
            mesh.vz = vec[2] * 7;
        }
        
        // Move self mesh
        mesh.position.x += mesh.vx;
        mesh.position.y += mesh.vy;
        mesh.position.z += mesh.vz;

        var direction = Boid.normalize(mesh.vx, mesh.vy, mesh.vz);
        mesh.rotation.x = direction[2];
        mesh.rotation.y = direction[0];
        mesh.rotation.z = direction[1];
        
    }
    
}


