define(["glMatrix", "Utils"], function(glm, Utils) {

  var Camera = function(fov, near, far, aspect) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;

    this.pos    = [0.0, 0.0, 10.0];
    this.target = [0.0, 0.0, 0.0];
    this.up     = [0.0, 1.0, 0.0];

    this.viewMat = mat4.create();
    this.projMat = mat4.create();
    this.viewProjMat = mat4.create();
  };

  Camera.prototype.update = function() {
    glm.mat4.lookAt(this.viewMat, this.pos, this.target, this.up);
    glm.mat4.perspective(this.projMat, this.fov, this.aspect, this.near, this.far);
    glm.mat4.mul(this.viewProjMat, this.projMat, this.viewMat);
  };

  var Controls = function(camera) {
    this.yawAngle = 0.0;
    this.pitchAngle = 0.0;
    this.radius = 10.0;

    this.camera = camera;
    this.camera.pos    = [0.0, 0.0, 10.0];
    this.camera.target = [0.0, 0.0, 0.0];
    this.camera.up     = [0.0, 1.0, 0.0];
    this.camera.right  = [1.0, 0.0, 0.0];
  };

  Controls.prototype.rotate = function(x, y) {
    this.yawAngle += x;
    this.pitchAngle += y;
  };

  Controls.prototype.pan = function(x, y) {
    glm.vec3.scaleAndAdd(this.camera.target, this.camera.target, this.camera.right, x);
    glm.vec3.scaleAndAdd(this.camera.target, this.camera.target, this.camera.up, y);
  };

  Controls.prototype.zoom = function(value) {
    this.radius -= value;
  };

  Controls.prototype.update = function() {
    // calcPos is position from cam target
    var calcPos = [Math.sin(this.yawAngle), 0.0, Math.cos(this.yawAngle)];
    this.camera.right = [calcPos[2], 0.0, -calcPos[0]];

    // pitch calcPos up, around right axis
    var pitchRot = glm.mat4.create();
    glm.mat4.rotate(pitchRot, pitchRot, this.pitchAngle, this.camera.right);
    glm.vec3.transformMat4(calcPos, calcPos, pitchRot);

    // zoom out
    glm.vec3.scale(calcPos, calcPos, this.radius);

    glm.vec3.add(this.camera.pos, this.camera.target, calcPos);   // pos = target + calcPos
    glm.vec3.cross(this.camera.up, calcPos, this.camera.right);   // up = calcPos x right
    glm.vec3.normalize(this.camera.up, this.camera.up);
  };


  return {
    Camera: Camera,
    Controls: Controls
  };

});