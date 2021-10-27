
import werkzeug
from odoo import api, http, tools, _
from odoo.http import request


class qa_function(http.Controller):
    @http.route(['/shop/qa'], type='http', auth="public", methods=['POST'], website=True, csrf=False)
    def wk_qa(self, **post):
        qa_array = {}
        qa_array['faq_question'] = post.get('question_name')
        qa_array['faq_answer'] = post.get('content')
        qa_array['user_id'] = post.get('user_id')
        request.env['website']._product_question( qa_array, post.get('product_tmp_id'))
        return werkzeug.utils.redirect(request.httprequest.referrer+ "#questionId")
