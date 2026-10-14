import React from 'react';
import ReactDOM from 'react-dom';
import { Http } from '../../common/http-client';
import { Engine } from '../../common/engine';
import { Helper } from '../../common/js-funcs';
import { getLabel } from '../../common/label';
import { fetchUserDataSuccess } from '../../action';
import type { Identifier } from '../../types/common';

interface AdminCategoryItem {
	i: Identifier;
	n: string;
	n_cn: string;
}

interface VisitorHit {
	create_time: string;
	uri: string;
	ip: string;
	week_day: string;
	count: number;
}

interface VisitorHitsResponse {
	lists: VisitorHit[];
	visitor_date?: string;
}

interface AdminAd {
	id: Identifier;
}

let admPageVars: Record<string, Record<string, AdminCategoryItem[]>> = {},
	ipListsViewed: Record<string, HTMLTableRowElement> = {},
	table: HTMLElement | null = null;

const statuses: Record<string, string> = {0: 'inactive', 1: 'active'},
actions: Record<string, string> = {0: 'deactivate_ad', 1: 'activate_ad'},
getParent = (dom: HTMLElement | null): HTMLElement | null => dom ? dom.parentElement : null,
removeAdRow = (ad: AdminAd): void => {
	let ads = [...Engine.store().USER['siteAds']],
		index = ads.indexOf(ad);
	if(index >= 0) {
		ads.splice(index, 1);
		Engine.dispatch(fetchUserDataSuccess([{siteAds: ads}]));
	}
},
AdminFunction = {
    setStatus: (s_a: string, ad: AdminAd, c: number, s: string): void => {
		const form = document.forms.namedItem(s_a),
			status = form && form.elements.namedItem('status_' + c);
		if(status instanceof HTMLInputElement) {
			status.value = statuses[s];
		}

        Http.ServerRequest('admin-function', {id: ad.id, admin_action: actions[s]}).then(promise => {
            if(promise.data.error) {
                Helper.addMessage(promise.data.error, true);
            }else {
                Helper.addMessage(promise.data.message);
            }
        });
    },

    removeAd: (ad: AdminAd): void => {
        Helper.confirm(
        	getLabel('r_sure_delete'),
			() => {
				 Http.ServerRequest('admin-function', {id: ad.id, admin_action: 'delete'}).then(promise => {
					if(promise.data.error) {
						Helper.addMessage(promise.data.error, true);
					}else {
						removeAdRow(ad);
						Helper.location('admin-ads');
					}
				});
			}
		);				
    },

    applyPermissionSetting: (s_p: string, c: number): void => {
		const form = document.forms.namedItem(s_p),
			page = form && form.elements.namedItem('page_' + c),
			accessLevel = form && form.elements.namedItem('access_level_' + c),
			checkAd = form && form.elements.namedItem('check_ad_' + c);
		if(!(page instanceof HTMLInputElement) || !(accessLevel instanceof HTMLInputElement) || !(checkAd instanceof HTMLInputElement)) {
			return;
		}

		Http.ServerRequest('admin-function', {page: page.value, access_level: accessLevel.value, check_ad: checkAd.value, admin_action: 'set_permission'}).then(promise => {
            if(promise.data.error) {
                Helper.addMessage(promise.data.error, true);
            }else {
                Helper.addMessage(promise.data.message);
            }
        });
	},

	accessLevel: (s_p: string, c: number, v: string): void => {
		const form = document.forms.namedItem(s_p),
			input = form && form.elements.namedItem('access_level_' + c);
		if(input instanceof HTMLInputElement) {
			input.value = v;
		}
	},

	checkAd: (s_p: string, c: number, v: string): void => {
		const form = document.forms.namedItem(s_p),
			input = form && form.elements.namedItem('check_ad_' + c);
		if(input instanceof HTMLInputElement) {
			input.value = v;
		}
	},

	admLoadDataItem: (f: HTMLFormElement, type: HTMLSelectElement, item: string, e_1: HTMLInputElement, e_2: HTMLInputElement): void => {
		let items = admPageVars[type.name] && admPageVars[type.name][type.value],
			itemOptions = f.elements.namedItem(item);
		if(!(itemOptions instanceof HTMLSelectElement)) {
			return;
		}
		e_1.value = '';
		e_2.value = '';
		itemOptions.options.length = 0;
		if(items) {
			for(let i = 0; i < items.length; i++) {
				const id = items[i].i;
				const name = items[i].n + '::' + items[i].n_cn;
				itemOptions.options[i] = new Option(name, String(id));
			}
		}
	},

	loadToChange: (f: HTMLFormElement, fld: HTMLSelectElement, chg_fld: string, chg_fld_cn: string, ed_box: string): void => {
		const box = document.getElementById(ed_box),
			selectedOption = fld.options[fld.selectedIndex],
			input = f.elements.namedItem(chg_fld),
			inputCn = f.elements.namedItem(chg_fld_cn);
		if(!box || !selectedOption || !(input instanceof HTMLInputElement) || !(inputCn instanceof HTMLInputElement)) {
			return;
		}
		const flds = selectedOption.text.split('::');
		box.style.display = 'inline';
		input.value = flds[0];
		inputCn.value = flds[1];
		console.log(fld.type);
	},
	
    getParent: getParent,
	
	setAdmPageVars: (vars: Record<string, Record<string, AdminCategoryItem[]>>): void => {
		admPageVars = vars;
	},

	clearHits: (): void => {
		for(const e of Object.keys(ipListsViewed)) {
			if(table && document.getElementById('ip_' + e)) {
				table.removeChild(ipListsViewed[e]);
			}
		}
		ipListsViewed = {};
	},
	
    hitDetails: (visitorIp: string): void => {
		const this_row = document.getElementById('ip_' + visitorIp),
			tb = getParent(this_row);
		if(!(this_row instanceof HTMLTableRowElement) || !tb || !(tb instanceof HTMLTableSectionElement || tb instanceof HTMLTableElement)) {
			return;
		}
		const this_index = this_row.rowIndex;
        
		if(!table) {
			table = tb;
		}
		
        if(ipListsViewed[visitorIp] && document.getElementById('detail_' + visitorIp)) {
            tb.removeChild(ipListsViewed[visitorIp]);
            delete ipListsViewed[visitorIp];
        }else {
            let v_ip = visitorIp,
                v_date = '';
            const match = visitorIp.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})_(\d{4}-\d{2}-\d{2})$/);
			if(match) {
                v_ip = match[1];
                v_date = match[2];
            }
            let new_row = tb.insertRow(this_index + 1);
            new_row.id = 'detail_' + visitorIp;
			new_row.className = this_row.className;
            let td = document.createElement("td");
            td.colSpan = 3;
            td.style.padding = '3px 10px 3px 20px';
            new_row.appendChild(td);
            let data: Record<string, string> = {action: 'admin_visitor_hits_list'};
            if(v_date) {
                data['visitor_ip'] = v_ip;
                data['visitor_date'] = v_date;
            }else {
                data['visitor_ip'] = visitorIp;
            }

            Http.Fetch('admin-function', data).then(promise => {
                if(promise.data.error) {
                    Helper.addMessage(promise.data.error, true);
                }else {
                    let hits = promise.data.hits as VisitorHitsResponse,
						lists = hits.lists,
						visitor_date = hits.visitor_date,
						html;
						
					if(visitor_date) {
						html = (
							<table style={{width: "50%", border: "0px"}}>
								<tbody>
								{
									lists.map((list, idx) => (
										 <tr key={`${list.create_time}${idx}`}><td style={{width: "30%", fontWeight: "normal"}}>{list.create_time}</td><td>{list.uri}</td></tr>
									))
								}
								</tbody>
							</table>
						);
					}else {
						html = (
							<table style={{width: "60%", border: "0px"}}>
								<tbody>
								{
									lists.map((list, idx) => (
										 <tr key={`${list.create_time}${idx}`} id={`ip_${list.ip}_${list.create_time}`}><td style={{width: "40%", fontWeight: "bold", cursor: "pointer"}} onClick={() => {AdminFunction.hitDetails(`${list.ip}_${list.create_time}`)}}>{list.create_time} ({list.week_day})</td><td>{list.count}</td></tr>
									))
								}
								</tbody>
							</table>
						);
					}

					ReactDOM.render(html, td);
                }
            });

            ipListsViewed[visitorIp] = new_row;
        }
	}
}

export { AdminFunction };
