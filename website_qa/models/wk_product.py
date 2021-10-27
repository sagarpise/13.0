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
import logging
from odoo import api, fields, models, _
from odoo.exceptions import UserError
from datetime import datetime
_logger = logging.getLogger(__name__)

class Template(models.Model):
    _inherit = 'product.template'

    qa =fields.One2many('wk.product.qa','template_id',"product")

    @api.model
    def get_public_user_id(self):
        ir_model_data = self.env['ir.model.data']
        p_user_id = self.env['ir.model.data'].xmlid_to_object(
            'base.public_user').id
        return p_user_id


class WkProductQa(models.Model):

    _name = "wk.product.qa"
    _order = 'id desc'


    def name_get(self):
        result = []
        for record in self:
            result.append((record.id, record.question))
        return result

    question = fields.Char('Question')
    description =fields.Text('Question description')
    answer = fields.Text('Answer')
    answer_by =fields.Many2one("res.users")
    answered_date =fields.Datetime("Answered date")
    asked_by =fields.Many2one("res.users",'Asked By',readonly="True")
    template_id =fields.Many2one("product.template","Product" )
    sequence_number =fields.Integer('Sequence no')
    website_published = fields.Boolean('Available on website', copy=False)
    asked_by_img = fields.Binary(related='asked_by.image_1920')
    answer_by_img = fields.Binary(related='answer_by.image_1920')
    state = fields.Selection([
                ('draft','Draft'),
                ('pending','Pending'),
                ('answered','Published'),
                ('undo','Undo'),
                ('cancel','Cancel')],"State", default="draft")


    def cancel_state(self):
       for obj in self:
           obj.state = 'cancel'

    def pending_state(self):
        for obj in self:
            obj.state = 'pending'

    def undo_state(self):
        for obj in self:
            obj.state = 'draft'

    def answer_state(self):
        for obj in self:
            if not obj.answer:
                raise UserError(_('Please give the answer.'))
            obj.state = 'answered'
            obj.website_published = True
            obj.answered_date = datetime.now()
            obj.answer_by = self._uid

    def secret_state(self):
        for obj in self:
            if not obj.answer:
                raise UserError(_('Please give the answer.'))
            obj.state = 'answered'
            obj.answered_date = datetime.now()
            obj.answer_by = self._uid
