import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Helper } from '../common/js-funcs';
import { fetchVisitorAdvertise, clearStateModelData } from '../action';
import RootReducer from '../reducer';
import { route } from '../utils';
import { useLocalizationContext } from '../context/localization-context';
import ImageList from './image-list';
import ContactPhone from './contact-phone';
import ProvinceList from './province-list';
import CityList from './city-list';
import CategoryList from './category-list';
import ItemList from './item-list';
import { SubmitButton, ErrorLabel } from '../box/form-fields';
import { initCity, initItem } from '../hook/dropdown-hook';
import { useFunctions } from '../hook/ad-function-hook';
import { useServerFunctions } from '../hook/user-function-hook';

type RootState = ReturnType<typeof RootReducer>;

interface UserAdvertise {
	id: string | number;
	name: string;
	contact_phone?: string;
	contact_email?: string;
	address?: string;
	description?: string;
}

type MODELSState = Record<string, any> & {
	userAdvertiseSet?: UserAdvertise;
	contactMethods: Record<string, string>;
	_contactMethods: Record<string, number>;
};

type POSTERRORSState = Record<string, string | undefined>;

const VisitorAdvertise = () => {
	const dispatch = useDispatch();
	const POSTERRORS = useSelector((state: RootState) => state.POSTERRORS) as POSTERRORSState;
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const behavior = route.param('behavior');
	const { userAdvertiseSet: ad } = MODELS;
	const {
		itemIsFree,
		itemIsNotFree,
		setItemFree,
		setItemNotFree,
		setCurrency,
		maximumImagesNumberReached,
		addImage,
		setContactMethod,
		selectedContactMethods,
	} = useFunctions();
	const { deleteVisitorAdd } = useServerFunctions();

	initCity(MODELS['cityId']);
	initItem(MODELS['itemId']);

	useEffect(() => {
		if (behavior === 'edit') {
			dispatch(fetchVisitorAdvertise());
		}

		return () => {
			dispatch(clearStateModelData());
		};
	}, [dispatch, behavior]);

	if (!ad?.id) {
		return null;
	}

	return (
		<form name='work_on_advertise' action='visitor-ad' encType='multipart/form-data'>
			<div className='ad_inline_block'>
				<div className='ad_box_title'>
					{getLabel('p_edit_title')}
					<div className='ang_close icon_list' onClick={Helper.goBack}>
						&times;
					</div>
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>
						<div>
							{getLabel('p_phone')} / {getLabel('p_email')}: {ad.contact_phone} / {ad.contact_email}
						</div>
					</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_cat_title')}</div>
				</div>
				<div className='ad_box_field'>
					<ErrorLabel errorLabel={POSTERRORS.category} />
					<CategoryList />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_cat_hint')}</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_sub_cat_title')}</div>
				</div>
				<div className='ad_box_field'>
					<ErrorLabel errorLabel={POSTERRORS.item} />
					<ItemList />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_sub_cat_hint')}</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_name_title')}</div>
				</div>
				<div className='ad_box_field'>
					<ErrorLabel errorLabel={POSTERRORS.ad_name} />
					<input type='text' name='ad_name' defaultValue={ad.name} maxLength={100} />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_ad_name_hint')}</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_free_title')}</div>
				</div>
				<div className='ad_box_field'>
					<ErrorLabel errorLabel={POSTERRORS.is_free} />
					<nav className='btn_list'>
						<div className={`tab ${itemIsFree ? 'active' : ''}`} onClick={setItemFree}>
							{getLabel('p_yes_title')}
						</div>
						<div className={`tab ${itemIsNotFree ? 'active' : ''}`} onClick={setItemNotFree}>
							{getLabel('p_no_title')}
						</div>
					</nav>
					<input type='hidden' name='is_free' defaultValue={MODELS['is_free']} />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'></div>
				</div>
			</div>
			{itemIsNotFree && (
				<div id='price_row'>
					<div className='ad_inline_block'>
						<div className='ad_box_field'>
							<div className='ad_box_label'>{getLabel('p_currency_title')}</div>
						</div>
						<div className='ad_box_field'>
							<ErrorLabel errorLabel={POSTERRORS.is_free} />
							<nav className='btn_list'>
								<div
									data-value='c'
									className={`tab ${MODELS['currency'] === 'c' ? 'active' : ''}`}
									onClick={setCurrency}
								>
									{getLabel('p_can_dollar')}
								</div>
								<div
									data-value='u'
									className={`tab ${MODELS['currency'] === 'u' ? 'active' : ''}`}
									onClick={setCurrency}
								>
									{getLabel('p_us_dollar')}
								</div>
								<div
									data-value='r'
									className={`tab ${MODELS['currency'] === 'r' ? 'active' : ''}`}
									onClick={setCurrency}
								>
									{getLabel('p_rmb_yuan')}
								</div>
							</nav>
							<input type='hidden' name='currency' defaultValue={MODELS['currency']} />
						</div>
					</div>
					<div className='ad_inline_block_top'>
						<div className='ad_box_field'>
							<div className='currency_hints'></div>
						</div>
					</div>
					<div className='ad_inline_block'>
						<div className='ad_box_field'>
							<div className='ad_box_label'>{getLabel('p_price_title')}</div>
						</div>
						<div className='ad_box_field'>
							<ErrorLabel errorLabel={POSTERRORS.price} />
							<input type='text' name='price' defaultValue={MODELS['price']} maxLength={15} />
						</div>
					</div>
					<div className='ad_inline_block_top'>
						<div className='ad_box_field'>
							<div className='post_hints'>{getLabel('p_price_hint')}</div>
						</div>
					</div>
				</div>
			)}
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_detail_title')}</div>
				</div>
				<div className='ad_box_field'>
					<textarea
						name='description'
						rows={4}
						cols={100}
						placeholder={getLabel('p_detail_placeholder')}
						defaultValue={ad.description}
					/>
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_detail_hint')}</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					{maximumImagesNumberReached ? (
						<div className='tab inactive'>{getLabel('r_add_photos')}</div>
					) : (
						<div className='tab' onClick={addImage}>
							{getLabel('r_add_photos')}
						</div>
					)}
				</div>
				<ImageList />
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_add_photo_hint')}</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_contact_title')}</div>
				</div>
				<div className='ad_box_field'>
					<ErrorLabel errorLabel={POSTERRORS.contact_method} />
					<nav className='btn_list'>
						<div
							data-value='contact_phone'
							className={`tab ${selectedContactMethods['contact_phone'] !== undefined ? 'active' : ''}`}
							onClick={setContactMethod}
						>
							{getLabel('p_phone')}
						</div>
						<div
							data-value='contact_email'
							className={`tab ${selectedContactMethods['contact_email'] !== undefined ? 'active' : ''}`}
							onClick={setContactMethod}
						>
							{getLabel('p_email')}
						</div>
					</nav>
					<input
						type='hidden'
						name='contact_method'
						defaultValue={Object.keys(selectedContactMethods).join(',')}
					/>
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_contact_you_title')}</div>
				</div>
			</div>
			<ContactPhone />
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_province_title')}</div>
				</div>
				<div className='ad_box_field'>
					<ErrorLabel errorLabel={POSTERRORS.province} />
					<ProvinceList />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_province_hint')}</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_city_title')}</div>
				</div>
				<div className='ad_box_field'>
					<ErrorLabel errorLabel={POSTERRORS.city} />
					<CityList />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_city_hint')}</div>
				</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_add_title')}</div>
				</div>
				<div className='ad_box_field'>
					<input
						type='text'
						name='address'
						defaultValue={ad.address}
						maxLength={100}
						placeholder={getLabel('p_add_placeholder')}
					/>
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_add_hint')}</div>
				</div>
			</div>
			<div className='ad_box_field'>
				<div className='ad_box_label'></div>
				<ButtonToolbar>
					<SubmitButton label='p_upt_post' name='work_on_advertise' post />
					<Button bsStyle='success' bsSize='small' onClick={deleteVisitorAdd}>
						{getLabel('p_del_post')}
					</Button>
				</ButtonToolbar>
			</div>
		</form>
	);
};

export default VisitorAdvertise;
