odoo.define('bi_website_product_brand.product_brand_label', function(require){
    //var next = 1;
    //$(".add-more").click(function(e){
        //e.preventDefault();
        //var addto = "#field" + next;
        //var addRemove = "#field" + (next);
        //next = next + 1;
       // var newIn = '<input autocomplete="off" class="input form-control" id="field' + next + '" name="field' + next + '" type="text">';
       // var newInput = $(newIn);
        //var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
        //var removeButton = $(removeBtn);
        //$(addto).after(newInput);
        //$(addRemove).after(removeButton);
        //$("#field" + next).attr('data-source',$(addto).attr('data-source'));
       // $("#count").val(next);  
        
        //console.log('beeeeeeforeeecallllllllllllllllllleeeeeeeeeeeeeeeeeeedddddddddddddddddddddddddddddd')
        //$('.remove-me').click(function(e){
        /*$('.remove-me').on('click', '.remove-me', function(e) {
        console.log('callllllllllllllllllleeeeeeeeeeeeeeeeeeedddddddddddddddddddddddddddddd')
            e.preventDefault();
            var fieldNum = this.id.charAt(this.id.length-1);
            var fieldID = "#field" + fieldNum;
            $(this).remove();
            $(fieldID).remove();
        });*/
        
        $('.label_remove').on('click', '.js_delete_product', function(e) {
            e.preventDefault();
            $(this).closest('tr').trigger('change');
        });
    //});
});

