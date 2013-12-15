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

var eventHandlerArray = new Array();

//common initialize function
function commonInitialize(){
	//regist keydown event handler
	addEventHandler(document.body, "keydown", processKeyDown);
}

//keydown event handler
function processKeyDown(event){
	var userInput = getKeyCode(event);
	
	//test
	//call testFunction when press 't'
	if(userInput == 84){
		testFunction();
	}

	onUserInput(userInput);
}

//click event handler
function onClickHandler(eventToHandle){
	var activatedObj = getActivatedObject(eventToHandle);
	switch(activatedObj.id){
		case "btn_back" : onUserInput(VK_BACK); break;
		case "btn_exit" : window.NetCastBack(); break; 
		case "btn_red" : onUserInput(VK_RED); break;
		case "btn_green" : onUserInput(VK_GREEN); break;
		case "btn_yellow" : onUserInput(VK_YELLOW); break;
		case "btn_blue" : onUserInput(VK_BLUE); break;
	}
}

//keydown event handler for confirm dialog
function processKeyDownForConfirm(event){
	var userInput = getKeyCode(event);
	if(userInput == 37){selectYes();}
	if(userInput == 39){selectNo();}
	if(userInput == 13){
		if(confirmSelection){confirmYes();}
		else{confirmNo();}
	}
}

//show confirm Div
var confirmSelection = false;
var functionHandleYes = null;
var functionHandleNo = null;
function showConfirmDiv(messageText, handleYes, handleNo){
	//remove current event handlers
	for(var i = 0 ; i < eventHandlerArray.length ; i++){
	removeEventHandler(eventHandlerArray[i][0], eventHandlerArray[i][1], eventHandlerArray[i][2]);
	}
	
	confirmSelection = false;
	functionHandleYes = handleYes;
	functionHandleNo = handleNo;
	
	var dialogBackground = document.createElement("div");
	dialogBackground.id = "dialogBackground";
	dialogBackground.className = "divDialogBackground";
	document.body.appendChild(dialogBackground);
	
	var messageString = document.createElement("div");
	messageString.id = "messageString";
	messageString.className = "confirmMessage";
	setInnerText(messageString, messageText);
	
	var buttonYes = document.createElement("div");
	buttonYes.id = "buttonYes";
	buttonYes.className = "confirmButtonYes whiteBgColor";
	var textNodeYes = document.createTextNode("YES");
	buttonYes.appendChild(textNodeYes);
	
	var buttonNo = document.createElement("div");
	buttonNo.id = "buttonNo";
	buttonNo.className = "confirmButtonNo orangeBgColor";
	var textNodeNo = document.createTextNode("NO");
	buttonNo.appendChild(textNodeNo);
	
	var confirmDialog = document.createElement("div");
	confirmDialog.id = "confirmDialog";
	confirmDialog.className = "divDialog";
	confirmDialog.appendChild(messageString);
	confirmDialog.appendChild(buttonYes);
	confirmDialog.appendChild(buttonNo);
	document.body.appendChild(confirmDialog);
	
	addEventHandlerWithOutSaving(document.body, "keydown", processKeyDownForConfirm);
	addEventHandlerWithOutSaving(buttonYes, "click", confirmYes);
	addEventHandlerWithOutSaving(buttonYes, "mouseover", selectYes);
	addEventHandlerWithOutSaving(buttonNo, "click", confirmNo);
	addEventHandlerWithOutSaving(buttonNo, "mouseover", selectNo);
	
}
function selectYes(){
	confirmSelection = true;
	document.getElementById("buttonYes").className = "confirmButtonYes orangeBgColor";
	document.getElementById("buttonNo").className = "confirmButtonNo whiteBgColor";
}
function selectNo(){
	confirmSelection = false;
	document.getElementById("buttonYes").className = "confirmButtonYes whiteBgColor";
	document.getElementById("buttonNo").className = "confirmButtonNo orangeBgColor";
}
function confirmYes(){
	selectYes();
	hideConfirmDiv();
	if(functionHandleYes){functionHandleYes();}
}
function confirmNo(){
	selectNo();
	hideConfirmDiv();
	if(functionHandleNo){functionHandleNo();}
}
function hideConfirmDiv(){
	removeEventHandler(document.body, "keydown", processKeyDownForConfirm);
	var eventHandlerArrayBackup = eventHandlerArray;
	eventHandlerArray = new Array();
	for(var i = 0 ; i < eventHandlerArrayBackup.length ; i++){
		addEventHandler(eventHandlerArrayBackup[i][0], eventHandlerArrayBackup[i][1], eventHandlerArrayBackup[i][2]);
	}
	document.body.removeChild(dialogBackground);
	document.body.removeChild(confirmDialog);
	window.focus();
}

//back to NetCast portal menu
function backToNetCastPortal(){
	var userAgent = new String(navigator.userAgent);
	var BrowserVer = userAgent.substring( userAgent.search(/LG Browser/) + 11); 
	BrowserVer = BrowserVer.split("(", 1); 
	if(BrowserVer >= "3.0.23") { 
	window.NetCastBack(); 
	}
}

//trim
function trim(str){
	str = str.replace(/(^\s*)|(\s*$)/g,"");
	return str;
}

//write cookie
function writeCookie(cookieName, cookieValue, cookiePath, expireMilliseconds){
	var todayDate = new Date();
	var expireSetting = "";
	if(expireMilliseconds != 0){
	todayDate.setTime(todayDate.getTime() + expireMilliseconds);
	expireSetting = "expires=" + todayDate.toGMTString() + ";";
	}
	var pathSetting = "";
	if(cookiePath != ""){
	pathSetting = "path=" + cookiePath + ";";
	}
	document.cookie = cookieName + "=" + cookieValue + ";" + pathSetting + expireSetting;
}

//read cookie
function readCookie(cookieName){
	var cookieArray = document.cookie.split(";");
	for(var i = 0 ; i < cookieArray.length ; i++){
	var nameAndValue = cookieArray[i].split("=");
	if(trim(nameAndValue[0]) == cookieName && nameAndValue.length == 2){
		return trim(nameAndValue[1]);
	}
	}
	return "";
}

//delete cookie
function deleteCookie(cookieName, cookiePath){
	writeCookie(cookieName, "", cookiePath, -1 * 24 * 60 * 60 * 1000);
}

//get key code according to browser
function getKeyCode(eventToGetKeyCode){
	var keyCodeFromEvent;
	if(window.event){ // IE 
	keyCodeFromEvent = eventToGetKeyCode.keyCode;
	}else if(eventToGetKeyCode.which) { // Netscape/Firefox/Opera
	keyCodeFromEvent = eventToGetKeyCode.which;
	}
	return keyCodeFromEvent;
}

//event-adding function for cross browser
function addEventHandler(obj, eventName, handler){
	//store adding events to use when confirm div is shown
	eventHandlerArray[eventHandlerArray.length] = [obj, eventName, handler];
	addEventHandlerWithOutSaving(obj, eventName, handler);
	
}

//event-adding function for cross browser
function addEventHandlerWithOutSaving(obj, eventName, handler){
	if(document.attachEvent){
		obj.attachEvent("on" + eventName, handler);
	}else if(document.addEventListener){
		obj.addEventListener(eventName, handler, false);
	}
}

//event-removing function for cross browser
function removeEventHandler(obj, eventName, handler){
	if(document.detachEvent){
		obj.detachEvent("on" + eventName, handler);
	}else if(document.removeEventListener){
		obj.removeEventListener(eventName, handler, false);
	}
}

//get active object function for cross browser
function getActivatedObject(e){
	var obj;
	if(!e){
		obj = window.event.srcElement; //old explorer
	}else if(e.srcElement){
		obj = e.srcElement; //ie7 or later
	}else{
		obj = e.target; //dom level 2
	}
	return obj;
}

//set last visit page
var titltUrlSeperator = "NCTS_SEPERATOR";
var lastVisitPageCookieName = "NCTS_LAST_VISIT_PAGE";
function setLastVisitPage(){
	setLastVisitPageManual(window.document.title, window.location.href);
}
function setLastVisitPageManual(pageTitle, pageUrl){
	writeCookie(lastVisitPageCookieName, pageTitle + titltUrlSeperator + pageUrl, "/", 30 * 24 * 60 * 60 * 1000);
}
//get last visit page title
function getLastVisitPageTitle(){
	var lastVisitPageCookie = readCookie(lastVisitPageCookieName);
	if(lastVisitPageCookie != ""){
		return lastVisitPageCookie.split(titltUrlSeperator)[0];
	}else{
		return "";
	}
}
//get last visit page url	
function getLastVisitPageUrl(){
	var lastVisitPageCookie = readCookie(lastVisitPageCookieName);
	if(lastVisitPageCookie != ""){
		return lastVisitPageCookie.split(titltUrlSeperator)[1];
	}else{
		return "";
	}
}

//clear child nodes
function clearChildNodes(nodeToClear){
	for(var i = nodeToClear.childNodes.length; i > 0 ; i--){
	nodeToClear.removeChild(nodeToClear.childNodes[i - 1]);
	}
}

//set inner text
function setInnerText(nodeToSet, textToSet){
	clearChildNodes(nodeToSet);
	//var textArray = textToSet.toString().split("<br>");
	var textArray = textToSet.toString().split(/<br>/i);
	for(i = 0 ; i < textArray.length ; i++){
		if(i > 0){ nodeToSet.appendChild(document.createElement("br")); }
	var newTextNode = document.createTextNode(textArray[i]);
	nodeToSet.appendChild(newTextNode);
	}
}

//set inner text by id
function setInnerTextById(nodeIdToSet, textToSet){
	setInnerText(document.getElementById(nodeIdToSet), textToSet);
	
}

//check whether this is LGE Browser
function isThisLGEBrowser(){
	var userAgentString = new String(navigator.userAgent);
	if (userAgentString != null && userAgentString.search(/LG Browser/) > -1) {
	return true;
	}else{
		return false;
	}
}

//get LGEBrowserVersion
function getLGEBrowserVersion(){
	//return "-1" if this is not LGE Browser
	if(!isThisLGEBrowser()){return "-1";}
	var userAgentString = new String(navigator.userAgent);
	var BrowserVer = userAgentString.substring( userAgentString.search(/LG Browser/) + 11); 
	return BrowserVer.split("(", 1);
}

//test function
function testFunction(){
	//something to test
	alert("test function");
	//var currentDate = new Date();
	//alert(currentDate.getTime());
}
var xmlHttp;
function createXMLHttpRequest() {
	if (window.ActiveXObject) {
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	} 
	else if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	}
}
	
function requestSourceCode() {
	createXMLHttpRequest();
	xmlHttp.onreadystatechange = handleStateChange;
	xmlHttp.open("GET", location.href, true);
	xmlHttp.send(null);
}
	
function handleStateChange() {
	if(xmlHttp.readyState == 4) {
		if(xmlHttp.status == 200) {
			document.getElementById('sourcecode').value = xmlHttp.responseText;
//			alert("The server replied with: " + xmlHttp.responseText);
		}
	}
}

function getBrowserVersion()
{
	var NetCastInfo = navigator.userAgent;
	var strBrowser = "LG Browser/";
	var nIndex = NetCastInfo.search(strBrowser);
	var nBrowserVersion;
	if(nIndex >= 0)
	{
		nBrowserVersion = NetCastInfo.substr(nIndex + strBrowser.length, 1);
		return nBrowserVersion;
	}
	
	return -1;
}

function showCode(){
	var view = document.getElementById("view");
	var sourcecode = document.getElementById("codeview");
	var video = document.getElementById("video");
	var broadcast = document.getElementById("broadcast");
	var testdescription = document.getElementById("testdescription");
	var error_test_description = document.getElementById("error_test_description");
	var keydownuppress_test_description = document.getElementById("keydownuppress_test_description"); 	
	var keyrepeat_test_description = document.getElementById("keyrepeat_test_description");
	var start = document.getElementById("start");

	var tabViewArea = document.getElementById("tabViewArea");
	var tabCodeArea = document.getElementById("tabCodeArea");
	
	if(video){	
		if(video.width <= 400){
			video.width =0;
			video.height= 0;			
		}
	}
	if(broadcast){	
		if(broadcast.width <= 400){
			broadcast.width =0;
			broadcast.height= 0;			
		}
	}

	view.style.visibility = "hidden";
	view.style.width ="0px";
	view.style.height="0px";

	sourcecode.style.visibility = "visible";
	sourcecode.style.width ="100%";
	sourcecode.style.height="100%";
	
	if(testdescription){
		testdescription.style.visibility = "hidden"; 
	}
	if(error_test_description){
		error_test_description.style.visibility="hidden";
	}
	if(keydownuppress_test_description){
		keydownuppress_test_description.style.visibility = "hidden";
	}
	if(keyrepeat_test_description){
		keyrepeat_test_description.style.visibility = "hidden";
	}
	
	if(start){
		start.style.visibility = 'hidden';
	}

	tabViewArea.className = 'UnselectedViewArea';
	tabCodeArea.className = 'SelectedViewArea';	
}

function showView(){
	var view = document.getElementById("view");
	var sourcecode = document.getElementById("codeview");
	var video = document.getElementById("video");
	var broadcast = document.getElementById("broadcast");
	var testdescription = document.getElementById("testdescription");
	var error_test_description = document.getElementById("error_test_description");
	var keydownuppress_test_description = document.getElementById("keydownuppress_test_description"); 	
	var keyrepeat_test_description = document.getElementById("keyrepeat_test_description");
	var start = document.getElementById("start");

	var tabViewArea = document.getElementById("tabViewArea");
	var tabCodeArea = document.getElementById("tabCodeArea");
	
	
	sourcecode.visibility = "hidden";
	sourcecode.width =0;
	sourcecode.height=0;
	
	view.style.visibility = "visible";
	view.style.width ="100%";
	view.style.height="100%";
	
	if(video)
	{
		if(video.width <= 400){
			video.width = 300;
			video.height= 250;
		}
	}
 
 	if(broadcast)
	{
		if(broadcast.width <= 400){
			broadcast.width = 240;
			broadcast.height= 180;
		}
	}
	
	if(testdescription){
		testdescription.style.visibility = "visible"; 
	}
	if(error_test_description){
		error_test_description.style.visibility="visible";
	}
	if(keydownuppress_test_description){
		keydownuppress_test_description.style.visibility = "visible";
	}	
	if(keyrepeat_test_description){
		keyrepeat_test_description.style.visibility = "visible";
	}
	if(start){
		start.style.visibility = 'visible';
	}

	tabViewArea.className = 'SelectedViewArea';
	tabCodeArea.className = 'UnselectedViewArea';
}
