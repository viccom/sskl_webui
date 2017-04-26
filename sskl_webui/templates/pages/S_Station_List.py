# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe import _
from tieta.tieta.doctype.cell_station.cell_station import search_station

def get_context(context):
    context.no_cache = 1
    menulist = frappe.get_all("Menu List")
    n_list = []
    for m in menulist:
        dd = { }
        dd['url'] = frappe.get_value("Menu List", m['name'], "url")
        dd['name'] = frappe.get_value("Menu List", m['name'], "menuname")
        dd['ico'] = frappe.get_value("Menu List", m['name'], "menuico")
        dd['id'] = frappe.get_value("Menu List", m['name'], "id")
        n_list.append(dd)

    n_list.sort(key=lambda k: (k.get('id', 0)))
    context.leftnavlist = n_list
    context.title = _('S_Station_List')
    frappe.form_dict.rgn='RGN000005'
    context.cell_list = search_station(**frappe.form_dict)


