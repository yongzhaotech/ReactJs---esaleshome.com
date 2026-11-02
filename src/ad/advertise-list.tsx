import React, { Suspense, use, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AdInfo } from '../common/ad-info';
import SearchTerms from './search-terms';
import PagesList from './pages-list';
import AdvertiseSnippets from './advertise-snippets';
import SortAds from './sort-ads';
import ReactLoader from './react-loader';

import type { Advertise } from '../types/ad';

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
		const [by, type] = sorting.split(',') as ['create_date' | 'price', 'asc' | 'des'],
			[A, B] = by === 'price' ? [a.price, b.price] : [a.create_date, b.create_date];
		if (type === 'asc') {
			if (A < B) {
				return -1;
			}
			if (A > B) {
				return 1;
			}
			return 0;
		} else if (type === 'des') {
			if (A < B) {
				return 1;
			}
			if (A > B) {
				return -1;
			}
			return 0;
		}
		return 0;
	};

interface AdvertiseResultsProps {
	pages: Page[];
	currentPage: number;
	searchAd: boolean;
	ads: Advertise[];
	sorting: SortKey;
	onHomePageChange?: (page: number) => void;
	onSort: (key: SortKey) => void;
}

const AdvertiseResults = ({ pages, currentPage, searchAd, ads: unsortedAds, sorting, onHomePageChange, onSort }: AdvertiseResultsProps) => {
	const ads = useMemo(() => unsortedAds.slice().sort(applySorting(sorting)), [unsortedAds, sorting]);

	return (
		(ads.length && (
			<React.Fragment>
				<SearchTerms />
				<div className='page-list'>
					<PagesList {...{ pages, searchAd, currentPage, ads, onHomePageChange }} />
					{ads.length > 1 ? <SortAds onSort={onSort} sort={sorting} /> : null}
				</div>
				<AdvertiseSnippets ads={ads} />
			</React.Fragment>
		)) || <ReactLoader />
	);
};

const SearchAdvertiseList = ({ sorting, onSort }: { sorting: SortKey; onSort: (key: SortKey) => void }) => {
	const resultSets = useSelector((state: AdvertiseListState) => state.advertiseList.resultSets || {});
	return resultSets.ads?.length ? (
		<AdvertiseResults
			pages={resultSets.pages || []}
			currentPage={resultSets.currentPage || 0}
			searchAd={resultSets.searchAd || false}
			ads={resultSets.ads}
			sorting={sorting}
			onSort={onSort}
		/>
	) : <ReactLoader />;
};

const HomeAdvertiseList = ({ sorting, start, onPageChange, onSort }: {
	sorting: SortKey;
	start: number;
	onPageChange: (page: number) => void;
	onSort: (key: SortKey) => void;
}) => {
	const result = use(AdInfo.listAdvertises(start));
	if (result.error) {
		return <div role='alert'>{result.error}</div>;
	}
	if (!result.ads?.length) {
		return <ReactLoader />;
	}
	return (
		<AdvertiseResults
			pages={result.pages || []}
			currentPage={result.currentPage || 0}
			searchAd={false}
			ads={result.ads}
			sorting={sorting}
			onHomePageChange={onPageChange}
			onSort={onSort}
		/>
	);
};

/**
 * Search results stay in Redux; home pages are loaded through a cached promise
 * so React can suspend while the requested page is fetched.
 */
const AdvertiseList = () => {
	const [sorting, setSorting] = useState<SortKey>('create_date,des');
	const [start, setStart] = useState(0);
	const performSearch = useSelector((state: AdvertiseListState) => state.performSearch);

	useEffect(() => {
		if (performSearch) {
			setStart(0);
		}
	}, [performSearch]);

	return (
		<Suspense fallback={<ReactLoader />}>
			{performSearch ? (
				<SearchAdvertiseList sorting={sorting} onSort={setSorting} />
			) : (
				<HomeAdvertiseList sorting={sorting} start={start} onPageChange={setStart} onSort={setSorting} />
			)}
		</Suspense>
	);
};

export default React.memo(AdvertiseList);
