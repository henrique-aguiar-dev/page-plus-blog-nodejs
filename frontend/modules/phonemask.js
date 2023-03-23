//Máscara para formulários de telefone (fixo é móvel - BR)
export default class Mask {
	constructor(input) {
		this.input = input;
	}

	//Número mais longo - móvel
	_mobileNumber() {
		let num = this.input.value.replace('-', '');
		this.input.pattern = '[(]{1}[0-9]{2}[)]{1}[0-9]{5}[-]{1}[0-9]{4}';
		this.input.value = `${num.slice(0, 9)}-${num.slice(9, 13)}`;
	}

	//Inserir padrão, parênteses e hífen (telefone fixo)
	mask() {
		this.input.addEventListener('input', e => {
			isNaN(e.data) || e.data === null || e.data === ' ' ? this.input.value = this.input.value.slice(0, -1) : false;
			
			let numberSize = this.input.value.length;
			if(numberSize <= 13) this.input.pattern = '[(]{1}[0-9]{2}[)]{1}[0-9]{4}[-]{1}[0-9]{4}';
			if(numberSize === 1) this.input.value = `(${this.input.value}`;
			if(numberSize === 3) this.input.value += ')';
			if(numberSize === 8 || numberSize === 9 && this.input.value[8] !== '-') this.input.value += '-';
			if(numberSize === 14) this._mobileNumber();//Número extra - telefone móvel
		})
	}
}