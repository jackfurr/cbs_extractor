var linkTargetFinder = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
		init : function () {
			gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
				if (autoRun) {
					linkTargetFinder.run();
				}
			}, false);
		},

        getCBSUrl : function() {
            var allLinks = content.document.getElementsByTagName("div"),
                foundLinks = 0,
                cbs_url = "";

            for (var i=0, il=allLinks.length; i<il; i++) {
                elm = allLinks[i];
                if (elm.getAttribute("id") == 'flashcontent') {
                    // get the first and only <object> child node
                    var elmChildren = elm.getElementsByTagName("object");
                    if(elmChildren.length == 1) {
                        cbs_url += elmChildren.item(0).getAttribute("data") + '?';
                        var elmParams = elmChildren.item(0).getElementsByTagName("param");
                        for (var p = 0; p < elmParams.length; p++) {
                            if (elmParams.item(p).getAttribute('name') == 'flashvars') {
                                var value = elmParams.item(p).getAttribute('value');
                                var valueArray = value.split('&');
                                for (var a = 0; a < valueArray.length; a++) {
                                    var paramArray = valueArray[a].split('=');
                                    switch(paramArray[0]) {
                                        case 'autoPlayVid':
                                        case 'pid':
                                        case 'partner': {
                                            cbs_url += valueArray[a] + '&';
                                            foundLinks++;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (foundLinks !== 0) {
                // remove the last '&'
                if (cbs_url.charAt(cbs_url.length-1) == '&') {
                    cbs_url = cbs_url.substring(0, cbs_url.length-1);
                }
            }

            return cbs_url;
        },
			
		run : function () {
			var head = content.document.getElementsByTagName("head")[0],
				style = content.document.getElementById("link-target-finder-style");
			
			if (!style) {
				style = content.document.createElement("link");
				style.id = "link-target-finder-style";
				style.type = "text/css";
				style.rel = "stylesheet";
				style.href = "chrome://linktargetfinder/skin/skin.css";
				head.appendChild(style);
			}

		    try {
                var url = this.getCBSUrl();
                if (url == '') {
                    alert("No video found. ");
                }
                else {
                    alert('CBS Video Extractor URL:\r\n\r\n '+url);
                }
            }
            catch (e) {
                alert(e);
            }
		}
	};
}();

window.addEventListener("load", linkTargetFinder.init, false);