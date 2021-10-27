odoo.define('theme_prime.wishlist', function (require) {
"use strict";

var publicWidget = require('web.public.widget');
require('website_sale_wishlist.wishlist');

publicWidget.registry.ProductWishlist.include({
    events: _.extend({
        'click .wishlist-section .tp_wish_rm': '_onClickPrimeWishRemove',
        'click .wishlist-section .tp_wish_add': '_onClickPrimeWishAdd',
    }, publicWidget.registry.ProductWishlist.prototype.events),

    _onClickPrimeWishAdd: function (ev) {
        var self = this;
        this.$('.wishlist-section .tp_wish_add').addClass('disabled');
        this._primeAddOrMoveWish(ev).then(function () {
            self.$('.wishlist-section .tp_wish_add').removeClass('disabled');
        });
    },
    _onClickPrimeWishRemove: function (ev) {
        this._primeRemoveWish(ev, false);
    },
    _primeAddOrMoveWish: function (e) {
        var $tpWishlistItem = $(e.currentTarget).parents('.tp-wishlist-item');
        var productID = $tpWishlistItem.data('product-id');

        if ($('#b2b_wish').is(':checked')) {
            return this._addToCart(productID, 1);
        } else {
            var adding_deffered = this._addToCart(productID, 1);
            this._primeRemoveWish(e, adding_deffered);
            return adding_deffered;
        }
    },
    _primeRemoveWish: function (e, deferred_redirect) {
        var $tpWishlistItem = $(e.currentTarget).parents('.tp-wishlist-item');
        var productID = $tpWishlistItem.data('product-id');
        var wishID = $tpWishlistItem.data('wish-id');
        var self = this;

        this._rpc({
            route: '/shop/wishlist/remove/' + wishID,
        }).then(function () {
            $tpWishlistItem.hide();
        });

        this.wishlistProductIDs = _.without(this.wishlistProductIDs, productID);
        if (this.wishlistProductIDs.length === 0) {
            if (deferred_redirect) {
                deferred_redirect.then(function () {
                    self._redirectNoWish();
                });
            }
        }
        this._updateWishlistView();
    },
    _updateWishlistView: function () {
        if (this.wishlistProductIDs.length > 0) {
            $('.o_wsale_my_wish').show();
            $('.my_wish_quantity').text(this.wishlistProductIDs.length);
        } else {
            $('.o_wsale_my_wish').show();
            $('.my_wish_quantity').text('');
        }
        $('.tp-wishlist-counter').text(this.wishlistProductIDs.length);
    }
});

});
