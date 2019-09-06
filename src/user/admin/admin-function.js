import React from 'react';
import ReactDOM from 'react-dom';
import { Http } from '../../common/http-client';
import { Engine } from '../../common/engine';
import { Helper } from '../../common/js-funcs';
import { getLabel } from '../../common/label';
import { fetchUserDataSuccess } from '../../action';

let admPageVars = {}, 
ipListsViewed = {},
table = null;

const statuses = {0: 'inactive', 1: 'active'},
actions = {0: 'deactivate_ad', 1: 'activate_ad'},
getParent = dom => {
	if(dom) {
		return dom.parentElement ? dom.parentElement : dom.parentNode;
	}else {
		return null;
	}
},
removeAdRow = ad => {
	let ads = [...Engine.store().USER['siteAds']],
		index = ads.indexOf(ad);
	if(index >= 0) {
		ads.splice(index, 1);
		Engine.dispatch(fetchUserDataSuccess([{siteAds: ads}]));
	}
},
AdminFunction = {
    setStatus: (s_a, ad, c, s) => {
        document.forms[s_a]['status_' + c].value = statuses[s];

        Http.ServerRequest('admin-function', {id: ad.id, admin_action: actions[s]}).then(promise => {
            if(promise.data.error) {
                Helper.addMessage(promise.data.error, true);
            }else {
                Helper.addMessage(promise.data.message);
            }
        });
    },

    removeAd: ad => {
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

    applyPermissionSetting: (s_p, c) => {
		var s_p_f = document.forms[s_p];

		Http.ServerRequest('admin-function', {page: s_p_f['page_' + c].value, access_level: s_p_f['access_level_' + c].value, check_ad: s_p_f['check_ad_' + c].value, admin_action: 'set_permission'}).then(promise => {
            if(promise.data.error) {
                Helper.addMessage(promise.data.error, true);
            }else {
                Helper.addMessage(promise.data.message);
            }
        });
	},

	accessLevel: (s_p, c, v) => {
		document.forms[s_p]['access_level_' + c].value = v;
	},

	checkAd: (s_p, c, v) => {
		document.forms[s_p]['check_ad_' + c].value = v;
	},

	admLoadDataItem: (f, type, item, e_1, e_2) => {
		let items = admPageVars[type.name][type.value],
			itemOptions = f[item];
		e_1.value = '';
		e_2.value = '';
		itemOptions.options.length = 0;
		if(items) {
			var len = items.length;
			for(var i = 0; i < len; i++) {
				var id = items[i]['i'];
				var name = items[i]['n'] + '::' + items[i]['n_cn'];
				itemOptions.options[i] = new Option(name, id);
			}
		}
	},

	loadToChange: (f, fld, chg_fld, chg_fld_cn, ed_box) => {
		let box = document.getElementById(ed_box),
			flds = fld.options[fld.selectedIndex].text.split('::');
		box.style.display = 'inline';
		f[chg_fld].value = flds[0];
		f[chg_fld_cn].value = flds[1];
		console.log(fld.type);
	},
	
    getParent: getParent,
	
	setAdmPageVars: vars => {
		admPageVars = vars;
	},

	clearHits: () => {
		for(let e in ipListsViewed) {
			if(document.getElementById('ip_' + e)) {
				table.removeChild(ipListsViewed[e]);
			}
		}
		ipListsViewed = {};
	},
	
    hitDetails: visitorIp => {
        let this_row = document.getElementById('ip_' + visitorIp),
            tb = getParent(this_row),
            this_index = this_row.rowIndex;
        
		if(!table) {
			table = tb;
		}
		
        if(ipListsViewed[visitorIp] && document.getElementById('detail_' + visitorIp)) {
            tb.removeChild(ipListsViewed[visitorIp]);
            delete ipListsViewed[visitorIp];
        }else {
            let v_ip = visitorIp,
                v_date = '';
            if(visitorIp.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})_(\d{4}-\d{2}-\d{2})$/)) {
                v_ip = RegExp.$1;
                v_date = RegExp.$2;
            }
            let new_row = tb.insertRow(this_index + 1);
            new_row.id = 'detail_' + visitorIp;
			new_row.className = this_row.className;
            let td = document.createElement("td");
            td.colSpan = 3;
            td.style.padding = '3px 10px 3px 20px';
            new_row.appendChild(td);
            let data = {action: 'admin_visitor_hits_list'};
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
                    let hits = promise.data.hits,
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
