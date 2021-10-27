# -*- coding: utf-8 -*-
# Copyright (c) 2019-Present Droggol. (<https://www.droggol.com/>)

from odoo import fields, models


class ThemeView(models.Model):
    _inherit = 'theme.ir.ui.view'

    customize_show = fields.Boolean(default=False)

    def _convert_to_base_model(self, website, **kwargs):
        res = super(ThemeView, self)._convert_to_base_model(website, **kwargs)
        if res:
            res['customize_show'] = self.customize_show
        return res
