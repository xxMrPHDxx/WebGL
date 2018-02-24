import * as Shader from './shader.js';
import ShaderProgram from './program.js';
import Crate from './crate.js';
import Ball from './ball.js';

const width = window.innerWidth;
const height = window.innerHeight;

window.canvas = document.querySelector('canvas#screen');
canvas.setAttribute('width',width);
canvas.setAttribute('height',height);
window.gl = canvas.getContext('webgl');

if(!gl) gl = canvas.getContext('experimental-webgl');
if(!gl) {
	throw new Error('WebGL is not supported');
}

gl.viewport(0,0,width,height);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);

let crate;
let ball;

Promise.all([
	loadText('shader/vs.glsl'),
	loadText('shader/fs.glsl'),
	loadJSON('sphere.json'),
	loadImage('tex/soccer.png'),
	loadImage('tex/crate.png')
]).then(([vertexShaderText,fragmentShaderText,sphereJson,soccerImage,crateImage])=>{
	let vertexShader = new Shader.VertexShader(gl).create(vertexShaderText);
	let fragmentShader = new Shader.FragmentShader(gl).create(fragmentShaderText);
	let shaderProgram = new ShaderProgram(gl).attachShader(vertexShader,fragmentShader);
	return Promise.all([
		new Ball(gl,shaderProgram,sphereJson,soccerImage),
		new Crate(gl,shaderProgram,crateImage)
	])
}).then(([soccerObj, crateObj]) => {
	ball = soccerObj;
	crate = crateObj;
	setTimeout(start,1000);
});

function start(){
	loop();
}

function loop(){
	let angle = performance.now() / 1100 / 6 * 2 * Math.PI;

	gl.clearColor(51 / 255,51 / 255,51 / 255,1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	ball.setCube();
	ball.bindBuffer();
	ball.rotate(angle);
	ball.draw();

	crate.setCube();
	crate.bindBuffer();
	crate.rotate(angle);
	crate.draw();

	requestAnimationFrame(loop);
}
