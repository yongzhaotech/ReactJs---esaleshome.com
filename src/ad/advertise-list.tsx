import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdvertises } from "../action";
import SearchTerms from "./search-terms";
import PagesList from "./pages-list"
import AdvertiseSnippets from "./advertise-snippets";
import SortAds from "./sort-ads";
import ReactLoader from "./react-loader";

import type { Advertise } from './advertise-snippets';

type SortKey = 'create_date,asc' | 'create_date,des' | 'price,asc' | 'price,des';

interface Page {
	i: number;
	n: string | number;
}

interface AdvertiseListState {
	performSearch: boolean;
	advertiseList: {
		resultSets?: {
			pages?: Page[];
			currentPage?: number;
			searchAd?: boolean;
			ads?: Advertise[];
		};
	};
}

const applySorting = (sorting: SortKey) => (a: Advertise, b: Advertise) => {
	if (!sorting) {
		return 0;
	}
	const [by, type] = sorting.split(",") as ['create_date' | 'price', 'asc' | 'des'],
		[A, B] = by === 'price' ? [a.price, b.price] : [a.create_date, b.create_date];
	if (type === "asc") {
		if (A < B) {
			return -1;
		}
		if (A > B) {
			return 1;
		}
		return 0;
	} else if (type === "des") {
		if (A < B) {
			return 1;
		}
		if (A > B) {
			return -1;
		}
		return 0;
	}
	return 0;
},
	sortAds = (setState: React.Dispatch<React.SetStateAction<SortKey>>) => (eventKey: SortKey) => {
		setState(eventKey);
	};

/**
 * @description shared by search and list screens
 * before page mounts checkResultSets is called once, when page re-mounts checkResultSets is called once too
 * re-mounts happens when the user clicks on the "Home" button or search returns a result set
 */
const AdvertiseList = () => {
	const [sorting, setSorting] = React.useState<SortKey>("create_date,des"),
		dispatch = useDispatch(),
		performSearch = useSelector((state: AdvertiseListState) => state.performSearch),
		resultSets = useSelector((state: AdvertiseListState) => state.advertiseList.resultSets || {}),
		pages = resultSets.pages || [],
		currentPage = resultSets.currentPage || 0,
		searchAd = resultSets.searchAd || false,
		ads = (resultSets.ads || []).sort(applySorting(sorting));

	React.useEffect(() => {
		if (!performSearch) {
			dispatch(fetchAdvertises());
		}
	}, [dispatch, performSearch]);

	return (ads.length && (
		<React.Fragment>
			<SearchTerms />
			<div className="page-list">
				<PagesList {...{ pages, searchAd, currentPage, ads }} />
				{
					ads.length > 1 ? (<SortAds onSort={sortAds(setSorting)} sort={sorting} />) : null
				}
			</div>
			<AdvertiseSnippets ads={[...ads]} />
		</React.Fragment>
	)) || (<ReactLoader />);
};

export default React.memo(AdvertiseList);