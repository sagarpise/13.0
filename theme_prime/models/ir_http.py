# -*- coding: utf-8 -*-

from odoo import models, api
from odoo.http import request


class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    @classmethod
    def _get_translation_frontend_modules_name(cls):
        mods = super(IrHttp, cls)._get_translation_frontend_modules_name()
        return mods + ['theme_prime', 'droggol_theme_common']

    @api.model
    def get_frontend_session_info(self):
        session_info = super(IrHttp, self).get_frontend_session_info()

        session_info.update({
            'dr_cart_flow': 'default',
        })

        if request and request.website: #frontend always have website no need to check for request.website
            # If there multi website cart flow
            multi_website_cart_flow_key = 'dr_cart_flow_%s' % request.website.id
            ICParam = self.env['ir.config_parameter'].sudo()
            # TO-DO FOR V-14 need to move is_droggol_editor to common module
            session_info.update({
                'is_droggol_editor': request.env.user.has_group('website.group_website_publisher'),
            })
            dr_cart_flow = ICParam.get_param(multi_website_cart_flow_key)
            if dr_cart_flow in ['notification', 'dialog', 'side_cart']:
                session_info.update({
                    'dr_cart_flow': dr_cart_flow
                })
            else:
                # If there is no multi website
                dr_cart_flow = ICParam.get_param('dr_cart_flow')
                if dr_cart_flow in ['notification', 'dialog', 'side_cart']:
                    session_info.update({
                        'dr_cart_flow': dr_cart_flow
                    })
        return session_info
