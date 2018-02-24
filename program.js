export default class ShaderProgram{
	constructor(gl){
		this.gl = gl;
		this.program = gl.createProgram();
		return this;
	}

	attachShader(...shaders){
		shaders.forEach(shader => {
			this.gl.attachShader(this.program,shader);
		});
		this.link();
		return this.program;
	}

	link(){
		this.gl.linkProgram(this.program);
		if(!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS)){
			console.error('Error linking program',this.gl.getProgramInfoLog(this.program));
		}
		return this;
	}
}