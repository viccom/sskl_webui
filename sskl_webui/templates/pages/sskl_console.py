# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe import _

def get_context(context):
    context.no_cache = 1
    navlist = [{'ico': 'fa-tachometer', 'name': _('Station Map'), 'url': '/myapp1_test1'}, {'ico': 'fa-paw', 'name': _('Station List'), 'url': '/myapp1_test2'},
    {'ico': 'fa-cogs', 'name': _('Battery Trace'), 'url': '/myapp1_test3'}, {'ico': 'fa-upload', 'name': _('Battery Assess'), 'url': '/myapp1_test4'},
    {'ico': 'fa-tasks', 'name': _('Remote Maintenance'), 'url': '/myapp1_test5'}, ]

    context.leftnavlist = navlist
    context.doc = "This is a test"


