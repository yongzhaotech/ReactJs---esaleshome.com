import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { useLocalizedLabel, Label } from '../hook/localization-hook';
import { useForm } from '../hook/form-hook';
import { Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import { Context } from '../context/reference-context';
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
	const getLocalizedLabel = useLocalizedLabel();
	const errorLabel = errors[fieldName] as Label;

	if (errorLabel) {
		return (
			<div className='account_box_label' aria-label='error'>
				<Glyphicon glyph='exclamation-sign' />
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
	const getLocalizedLabel = useLocalizedLabel();
	if (errorLabel) {
		return (
			<div aria-label='error'>
				<Glyphicon glyph='exclamation-sign' />
				{getLocalizedLabel(errorLabel as Label)}
			</div>
		);
	}

	return null;
};

const SubmitButton = ({ label, name, post = false }: ButtonsProps) => {
	const { submitForm } = useForm();
	const errors = useSelector((state: RootState) => state.ERRORS);
	const buttonClass = Object.keys(errors).length > 0 ? 'danger' : 'success';
	const getLabel = useLocalizedLabel();
	const submit = React.useCallback(() => {
		submitForm(name, post);
	}, [name, post, submitForm]);

	return (
		<Button bsStyle={buttonClass} bsSize='small' onClick={submit}>
			{getLabel(label as Label)}
		</Button>
	);
};

const CancelButton = () => {
	const { clearActionBox, actionBox } = useContext(Context);
	const dispatch = useDispatch();

	const getLabel = useLocalizedLabel();

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
		<Button bsStyle='success' bsSize='small' onClick={closeActionBox}>
			{getLabel('c_cancel')}
		</Button>
	);
};

export const SubmitButtons = ({ label, name, post = false }: ButtonsProps) => (
	<ButtonToolbar>
		<SubmitButton label={label} name={name} post={post} />
		<CancelButton />
	</ButtonToolbar>
);
