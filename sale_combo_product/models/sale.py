
from odoo import models

class SaleOrderLine(models.Model):
    _inherit = 'sale.order.line'

    def _action_launch_stock_rule(self, previous_product_uom_qty=False):
        res = super(SaleOrderLine, self)._action_launch_stock_rule(previous_product_uom_qty)
        procurements = []
        for line_id in self.filtered(lambda line: line.product_id.combo_product_id):
            for pack_id in line_id.product_id.combo_product_id:
                group_id = line_id._get_procurement_group()
                if not group_id:
                    group_id = self.env['procurement.group'].create(line_id._prepare_procurement_group_vals())
                    line_id.order_id.procurement_group_id = group_id
                else:
                    # In case the procurement group is already created and the order was
                    # cancelled, we need to update certain values of the group.
                    updated_vals = {}
                    if group_id.partner_id != line_id.order_id.partner_shipping_id:
                        updated_vals.update({'partner_id': line_id.order_id.partner_shipping_id.id})
                    if group_id.move_type != line_id.order_id.picking_policy:
                        updated_vals.update({'move_type': line_id.order_id.picking_policy})
                    if updated_vals:
                        group_id.write(updated_vals)

                values = line_id._prepare_procurement_values(group_id=group_id)
                product_qty = line_id.product_uom_qty * pack_id.product_quantity

                line_uom = pack_id.uom_id
                quant_uom = pack_id.product_id.uom_id
                product_qty, procurement_uom = line_uom._adjust_uom_quantities(product_qty, quant_uom)

                procurements.append(self.env['procurement.group'].Procurement(
                    pack_id.product_id, product_qty, procurement_uom,
                    line_id.order_id.partner_shipping_id.property_stock_customer,
                    line_id.name, line_id.order_id.name, line_id.order_id.company_id, values))
        if procurements:
            self.env['procurement.group'].run(procurements)
        return res
