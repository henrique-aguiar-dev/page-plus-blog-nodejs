import Mask from './phonemask'

//-----------FORM VALIDATION------------
export const formValidation = form => {
	const inputPhone = form.querySelector('#fone');

	const loadMask = () => {
		const phoneMask = new Mask(inputPhone);
		phoneMask.mask();
	}
	loadMask();

	inputPhone.addEventListener('focusin', e => e.target.placeholder = '(__)____-____');
	inputPhone.addEventListener('focusout', e => e.target.placeholder = 'Telefone p/ contato...');

	inputPhone.addEventListener('paste', event => event.preventDefault());

	//Disable Enter key on form inputs
	document.querySelectorAll('input:not(textarea)').forEach(input => {
		input.addEventListener('keydown', event => {
			if (event.key == "Enter") { event.preventDefault() };
		})
	})
}
