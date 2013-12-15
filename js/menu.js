//*****************************************************************************
//	 LCD TV LABORATORY, LG ELECTRONICS INC., SEOUL, KOREA
//	 Copyright(c) 2010 by LG Electronics Inc.
//
//	 All rights reserved. No part of this work may be reproduced, stored in a
//	 retrieval system, or transmitted by any means without prior written
//	 permission of LG Electronics Inc.
//
//	 Following functions are for NetCast Test Suite.
//	 
//*****************************************************************************

var columnCount = 1;
var rowCount = 1;
var currentXIndex = 1;
var currentYIndex = 1;
var currentNumberKeyInput = "";
var menuArray = new Array();
var numberKeyTimer;
var pageID = "";

//set pageID - pageID is used to save latest executed menu as cookie
function setPageID(pageIDToSet){
	pageID = pageIDToSet;
}

//add menu
function addMenu(menuTitle, urlToCall){
	var subArray = new Array(5);
	var menuID = "";
	if(menuArray.length < 9){menuID = "0";}
	menuID += String(menuArray.length + 1);
	subArray[0] = menuID; //menu id
	//subArray[1] = ; //menu X position(will be decided later)
	//subArray[2] = ; //menu Y position(will be decided later)
	subArray[3] = menuTitle; //menu title
	subArray[4] = urlToCall; //url to call
	menuArray.push(subArray);
}


//max row variable and setter
var maxRowNumber = 5;
function setMaxRowNumber(rowNumberToSet){maxRowNumber = rowNumberToSet;}

//max column variable and setter
var maxColumnNumber = 3;
function setMaxColumnNumber(columnNumberToSet){maxColumnNumber = columnNumberToSet;}

//draw menu on page
function drawMenu(){
	//whole menu width in px
	var wholeMenuWidth = 1000;
	var wholeMenuHeight = 300;
	
	//default left and top
 	var defaultLeft = 140;
 	var defaultTop = 200;
	
	//check if menu number is capable of drawing
	if(menuArray.length == 0){
		alert("There is no menu to draw.\nAdd menu before drawing menu.");
		return;
	}
	if(menuArray.length > (maxRowNumber * maxColumnNumber)){
		alert("There is too many menu to draw.\nThe number of menu should be less than " + (maxRowNumber * maxColumnNumber) + ".");
		return;
	}
	
	//estimate how many rows and columns to draw
	columnCount = Math.ceil(menuArray.length / maxRowNumber);
	rowCount = (columnCount < 2) ? menuArray.length : maxRowNumber;
	//estimate each menu height and width in px
	var eachMenuHeight = 61;
	var eachMenuWidth = Math.floor(wholeMenuWidth / columnCount);
	 
	for(var i = 0 ; i < menuArray.length ; i++){
		var xPosition = ((i % columnCount) + 1);
		var yPosition = Math.ceil((i + 1) / columnCount);
		menuArray[i][1] = xPosition;
		menuArray[i][2] = yPosition;
	 	var leftPx = (eachMenuWidth + 4) * (xPosition - 1);
	 	var topPx = (eachMenuHeight + 4) * (yPosition - 1);
	 	var divToAppend = document.createElement("div");
		divToAppend.className = "eachMenuDefault";
		divToAppend.style.left = (defaultLeft + leftPx) + "px";
		divToAppend.style.top = (defaultTop + topPx) + "px";
		divToAppend.style.width = (eachMenuWidth) + "px";
		divToAppend.style.height = (eachMenuHeight) + "px";
		divToAppend.style.lineHeight = (eachMenuHeight) + "px";
		divToAppend.id = menuArray[i][0];
		
		var numSpanToAppend = document.createElement("span");
		numSpanToAppend.id = menuArray[i][0] + "_innerObjNo";
		numSpanToAppend.innerHTML = menuArray[i][0];
		numSpanToAppend.className = "eachMenuNo";
//		numSpanToAppend.style.position = "absolute";
//		numSpanToAppend.style.left = "0px";
		divToAppend.appendChild(numSpanToAppend);
		
		var nameSpanToAppend = document.createElement("span");
		nameSpanToAppend.id = menuArray[i][0] + "_innerObjName";
		nameSpanToAppend.innerHTML = "&nbsp;" + menuArray[i][3];
		nameSpanToAppend.className = "eachMenuName";
		nameSpanToAppend.style.position = "absolute";
//		nameSpanToAppend.style.left = "0px";
		divToAppend.appendChild(nameSpanToAppend);
		
		document.body.appendChild(divToAppend);
		//addEventHandler(spanToAppend, "click", menuClickHandlerForInnerObj);
//		addEventHandler(spanToAppend, "mouseover", menuMouseOverHandlerForInnerObj);
		addEventHandler(divToAppend, "click", menuClickHandler);
//		addEventHandler(divToAppend, "mouseover", menuMouseOverHandler);
	}
	
	//set selected menu
	//if latest executed menu is saved as cookie, set it selected
	var lastestExecutedMenuID = "";
	var isLastestExecutedMenuIDExist = false;
	if(pageID != ""){
		lastestExecutedMenuID = readCookie(pageID);
		for(var i = 0 ; i < menuArray.length ; i++){
			if(lastestExecutedMenuID == menuArray[i][0]){
				isLastestExecutedMenuIDExist = true;
				break;
			}
		}
	}

 	if(isLastestExecutedMenuIDExist){
		setSelectedMenuByID(lastestExecutedMenuID);
	}else{
		setSelectedMenuByXYIndex(1, 1);
	}
	//draw div for number key press
	drawNumberKeyField();
	
	//set menuKeyEvent handler
	addEventHandler(document.body, "keydown", menuKeyEvent);
}

//click event handler for each menu
function menuClickHandler(eventToHandle){
	var activatedObj = getActivatedObject(eventToHandle);
	executeMenu(activatedObj.id);
}

//mouse over event handler for each menu
function menuMouseOverHandler(eventToHandle){
	var activatedObj = getActivatedObject(eventToHandle);
	setSelectedMenuByID(activatedObj.id);
}

//click event handler for inner object
//function menuClickHandlerForInnerObj(eventToHandle){
//	var activatedObj = getActivatedObject(eventToHandle);
//	executeMenu(activatedObj.id.substr(0,2));
//}

//mouse over event handler for inner object
function menuMouseOverHandlerForInnerObj(eventToHandle){
	var activatedObj = getActivatedObject(eventToHandle);
	setSelectedMenuByID(activatedObj.id.substr(0,2));
}

//set selected menu by X, y index
function setSelectedMenuByXYIndex(xIndex, yIndex){
	//check if indicated position is exist
	var isIndicatedPositionExist = false;
	
	if(xIndex > columnCount)
	{
		xIndex = 1;
		yIndex++;
	}
	
	if(xIndex == 0)
	{
		xIndex = columnCount;
		yIndex--;
	}
	
	for(var i = 0 ; i < menuArray.length ; i++){
		if(menuArray[i][1] == xIndex && menuArray[i][2] == yIndex){
			isIndicatedPositionExist = true;
			break;
		}
	}
	//if designated X, Y index is not exist, do nothing.
	if(!isIndicatedPositionExist){
		return;
	}
	//change color and text effect(tag) according to selected or not
	for(var i = 0 ; i < menuArray.length ; i++){
		var objectToModify = document.getElementById(menuArray[i][0]);
		var innerObjectNameToModify = document.getElementById(menuArray[i][0] + "_innerObjName");
		if(menuArray[i][1] == xIndex && menuArray[i][2] == yIndex){
			objectToModify.className = "eachMenuSelected";
			if(innerObjectNameToModify.offsetWidth > objectToModify.offsetWidth){
				objectToModify.removeChild(innerObjectNameToModify);
				var marqueeToAppend = document.createElement("marquee");
				marqueeToAppend.id = menuArray[i][0] + "_innerObjName";
				var attToAdd = document.createAttribute("behavior");
				attToAdd.value = "alternate";
				marqueeToAppend.attributes.setNamedItem(attToAdd);
				marqueeToAppend.innerHTML = "&nbsp;" + menuArray[i][3];
				marqueeToAppend.className = "eachMenuName";
				objectToModify.appendChild(marqueeToAppend);
			}
		}else if(menuArray[i][1] == currentXIndex && menuArray[i][2] == currentYIndex){
			objectToModify.className = "eachMenuDefault";
			if(innerObjectNameToModify.nodeName != "span"){
				objectToModify.removeChild(innerObjectNameToModify);
				var spanToAppend = document.createElement("span");
				spanToAppend.id = menuArray[i][0] + "_innerObjName";
				spanToAppend.innerHTML = "&nbsp;" + menuArray[i][3];
				spanToAppend.className = "eachMenuName";
				objectToModify.appendChild(spanToAppend);
//				addEventHandler(spanToAppend, "mouseover", menuMouseOverHandlerForInnerObj);
			}
 		}
	}
	//change currently selected X, Y index
	currentXIndex = xIndex;
	currentYIndex = yIndex;
}

//set selected by menu ID - if not found, do nothing
function setSelectedMenuByID(menuID){
	for(var i = 0 ; i < menuArray.length ; i++){
		if(menuArray[i][0] == menuID){
			setSelectedMenuByXYIndex(menuArray[i][1], menuArray[i][2]);
			return;
		}
	}
}

//menu-related key event handling
function menuKeyEvent(event){
	var inputKeyCode = getKeyCode(event);
	if((VK_0 <= inputKeyCode) && (VK_9 >= inputKeyCode)){
		numberKeyPress(inputKeyCode - VK_0);
		return;
	}
	switch(inputKeyCode){
		case VK_UP : setSelectedMenuByXYIndex(currentXIndex, currentYIndex - 1);
			break;
		case VK_DOWN : setSelectedMenuByXYIndex(currentXIndex, currentYIndex + 1);
			break;
		case VK_LEFT : setSelectedMenuByXYIndex(currentXIndex - 1, currentYIndex);
			break;
		case VK_RIGHT : setSelectedMenuByXYIndex(currentXIndex + 1, currentYIndex);
			break;
		case VK_ENTER : executeSelectedMenu();
			break;
	}
}

//execute menu
function executeMenu(menuID){
	menuID = String(menuID).substr(0,2);
	//save executing menu
	if(pageID != ""){
		writeCookie(pageID, menuID, "/", (30 * 24 * 60 * 60 * 1000));
	}
	
	for(var i = 0 ; i < menuArray.length ; i++){
		if(menuArray[i][0] == menuID && menuArray[i][4] != ""){
			window.location.replace(menuArray[i][4]);
			return;
		}
	}
}

//execute currently selected menu
function executeSelectedMenu(){
	//check whether there is number key input
	if(currentNumberKeyInput != ""){
		executeNumberKeySelection();
		return;
	}
	
	//find the ID of currently selected menu
	var selectedMenuID = "";
	for(var i = 0 ; i < menuArray.length ; i++){
		if(menuArray[i][1] == currentXIndex && menuArray[i][2] == currentYIndex){
			selectedMenuID = menuArray[i][0];
			break;
		}
	}
	//execute menu
	executeMenu(selectedMenuID);
}

//draw div for number key input
function drawNumberKeyField(){
	var divToAppend = document.createElement("div");
	divToAppend.className = "inputNumberField";
	divToAppend.id = "numberKeyField";
	document.body.appendChild(divToAppend);
}

//process number key press
function numberKeyPress(numberKeyValue){
	//clear timer set by previous key
	clearTimeout(numberKeyTimer);

	if(currentNumberKeyInput.length == 1){
		//if this is second key, add it and execute
		currentNumberKeyInput += numberKeyValue;
		executeNumberKeySelection();
	}else{
		//if this is first key, show it on screen and set timer
		currentNumberKeyInput = "" + numberKeyValue;
		numberKeyTimer = setTimeout(executeNumberKeySelection, 5000);
		setNumberKeyField(currentNumberKeyInput);
	}
}

//set number key input field
function setNumberKeyField(numberKeyFieldValue){
	var numberInputTag = "";
	numberInputTag += "<table width='100%' height='100%' cellpadding='0' cellspacing='0' >";
	numberInputTag += "<tr><td align='center' valign='middle'>";
	numberInputTag += "<font style='font-size:30px; font-family:TiresiasScreenfont;' color='#000000'>" + numberKeyFieldValue + "</font>";
	numberInputTag += "</td></tr></table>";
	var numberKeyFieldDiv = document.getElementById("numberKeyField");
	numberKeyFieldDiv.innerHTML = numberInputTag;
	numberKeyFieldDiv.style.display = "block";
}

//execute menu selected by number key
function executeNumberKeySelection(){
	//clear timer which is set by previous number key
	clearTimeout(numberKeyTimer);
	if(currentNumberKeyInput.length == 1){
		currentNumberKeyInput = "0" + currentNumberKeyInput;
	}
	document.getElementById("numberKeyField").style.display = "none";
	setSelectedMenuByID(currentNumberKeyInput);
	executeMenu(currentNumberKeyInput);
	currentNumberKeyInput = "";
}
