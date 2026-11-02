import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { useLocalizationContext, Label } from '../context/localization-context';
import { useForm } from '../hook/form-hook';
import { useReferenceContext } from '../context/reference-context';
import { addErrors, setActionBox } from '../action';

type RootState = ReturnType<typeof RootReducer>;

type InputLabelProps = {
	fieldLabel: Label;
	fieldName: Label | string;
};

type ErrorLabelProps = {
	errorLabel: unknown;
};

type ButtonsProps = {
	label: string;
	name: string;
	post?: boolean;
};

export const InputLabel = ({ fieldLabel, fieldName }: InputLabelProps) => {
	const errors = useSelector((state: RootState) => state.ERRORS);
	const { getLocalizedLabel } = useLocalizationContext();
	const errorLabel = errors[fieldName] as Label;

	if (errorLabel) {
		return (
			<div className='account_box_label' aria-label='error'>
				<span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true' />
				{getLocalizedLabel(errorLabel)}
			</div>
		);
	}

	return (
		<div className='account_box_label' aria-label={getLocalizedLabel(fieldLabel)}>
			{getLocalizedLabel(fieldLabel)}
		</div>
	);
};

export const ErrorLabel = ({ errorLabel }: ErrorLabelProps) => {
	const { getLocalizedLabel } = useLocalizationContext();
	if (errorLabel) {
		return (
			<div aria-label='error'>
				<span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true' />
				{getLocalizedLabel(errorLabel as Label)}
			</div>
		);
	}

	return null;
};

export const SubmitButton = ({ label, name, post = false }: ButtonsProps) => {
	const { submitForm } = useForm();
	const errors = useSelector((state: RootState) => post ? state.POSTERRORS : state.ERRORS);
	const buttonClass = Object.keys(errors).length > 0 ? 'danger' : 'success';
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const submit = React.useCallback(() => {
		submitForm(name, post);
	}, [name, post, submitForm]);

	return (
		<button type='button' className={`btn btn-${buttonClass} btn-sm`} onClick={submit}>
			{getLabel(label as Label)}
		</button>
	);
};

const CancelButton = () => {
	const { clearActionBox, actionBox } = useReferenceContext();
	const dispatch = useDispatch();

	const { getLocalizedLabel: getLabel } = useLocalizationContext();

	const closeActionBox = React.useCallback(() => {
		if (actionBox) {
			actionBox.className = actionBox.className.replace(/box-in/, 'box-out');
			clearActionBox();
			setTimeout(() => {
				dispatch(setActionBox({ box: null }));
				dispatch(addErrors());
			}, 1001);
		}
	}, [clearActionBox, actionBox, dispatch]);

	return (
		<button type='button' className='btn btn-success btn-sm' onClick={closeActionBox}>
			{getLabel('c_cancel')}
		</button>
	);
};

export const SubmitButtons = ({ label, name, post = false }: ButtonsProps) => (
	<div className='btn-toolbar' role='toolbar'>
		<SubmitButton label={label} name={name} post={post} />
		<CancelButton />
	</div>
);
