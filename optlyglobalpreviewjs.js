
var project_id = "330576466";
var token = "2d8c31acef0031406f5d69ce29d99719:a6c7034b"; 


function OptlyAPI(project_id, token){

	this.project_id = project_id;
	this.token = token;

	this.GET = function(url, callback, options){
		xmlHttp = new XMLHttpRequest()
		if(callback){
			xmlHttp.onreadystatechange = function(){
				if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
					console.log("on ready state change, about to call call back");
					callback(xmlHttp.responseText);
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



	this.getExperiments = function(callback){
		return JSON.parse(this.GET("https://www.optimizelyapis.com/experiment/v1/projects/" + this.project_id +  "/experiments/", callback));
	}


	this.getVariation = function(variation_id){
		return JSON.parse(this.GET("https://www.optimizelyapis.com/experiment/v1/variations/" + variation_id));
	}

	this.getVariationName = function(variation_id){
		return this.getVariation(variation_id)["description"]
	}
}


function templateMachine(){
	this.insertExpModules = function(experiments){
		console.log("starting insert exp modules");
		experiments = JSON.parse(experiments)
	}
}

optly = new OptlyAPI(project_id, token)
doms = new templateMachine()

experiments = optly.getExperiments(doms.insertExpModules)



// for every experiment, create an appropriate experimentModule 


// optly.getVariation(experiments[0]["variation_ids"][0])
// // Get Name
// optly.getVariations(experiments[0]["variation_ids"][0])["description"]