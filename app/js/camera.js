define(["glMatrix"], function(glm) {

  var Camera = function(fov, near, far, aspect) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;

    this.pos = [0.0, 0.0, 10.0];
    this.target = [0.0, 0.0, 0.0];
    this.up = [0.0, 1.0, 0.0];

    this.viewMat = mat4.create();
    this.projMat = mat4.create();
    this.viewProjMat = mat4.create();
  };

  Camera.prototype.update = function() {
    this.viewMat = glm.mat4.lookAt(this.viewMat, this.pos, this.target, this.up);
    this.projMat = glm.mat4.perspective(this.projMat, this.fov, this.aspect, this.near, this.far);
    this.viewProjMat = glm.mat4.multiply(this.viewProjMat, this.projMat, this.viewMat);
  };

  var CameraControl = function() {

  };

  return {
    Camera: Camera,
    CameraControl: CameraControl
  };

});