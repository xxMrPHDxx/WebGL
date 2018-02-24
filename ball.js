import ShaderProgram from './program.js';

export default class Ball{
	constructor(gl,program,config,ballTexture){
		this.gl = gl;
		this.program = program;
		this.vertices = config.meshes[0].vertices;
		this.indices = [].concat.apply([],config.meshes[0].faces);
		this.texCoords = config.meshes[0].texturecoords[0];
		this.ballTexture = ballTexture;

		this.texturebinded = false;

		this.identityMatrix = new Float32Array(16);
		mat4.identity(this.identityMatrix);

		return this;
	}

	bindTexture(){
		if(this.texturebinded) return;

		this.texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);
		this.gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR);
	
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			this.ballTexture 
		);

		this.gl.bindTexture(this.gl.TEXTURE_2D,null);
		this.texturebinded = true;

		return this;
	}

	bindBuffer(){
		var posVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, posVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

		var texCoordVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, posVertexBuffer);
		var positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
		gl.vertexAttribPointer(
			positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
		);
		gl.enableVertexAttribArray(positionAttribLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordVertexBuffer);
		var texCoordAttribLocation = gl.getAttribLocation(this.program, 'vertTexCoord');
		gl.vertexAttribPointer(
			texCoordAttribLocation, // Attribute location
			2, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0
		);
		gl.enableVertexAttribArray(texCoordAttribLocation);

		return this;
	}

	draw(){
		this.bindTexture();

		this.gl.bindTexture(gl.TEXTURE_2D,this.texture);
		this.gl.activeTexture(this.gl.TEXTURE0);		

		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
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
		mat4.lookAt(this.viewMatrix,[0,2,-8],[0,1,0],[0,1,3]);
		mat4.perspective(this.projMatrix,glMatrix.toRadian(45),canvas.width / canvas.height,0.1,1000.0);

		gl.uniformMatrix4fv(this.mWorldUniformLocation,gl.FALSE,this.worldMatrix);
		gl.uniformMatrix4fv(this.mViewUniformLocation,gl.FALSE,this.viewMatrix);
		gl.uniformMatrix4fv(this.mProjUniformLocation,gl.FALSE,this.projMatrix);

		return this;
	}
}