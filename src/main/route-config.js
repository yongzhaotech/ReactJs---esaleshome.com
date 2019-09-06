import AdvertiseList from '../ad/advertise-list';
import AdvertiseDetail from '../ad/advertise-detail';
import PostAdvertise from '../ad/post-advertise';
import EditAdvertise from '../ad/edit-advertise';
import VisitorAdvertise from '../ad/visitor-advertise';
import UserAccount from '../user/user-account';
import UserAdvertise from '../user/user-advertise';
import SetPassword from '../user/set-password';
import AdminUsers from '../user/admin/admin-users';
import AdminAds from '../user/admin/admin-ads';
import AdminVisitorHits from '../user/admin/admin-visitor-hits';
import AdminPerm from '../user/admin/admin-perm';
import SaveCategory from '../user/admin/save-category';
import SaveSubCategory from '../user/admin/save-sub-category';

const Config = [
	{
		exact: true,
		path: '/',
		list: true,
		comp: AdvertiseList
	},
	{
		path: '/ads/ad-detail/:advertiseId',
		comp: AdvertiseDetail
	},
	{
		path: '/ads/post-ad',
		comp: PostAdvertise
	},
	{
		path: '/ads/user-account',
		comp: UserAccount
	},
	{
		path: '/ads/user-advertise',
		comp: UserAdvertise
	},
	{
		path: '/ads/edit-ad/:advertiseId',
		comp: EditAdvertise
	},
	{
		path: '/ads/set-pwd/:accCode',
		comp: SetPassword
	},
	{
		path: '/ads/admin-users',
		comp: AdminUsers
	},
	{
		path: '/ads/admin-ads',
		comp: AdminAds
	},
	{
		path: '/ads/visitor-hits',
		comp: AdminVisitorHits
	},
	{
		path: '/ads/admin-perm',
		comp: AdminPerm
	},
	{
		path: '/ads/save-category',
		comp: SaveCategory
	},
	{
		path: '/ads/save-subcategory',
		comp: SaveSubCategory
	},
	{
		path: '/ads/visitor-ad/:behavior',
		comp: VisitorAdvertise
	},
	{
		list: true,
		comp: AdvertiseList
	}
];

export { Config };
