define(["glMatrix", "utils"], function(glm, Utils) {

  var Camera = function(fov, near, far, aspect) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;

    this.pos    = [0.0, 0.0, 1.0];
    this.target = [0.0, 0.0, 0.0];
    this.up     = [0.0, 1.0, 0.0];
    this.right  = [1.0, 0.0, 0.0];

    this.viewMat = glm.mat4.create();
    this.projMat = glm.mat4.create();
    this.viewProjMat = glm.mat4.create();
  };

  Camera.prototype.update = function() {
    glm.mat4.lookAt(this.viewMat, this.pos, this.target, this.up);
    glm.mat4.perspective(this.projMat, this.fov*2.0, this.aspect, this.near, this.far);
    glm.mat4.mul(this.viewProjMat, this.projMat, this.viewMat);
  };

  Camera.prototype.getRay = function(u, v) {

    // unproject method (TODO: faster?)

    // var ray = [2.0*u-1.0, 2.0*v-1.0, 1.0];
    // var invViewProj = glm.mat4.clone(this.viewProjMat);
    // glm.mat4.invert(invViewProj, invViewProj);
    // glm.vec3.transformMat4(ray, ray, invViewProj);
    // glm.vec3.normalize(ray, ray);
    // return ray;

    var A = glm.vec3.clone(this.right); // +x
    var B = glm.vec3.clone(this.up);    // +y
    var C = glm.vec3.create();          // +z

    // scale A and B
    var tanFOV = Math.tan(this.fov);
    glm.vec3.scale(A, A, tanFOV * this.aspect);
    glm.vec3.scale(B, B, tanFOV);

    // find C camera ray
    glm.vec3.sub(C, this.target, this.pos);
    glm.vec3.normalize(C, C);

    // point = camPos+C + (2.0f*uv.x-1.0f)*A + (2.0f*uv.y-1.0f)*B;
    
    glm.vec3.scale(A, A, 2.0*u-1.0);  // reusing A for scaled u point, (TODO: can combine FOV here)
    glm.vec3.scale(B, B, 2.0*v-1.0);  // reusing B for scaled v point
    C[0] += A[0] + B[0];              // reusing C for result ray point
    C[1] += A[1] + B[1];
    C[2] += A[2] + B[2];

    glm.vec3.normalize(C, C);

    return C;
  };

  Camera.prototype.getPointOnTargetPlane = function(u, v) {
    var ray = this.getRay(u,v);
    var targetVec = glm.vec3.create();
    glm.vec3.sub(targetVec, this.target, this.pos);
    var targetDist = glm.vec3.length(targetVec);

    var angle = Math.acos(glm.vec3.dot(ray, targetVec)/targetDist);

    var scale = targetDist / Math.cos(angle);
    glm.vec3.scale(ray, ray, scale);

    glm.vec3.add(ray, ray, this.pos);

    return ray;
  };

  var Controls = function(camera) {
    this.yawAngle = 0.0;
    this.pitchAngle = 0.0;
    this.radius = 1.0;

    this.camera = camera;
    this.camera.pos    = [0.0, 0.0, this.radius];   // TODO: should set values not re-init
    this.camera.target = [0.0, 0.0, 0.0];
    this.camera.up     = [0.0, 1.0, 0.0];
    this.camera.right  = [1.0, 0.0, 0.0];
  };

  Controls.prototype.reset = function() {
    this.yawAngle = 0.0;
    this.pitchAngle = 0.0;
    this.radius = 1.0;
    
    this.camera.pos    = [0.0, 0.0, this.radius];
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