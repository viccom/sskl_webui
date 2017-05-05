# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt
from __future__ import unicode_literals
import frappe
import json
import redis
import requests
from frappe.model.document import Document
from frappe.utils import cint
from frappe import throw, msgprint, _, _dict
from iot.iot.doctype.iot_hdb_settings.iot_hdb_settings import IOTHDBSettings


@frappe.whitelist()
def taghisdata(sn=None, vsn=None, fields=None, condition=None):
	vsn = vsn or sn
	fields = fields or "*"
	doc = frappe.get_doc('IOT Device', sn)
	doc.has_permission("read")

	inf_server = IOTHDBSettings.get_influxdb_server()
	if not inf_server:
		frappe.logger(__name__).error("InfluxDB Configuration missing in IOTHDBSettings")
		return 500
	query = 'SELECT ' + fields + ' FROM "' + vsn + '"'
	if condition:
		query = query + " WHERE " + condition
	else:
		query = query + " LIMIT 1000"

	domain = frappe.get_value("Cloud Company", doc.company, "domain")
	r = requests.session().get(inf_server + "/query", params={"q": query, "db": domain}, timeout=10)
	if r.status_code == 200:
		res = r.json()["results"][0]['series'][0]['values']
		taghis = []
		for i in range(0, len(res)):
			hisvalue = {}
			if len(res[i]) == 5:
				hisvalue = {'name': res[i][1], 'value': res[i][3], 'time': res[i][0], 'quality': 0}
				taghis.append(hisvalue)
			elif len(res[i]) == 6:
				hisvalue = {'name': res[i][1], 'value': res[i][4], 'time': res[i][0], 'quality': 0}
				taghis.append(hisvalue)
		#print(taghis)
		return taghis or r.json()

@frappe.whitelist()
def iot_device_tree(sn=None):
	sn = sn or frappe.form_dict.get('sn')
	doc = frappe.get_doc('IOT Device', sn)
	doc.has_permission("read")
	client = redis.Redis.from_url(IOTHDBSettings.get_redis_server() + "/1")
	return client.lrange(sn, 0, -1)

