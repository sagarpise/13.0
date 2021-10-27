odoo.define('theme_prime.website_sale', function (require) {
'use strict';

require('website_sale.website_sale');
var publicWidget = require('web.public.widget');
var core = require('web.core');
var Mixins = require('droggol_theme_common.mixins');
var config = require('web.config');

var isMobileTablet = config.device.size_class <= config.device.SIZES.MD;

var qweb = core.qweb;
var _t = core._t;

var ProductCarouselMixins = Mixins.ProductCarouselMixins;

publicWidget.registry.WebsiteSale.include({
    _startZoom: function () {
        // Disable zoomOdoo, Because Drift is enabled
    },
    /**
     * TO-DO move to common this fuking thing
     *
     * @override
     * @private
     */
    _updateProductImage: function ($productContainer, displayImage, productId, productTemplateId, newCarousel, isCombinationPossible) {
        if (this.$target.hasClass('d_website_sale')) {
            var $carousel = $productContainer.find('.d_shop_product_details_carousel');
            // When using the web editor, don't reload this or the images won't
            // be able to be edited depending on if this is done loading before
            // or after the editor is ready.
            if (window.location.search.indexOf('enable_editor') === -1) {
                var $newCarousel = $(newCarousel);
                $carousel.after($newCarousel);
                $carousel.remove();
                $carousel = $newCarousel;
                $carousel.carousel(0);
                this._startZoom();
                // fix issue with carousel height
                this.trigger_up('widgets_start_request', {$target: $carousel});
                ProductCarouselMixins._updateIDs($productContainer);
            }
            $carousel.toggleClass('css_not_available', !isCombinationPossible);
        } else {
            this._super.apply(this, arguments);
        }
    },
    _onChangeCombination: function (ev, $parent, combination) {
        this._super.apply(this, arguments);

        var $price = $parent.find('.oe_price_h4');

        var $percentage = $parent.find(".tp-off-percentage");

        if (combination.has_discounted_price) {
            var percentage = Math.round((combination.list_price - combination.price) / combination.list_price * 100)
            if (percentage) {
                var percentageText = _.str.sprintf(_t('(%d%% OFF)'), percentage);
                if ($percentage.length) {
                    $percentage.text(percentageText);
                } else {
                    $percentage = $('<small class="tp-off-percentage d-none d-md-inline-block ml-1">' + percentageText + '</small>');
                    $percentage.appendTo($price);
                }
            } else {
                $percentage.remove();
            }
        } else {
            $percentage.remove();
        }
    },
});

publicWidget.registry.FilterSidebar = publicWidget.Widget.extend({
    selector: '.oe_website_sale',
    events: {
        'click .tp-filter-sidebar-toggle': '_onClickToggleSidebar'
    },
    init: function () {
        this._super.apply(this, arguments);
        this.$backdrop = $('<div class="modal-backdrop show"/>');
    },
    _onClickToggleSidebar: function (ev) {
        ev.preventDefault();
        if($('#products_grid_before').hasClass('open')) {
            this.$backdrop.remove();
            $('#products_grid_before').removeClass('open', 400, 'linear', function () {
                $('body').removeClass('modal-open');
            });
        } else {
            this.$backdrop.appendTo('body');
            $('#products_grid_before').addClass('open', 400, 'linear');
            $('body').addClass('modal-open');
            this.$backdrop.on('click', this._onClickToggleSidebar.bind(this));
        }
        $('.tp-filter-sidebar-item').toggleClass('d-none show');
    },
});

publicWidget.registry.DriftZoom = publicWidget.Widget.extend({
    selector: '#o-carousel-product, .d_shop_product_details_carousel',
    disabledInEditableMode: true,
    start: function () {
        // If option is activated then zoom
        if ($('.ecom-zoomable').length) {
            this.images = _.map(this.$('.carousel-item img'), function (el) {
                return new Drift(el, {
                    namespace: 'tp',
                    sourceAttribute: 'src',
                    paneContainer: el.parentElement,
                    zoomFactor: $('.tp-zoom-factor').val() || 3,
                    inlineOffsetY: -50,
                    touchDelay: 500,
                    inlinePane: 992,    // Enable mobile zoom for mobile
                });
            });
        }
        return this._super.apply(this, arguments);
    },
    destroy: function () {
        _.invoke(this.images, 'disable');
        this._super.apply(this, arguments);
    }
});

publicWidget.registry.ProductRating = publicWidget.Widget.extend({
    xmlDependencies: ['/website_rating/static/src/xml/portal_tools.xml'],
    selector: '.tp_product_rating',
    events: {
        'click': '_onClickProductRating',
    },
    /**
     * @override
     */
    start: function () {
        var $rating = $(qweb.render('website_rating.rating_stars_static', {val: Math.round(this.$el.data('rating') / 2 * 100) / 100 || 0}));
        $rating.addClass('d-inline-block');
        $rating.prependTo(this.$el);
        return this._super.apply(this, arguments);
    },
    _onClickProductRating: function () {
        $('.nav-link[href="#tab_product_rating"]').click();
        $('html, body').animate({
            scrollTop: $('.tab_product_details').offset().top
        });
    }
});

publicWidget.registry.Tabs = publicWidget.Widget.extend({
    selector: '.tab_product_details',
    /**
     * @override
     */
    start: function () {
        this.$('.nav-link').removeClass('active');
        this.$('.nav-link:first').addClass('active');
        this.$('.tab-content .tab-pane:first').addClass('active show');
        if (!this.$('.nav-item').length) {
            this.$el.remove();
        }
        return this._super.apply(this, arguments);
    },
});

publicWidget.registry.ProductOwlCarousel = publicWidget.Widget.extend({
    selector: '.tp-owl-carousel',
    /**
     * @override
     */
    start: function () {
        var $owlSlider = this.$('.owl-carousel');
        var responsiveParams = {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            768: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        };
        if (!this.$target.hasClass('tp-has-two-blocks')) {
            _.extend(responsiveParams, {
                768: {
                    items: 3,
                },
                992: {
                    items: 4,
                },
                1200: {
                    items: 5,
                }

            });
        }
        $owlSlider.removeClass('d-none');
        $owlSlider.owlCarousel({
            dots: false,
            margin: 15,
            stagePadding: 5,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            rewind: true,
            rtl: _t.database.parameters.direction === 'rtl',
            responsive: responsiveParams,
        });
        this.$('.tp-owl-carousel-prev').click(function() {
            $owlSlider.trigger('prev.owl.carousel');
        });
        this.$('.tp-owl-carousel-next').click(function() {
            $owlSlider.trigger('next.owl.carousel');
        });
        return this._super.apply(this, arguments);
    },
});

publicWidget.registry.ProductSelectedAttributes = publicWidget.Widget.extend({
    selector: '.tp-product-selected-attributes',
    events: {
        'click .tp-attribute-remove': '_onClickAttributeRemove'
    },
    _onClickAttributeRemove: function (ev) {
        var $form = $('.js_attributes');
        // TODO: For selected price filter attribute
        if ($(ev.currentTarget).data('id') === 'price') {
            $form.find('input[name=min_price]').remove();
            $form.find('input[name=max_price]').remove();
            $form.submit();
        } else {
            var $input = $form.find('input[value=' + $(ev.currentTarget).data('id') + ']');
            $input.prop('checked', false);
            var $select = $form.find('option[value=' + $(ev.currentTarget).data('id') + ']').closest('select');
            $select.val('');
            $form.submit();
        }
    },
});

publicWidget.registry.DrFilterCollapse = publicWidget.Widget.extend({
    selector: '.tp-sidebar-attribute',
    events: {
        'click .tp-attribute-title.collapsible': '_onClickTitleAttribute',
    },
    _onClickTitleAttribute: function (ev) {
        if ($(ev.currentTarget).hasClass('expand')) {
            $(ev.currentTarget).siblings('.tp-filter-collapse-area').slideUp('fast');
        } else {
            $(ev.currentTarget).siblings('.tp-filter-collapse-area').slideDown('fast');
        }
        $(ev.currentTarget).toggleClass('expand');
    },
});

publicWidget.registry.DrFilterSearch = publicWidget.Widget.extend({
    selector: '.tp-filter-search',
    events: {
        'input input.search': '_onChangeSearch'
    },
    _onChangeSearch: function (ev) {
        ev.stopPropagation();
        var value = $(ev.currentTarget).val().trim();
        if (value) {
            this.$('li[data-search-term]').addClass('d-none');
            this.$('li[data-search-term*="' + value.toLowerCase() + '"]').removeClass('d-none');
        } else {
            this.$('li[data-search-term]').removeClass('d-none');
        }
    },
});

publicWidget.registry.DrProductDetailFollowup = publicWidget.Widget.extend({
    selector: '.tp-product-detail-followup',
    events: {
        'click .add_to_cart': '_onClickAddToCart',
        'click .product-img': '_onClickImg'
    },
    start: function () {
        var self = this;
        if (!isMobileTablet && $('.tab_product_details').length) {
            var position = $('.tab_product_details').position().top;
            $(window).on('scroll', _.throttle(function (ev) {
                var scroll = $(window).scrollTop();
                if (scroll > position) {
                    var productID = $('input[name="product_id"]').val();
                    var productPrice = $('.product_price .oe_price').text().trim();
                    self.$('.product-img img').attr('src', '/web/image/product.product/' + productID + '/image_128');
                    self.$('.oe_price').text(productPrice);
                    self.$el.fadeIn();
                } else {
                    self.$el.fadeOut();
                }
            }, 20));
        }
    },
    _onClickAddToCart: function (ev) {
        ev.preventDefault();
        var $btn = $('#add_to_cart');
        if ($('#add_to_cart').hasClass('out_of_stock')) {
            return this.displayNotification({
                type: 'danger',
                title: _t('No quantity available'),
                message: _t('Can not add product in cart. No quantity available.'),
                sticky: false,
            });
        } else {
            $btn.click();
        }
    },
    _onClickImg: function (ev) {
        ev.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
});

publicWidget.registry.ProductPriceSlider = publicWidget.Widget.extend({
    selector: '.tp-product-price-filter',
    events: {
        'change input[name=min_price]': '_onChangePrice',
        'change input[name=max_price]': '_onChangePrice',
    },
    start: function () {
        var self = this;
        this.$('.tp-product-price-slider').ionRangeSlider({
            skin: 'square',
            prettify_separator: ',',
            type: 'double',
            hide_from_to: true,
            onChange: function (ev) {
                self.$('input[name=min_price]').val(ev.from);
                self.$('input[name=max_price]').val(ev.to);
                self.$('.tp-price-validate').text('');
                self.$('[type=submit]').removeClass('d-none');
            },
        });
        this.priceFilterSlider = this.$('.tp-product-price-slider').data('ionRangeSlider');
        return this._super.apply(this, arguments);
    },
    _onChangePrice: function (ev) {
        ev.preventDefault();
        var minValue = this.$('input[name=min_price]').val();
        var maxValue = this.$('input[name=max_price]').val();
        if (isNaN(minValue) || isNaN(maxValue)) {
            this.$('.tp-price-validate').text(_t('Enter valid price value'));
            this.$('[type=submit]').addClass('d-none');
            return false;
        }
        if (parseInt(minValue) > parseInt(maxValue)) {
            this.$('.tp-price-validate').text(_t('Max price should be greater than min price'));
            this.$('[type=submit]').addClass('d-none');
            return false;
        }
        this.priceFilterSlider.update({
            from: minValue,
            to: maxValue,
        });
        this.$('.tp-price-validate').text('');
        this.$('[type=submit]').removeClass('d-none');
        return false;
    },
});

});


odoo.define('theme_prime.search_popover', function (require) {
'use strict';

require('website_sale.website_sale');
var publicWidget = require('web.public.widget');
var core = require('web.core');
var QWeb = core.qweb;

publicWidget.registry.searchPopover = publicWidget.Widget.extend({
    selector: '.tp-search-popover',
    xmlDependencies: ['/theme_prime/static/src/xml/theme_prime.xml'],
    events: {
        'click': '_onClickSearchPopover',
    },
    willStart: function () {
        var self = this;
        var sup_def = this._super.apply(this, arguments);
        var categ_def = this._rpc({
            route: '/droggol_theme_common/get_website_category'
        }).then(function (result) {
            self.categories = result;
        });
        return Promise.all([sup_def, categ_def]);
    },
    _onClickSearchPopover: function (ev) {
        ev.preventDefault();
        if (!QWeb.templates['theme_prime.SearchPopover']) {
            return;
        }
        var self = this;
        if (this.$searchPopover && this.$searchPopover.length) {
            this.$searchPopover.remove();
            this.$searchPopover = undefined;
            $('#wrapwrap').removeClass('tp-open-search-popover');
        } else {
            $('#wrapwrap').addClass('tp-open-search-popover');
            this.$searchPopover = $(QWeb.render('theme_prime.SearchPopover', { 'drg_categories': this.categories })).appendTo('body');
            this.$searchPopover.find('input').focus();
            this.$searchPopover.on('click', '.tp-search-box-close-btn', function () {
                self.$searchPopover.remove();
                self.$searchPopover = undefined;
                $('#wrapwrap').removeClass('tp-open-search-popover');
            });
            this.trigger_up('widgets_start_request', {$target: this.$searchPopover.find('.o_wsale_products_searchbar_form')});
        }
    },
});

publicWidget.registry.productsSearchBar.include({
    events: _.extend({}, publicWidget.registry.productsSearchBar.prototype.events, {
        'click .d_search_categ_dropdown .dropdown-item': '_onCategoryChange',
        'click .d_search_categ_dropdown': '_onClickDropDown',
    }),
    _onClickDropDown: function (ev) {
        this._render();
    },
    _onCategoryChange: function (ev) {
        ev.preventDefault();
        var $item = $(ev.currentTarget);
        this.category_id = $item.data('id') || false;
        this.$('.dr_active_text').text($item.text());
        var actionURL = "/shop";
        if (this.category_id) {
            actionURL = _.str.sprintf("/shop/category/%s", this.category_id);
        }
        this.$el.attr('action', actionURL);
    },
    _fetch: function () {

        var options = {
            'order': this.order,
            'limit': this.limit,
            'display_description': this.displayDescription,
            'display_price': this.displayPrice,
            'max_nb_chars': Math.round(Math.max(this.autocompleteMinWidth, parseInt(this.$el.width())) * 0.22),
        };
        if (this.category_id) {
            options['category'] = this.category_id;
        }
        return this._rpc({
            route: '/shop/products/autocomplete',
            params: {
                'term': this.$input.val(),
                'options': options,
            },
        });
    },
    _onInput: function (ev) {
        if (!$(ev.currentTarget).val()) {
            this._render();
            return;
        } else {
            this._super.apply(this, arguments);
        }
    }
});

});


// TODO: V14 move to below code in separator file called cart manager

odoo.define('theme_prime.website_cart_manager', function (require) {
    'use strict';

    require('website_sale_options.website_sale');
    require('website_sale_stock.VariantMixin');
    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var QuickViewDialog = require('droggol_theme_common.product_quick_view');
    var wSaleUtils = require('website_sale.utils');
    var CartManagerMixin = require('droggol_theme_common.mixins').CartManagerMixin;

    var qweb = core.qweb;
    var _t = core._t;

    publicWidget.registry.WebsiteSale.include(_.extend({}, CartManagerMixin, {

        xmlDependencies: (publicWidget.registry.WebsiteSale.prototype.xmlDependencies || [])
            .concat(['/droggol_theme_common/static/src/xml/we_sale_snippets/droggol_notification_template.xml']),

        init: function () {
            this.dr_cart_flow = odoo.session_info.dr_cart_flow || 'default';
            return this._super.apply(this, arguments);
        },
        _onProductReady: function () {
            var self = this;
            if (this._isDefaultCartFLow() || this.isBuyNow) {
                return this._super.apply(this, arguments);
            }

            /*  We assume is qty selector is not present the it will not have the
                variant selector so `variantSelectorNeeded` variable used to indicate
                that should we open custom selector or not.
            */
            var variantSelectorNeeded = !this.$form.find('input[name="add_qty"]').length;
            if (variantSelectorNeeded) {
                var dialogOptions = {
                    mini: true,
                    size: 'small',
                    add_if_single_variant: true,
                };
                var productID = this.$form.find('.product_template_id').val();
                if (productID) {
                    dialogOptions['productID'] = parseInt(productID);
                } else {
                    dialogOptions['variantID'] = this.rootProduct.product_id;
                }
                this.QuickViewDialog = new QuickViewDialog(this, dialogOptions).open();
                return this.QuickViewDialog;
            }
            return this._customCartSubmit();
        },

        _customCartSubmit: function () {
            var self = this;
            var $drCustomCartFlow = $('<input>', {
                name: 'dr_cart_flow',
                type: "hidden",
                value: this.dr_cart_flow || 0
            });
            this.$form.append($drCustomCartFlow);
            return this.$form.ajaxSubmit({
                dataType: 'json',
                success: function (data) {
                    if (data) {
                        wSaleUtils.updateCartNavBar(data);
                    }
                    self.$el.trigger('dr_close_dialog', {});
                    return self._handleCartConfirmation(self.dr_cart_flow, data);
                }
            });

        },

        _isDefaultCartFLow: function () {
            return !_.contains(['side_cart', 'dialog', 'notification'], this.dr_cart_flow);
        },

        // Add product automatically
        // Or show not enough stock error
        _onChangeCombination: function () {
            this._super.apply(this, arguments);
            if (this.$el.hasClass('auto-add-product') && this.$('#add_to_cart').hasClass('out_of_stock')) {
                return this.displayNotification({
                    type: 'danger',
                    title: _t('No quantity available'),
                    message: _t('Can not add product in cart. No quantity available.'),
                    sticky: false,
                });
            } else if (this.$el.hasClass('auto-add-product')) {
                this.$('#add_to_cart').click();
            }
        },

        _onModalSubmit: function () {
            this.$el.trigger('dr_close_dialog', {});
            this._super.apply(this, arguments);
        }
    }));

});

odoo.define('theme_prime.cart_confirmation_dialog', function (require) {
'use strict';

    var Dialog = require('web.Dialog');

    return Dialog.extend({
        xmlDependencies: Dialog.prototype.xmlDependencies.concat(
            ['/theme_prime/static/src/xml/cart_confirmation_dialog.xml']
        ),
        template: 'theme_prime.cart_confirmation_dialog',
        events: _.extend({}, Dialog.prototype.events, {
            'dr_close_dialog': 'close',
            'click .d_view_cart': '_openCartSidebar',
            'click .s_d_product_small_block .card': '_onClickProduct'
        }),
        /**
         * @constructor
         */
        init: function (parent, options) {
            this.data = options.data;
            if (this.data.accessory_product_ids.length) {
                this.data.accessory_product_ids_str = JSON.stringify(this.data.accessory_product_ids);
            }
            this._super(parent, _.extend({
                renderHeader: false,
                renderFooter: false,
                technical: false,
                size: options.size,
                backdrop: true,
            }, options || {}));
        },
        /**
         * @override
         */
        start: function () {
            var sup = this._super.apply(this, arguments);
            // Append close button to dialog
            $('<button/>', {
                class: 'close',
                'data-dismiss': "modal",
                html: '<i class="lnr lnr-cross"/>',
            }).prependTo(this.$modal.find('.modal-content'));
            this.$modal.find('.modal-dialog').addClass('modal-dialog-centered dr_full_dialog d_cart_confirmation_dialog');
            if (this.mini) {
                this.$modal.find('.modal-dialog').addClass('is_mini');
            }
            this.trigger_up('widgets_start_request', {
                $target: this.$('.droggol_product_snippet'),
            });
            return sup;
        },

        _openCartSidebar: function (ev) {
            ev.preventDefault();
            if (!$('.dr_sale_cart_sidebar_container.open').length) {
                if ($('.dr_sale_cart_sidebar:first').length) {
                    $('.dr_sale_cart_sidebar:first').trigger('click');
                    this.close();
                } else {
                    // Fall back to cart
                    window.location.href = "/shop/cart";
                }
            }
        },

        // TODO: fix this hack
        _onClickProduct: function (ev){
            window.location.href = $(ev.currentTarget).find('.d-product-name a')[0].href;
        },

    });

});
