const vertexShaderText = 
`
	precision mediump float;
	
	attribute vec3 vertPosition;
	attribute vec3 vertColor;
	varying vec3 fragColor;

	uniform mat4 mWorld;
	uniform mat4 mView;
	uniform mat4 mProj;
	
	void main(){
		fragColor = vertColor;
		gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
	}
`;

const fragmentShaderText = 
`
	precision mediump float;
	
	varying vec3 fragColor;
	
	uniform float screenWidth;

	void main(){
		gl_FragColor = vec4(fragColor, 1.0);
	}
`;

export const vertexShaderText2 = 
`
	precision mediump float;
	
	attribute vec3 vertPosition;
	attribute vec2 vertTexCoord;
	varying vec2 fragTexCoord;

	uniform mat4 mWorld;
	uniform mat4 mView;
	uniform mat4 mProj;
	
	void main(){
		fragTexCoord = vertTexCoord;
		gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
	}
`;

export const fragmentShaderText2 = 
`
	precision mediump float;
	
	varying vec2 fragTexCoord;

	uniform sampler2D sampler;

	void main(){
		gl_FragColor = texture2D(sampler,fragTexCoord);
	}
`;

export class VertexShader{
	constructor(gl){
		this.gl = gl;
		return this;
	}

	create(shaderText=vertexShaderText){
		let vertexShader = this.gl.createShader(gl.VERTEX_SHADER);

		gl.shaderSource(vertexShader,shaderText);

		gl.compileShader(vertexShader);
		if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
			console.error('Error compiling vertexShader',gl.getShaderInfoLog(vertexShader));
		}

		return vertexShader;
	}
}

export class FragmentShader{
	constructor(gl){
		this.gl = gl;
		return this;
	}

	create(shaderText=fragmentShaderText){
		let fragmentShader = this.gl.createShader(gl.FRAGMENT_SHADER);

		gl.shaderSource(fragmentShader,shaderText);

		gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
			console.error('Error compiling fragmentShader',gl.getShaderInfoLog(fragmentShader));
		}

		return fragmentShader;
	}
}