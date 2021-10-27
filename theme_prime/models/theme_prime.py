# -*- coding: utf-8 -*-
# Copyright (c) 2019-Present Droggol. (<https://www.droggol.com/>)

from odoo import models


class ThemePrime(models.AbstractModel):
    _inherit = 'theme.utils'

    def _theme_prime_post_copy(self, mod):
        self.disable_view('website_theme_install.customize_modal')

        self.enable_view('theme_prime.d_product_quick_view_option')
        self.enable_view('theme_prime.d_product_color_preview_option')
