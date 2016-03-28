// With JQuery

//Cookies Functions

function deleteAllCookies() {
	var cookies = $.cookie();
	for(var cookie in cookies) {
  	 	$.removeCookie(cookie, { path: '/' });
	}
}

// End Cookies Functions

//Where referenceNode is the node you want to put newNode after. If referenceNode is the last child within its parent element, that's fine, because referenceNode.nextSibling will be null and insertBefore handles that case by adding to the end of the list.

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addTicksLabels(Slider, min, mean, max) 
{
	
//Add tick marks and labels
	Slider.slider('setattribute', "ticks", [min, mean, max]);
	if(SOMEKINDOFLABEL = "valence") {
		//CASE STATEMENT FOR THE VALENCE OPTIONS TO CHANGE THE LABELS OF
		//MIN = 'Extreme' + negative superlative
		//MAX = 'Extreme' + positive superlative	
	}
	Slider.slider('setattribute', "ticks_labels", [min, mean, max]);
	Slider.slider('setattribute', "ticks_snap_bounds", 10);
	return;
}

var checkSlideConditions = function(newValue,oldValue,initial_Value,pointsBoxID,slideRestriction)
{
	//Should return the value that the slider should become (old value or new value)
	var pointsBox = document.getElementById(pointsBoxID);
	//IS "innterHTML" correct?
	var pointsBoxNum = parseInt(pointsBox.innerHTML);
	//IS "innterHTML" correct?
	var correctValue = newValue;
	
	if ((newValue < initial_Value) && (slideRestriction == "lessThanInit")) {
		//alert the user
		alert("Cannot set below initial choice.");
		//adjusted value
		correctValue = initial_Value;
	}
	else if((newValue > initial_Value) && (slideRestriction == "moreThanInit")) {
		alert("Cannot set above initial choice.");
		//adjusted value
		correctValue = initial_Value;
	}
	if((pointsBoxNum - (correctValue-oldValue)) < 0){
		//alert 
		alert("Partial adjustent");
		return oldValue + pointsBoxNum;
	}
	else{
		return correctValue;
	}
};

function getSliderInit(Slider)
{
	var sliderVal = 0;
	var id = Slider.slider('getAttribute',"id");
	var hasParent = document.getElementById(id).hasAttribute("parent");
	var parentVal = 0;
	var inheritParent = hasParent;
	if (hasParent) { 
		parentVal = $.cookie(document.getElementById(id).getAttribute("parent"));
		if (!parentVal) {
			inheritParent = false;
		}
	}
	
	// The value from THIS slider stored in Cookies (returns null if DNE)
	var storedVal = $.cookie(id);
	//If this slider has been used and saved before a reset, then load its old value
	var min = Slider.slider('getAttribute',"min");
	var max = Slider.slider('getAttribute',"max");
	var mean = (max+min)/2;
	if (storedVal)
	{
		sliderVal = storedVal;
	}
	//Or, load its value from its "parent" class if parent cookie exists
	else if(inheritParent) 
	{
			//console.log("parent= " + document.getElementById(id).getAttribute("parent"));
			sliderVal = parentVal;
	}
	//Otherwise, give it a value averaged between min and max.
	else
	{
		sliderVal = (Slider.slider('getAttribute',"min") + Slider.slider('getAttribute',"max")) / 2  ;
	}
	
	//addTicksLabels(Slider, min,mean,max);
	
	
	return parseFloat(sliderVal);	
}

var makeSlider = function(id,updatedValue)
{
	//the label variable is not being used anymore
	Slider = $("#"+id).slider({
		tooltip: 'always',
		//Below is absolutely correct, but the ticks do not show. Impossible, really.
		ticks: [0, 50, 100],
		ticks_labels: ['0', '50', '100']
		});
		//Give each slider id = element id
	Slider.slider('setAttribute',"id",id);
	
	if ('undefined' === typeof updatedValue) {
        //updatedValue was not passed
		//Get the last part of the page address
		var pageLink = String(location.pathname.split("/").slice(-1));
		pageLink = pageLink.split(".")[0];
		
		//pseudo-enumerated variable to hold the rules for what you can't do when you slide
		//Page 4
		var slideRestrictionOptions = 
		{
			none: "",
			lessThanInit : "lessThanInit",
			moreThanInit : "moreThanInit",
			lessThanOld : "lessThanOld",
			moreThanOld	: "moreThanOld"
		};
		var slideRestriction = slideRestrictionOptions.none;
		switch(pageLink) {
			case "page4":
				slideRestriction = slideRestrictionOptions.lessThanInit;
				break;
			case "page9":
				//note that this restriction only applies to 1 out of 2 sliders compared side by side.
				//slideRestriction = slideRestrictionOptions.moreThanInit;
				break;
			default:
				break;	
		}
		var initial_Val = getSliderInit(Slider);
		Slider.slider('setValue',initial_Val,false);
		
		var pointsBoxNum = document.getElementsByClassName("pointsBox");
		
		if(pointsBoxNum.length){
			var pointsBoxID = null;
			pointsBoxID = pointsBoxNum[0].id;
	
			Slider.on('change', function(slideEvt){
				var cookies = $.cookie();
				for(var cookie in cookies) {
					if( $.cookie("STATUS_UPDATE") != null ){
						return;	
					}
				}
				$.cookie("START" + id,slideEvt.value.oldValue, {expires: 1, path: '/'});
				$.cookie("STATUS_UPDATE",1,{expires: 1, path: '/'});
			});
			
			
			Slider.on('slideStop', function(slideEvt){
				//console.log("slideStop Val: " + slideEvt.value);
				//console.log(Slider.slider('getValue'));
				var newVal = parseInt(slideEvt.value);
				var pointsBox = document.getElementById(pointsBoxID);
				var pointsBoxNum = parseInt(pointsBox.innerHTML);
				var startVal = parseInt($.cookie("START" + id));
				$.removeCookie("START" + id, { path: '/' });
				var correctedValue = parseInt(checkSlideConditions(newVal,startVal,initial_Val,pointsBoxID,slideRestriction));
				pointsBox.innerHTML = pointsBoxNum - (correctedValue-startVal);
				if (correctedValue != newVal) {
					makeSlider(id, correctedValue);	
				}
				$.removeCookie("STATUS_UPDATE", {path: '/' });
			});
		}
    }
	else {
		Slider.slider('setValue',updatedValue,false);
	}
			
	return Slider;
};

function processCookies() {
	var cookies = $.cookie();
	for(var cookie in cookies){
		var cookieID = cookie;
		var cookieValue = $.cookie(cookie);	
	}
	return;
}

function saveSliders()
{
	//Loop through the sliders (identify by class)
	var days = 1;
	var sliderArray = document.getElementsByClassName("classSlider");
	var length = sliderArray.length;
	 //Store all slider values into cookies
	for(i=0;i<length;i++)
	{	
		$.cookie(sliderArray[i].id, $("#" + sliderArray[i].id).slider('getValue'), {expires: days, path: '/'});
	}
	//Save the pointsBox values to cookies as well.
	var pointsBoxArray = document.getElementsByClassName("pointsBox");
	for(i=0;i<pointsBoxArray.length;i++){
		$.cookie(pointsBoxArray[i].id, pointsBoxArray[i].innerHTML, {expires: days, path: '/'});	
	}
	//Continuing pointsBox saving, but with different class name.
	pointsBoxArray = document.getElementsByClassName("doubleSliderPointsBox");
	for (i=0;i<pointsBoxArray.length;i++){
		$.cookie(pointsBoxArray[i].id, pointsBoxArray[i].value, {expires: days, path: '/'});	
	}
}

var resetSlider = function (Slider)
{
	return function (event) {
		var initValue = getSliderInit(Slider);
		var correctedValue = initValue;
		var pointsBoxArray = document.getElementsByClassName("pointsBox");
		
		if(pointsBoxArray.length){
			var startValue = Slider.slider('getValue');
			var pointsBoxID = pointsBoxArray[0].id;
			//Label the name of the slider the id of the pointsBox you want to pair it with
			var sliderPointsBoxName = document.getElementById(id).name;
			//
			if(sliderPointsBoxName != ""){
				pointsBoxID = sliderPointsBoxName;
			}
			var pointsBox = document.getElementById(pointsBoxID);
			var pointsBoxNum = parseInt(pointsBox.innerHTML);
			var correctedValue = parseInt(checkSlideConditions(initValue,startValue,initValue,pointsBoxID,""));
			pointsBox.innerHTML = pointsBoxNum - (correctedValue-startValue);
		}
		$.cookie("STATUS_UPDATE",1,{expires: 1, path: '/'});
		Slider.slider('setValue',correctedValue,false);
		$.removeCookie("STATUS_UPDATE", {path: '/' });
	};
};

function resetAllSliders()
{
	var confirmation = confirm("Are you sure you wish to reset the questionnaire?");
	if(confirmation){
		//Delete all cookies in the domain
		deleteAllCookies();
		
		var pageSliders = document.getElementsByClassName("classSlider");
		
		//for (i=0; i<pageSliders.length; i++)
		//{
		//	var	id = pageSliders[i].id;
		//	var Slider = $("#" + id).slider();
		//	//eraseCookie(id);
		//	Slider.slider('setValue', getSliderInit(Slider));
		//}
		location.reload(); //put true inside function call if it doesn't work.
	}
	else return;
}

function disableSliders() 
{
	var pageSliders = document.getElementsByClassName("classSlider");
	for (i=0; i<pageSliders.length; i++)
	{
		var	id = pageSliders[i].id;
		var Slider = $("#" + id).slider();
		//Disable the slider from adjustment
		Slider.slider("disable");	
	}
}

var validateBoxInput = function(boxValue) 
{
	var intValue = parseInt(boxValue);
	if ((intValue == "") || isNaN(intValue)) {
		return false;	
	}
	return true;
};

function doublePointsBoxChange(evtObject) 
{
	var evt=window.event || evtObject;
 	if (!evt.target) //if event obj doesn't support e.target, presume it does e.srcElement
 	 	evt.target=evt.srcElement //extend obj with custom e.target prop
 	//do something with evt.target, which is cross browser
	var doubleSliderPointsBox = evt.target; //easier naming
	//Validate the text input..only integers and negative sign allowed
	if ((doubleSliderPointsBox.value == "") || (doubleSliderPointsBox.value == 0) || validateBoxInput(doubleSliderPointsBox.value)) {
		var doubleSliderDiv = evt.target.parentNode.parentNode;
		var divSliderArray = doubleSliderDiv.getElementsByClassName("classSlider");
		var pointsBoxInteger = 0;
		if ((doubleSliderPointsBox.value != "") && (doubleSliderPointsBox.value !=0)) {
			pointsBoxInteger = parseInt(doubleSliderPointsBox.value);
		}
		else {
			//In the case of the reset button, need to find the Points Box element in the current div
			doubleSliderDiv = evt.target.parentNode;
			divSliderArray = doubleSliderDiv.getElementsByClassName("classSlider");
			//Now set the pointsBox to "" because of the reset click.
			doubleSliderDiv.getElementsByClassName("doubleSliderPointsBox")[0].value = '';
		}
		var multiplier = -1;
		var sliderSetAmount = 0;
		for (j=0; j<divSliderArray.length; j++) 
		{
			Slider = $("#"+divSliderArray[j].id).slider();
			var sliderStartValue = parseInt(getSliderInit(Slider));
			sliderSetAmount = sliderStartValue;
			//The left slider should decrease with positive numbers, and vice versa.
			sliderSetAmount = sliderSetAmount + (multiplier * pointsBoxInteger);
			Slider.slider('setValue',sliderSetAmount);
			multiplier *= -1;	
		}
	}
	else {
		alert("Please enter only positive or negative integers.");
		evt.target.value = '';
	}
}

var makeDoubleResetButton = function(divElement) 
{
	id = divElement.id;
	var button = document.createElement("BUTTON");
	var text = document.createTextNode("Reset to Initial Value");
	button.appendChild(text);
	button.className = "doubleResetButton";
	button.id = id + button.className;
	$(button).on("click",function(eventObject) {doublePointsBoxChange(eventObject)});
	
	return button;
};

function insertDoubleResetButtons() {
	var doubleSliderDivArray = document.getElementsByClassName("doubleSliderDiv");
	for (i=0;i<doubleSliderDivArray.length;i++) {
		var buttonChild = $(doubleSliderDivArray[i]).append(makeDoubleResetButton(doubleSliderDivArray[i]));
		//var buttonChild = insertAfter(makeDoubleResetButton(doubleSliderDivArray[i]),doubleSliderDivArray[i]);	
	}
}

function replaceResetButtons()
{
	var resetButtons = document.getElementsByClassName("resetButton");
	for(i=0;i<resetButtons.length;i++) {
		resetButtons[i].remove();
	}
}

function disableResetButtons() 
{
	var resetButtons = document.getElementsByClassName("resetButton");
	for(i=0;i<resetButtons.length;i++) {
		resetButtons[i].disabled = true;
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isNumberKey(evt)
{
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
		return false;

  return true;
}

function randomizeSliders()
{
	if ($.cookie("ALREADY_RANDOM") == null) {
		var pageSliders = document.getElementsByClassName("classSlider");
		for (i=0; i<pageSliders.length; i++)
		{
			var	id = pageSliders[i].id;
			var Slider = $("#" + id).slider();
			//not sure if it will make a new slider or if it will let me just use the old slider and its value
			//if this does not work then just make an if clause in the make sliders function
			var sliderVal = Slider.slider('getValue');
			var sliderRange = 0.2 * (parseInt(Slider.slider('getAttribute','max')) - parseInt(Slider.slider('getAttribute','min')));
			//Make it +- by giving it a 50% chance.
			if (Math.random() >= 0.5) {
				sliderRange = -1*sliderRange;	
			}
			//Set the new random value
			$.cookie("STATUS_UPDATE",1,{expires: 1, path: '/'});
			Slider.slider('setValue',sliderVal + sliderRange,false);
			$.removeCookie("STATUS_UPDATE", {path: '/' });
			//Store how much it was randomized.
			//$.cookie(id + "_randomResult",sliderVal);
			
			//In the case of a refresh, or use of the back button, don't have it randomize again
		}
		$.cookie("ALREADY_RANDOM",1,{expires: 1, path: '/'});
	}
	
}

function makeRatingSliders()
{
	//this function will make new sliders where all the elements with class = "ratingSlider"
	var ratingSliders = document.getElementsByClassName("ratingSlider");
	for (i=0; i<ratingSliders.length; i++)
	{
		var id = ratingSliders[i].id;
		Slider = $("#"+id).slider({
		tooltip: 'always',
		});
		//Give each slider id = element id
	Slider.slider('setAttribute',"id",id);	
	}
}

var makeResetButton = function (Slider)
{
	//Create a button that will call getSliderInit when pressed
	id = Slider.slider('getAttribute', "id") ;
	var button = document.createElement("BUTTON");
	var text = document.createTextNode("Reset to Initial Value");
	button.appendChild(text);
	button.className = "resetButton";
	button.id = id + button.className;
	button.setAttribute('style', 'float :right;');
	button.addEventListener("click",resetSlider(Slider),false);
	
	return button;
};

var finalSubmit = function(pageLink,submitID)
{
	return function (event) {
		var confirmation = confirm("Are you sure you wish to submit the questionnaire?");
		if(confirmation) {
			saveInputsLast();
			processCookies();
			deleteAllCookies();
			//Link to the next page
			window.location.href = pageLink;	
		}
	};
};

var agreeToCond = function(pageLink)
{
	return function (event) {
		if(document.getElementById('checkbox').checked){
			window.location.href = pageLink;
			return true;
		}
		else{
			alert("You must agree to the conditions to participate.")
			return false;
		}
	};
	
};

var nextPage = function(pageLink)
{
	return function (event) {
	  	
	  //Save slider values to cookies

	  saveSliders();
	  
	  //Get the page #, don't let them advance if there is a id = 'zeroPointsBox' element, with value != 0 
	  var zeroPointsBox = document.getElementById("zeroPointsBox");
	  if ((zeroPointsBox != null) && (parseInt(zeroPointsBox.innerHTML) != 0)) {
		  alert("Cannot have leftover points");
	  }
	  else {
		  //Link to the next page
		  window.location.href = pageLink;
	  }
	};
};

function nextLinkMake()
{
	//Add the link-event handler for the next button
	//The index of the nextLink = [page # -1] ie. page1 = index 0
	var nextLink = document.getElementsByClassName("nextLink");
	if(nextLink.length)
	{
	  var pageLink = String(location.pathname.split("/").slice(-1));
	  var splitLink = pageLink.split(".");
	  var pageNum = parseInt(pageLink.match(/\d+/)[0]);
	  pageLink = splitLink[0].replace(/\d+/g,'') + String(pageNum + 1) + "." + splitLink[1];
	  for (i=0; i<nextLink.length; i++)
	  {
		//Check to see if this is the submit form type of nextLink creation
		if(nextLink[i].id == "agree_Submit"){
			if(window.addEventListener) {
				nextLink[i].addEventListener('click', agreeToCond(pageLink), false);
			}
			else if (window.attachEvent) {
				nextLink[i],attachEvent('onclick',agreeToCond(pageLink));
			}
		}
		else if(nextLink[i].id == "finalSubmit"){
			if(window.addEventListener) {
				nextLink[i].addEventListener('click', finalSubmit(pageLink,nextLink[i].id), false);
			}
			else if (window.attachEvent) {
				nextLink[i].attachEvent('onclick', finalSubmit(pageLink,nextLink[i].id));
			}
		}
		else{
			if(window.addEventListener) {
				nextLink[i].addEventListener('click', nextPage(pageLink), false);
			}
			else if (window.attachEvent) {
				nextLink[i].attachEvent('onclick',nextPage(pageLink));
			}
		}
	  }
	}	
}

function saveInputsLast() 
{
	var inputElements = document.getElementsByTagName('input');
	var textAreas = document.getElementsByTagName('textarea');
	for(i=0;i<inputElements.length;i++){
		$.cookie(inputElements[i].id,inputElements[i].value, {expires: 1, path: '/'});
	}
	for(i=0;i<textAreas.length;i++){
		$.cookie(textAreas[i].id,textAreas[i].value, {expires: 1, path: '/'});
	}
}

function onPageLoad()
{
	var pageSliders = document.getElementsByClassName("classSlider");
	
	for (i=0; i<pageSliders.length; i++)
	{
		var id = pageSliders[i].id;
		var Slider = makeSlider(id); //,pageSliders[i].id + "Val");
		//Append to the label
		var description = document.getElementById(id + "Descript");
		//description.insertAdjacentHTML('beforeend', '<right>');
		var pageLink = String(location.pathname.split("/").slice(-1));
		pageLink = pageLink.split(".")[0];
		if (pageLink != "page9" && pageLink != "page10") {
			var buttonChild = insertAfter(makeResetButton(Slider),description);
		}
	}
	
	var pointsBoxArray = document.getElementsByClassName("pointsBox");
	for (i=0; i<pointsBoxArray.length; i++)
	{
		var pointsBoxVal = $.cookie(pointsBoxArray[i].id);
		if (pointsBoxVal != null){
			pointsBoxArray[i].innerHTML = pointsBoxVal;
		}
	}
	
	nextLinkMake();
}