(function(n){n(".bt").button();var t;n.fn.SearchPeople=function(i,r,u){return t=n.extend({multi:!1},u||{}),t.Target=i.target,t.Select=r,t.SearchClicked=function(){return t.qs=n("#searchform",t.$this).serialize(),n.post("/SearchPeople/Rows/0",t.qs,t.LoadRows),!1},t.SortClicked=function(i){return n("#people #Sort",t.$this).val(n(i.target).text()),t.SearchClicked()},t.LoadRows=function(i){n("#people > tbody",t.$this).html(i).ready(function(){n("#people",t.$this).SearchPeoplePager(),t.BindSelect()})},t.LoadRowsPage=function(i){n("#people > tbody",t.$this).html(i).ready(function(){t.BindSelect()})},t.AddNew=function(i){return confirm("Are you sure you want to add a new person?")?(t.qs=n("#searchform",t.$this).serialize(),i.target.id!="AddNew"&&(t.qs=t.qs.appendQuery("ExistingFamilyMember="+i.target.id.substring(1))),n.post("/SearchPeople/AddNew",t.qs,function(i){i.err?n.growlUI("error",i.err):(t.Select(t.Target.id,i.PeopleId),t.$this.dialog("close"))}),!1):!1},t.ClearForm=function(){return n("#searchform .clearable").clearFields(),!1},t.DisplaySelect=function(){n("#AddToExisting").attr("checked")?(n(".select",t.$this).hide(),n(".add",t.$this).show()):(n(".add",t.$this).hide(),n(".select",t.$this).show())},t.BindSelect=function(){n(".select",t.$this).click(function(n){t.Select(t.Target.id,n.target.id.substring(1)),t.$this.dialog("close")}),n(".add",t.$this).click(t.AddNew),t.DisplaySelect()},t.$this=n(this[0]),t.qs="",t.entrypoint&&(t.qs=t.qs.appendQuery("entrypoint="+t.entrypoint)),t.origin&&(t.qs=t.qs.appendQuery("origin="+t.origin)),t.multi&&(t.qs=t.qs.appendQuery("select=2")),this.load("/SearchPeople/",t.qs,function(){t.qs=n("#searchform",t.$this).serialize(),n("#people",t.$this).SearchPeoplePager(),t.BindSelect(),n("#AddNew",t.$this).click(t.AddNew),n("#ClearForm",t.$this).click(t.ClearForm),n("#AddToExisting",t.$this).click(t.DisplaySelect),n("a.sortable",t.$this).click(t.SortClicked),n("#Search",t.$this).click(t.SearchClicked)}),this.dialog("open"),this},n.fn.SearchPeoplePager=function(){return this.each(function(){n("#PageSize",t.$this).change(t.SearchClicked),n(".pagination",t.$this).pagination(n("#Count",t.$this).val(),{items_per_page:n("#PageSize",t.$this).val(),num_display_entries:5,num_edge_entries:1,current_page:0,callback:function(i){return n.post("/SearchPeople/Rows/"+i,t.qs,t.LoadRowsPage),!1}}),n("#NumItems",this).text(n("#Count",t.$this).val().addCommas()+" items")})},n.fn.SearchPeopleInit=function(t){var i=n.extend({overlay:{background:"#000",opacity:.8},bgiframe:!0,modal:!0,autoOpen:!1,title:"Search People",closeOnEscape:!0,width:700,height:525,position:"top",close:function(){n(this).empty()}},t||{});return this.each(function(){n(this).dialog(i)})}})(jQuery)