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
{
  "name"                 :  "Website Product Question & Answer",
  "summary"              :  """Sales product Question & Answer""",
  "category"             :  "Sales",
  "version"              :  "1.1.0",
  "sequence"             :  10,
  "author"               :  "Webkul Software Pvt. Ltd.",
  "license"              :  "Other proprietary",
  "website"              :  "https://store.webkul.com/Odoo-Website-Product-Question-And-Answers.html",
  "description"          :  """""",
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=website_qa&version=12.0",
  "depends"              :  [
                             'website_sale',
                             'base',
                             'product',
                            ],
  "data"                 :  [
                             'views/product_view.xml',
                             'views/web_product_view.xml',
                             'security/ir.model.access.csv',
                            ],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  29,
  "currency"             :  "USD",
}