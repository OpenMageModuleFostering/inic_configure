if(typeof selectedAssocProducts=='undefined') {
    var selectedAssocProducts = {};
}
if (typeof Product.Config != 'undefined') {
Product.Config.addMethods({
    
});
}

/*
    Some of these override earlier varien/product.js methods, therefore
    varien/product.js must have been included prior to this file.
*/


Product.Config.prototype.getMatchingSimpleProduct = function(){
    var inScopeProductIds = this.getInScopeProductIds();
    if ((typeof inScopeProductIds != 'undefined') && (inScopeProductIds.length == 1)) {
        return inScopeProductIds[0];
    }
    return false;
};

/*
    Find products which are within consideration based on user's selection of
    config options so far
    Returns a normal array containing product ids
    allowedProducts is a normal numeric array containing product ids.
    childProducts is a hash keyed on product id
    optionalAllowedProducts lets you pass a set of products to restrict by,
    in addition to just using the ones already selected by the user
*/
Product.Config.prototype.getInScopeProductIds = function(optionalAllowedProducts) {

    var childProducts = this.config.childProducts;
    var allowedProducts = [];

    if ((typeof optionalAllowedProducts != 'undefined') && (optionalAllowedProducts.length > 0)) {
       // alert("starting with: " + optionalAllowedProducts.inspect());
        allowedProducts = optionalAllowedProducts;
    }

    for(var s=0, len=this.settings.length-1; s<=len; s++) {
        if (this.settings[s].selectedIndex <= 0){
            break;
        }
        var selected = this.settings[s].options[this.settings[s].selectedIndex];
        if (s==0 && allowedProducts.length == 0){
            allowedProducts = selected.config.allowedProducts;
        } else {
           // alert("merging: " + allowedProducts.inspect() + " with: " + selected.config.allowedProducts.inspect());
            allowedProducts = allowedProducts.intersect(selected.config.allowedProducts).uniq();
           // alert("to give: " + allowedProducts.inspect());
        }
    }

    //If we can't find any products (because nothing's been selected most likely)
    //then just use all product ids.
    if ((typeof allowedProducts == 'undefined') || (allowedProducts.length == 0)) {
        productIds = Object.keys(childProducts);
    } else {
        productIds = allowedProducts;
    }
    return productIds;
};



Product.Config.prototype.reloadPrice = function(){
        if (this.config.disablePriceReload) {
            return;
        }
        var childProductId = this.getMatchingSimpleProduct();
    	var childProducts = this.config.childProducts;
        var price    = 0;
        var oldPrice = 0;
        for(var i=this.settings.length-1;i>=0;i--){
            var selected = this.settings[i].options[this.settings[i].selectedIndex];
            if(selected.config){
                price    += parseFloat(selected.config.price);
                oldPrice += parseFloat(selected.config.oldPrice);
            }
        }
        
        if (childProductId){
        	this.updateProductName(childProductId);
        	this.updateProductShortDescription(childProductId);
	        this.updateProductDescription(childProductId);
	        this.updateProductAttributes(childProductId);
	        this.updateProductImage(childProductId);
	       
    	} else {
    		this.updateProductName(false);
    		this.updateProductShortDescription(false);
	        this.updateProductDescription(false);
	        this.updateProductAttributes(false);
	        this.updateProductImage(false);
    	}
    	
		optionsPrice.changePrice('config', {'price': price, 'oldPrice': oldPrice});
        optionsPrice.reload();        
		return price;

        if($('product-price-'+this.config.productId)){
            $('product-price-'+this.config.productId).innerHTML = price;
        }
        this.reloadOldPrice();
        
        
    };

Product.Config.prototype.updateProductShortDescription = function(productId) {
    var shortDescription = this.config.shortDescription;
    if (productId && this.config.childProducts[productId].shortDescription) {
        shortDescription = this.config.childProducts[productId].shortDescription;
    } 
    $$('#product_addtocart_form div.short-description div.std').each(function(el) {
        el.innerHTML = shortDescription;
    });
};

Product.Config.prototype.updateProductDescription = function(productId) {
    var description = this.config.description;
    if (productId && this.config.childProducts[productId].description) {
        description = this.config.childProducts[productId].description;
    }
    
    $$('div.box-description div.std').each(function(el) {
        el.innerHTML = description;
    });
    
};

Product.Config.prototype.updateProductAttributes = function(productId) {
    var productAttributes = this.config.productAttributes;
    if (productId && this.config.childProducts[productId].productAttributes) {
        productAttributes = this.config.childProducts[productId].productAttributes;
    }
    //If config product doesn't already have an additional information section,
    //it won't be shown for associated product either. It's too hard to work out
    //where to place it given that different themes use very different html here
    
    $$('div.product-collateral div.box-additional').each(function(el) {
        el.innerHTML = productAttributes;
        decorateTable('product-attribute-specs-table');
    });
    
};

Product.Config.prototype.updateProductName = function(productId) {
    var productName = this.config.productName;
    if (productId && this.config.childProducts[productId].productName) {
        productName = this.config.childProducts[productId].productName;
    }
    $$('#product_addtocart_form div.product-name h1').each(function(el) {
        el.innerHTML = productName;
    });
};

Product.Config.prototype.updateProductImage = function(productId) {
    var imageUrl = this.config.imageUrl;
    
    if(productId && this.config.childProducts[productId].imageUrl) {
        imageUrl = this.config.childProducts[productId].imageUrl;
    }

    if (!imageUrl) {
        return;
    }

    if($('img')) {
        $('img').src = imageUrl;
    } else {
        $$('p.product-image img').each(function(el) {
            var dims = el.getDimensions();
            el.src = imageUrl;
            el.width = dims.width;
            el.height = dims.height;
        });
    }
};
