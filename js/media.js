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

var mediaUrlArray = new Array();
//mediaUrlArray[n] = ["media_id", "media_url"];
mediaUrlArray[0] = ["timer.mp4", "../../mediafile/timer.mp4"];
mediaUrlArray[1] = ["cinecanvas-timing.1.dcs", "../../mediafile/cinecanvas-timing.1.dcs"];
mediaUrlArray[2] = ["cinecanvas-timing.2.dcs", "../../mediafile/cinecanvas-timing.2.dcs"];
mediaUrlArray[3] = ["asx_test.asx", "../../mediafile/asx_test.asx"];
mediaUrlArray[4] = ["samplevideo.flv", "../../mediafile/samplevideo.flv"];
mediaUrlArray[5] = ["not_exist.mp4", "../../mediafile/not_exist.mp4"];
mediaUrlArray[6] = ["empty_list.asx", "../../mediafile/empty_list.asx"];
mediaUrlArray[7] = ["pls_test.pls", "../../mediafile/pls_test.pls"];
mediaUrlArray[8] = ["invalid_format.asx", "../../mediafile/invalid_format.asx"];
mediaUrlArray[9] = ["NetCastGeneratorClient.avi", "../../mediafile/NetCastGeneratorClient.avi"];
mediaUrlArray[10] = ["samplevideo", "../../mediafile/samplevideo.wmv"];
mediaUrlArray[11] = ["multi_audio2.wmv", "../../mediafile/multi_audio2.wmv"];
mediaUrlArray[12] = ["danish.xml", "../../mediafile/danish.xml"];
mediaUrlArray[13] = ["smi-timing.1.smi", "../../mediafile/smi-timing.1.smi"];
mediaUrlArray[14] = ["memoryTestImages", "../../mediafile/memorytestimages/"];

function getMediaFileUrl(mediaID){
	var mediaUrlToReturn = "";
	for(var i = 0 ; i < mediaUrlArray.length ; i++){
	//if found, store url
	if(mediaUrlArray[i] == null){
		alert("== getMediaFileUrl(media.js) ==\nmediaUrlArray[" + i + "] is null.\nCheck mediaUrlArray.");
		break;
	}else if(mediaUrlArray[i][0] == mediaID){
		mediaUrlToReturn = mediaUrlArray[i][1];
		break;
	}
	}
	if(mediaUrlToReturn == ""){
		alert("== getMediaFileUrl(media.js) ==\nNo media was found\nID : " + mediaID);
	}
	return mediaUrlToReturn;
}
