if(typeof selectedAssocProducts=='undefined') {
    var selectedAssocProducts = {};
}
if (typeof Product.Config != 'undefined') {
Product.Config.addMethods({
    configureElement : function(element) {
        this.reloadOptionLabels(element);
        if(element.value){
            this.state[element.config.id] = element.value;
            if(element.nextSetting){
                element.nextSetting.disabled = false;
                this.fillSelect(element.nextSetting);
                this.resetChildren(element.nextSetting);
            }
        }
        else {
            this.resetChildren(element);
        }
        this.reloadPrice();
        if (!element.value || element.value.substr(0,6) == 'choose') return; // Selected "choose option"
          var attributeId = element.id.replace(/[a-z]*/, '');
          for (var a in this.config.attributes)
          {
              for (i = 0; i < this.config.attributes[a].options.length; i++)
              {
                  if (this.config.attributes[a].options[i].id != element.value) continue;
                  selectedAssocProducts[a] = this.config.attributes[attributeId].options[i].products;
              }
          }
          var productNo = intersect(selectedAssocProducts) || selectedAssocProducts[attributeId][0];
          if(assocIMG[productNo])
          $('image').src = assocIMG[productNo]; //change your image id here if its not as per default
    }
});
    function intersect(ar) // ar can be an array of arrays or an asssociative array
      {
          if (ar == null) return false;
          var a = new Array();
          if (ar.length == undefined) // Associate Array
          {       
              for (var i in ar)
               a.push(ar[i]);       
          }     
          else
           a = ar;
          if (a.length == 1) return false; // Single array ? Nothing to intersect with
          var common = new Array();
          function loop(a, index, s_index, e_index)
          {               
              if (index == null) index = 0;
              if (s_index == null) s_index = 0;
              if (e_index == null) e_index = a[index].length;
              if (index == a.length - 1) return;           
              for (var i = s_index; i < e_index; i++)
              {
                  if (common.indexOf(a[index][i]) != -1) continue;
                  for (var j = 0; j < a[index + 1].length; j++)
                  {
                      if (a[index][i] != a[index+1][j]) continue;                       
                      loop(a, index + 1, j, j + 1);
                      if (index + 1 == a.length - 1) { common.push(a[index][i]); break; }                       
                  }
              }           
          }       
          loop(a);
          return common;
      }
}