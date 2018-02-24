let vertices = [
	// TOP
	-1,1,-1,			0.5,0.5,0.5,
	-1,1,1,				0.5,0.5,0.5,
	1,1,1,				0.5,0.5,0.5,
	1,1,-1,				0.5,0.5,0.5,

	// LEFT
	-1,1,1,				0.75,0.25,0.5,						
	-1,-1,1,			0.75,0.25,0.5,
	-1,-1,-1,			0.75,0.25,0.5,
	-1,1,-1,			0.75,0.25,0.5,

	// RIGHT
	1,1,1,				0.25,0.25,0.75,					
	1,-1,1,				0.25,0.25,0.75,
	1,-1,-1,			0.25,0.25,0.75,
	1,1,-1,				0.25,0.25,0.75,

	// FRONT
	1,1,1,				1.0,0.0,0.15,
	1,-1,1,				1.0,0.0,0.15,
	-1,-1,1,			1.0,0.0,0.15,
	-1,1,1,				1.0,0.0,0.15,

	// BACK
	1,1,-1,				0.0,1.0,0.15,	
	1,-1,-1,			0.0,1.0,0.15,
	-1,-1,-1,			0.0,1.0,0.15,
	-1,1,-1,			0.0,1.0,0.15,

	// BOTTOM
	-1,-1,-1,			0.5,0.5,1.0,			
	-1,-1,1,			0.5,0.5,1.0,
	1,-1,1,				0.5,0.5,1.0,
	1,-1,-1,			0.5,0.5,1.0
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

export default class Cube{
	constructor(gl,program){
		this.gl = gl;
		this.program = program;

		this.vertices = Array(3).fill().map(() => Array(3).fill(0.0));
		this.colors = Array(3).fill().map(() => Array(3).fill(0.0));

		this.identityMatrix = new Float32Array(16);
		mat4.identity(this.identityMatrix);

		return this;
	}

	bindBuffer(){
		let bufferData = [];
		
		for(let i=0;i<3;i++){
			bufferData = bufferData.concat(this.vertices[i].concat(this.colors[i]));
		};

		let vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(vertices),this.gl.STATIC_DRAW);

		let indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),this.gl.STATIC_DRAW);

		let posAttribLocation = this.gl.getAttribLocation(this.program,'vertPosition');
		this.gl.vertexAttribPointer(
			posAttribLocation,						// Attribute location
			3,										// Number of element per attribute
			this.gl.FLOAT,
			this.gl.FALSE,
			6 * Float32Array.BYTES_PER_ELEMENT,		// Size of individual vertex
			0										// Offset from the beginning
		);
		this.gl.enableVertexAttribArray(posAttribLocation);

		let colorAttribLocation = this.gl.getAttribLocation(this.program,'vertColor');
		this.gl.vertexAttribPointer(
			colorAttribLocation,					// Attribute location
			3,										// Number of element per attribute
			this.gl.FLOAT,
			this.gl.FALSE,
			6 * Float32Array.BYTES_PER_ELEMENT,		// Size of individual vertex
			3 * Float32Array.BYTES_PER_ELEMENT		// Offset from the beginning
		);
		this.gl.enableVertexAttribArray(colorAttribLocation);

		this.gl.useProgram(this.program);

		return this;
	}

	draw(){
		this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);
	}

	rotate(angle){
		mat4.rotate(this.worldMatrix,this.identityMatrix,angle,[0,1,0]);

		this.gl.uniformMatrix4fv(this.mWorldUniformLocation,this.gl.FALSE,this.worldMatrix);
	}

	setColor(...colors){
		if(colors.length !== 9) throw new Error("Expecting 9 arguments for vertices color");

		this.colors.forEach((color,i) => {
			this.colors[i][0] = colors[3*i];
			this.colors[i][1] = colors[3*i + 1];
			this.colors[i][2] = colors[3*i + 2];
		});

		return this;
	}

	setVertex(...vertices){
		if(vertices.length !== 6) throw new Error("Expecting 6 arguments for triangle vertices");

		this.vertices.forEach((vertex,i) => {
			this.vertices[i][0] = vertices[2*i];
			this.vertices[i][1] = vertices[2*i+1];
		});

		return this;
	}

	setCube(){
		this.mWorldUniformLocation = this.gl.getUniformLocation(this.program, 'mWorld');
		this.mViewUniformLocation = this.gl.getUniformLocation(this.program, 'mView');
		this.mProjUniformLocation = this.gl.getUniformLocation(this.program, 'mProj');

		this.worldMatrix = new Float32Array(16);
		this.viewMatrix = new Float32Array(16);
		this.projMatrix = new Float32Array(16);

		mat4.identity(this.worldMatrix);
		mat4.lookAt(this.viewMatrix,[0,0,-8 - 2 * Math.sin(performance.now() / 100)],[0,0,0],[0,1,0]);
		mat4.perspective(this.projMatrix,glMatrix.toRadian(45),canvas.width / canvas.height,0.1,1000.0);

		gl.uniformMatrix4fv(this.mWorldUniformLocation,gl.FALSE,this.worldMatrix);
		gl.uniformMatrix4fv(this.mViewUniformLocation,gl.FALSE,this.viewMatrix);
		gl.uniformMatrix4fv(this.mProjUniformLocation,gl.FALSE,this.projMatrix);

		return this;
	}
}