export default class Matrix{
	constructor(rows=0,cols=0){
		this.rows = rows;
		this.cols = cols;
		this.data = Array(rows).fill().map(() => Array(cols).fill(0));
		return this;
	}

	forEach(callback){
		this.data.forEach((rows,i) => {rows.forEach((cell,j) => {callback(cell,i,j);});});
		return this;
	}

	map(callback){
		return this.forEach((_,row,col) => this.data[row][col] = callback(_,i,j));
	}

	identity(){
		return new Matrix(this.cols,this.cols).map((_,i,j) => (i === j) ? 1 : 0);
	}
}

export class mat4 extends Matrix{
	constructor(){
		super(4,4);
	}

	rotate(){
		
	}
}