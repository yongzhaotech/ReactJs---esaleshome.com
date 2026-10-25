import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { processForm } from '../common/form-process';
import { addErrors, addPostErrors, sendFormData } from '../action';

export const useForm = () => {
	const dispatch = useDispatch();

	const submitForm = useCallback(
		(formName: string, post: boolean = false) => {
			const formErrors = processForm(formName, post);
			const action = post ? addPostErrors : addErrors;
			const hasFormErrors = Object.keys(formErrors).length > 0;

			if (!hasFormErrors) {
				// send form data
				dispatch(sendFormData(formName, post));
			}

			dispatch(action(formErrors));
		},
		[dispatch]
	);

	return { submitForm };
};
