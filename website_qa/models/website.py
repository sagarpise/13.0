# -*- coding: utf-8 -*-
#################################################################################
# Author      : Webkul Software Pvt. Ltd. (<https://webkul.com/>)
# Copyright(c): 2015-Present Webkul Software Pvt. Ltd.
# All Rights Reserved.
#
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <https://store.webkul.com/license.html/>
#################################################################################

from odoo import api, fields, models, _

class Website(models.Model):
    _inherit = 'website'

    def _product_question(self,review_array, product_template_id):
        vals = {}
        # product = self.pool.get('product.template')

        vals['question'] = review_array['faq_question']

        vals['description'] = review_array['faq_answer']
        vals['asked_by'] = int(review_array['user_id'])

        vals['template_id'] = int(product_template_id)
        vals['state']='draft'

        rec = self.env['wk.product.qa'].sudo().create(vals)
        return True
