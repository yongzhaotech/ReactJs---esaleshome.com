import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdvertises } from "../action";
import SearchTerms from "./search-terms";
import PagesList from "./pages-list"
import AdvertiseSnippets from "./advertise-snippets";
import SortAds from "./sort-ads";
import ReactLoader from "./react-loader";

const applySorting = sorting => (a, b) => {
	if (!sorting) {
		return 0;
	}
	const [by, type] = sorting.split(","),
		[A, B] = [a[by], b[by]];
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
},
	sortAds = setState => eventKey => {
		setState(eventKey);
	};

/**
 * @description shared by search and list screens
 * before page mounts checkResultSets is called once, when page re-mounts checkResultSets is called once too
 * re-mounts happens when the user clicks on the "Home" button or search returns a result set
 */
const AdvertiseList = () => {
	const [sorting, setSorting] = React.useState("create_date,des"),
		dispatch = useDispatch(),
		performSearch = useSelector(state => state.performSearch),
		resultSets = useSelector(state => state.advertiseList.resultSets || {}),
		pages = resultSets.pages || [],
		currentPage = resultSets.currentPage || 0,
		searchAd = resultSets.searchAd || false,
		ads = (resultSets.ads || []).sort(applySorting(sorting));

	React.useEffect(() => {
		if (!performSearch) {
			dispatch(fetchAdvertises());
		}
	}, []);

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