from logging import getLogger
from odoo import models, fields, api


class AccountMove(models.Model):
  _inherit = 'account.move'

  partner_vat = fields.Char(related='partner_id.vat', store=True)

