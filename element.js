/**
 * Created by denis on 20.01.14.
 */
var glMatrix = require('gl-matrix');
var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;
var quat = glMatrix.quat;

module.exports = function (context) {
	var gl = context;
	function Element () {
		Element.prototype.init.apply(this, arguments);
	};

	Element.prototype.init = function(options) {
		this.geometry = options.geometry;
		this.material = options.material;
		this.program = options.program;

		this.color = vec3.create();
		this.texture = null;

		this.mvMatrix = mat4.create();
		this.rMatrix = mat4.create();
		this.curMVMatrix = mat4.create();

		this.position = vec3.create();
		this.orientation = quat.create();

		this.children = {};
		this.angel = 1;
	};

	Element.prototype.beforeRender = function(mvMatrix, pMatrix) {
		this.pMatrix = pMatrix;
		this.program.bind();
		this.program.getParamLocations(['aVertexPosition', 'uPMatrix', 'uMVMatrix']);

		mat4.multiply(this.curMVMatrix, this.mvMatrix, mvMatrix);

		this.rotateX(1);
		//this.rotateZ(1);

		mat4.multiply(this.curMVMatrix, this.curMVMatrix, this.rMatrix);
	};

	Element.prototype.render = function() {
		var params = this.program.params;
		gl.uniformMatrix4fv(params.uPMatrix, false, this.pMatrix);
		gl.uniformMatrix4fv(params.uMVMatrix, false, this.curMVMatrix);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.VBO);
		gl.vertexAttribPointer(params.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(params.aVertexPosition);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.IBO);
		gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
	};

	Element.prototype.afterRender = function() {
		this.program.unbind();
	};

	Element.prototype.rotate = function(q) {

	};

	Element.prototype.rotateX = function (grad) {
		var grd = grad || 0;
		mat4.rotateX(this.rMatrix, this.rMatrix, grd * Math.PI / 180);
	};

	Element.prototype.rotateY = function (grad) {
		var grd = grad || 0;
		mat4.rotateY(this.rMatrix, this.rMatrix, grd * Math.PI / 180);
	};

	Element.prototype.rotateZ = function (grad) {
		var grd = grad || 0;
		mat4.rotateZ(this.rMatrix, this.rMatrix, grd * Math.PI / 180);
	};

	Element.prototype.translate = function (v) {
		mat4.translate(this.mvMatrix, this.mvMatrix, v);
	};

	return Element;
};