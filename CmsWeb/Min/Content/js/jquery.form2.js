(function(n){n.fn.getCheckboxVal=function(){var t=[],i=0;return this.each(function(){t[i++]=n(this).val()}),t},n.fieldValue2=function(n){var o=n.name,i=n.type,f=n.tagName.toLowerCase(),e,r,t,u;if(o&&!n.disabled&&i!="reset"&&i!="button"&&i!="submit"&&i!="image"&&(i!="checkbox"&&i!="radio"||n.checked)&&(f!="select"||n.selectedIndex!=-1)){if(f=="select"){if(e=n.selectedIndex,e<0)return null;for(r=0;r<n.options.length;r++)if(t=n.options[r],t.selected)return u=t.value,u||(u=t.attributes&&t.attributes.value&&!t.attributes.value.specified?t.text:t.value),u}else if(f=="input"&&i=="checkbox"&&!n.value)return n.checked}else return null;return n.value},n.fn.formToArray2=function(){var i={},o,f,u,e,r,t;if(this.length==0||(o=this[0],f=o.elements,!f))return i;for(u=0;u<f.length;u++)(e=f[u],r=e.name,r)&&(t=n.fieldValue2(e),t!==null&&typeof t!="undefined"&&t!=""&&(i[r]||(i[r]=t)));return i},n.fn.formSerialize2=function(){return n.param(this.formToArray2())},n.QueryString=function(t,i){var r={};return n.each(t.split("&"),function(){var n=this.split("=");r[n[0]]=n[1]}),r[i]},n.block=function(){n.blockUI({message:'working on it...<img src="/content/loading.gif"/>'})},n.unblock=function(){n.unblockUI({fadeOut:150})},n.navigate=function(n,t){n+=(n.match(/\?/)?"&":"?")+t,window.location=n}})(jQuery)