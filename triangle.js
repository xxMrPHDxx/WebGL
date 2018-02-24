export default class Triangle{
	constructor(gl,program){
		this.gl = gl;
		this.program = program;

		this.vertices = Array(3).fill().map(() => Array(3).fill(0.0));
		this.colors = Array(3).fill().map(() => Array(3).fill(0.0));

		return this;
	}

	bindBuffer(){
		let bufferData = [];
		
		for(let i=0;i<3;i++){
			bufferData = bufferData.concat(this.vertices[i].concat(this.colors[i]));
		};

		let buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(bufferData),this.gl.STATIC_DRAW);

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
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
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
}