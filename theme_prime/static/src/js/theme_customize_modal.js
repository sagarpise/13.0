odoo.define('theme_prime.theme', function (require) {

var ThemeCustomizeDialog = require('website.theme');
var websiteNavbarData = require('website.navbar');
var ThemeCustomizeMenu = _.find(websiteNavbarData.websiteNavbarRegistry.get(), function (w) {
    return w.selector === '#theme_customize';
});

ThemeCustomizeDialog.include({
    start: function () {
        var self = this;
        this.opened().then(function () {
            // Added custom class to btn tab
            self.$('.d_btn_widget:first').closest('.o_theme_customize_option_list').addClass('dr_btn_style_option');
            self.$('.dr_btn_style_option .o_theme_customize_with_widget').addClass('my-2');
        });
        return this._super.apply(this, arguments);
    },
});

var DThemeCustomizeMenu = ThemeCustomizeMenu.Widget.extend({
    xmlDependencies: (ThemeCustomizeMenu.Widget.prototype.xmlDependencies || []).concat(
        ['/theme_prime/static/src/xml/customize_modal_widget.xml']
    ),
});

// Replace 'theme_customize' id with d_theme_customize
// Load d_btn_widget template
// there is no way to add extra xmlDependencies to ThemeCustomizeDialog.
websiteNavbarData.websiteNavbarRegistry.add(DThemeCustomizeMenu, '#d_theme_customize');

});
