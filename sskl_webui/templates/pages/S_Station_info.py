# coding=utf-8
# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe import _
from iot.hdb import iot_device_tree

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = "/login"
        raise frappe.Redirect
    context.no_cache = 1
    context.show_sidebar = True

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

    name = frappe.form_dict.name
    if name:
        doc = frappe.get_doc("Cell Station", name)
    symlink_type = frappe.db.get_single_value('Cell Station Settings', 'symlink_device_type')
    #print("####",doc.devices)
    sn = None
    for dev in doc.devices:
        if dev.device_type == symlink_type:
            sn = dev.device_id
    if sn:
        context.vsn = iot_device_tree(sn)
        context.sn = sn
    else:
        context.vsn = []
        context.sn = ''
    '''
    context.sn = '2-26003-161220-00002'
    context.vsn = ['2-26003-161220-00002_C2_B2']
    '''
    tags = {"tags": [{"name": "Tenv", "desc": "\u73af\u5883\u6e29\u5ea6"},
                     {"name": "Usmax", "desc": "\u5355\u4f53\u7535\u538b\u6700\u5927\u503c"},
                     {"name": "Usmin", "desc": "\u5355\u4f53\u7535\u538b\u6700\u5c0f\u503c"},
                     {"name": "Tshi", "desc": "\u5355\u4f53\u6e29\u5ea6\u6700\u9ad8\u503c"},
                     {"name": "Tslo", "desc": "\u5355\u4f53\u6e29\u5ea6\u6700\u4f4e\u503c"},
                     {"name": "UB", "desc": "\u7535\u6c60\u7ec4\u7535\u538b"},
                     {"name": "UBL", "desc": "\u6bcd\u7ebf\u7535\u538b"},
                     {"name": "Icc", "desc": "\u5145\u7535\u7535\u6d41"},
                     {"name": "Ifd", "desc": "\u653e\u7535\u7535\u6d41"},
                     {"name": "CMax", "desc": "\u989d\u5b9a\u5bb9\u91cfAh"},
                     {"name": "CLeft", "desc": "\u5269\u4f59\u5bb9\u91cf"},
                     {"name": "BNo", "desc": "\u7535\u6c60\u7ec4\u53f7"},
                    {"name": "Us01", "desc": "\u5355\u4f53\u7535\u538b01"},
                     {"name": "Us02", "desc": "\u5355\u4f53\u7535\u538b02"},
                     {"name": "Us03", "desc": "\u5355\u4f53\u7535\u538b03"},
                     {"name": "Us04", "desc": "\u5355\u4f53\u7535\u538b04"},
                     {"name": "Us05", "desc": "\u5355\u4f53\u7535\u538b05"},
                     {"name": "Us06", "desc": "\u5355\u4f53\u7535\u538b06"},
                     {"name": "Us07", "desc": "\u5355\u4f53\u7535\u538b07"},
                     {"name": "Us08", "desc": "\u5355\u4f53\u7535\u538b08"},
                     {"name": "Us09", "desc": "\u5355\u4f53\u7535\u538b09"},
                     {"name": "Us10", "desc": "\u5355\u4f53\u7535\u538b10"},
                     {"name": "Us11", "desc": "\u5355\u4f53\u7535\u538b11"},
                     {"name": "Us12", "desc": "\u5355\u4f53\u7535\u538b12"},
                     {"name": "Us13", "desc": "\u5355\u4f53\u7535\u538b13"},
                     {"name": "Us14", "desc": "\u5355\u4f53\u7535\u538b14"},
                     {"name": "Us15", "desc": "\u5355\u4f53\u7535\u538b15"},
                     {"name": "Us16", "desc": "\u5355\u4f53\u7535\u538b16"},
                     {"name": "Ts01", "desc": "\u5355\u4f53\u6e29\u5ea601"},
                     {"name": "Ts02", "desc": "\u5355\u4f53\u6e29\u5ea602"},
                     {"name": "Ts03", "desc": "\u5355\u4f53\u6e29\u5ea603"},
                     {"name": "Ts04", "desc": "\u5355\u4f53\u6e29\u5ea604"},
                     {"name": "Ts05", "desc": "\u5355\u4f53\u6e29\u5ea605"},
                     {"name": "Ts06", "desc": "\u5355\u4f53\u6e29\u5ea606"},
                     {"name": "Ts07", "desc": "\u5355\u4f53\u6e29\u5ea607"},
                     {"name": "Ts08", "desc": "\u5355\u4f53\u6e29\u5ea608"},
                    ]}

    symtags = {"tags": [
                {
                    "name": "status",
                    "desc": "状态"
                },
                {
                    "name": "transpdatas",
                    "desc": "变化数据"
                },
                {
                    "name": "transprt",
                    "desc": "实时传输"
                },
                {
                    "name": "transpcc",
                    "desc": "断缓传输"
                },
                {
                    "name": "transflowup",
                    "desc": "上行流量"
                },
                {
                    "name": "transflowdn",
                    "desc": "下行流量"
                },
                {
                    "name": "DeviceSN",
                    "desc": "设备序列号"
                },
                {
                    "name": "CpuLoad",
                    "desc": "CPU使用率"
                },
                {
                    "name": "SysUptime",
                    "desc": "设备开机时间"
                },
                {
                    "name": "SysTotalRam",
                    "desc": "系统内存总量"
                },
                {
                    "name": "SysFreeRam",
                    "desc": "系统剩余内存"
                },
                {
                    "name": "SDCardFree",
                    "desc": "SD卡剩余容量"
                },
                {
                    "name": "LicInfo",
                    "desc": "设备授权信息"
                },
                {
                    "name": "pcid",
                    "desc": "设备标识"
                },
                {
                    "name": "BSPos",
                    "desc": "基站定位"
                },
                {
                    "name": "CSQ",
                    "desc": "无线信号强度"
                },
                {
                    "name": "C1.B1.IoStatus",
                    "desc": "设备1状态"
                },
                {
                    "name": "C1.B1.IoValid",
                    "desc": "设备1运行状态"
                },
                {
                    "name": "C1.B1.IoSendPacks",
                    "desc": "设备1发送包数"
                },
                {
                    "name": "C1.B1.IoRevPacks",
                    "desc": "设备1接收包数"
                },
                {
                    "name": "C1.B1.IoCommSusPer",
                    "desc": "设备1通讯成功率"
                },
                {
                    "name": "C1.B2.IoStatus",
                    "desc": "设备1状态"
                },
                {
                    "name": "C1.B2.IoValid",
                    "desc": "设备2运行状态"
                },
                {
                    "name": "C1.B2.IoSendPacks",
                    "desc": "设备2发送包数"
                },
                {
                    "name": "C1.B2.IoRevPacks",
                    "desc": "设备2接收包数"
                },
                {
                    "name": "C1.B2.IoCommSusPer",
                    "desc": "设备2通讯成功率"
                }]}

    context.symtags = symtags
    context.symtagsjson = json.dumps(symtags)
    context.tags = tags
    context.tagsjson = json.dumps(tags)
    context.doc = doc
    n_list.sort(key=lambda k: (k.get('id', 0)))
    context.leftnavlist = n_list
    context.title = _('S_Station_List')
    context.Station_name = name

