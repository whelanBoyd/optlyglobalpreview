

$(function(){
	var project_id = "657361791";
	var token = "ed8de8610b72bb31c7362a827f761598:f7ba91d4"; 
	window.debug = true;


	function OptlyAPI(project_id, token){

		this.project_id = project_id;
		this.token = token;

		this.GET = function(url, callback, context, options){
			xmlHttp = new XMLHttpRequest()
			if(callback){
				xmlHttp.onreadystatechange = function(){
					if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
						if(debug)
							console.log("on ready state change, about to call call back");
						callback.apply(context, [xmlHttp.responseText]);
					}
				}
			}
			xmlHttp.open( "GET", 
			 			   url,
			 			   false );
			xmlHttp.setRequestHeader("Token" , this.token)	
			xmlHttp.send()
			return xmlHttp.responseText	
		}

		this.getProject = function(){
			return JSON.parse(this.GET("https://www.optimizelyapis.com/experiment/v1/projects/" + this.project_id +  "/"));
		}



		this.getExperiments = function(callback, context){
			experiments = JSON.parse(this.GET("https://www.optimizelyapis.com/experiment/v1/projects/" + this.project_id +  "/experiments/", callback,  context));
			console.log(experiments, experiments.length)
			return	experiments;
		}


		this.getVariation = function(variation_id, callback, context){
			return JSON.parse(this.GET("https://www.optimizelyapis.com/experiment/v1/variations/" + variation_id, callback, context));
		}

		this.getVariationName = function(variation_id){
			return this.getVariation(variation_id)["description"]
		}
	}


	function templateMachine(optly){
		var self = this;
		this.optly = optly;

		this.attrDict = function(object, list_attrs){
			dict = {}
			$.each(list_attrs, function(index, attr){
				dict[attr] = object[attr]
			})
			return dict;
		}

		this.writes = function(domSelector, method, templateSelector, data){
			var templateScript = $(templateSelector).html();  
			var template = Handlebars.compile(templateScript);
			$(domSelector)[method](template(data));
		}

		this.createModules = function(experiments){
			if(debug)
				console.log("starting insert exp modules");
			this.optly.getExperiments(this.createExperimentModules, this);
		}

		this.createExperimentModules = function(experiments){
			var that = this;
			var experiments = JSON.parse(experiments);
			$.each([experiments[0], experiments[1], experiments[2]], function(index, experiment){
				dict = that.attrDict(experiment, ['id', 'description']);	
				console.log("create exp modules: ",that, dict);
				that.writes("#container", 
						   "append", 
						   "#expModuleTemplate", 
						   dict
						  );
				if(debug)	
					console.log("createExperimentModules: passing to insertVariationModules", experiment)
				that.insertVariationModules(experiment);
			})
		}

		this.insertVariationModules = function(experiment){
			var that = this;
			that.variation_ids = experiment['variation_ids']; 

			that.insertVarIds = function(variation){
				variation = JSON.parse(variation)
				// if (that.variations.length == that.variation_ids.length){
				that.writes(".experimentModule[data-exp-id='" + experiment['id'] + "'] .variationTabs", 
							   "append", 
							   "#variationTabsTemplate", 
							   variation
							)
				that.writes(".experimentModule[data-exp-id='" + experiment['id'] + "'] .variationCarousel", 
							   "append", 
							   "#variationCarouselTemplate", 
							   {experiment: experiment, variation: variation}
							)
				$(".experimentModule[data-exp-id='" + experiment['id'] + "'] .variationCarousel iframe:eq(0)").addClass("varSelected_1");
				$(".experimentModule[data-exp-id='" + experiment['id'] + "'] .variationCarousel iframe:eq(1)").addClass("varSelected_2");
			}

			$.each(that.variation_ids, function(index, variation_id){
				optly.getVariation(variation_id, that.insertVarIds, that);
			})
		}
	}

	window.optly = new OptlyAPI(project_id, token)
	window.doms = new templateMachine(optly)
	doms.createModules();







	/* $(".varButton").on('click', function() {
      var index = $(this).attr('data-index');
      var parent = $(this).parents(".experimentModule");
      window.rents = parent;
      $(rents).find(".varSelected_1").removeClass('varSelected_1');
      $(rents).find(".varSelected_2").addClass('varSelected_1');
      $(rents).find(".varSelected_2").removeClass('varSelected_2');
      $(rents).find("iframe[data-index='" + index + "']").addClass('varSelected_2');
    //// var templateScript = $("#expModuleTemplate").html();  
	//// var template = Handlebars.compile(templateScript);
	////  $("#ffcontainer").prepend(template());
	
    }); */
}); 



// curl -H "Token: 2d8c31acef0031406f5d69ce29d99719:a6c7034b" "https://www.optimizelyapis.com/experiment/v1/projects/" + "330576466" +  "/experiments/"
// curl -H "Token: 2d8c31acef0031406f5d69ce29d99719:a6c7034b" "https://www.optimizelyapis.com/experiment/v1/projects/330576466/experiments/"



	// for every experiment, create an appropriate experimentModule 


	// optly.getVariation(experiments[0]["variation_ids"][0])
	// // Get Name
	// optly.getVariations(experiments[0]["variation_ids"][0])["description"]