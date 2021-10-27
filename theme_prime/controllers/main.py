# -*- coding: utf-8 -*-
# Copyright (c) 2019-Present Droggol. (<https://www.droggol.com/>)

import json
import math

from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale
from odoo.addons.website.controllers.main import QueryURL
from odoo.osv import expression


class ThemePrimeWebsiteSale(WebsiteSale):

    def _check_float(self, val):
        try:
            return float(val)
        except ValueError:
            pass
        return False

    def _get_search_domain(self, search, category, attrib_values, search_in_description=True):
        domains = [request.website.sale_product_domain()]
        if search:
            for srch in search.split(" "):
                subdomains = [
                    [('name', 'ilike', srch)],
                    [('product_variant_ids.default_code', 'ilike', srch)]
                ]
                if search_in_description:
                    subdomains.append([('description', 'ilike', srch)])
                    subdomains.append([('description_sale', 'ilike', srch)])
                domains.append(expression.OR(subdomains))

        if category:
            domains.append([('public_categ_ids', 'child_of', int(category))])

        if attrib_values:
            attrib = None
            ids = []
            brand_ids = []
            for value in attrib_values:
                if value[0] == 0:
                    brand_ids.append(value[1])
                else:
                    if not attrib:
                        attrib = value[0]
                        ids.append(value[1])
                    elif value[0] == attrib:
                        ids.append(value[1])
                    else:
                        domains.append([('attribute_line_ids.value_ids', 'in', ids)])
                        attrib = value[0]
                        ids = [value[1]]
            if attrib:
                domains.append([('attribute_line_ids.value_ids', 'in', ids)])
            if brand_ids:
                domains.append([('dr_brand_id', 'in', brand_ids)])

        min_price = request.httprequest.args.get('min_price')
        max_price = request.httprequest.args.get('max_price')
        if min_price:
            min_price = self._check_float(min_price)
            if min_price:
                min_price = request.website._convert_currency_price(min_price, from_base_currency=False)
                domains.append([('list_price', '>=', min_price)])
        if max_price:
            max_price = self._check_float(max_price)
            if max_price:
                max_price = request.website._convert_currency_price(max_price, from_base_currency=False)
                domains.append([('list_price', '<=', max_price)])

        return expression.AND(domains)

    @http.route()
    def shop(self, page=0, category=None, search='', ppg=False, **post):
        response = super(ThemePrimeWebsiteSale, self).shop(page, category, search, ppg, **post)
        theme = request.website.sudo().theme_id
        if theme and theme.name.startswith('theme_prime'):
            prices = request.env['product.template'].read_group([], ['max_price:max(list_price)', 'min_price:min(list_price)'], [])[0]

            min_price = request.website._convert_currency_price(float(prices['min_price'] or 0), rounding_method=math.floor)
            max_price = request.website._convert_currency_price(float(prices['max_price'] or 0), rounding_method=math.ceil)

            keep = QueryURL(
                '/shop',
                category=category and int(category),
                search=search,
                attrib=request.httprequest.args.getlist('attrib'),
                ppg=ppg,
                order=post.get('order'),
                min_price=request.httprequest.args.get('min_price'),
                max_price=request.httprequest.args.get('max_price')
            )
            response.qcontext.update(keep=keep, min_price=min_price, max_price=max_price)

            # Grid Sizing
            bins = []
            for product in response.qcontext.get('products'):
                bins.append([{
                    'class': " ".join(x.html_class for x in product.website_style_ids if x.html_class),
                    'product': product,
                    'x': 1,
                    'y': 1
                }])
            response.qcontext.update(bins=bins)

            attrib_list = request.httprequest.args.getlist('attrib')
            attrib_values = [[int(x) for x in v.split("-")] for v in attrib_list if v]
            attributes_ids = [v[0] for v in attrib_values]

            response.qcontext.update(attributes_ids=attributes_ids)

        return response

    @http.route(['/shop/cart/update'], type='http', auth="public", methods=['GET', 'POST'], website=True, csrf=False)
    def cart_update(self, product_id, add_qty=1, set_qty=0, **kw):
        response = super(ThemePrimeWebsiteSale, self).cart_update(product_id, add_qty, set_qty, **kw)
        sale_order = request.website.sale_get_order(force_create=True)

        if kw.get('express'):
            return response

        monetary_options = {
            'display_currency': sale_order.pricelist_id.currency_id,
        }

        FieldMonetary = request.env['ir.qweb.field.monetary']
        cart_amount_html = FieldMonetary.value_to_html(sale_order.amount_total, monetary_options)

        if kw.get('dr_cart_flow'):
            product = request.env['product.product'].browse(int(product_id))
            return json.dumps({
                'cart_quantity': sale_order.cart_quantity,
                'product_name': product.name,
                'product_id': int(product_id),
                'cart_amount_html': cart_amount_html,
                'accessory_product_ids': product.accessory_product_ids and product.accessory_product_ids.mapped('product_tmpl_id').ids or []
            })

        return response
