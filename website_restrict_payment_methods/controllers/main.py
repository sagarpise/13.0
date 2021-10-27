# -*- coding: utf-8 -*-
# Part of Probuse Consulting Service Pvt Ltd. See LICENSE file for full copyright and licensing details.

from odoo import http, _
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale

class WebsiteSale(WebsiteSale):
        
    def _get_shop_payment_values(self, order, **kwargs):
        values = super(WebsiteSale, self)._get_shop_payment_values(order, **kwargs)
        acq_list = values.get("acquirers", False)
        res_partner = request.env.user.partner_id
        res_acq_list = list(res_partner.custom_payment_acquirer_ids)
        for ele in res_acq_list: 
            if ele in acq_list: 
                acq_list.pop(acq_list.index(ele))
        return values
     
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: