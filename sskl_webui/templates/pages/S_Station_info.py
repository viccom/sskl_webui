# coding=utf-8
# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe import _
from iot.hdb import iot_device_tree

def get_context(context):
    context.no_cache = 1
    menulist = frappe.get_all("Menu List")
    n_list = []
    for m in menulist:
        dd = { }
        print("@@@@@@@@", m['name'].decode('utf-8'))
        dd['url'] = frappe.get_value("Menu List", m['name'], "url")
        dd['name'] = frappe.get_value("Menu List", m['name'], "menuname")
        dd['ico'] = frappe.get_value("Menu List", m['name'], "menuico")
        dd['id'] = frappe.get_value("Menu List", m['name'], "id")
        n_list.append(dd)

    n_list.sort(key=lambda k: (k.get('id', 0)))
    context.leftnavlist = n_list
    context.title = _('sskl_console')


    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = "/login"
        raise frappe.Redirect

    name = frappe.form_dict.name

    doc = frappe.get_doc("Cell Station", "CELL00000002")
    # symlink_type = frappe.db.get_single_value('Cell Station Settings', 'symlink_device_type')
    #
    # sn = None
    # for dev in doc.devices:
    #     if dev.device_type == symlink_type:
    #         sn = dev.device_id
    # if sn:
    #     context.vsn = iot_device_tree(sn)
    #     context.sn = sn
    '''
    context.sn = '2-26003-161220-00002'
    context.vsn = ['2-26003-161220-00002_C2_B2']
    '''

    context.doc = doc


