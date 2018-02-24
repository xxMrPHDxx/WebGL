import ShaderProgram from './program.js';
import * as Shader from './shader.js';

let vertices = [
//  x,y,z               u,v
	// TOP
	-1,1,-1,			0,0,
	-1,1,1,				0,1,
	1,1,1,				1,1,
	1,1,-1,				1,0,

	// LEFT
	-1,1,1,				0,0,						
	-1,-1,1,			1,0,
	-1,-1,-1,			1,1,
	-1,1,-1,			0,1,

	// RIGHT
	1,1,1,				1,1,
	1,-1,1,				0,1,
	1,-1,-1,			0,0,
	1,1,-1,				1,0,

	// FRONT
	1,1,1,				1,1,
	1,-1,1,				1,0,
	-1,-1,1,			0,0,
	-1,1,1,				0,1,

	// BACK
	1,1,-1,				0,0,
	1,-1,-1,			0,1,
	-1,-1,-1,			1,1,
	-1,1,-1,			1,0,

	// BOTTOM
	-1,-1,-1,			1,1,
	-1,-1,1,			1,0,
	1,-1,1,				0,0,
	1,-1,-1,			0,1
];

let indices = [
	// TOP
	0,1,2,
	0,2,3,
	
	// LEFT
	5,4,6,
	6,4,7,
	
	// RIGHT
	8,9,10,
	8,10,11,
	
	// FRONT
	13,12,14,
	15,14,12,
	
	// BACK
	16,17,18,
	16,18,19,
	
	// BOTTOM
	21,20,22,
	22,20,23
];

let cubeColors = [
	0.5,0.5,0.5,			// TOP
	0.75,0.25,0.5,			// LEFT
	0.25,0.25,0.75,			// RIGHT
	1.0,0.0,0.15,			// FRONT
	0.0,1.0,0.15,			// BACK
	0.5,0.5,1.0				// BOTTOM
];

export default class Crate{
	constructor(gl,program,boxTexture){
		this.gl = gl;
		this.program = program;

		this.vertices = Array(3).fill().map(() => Array(3).fill(0.0));
		this.colors = Array(3).fill().map(() => Array(3).fill(0.0));

		this.identityMatrix = new Float32Array(16);
		mat4.identity(this.identityMatrix);

		this.textureBinded = false;
		this.boxTexture = boxTexture;

		return this;
	}

	bindTexture(){
		if(!this.boxTexture || this.textureBinded) return;

		this.texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR);
	
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			this.boxTexture 
		);

		this.gl.bindTexture(this.gl.TEXTURE_2D,null);
		this.textureBinded = true;

		return this;
	}

	bindBuffer(){
		let vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(vertices),this.gl.STATIC_DRAW);

		let indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),this.gl.STATIC_DRAW);

		let positionAttribLocation = this.gl.getAttribLocation(this.program,'vertPosition');
		this.gl.vertexAttribPointer(
			positionAttribLocation,					// Attribute location
			3,										// Number of element per attribute
			this.gl.FLOAT,
			this.gl.FALSE,
			5 * Float32Array.BYTES_PER_ELEMENT,		// Size of individual vertex
			0										// Offset from the beginning
		);
		this.gl.enableVertexAttribArray(positionAttribLocation);

		let texCoordAttribLocation = this.gl.getAttribLocation(this.program,'vertTexCoord');
		this.gl.vertexAttribPointer(
			texCoordAttribLocation,					// Attribute location
			2,										// Number of element per attribute
			this.gl.FLOAT,
			this.gl.FALSE,
			5 * Float32Array.BYTES_PER_ELEMENT,		// Size of individual vertex
			3 * Float32Array.BYTES_PER_ELEMENT		// Offset from the beginning
		);
		this.gl.enableVertexAttribArray(texCoordAttribLocation);

		return this;
	}

	draw(){
		this.bindTexture();

		this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);
		this.gl.activeTexture(this.gl.TEXTURE0);		

		this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);
	}

	rotate(angle){
		this.gl.useProgram(this.program);

		mat4.rotate(this.worldMatrix,this.identityMatrix,angle,[0,1,0]);

		this.gl.uniformMatrix4fv(this.mWorldUniformLocation,this.gl.FALSE,this.worldMatrix);
	}

	setCube(){
		this.gl.useProgram(this.program);

		this.mWorldUniformLocation = this.gl.getUniformLocation(this.program, 'mWorld');
		this.mViewUniformLocation = this.gl.getUniformLocation(this.program, 'mView');
		this.mProjUniformLocation = this.gl.getUniformLocation(this.program, 'mProj');

		this.worldMatrix = new Float32Array(16);
		this.viewMatrix = new Float32Array(16);
		this.projMatrix = new Float32Array(16);

		mat4.identity(this.worldMatrix);
		mat4.lookAt(this.viewMatrix,[0,2,-8],[0,-2,0],[0,1,2]);
		mat4.perspective(this.projMatrix,glMatrix.toRadian(45),canvas.width / canvas.height,0.1,1000.0);

		this.gl.uniformMatrix4fv(this.mWorldUniformLocation,this.gl.FALSE,this.worldMatrix);
		this.gl.uniformMatrix4fv(this.mViewUniformLocation,this.gl.FALSE,this.viewMatrix);
		this.gl.uniformMatrix4fv(this.mProjUniformLocation,this.gl.FALSE,this.projMatrix);

		return this;
	}
}