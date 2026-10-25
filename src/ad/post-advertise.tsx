import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { session, route } from '../utils';
import { useLocalizationContext } from '../context/localization-context';
import { Helper } from '../common/js-funcs';
import ImageList from './image-list';
import ContactPhone from './contact-phone';
import ContactEmail from './contact-email';
import ProvinceList from './province-list';
import CityList from './city-list';
import CategoryList from './category-list';
import ItemList from './item-list';
import { clearStateModelData, clearPostErrors } from '../action';
import { SubmitButton, ErrorLabel } from '../box/form-fields';
import { useFunctions } from '../hook/ad-function-hook';

type RootState = ReturnType<typeof RootReducer>;

const PostAdvertise = () => {
	const dispatch = useDispatch();
	const POSTERRORS = useSelector((state: RootState) => state.POSTERRORS) as Record<string, string | undefined>;
	const MODELS = useSelector((state: RootState) => state.MODELS) as Record<string, any>;
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
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

	useEffect(() => {
		dispatch(clearStateModelData());
		dispatch(clearPostErrors());
	}, [dispatch]);

	const onClick = useCallback(() => {
		route.goBack();
	}, []);

	Helper.title(getLabel('p_post_title'));

	console.log(MODELS);

	return (
		<form name='work_on_advertise' action='post-ad' encType='multipart/form-data'>
			<div className='ad_inline_block'>
				<div className='ad_box_title'>
					{getLabel('p_post_title')}
					<div className='ang_close icon_list' onClick={onClick}>
						&times;
					</div>
				</div>
			</div>
			<div className='ad_inline_block_top'></div>
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
					<input type='text' name='ad_name' maxLength={100} placeholder={getLabel('p_ad_name_placeholder')} />
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
						<button className={`tab ${itemIsFree ? 'active' : ''}`} onClick={setItemFree}>
							{getLabel('p_yes_title')}
						</button>
						<button className={`tab ${itemIsNotFree ? 'active' : ''}`} onClick={setItemNotFree}>
							{getLabel('p_no_title')}
						</button>
					</nav>
					<input type='hidden' name='is_free' defaultValue={MODELS['is_free']} />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'></div>
				</div>
			</div>
			{itemIsNotFree ? (
				<div id='price_row'>
					<div className='ad_inline_block'>
						<div className='ad_box_field'>
							<div className='ad_box_label'>{getLabel('p_currency_title')}</div>
						</div>
						<div className='ad_box_field'>
							<ErrorLabel errorLabel={POSTERRORS.currency} />
							<nav className='btn_list'>
								<button
									className={`tab ${MODELS['currency'] === 'c' ? 'active' : ''}`}
									data-value='c'
									onClick={setCurrency}
								>
									{getLabel('p_can_dollar')}
								</button>
								<button
									className={`tab ${MODELS['currency'] === 'u' ? 'active' : ''}`}
									data-value='u'
									onClick={setCurrency}
								>
									{getLabel('p_us_dollar')}
								</button>
								<button
									className={`tab ${MODELS['currency'] === 'r' ? 'active' : ''}`}
									data-value='r'
									onClick={setCurrency}
								>
									{getLabel('p_rmb_yuan')}
								</button>
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
							<input type='text' name='price' maxLength={15} />
						</div>
					</div>
					<div className='ad_inline_block_top'>
						<div className='ad_box_field'>
							<div className='post_hints'>{getLabel('p_price_hint')}</div>
						</div>
					</div>
				</div>
			) : null}
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
					></textarea>
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
						<button
							className='tab inactive'
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							{getLabel('r_add_photos')}
						</button>
					) : (
						<button className='tab' onClick={addImage}>
							{getLabel('r_add_photos')}
						</button>
					)}
				</div>
				<ImageList />
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_add_photo_hint')}</div>
				</div>
			</div>
			<div>
				<div className='ad_box_sub_title'>{getLabel('p_contact_title')}</div>
			</div>
			<div className='ad_inline_block'>
				<div className='ad_box_field'>
					<div className='ad_box_label'>{getLabel('p_contact_you_title')}</div>
				</div>
				<div className='ad_box_field_'>
					<ErrorLabel errorLabel={POSTERRORS.contact_method} />
					<nav className='btn_list'>
						<button
							data-value='contact_phone'
							className={`tab ${selectedContactMethods['contact_phone'] !== undefined ? 'active' : ''}`}
							onClick={setContactMethod}
						>
							{getLabel('p_phone')}
						</button>
						{session.userSignedIn ? (
							<button
								data-value='contact_email'
								className={`tab ${selectedContactMethods['contact_email'] !== undefined ? 'active' : ''}`}
								aria-label='contact-email-tab'
								onClick={setContactMethod}
							>
								{getLabel('p_email')}
							</button>
						) : (
							<button
								data-value='email'
								className={`tab ${selectedContactMethods['email'] !== undefined ? 'active' : ''}`}
								aria-label='email-tab'
								onClick={setContactMethod}
							>
								{getLabel('p_email')}
							</button>
						)}
					</nav>
					<input type='hidden' name='contact_method' value={Object.keys(selectedContactMethods).join(',')} />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>
						{getLabel('p_select_phone_hint')}.
						{session.userSignedIn ? (
							<section>{getLabel('p_contact_you_hint_1')}</section>
						) : (
							<section>{getLabel('p_contact_you_hint_2')}</section>
						)}
					</div>
				</div>
			</div>
			<ContactPhone />
			<div className='ad_inline_block_top'></div>
			<ContactEmail />
			<div>
				<div className='ad_box_sub_title'>{getLabel('p_loc_title')}</div>
			</div>
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
					<input type='text' name='address' maxLength={100} placeholder={getLabel('p_add_placeholder')} />
				</div>
			</div>
			<div className='ad_inline_block_top'>
				<div className='ad_box_field'>
					<div className='post_hints'>{getLabel('p_add_hint')}</div>
				</div>
			</div>
			<div className='ad_box_field'>
				<div className='ad_box_label'></div>
				<SubmitButton label='p_post_it' name='work_on_advertise' post />
			</div>
		</form>
	);
};

export default PostAdvertise;
