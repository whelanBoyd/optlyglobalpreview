//variation rearrange
$(".varButton").on('click', function() {
      var index = $(this).attr('data-index');
      var parent = $(this).parents(".experimentModule");
      window.rents = parent;
      //var curVarSel_1 = $(rents).find(".varSelected_2");
      if (index != $(rents).find(".varSelected_2").attr('data-index')) {
        $(rents).find(".varSelected_1").removeClass('varSelected_1');
        $(rents).find(".varSelected_2").addClass('varSelected_1');
        $(rents).find(".varSelected_2").removeClass('varSelected_2');
        $(rents).find("iframe[data-index='" + index + "']").addClass('varSelected_2');
      } 
    });
	
	
	