 /*jshint esversion: 6 */

/*
 These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
 Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/


const Config = {
  also_known_as                  : `${Configalso_known_as}`,
  all_your_bases_are_belong_to_us: `${Configall_your_bases_are_belong_to_us}`,
  mtone_base_uri                 : `${Configmtone_base_uri}`,
  author_tool_domain             : `${Configauthor_tool_domain}`,
  api_key                        : `${Configapi_key}`
};


//onended seems to not work as expected

// If you minimize as the bubble is being built, the text width is messed up and looks awful, very narrow.

//Better way to process video OR disable.  Better = only do the exchange of the link and/or a href entirely but NOT the whole string.

import './css/input.css';
import './css/reply.css';
import './css/says.css';
import './css/setup.css';
import './css/sprites.css';
import './css/typing.css';

import './css/toast/jquery.toast.css';

window.inAvatar = false;

// Start up some global handler for errors to try to make hadron deal with odd errors.
window.addEventListener('error', function (e) {
  var error = e.error;
  console.log(error);
});


import $ from './javascript/jquery3/jquery-3.3.1.js';
window.jQuery = $;
window.$ = $;

import './javascript/modernizr/modernizr-custom.js';
import Artyom from './javascript/artyom/artyom.js';

// Load the storage facade
import {HadronStorage} from './hadron.storage.js';

// Load Avatar support
import {HadronAvatar} from './hadron.avatar.js';
import {HadronActr} from './hadron.actr.js';


// The core class of Hadron
class Hadron {
  constructor(self, target, options) {
      options = typeof(options) !== "undefined" ? options : {};

  		this.name = self;

      this.hadronButton = jQuery(target).first();

      this.hasWebGL              = false;
      this.hasWebGLExtensions    = false;
      this.hasSpeechSynthesis    = false;
      this.hasSpeechRecognition  = false;
      this.hasBatteryAPI         = false;
      this.hasLowBattery         = false;
      this.hasLowBandwidth       = false;

      this.hadronStorage         = new HadronStorage("hadronStorage");

      //  These are internal vars
      this.tokenChecked = false;
      this.botHasSpoken = false;  // This is set to true if the bot is meant to talk first and HAS responded.
      this.token = false;
      this.soundObject = false;
      this.audioUnlocked = false;
      this.replyCount = 0;
      this.relative_path = Config.all_your_bases_are_belong_to_us;
      this.iceBreaker = false;  // this variable holds answer to whether this is the initative bot interaction or not
      this.quarkQueue = false;
      this._convo = false;
      this.standingAnswer = "ice";
      this.prereqsLoaded = false;
      this.fullyLoaded = false;
      this.stopCommand = "stop listening";
      this.userDictation = false;
      this.ttsURIToCall = "";

      this.debugCommands = ["!!caps", "!!state", "!!config", "!!actr", "!!3js"];

      //jQuery controls AND this.hadronButton. These may act oddly because of the wrapping.
      this.container = false;
      this.quarkWrap = false;
      this.quarkTyping = false;
      this.inputText = false;
      this.quark = false;
      this.quarkContent = false;
      this.chrome = false;
      this.conversationArea = false;
      this.collapseButton = false;
      this.isMobile = false;
      this.disableTray = false;
      this.recoObject = false;
      this.returnToReco = false;
      this.suppressedCommand = "";
      this.hideButtonsWhenClicked = true;
      this.isDebug = false;
      this.mediaViewEnabled = false;
      this.mediaOverlay = false;
      this.mediaOverlayContent = false;
      this.mediaOverlayResponse = false;
      this.mediaViewPreservedState = false;
      this.doNotTrack = false;
      this.orderQuarksRunning = false;

      this.firstVolleyPause = 1000; // Wait one second after the first volley, just in case.

      this.doNotTrackText = "I see you have <b>Do Not Track</b> enabled.  This chat respects your request but we can't vouch for the site it is on.";

      // Controlled by data parameters. Double check readme names, defaults, etc.
      this.animationTime      = this.getControlData("bot-animation-speed", 10); // 0, 150 how long it takes to animate chat quarks, also set in CSS
      this.delayBetweenBubbles= this.getControlData("bot-bubble-delay", 10); //100, 250
      this.typeSpeed          = this.getControlData("bot-type-speed", 5); // 1, 10 delay per character, to simulate the machine "typing"
      this.botAMAText         = this.getControlData("bot-placeholder", "Ask me anything...");
      this.botWelcomeText     = this.getControlData("bot-welcome", "Say Hello or Hi to start chatting");
      this.rootFlowUUID       = this.getControlData("bot-user-data", "");
      this.chromeless         = this.getControlData("bot-without-chrome", false, "bool");
      this.botAutoOpens       = this.getControlData("bot-auto-opens", false, "bool");
      this.MTOneBaseUrl       = this.getControlData("bot-mtone-uri", Config.mtone_base_uri);
      this.botUserData        = this.getControlData("bot-user-data-json", "");

      this.botsFirstMessage   = this.getControlData("bot-first-message", "hi");
      this.botTalksFirst      = this.getControlData("bot-talks-first", false, "bool");

      this.botResetOnLoad     = this.getControlData("bot-reset-on-load", false, "bool");
      this.botResetClearsToken= this.getControlData("bot-reset-clears-token", true, "bool");

      this.ttsVisible         = this.getControlData("bot-tts-visible", true, "bool");
      this.ttsEnabled         = this.getControlData("bot-tts-enabled", false, "bool");

      this.recoVisible        = this.getControlData("bot-voice-recognition-visible", true, "bool");
      this.recoEnabled        = this.getControlData("bot-voice-recognition-enabled", false, "bool");
      this.recoContinuous     = this.getControlData("bot-voice-recognition-continuous", false, "bool");

      this.use3DAvatar        = this.getControlData("bot-uses-3d-avatar", false, "bool");
      this.use3DTextPanel     = this.getControlData("bot-uses-3d-text-panel", true, "bool");

      this.hideInput          = this.getControlData("bot-hide-input", false, "bool");
      this.botId              = this.getControlData("bot-id", Config.api_key);
      this.widerBy            = this.getControlData("bot-wider-by", 32); // add a little extra width to quarks to make sure they don't break
      this.sidePadding        = this.getControlData("bot-side-padding", 6); // padding on both sides of chat quarks
      this.recallInteractions = this.getControlData("bot-recall-interactions", 0); // number of interactions to be remembered and brought back upon restart
      this.buttonClass        = this.getControlData("bot-button-class", "botanic-button");
      this.botSaysClass       = this.getControlData("bot-button-class", "botanic-green");
      this.botReplyClass      = this.getControlData("bot-reply-class", "botanic-silver");
      this.showDebug          = this.getControlData("bot-show-debug", false, "bool");
      this.useFlowText        = this.getControlData("bot-use-flow-text", false, "bool");
      this.botIcon            = this.getControlData("bot-icon", ""); // this.relative_path + "css/images/hadron-48.png");
      this.showSentiment      = this.getControlData("bot-show-sentiment", false, "bool");
      this.isSecure           = this.getControlData("bot-is-secure", false, "bool");

      this.hijackRefresh      = this.getControlData("bot-refresh-uri", "");
      this.showRefresh        = this.getControlData("bot-show-refresh", true, "bool");
      this.useLocalTTS        = this.getControlData("bot-local-tts", false, "bool");
      this.sizeClass          = this.getControlData("bot-size-class",   "standard");
      this.togglePulses       = this.getControlData("bot-toggle-pulses", true, "bool");
      this.toggleClass        = this.getControlData("bot-toggle-class", "botanic-green");
      this.toggleVisible      = this.getControlData("bot-toggle-visible", true, "bool");
      this.toggleIcon         = this.getControlData("bot-toggle-icon", "chat_bubble_outline");
      this.botTitle           = this.getControlData("bot-title", "Powered by Botanic");
      this.botSubTitle        = this.getControlData("bot-subtitle", "Powered by Botanic Technologies");
      this.closeClass         = this.getControlData("bot-close-class", "transparent");
      this.refreshClass       = this.getControlData("bot-refresh-class", "transparent");
      this.closeIcon          = this.getControlData("bot-close-icon", "expand_more");
      this.fullscreen         = this.getControlData("bot-fullscreen", false, "bool");
      this.startFullscreen    = this.getControlData("bot-start-fullscreen", false, "bool");

      this.botHandler         = this.getControlData("bot-handler", "text");

      this.externalCSS        = this.getControlData("bot-external-css", "");
      this.externalFont       = this.getControlData("bot-load-font", "");

      this.storageAvailable   = true;
      this.interactionsLS     = "chat-quark-interactions";
      this.flowOrNative       = (this.rootFlowUUID != "") ? this.rootFlowUUID : 'native';
      this.tokenLS            = "chat-quark-token-" + this.flowOrNative + "-" + this.botId + "-" + Config.also_known_as;

      if (this.recallInteractions != 0) {
        this.consoleLog('recallInteractions: ' + this.recallInteractions);

        this.interactionsHistory = (this.storageAvailable && JSON.parse(inControl.hadronStorage.getItem(this.interactionsLS))) || [];
      } else {
        this.interactionsHistory = {};
      }

      this.sentimentToIcoName  = [ 'sentiment_very_dissatisfied', 'sentiment_very_dissatisfied', 'sentiment_dissatisfied', 'sentiment_dissatisfied', 'sentiment_dissatisfied', 'sentiment_neutral', 'sentiment_satisfied', 'sentiment_satisfied', 'sentiment_satisfied', 'sentiment_very_satisfied', 'sentiment_very_satisfied'];

      this.twoTitles          = false;

      if (navigator.doNotTrack != 0) {
        //this.doNotTrack = true;
        this.doNotTrack = false; // Disable for now
      }

      if (this.botTitle != "" & this.botSubTitle != "") {
        this.twoTitles = true;
      }

      if (this.botIcon == "" && this.isDebug == true) {
        this.botIcon = Config.all_your_bases_are_belong_to_us + "css/images/" + Config.also_known_as + ".png";
      }

      // Make sure to create or use or update the JSON structure.
      if (this.botUserData == "") {
        this.botUserData = '{"botAuthorsToolDomain": "' + Config.author_tool_domain + '"}';
      }

      var bud = JSON.parse(this.botUserData);

      if (this.isUndefined(bud.botAuthorsToolDomain)) {
        bud.botAuthorsToolDomain = Config.author_tool_domain;
      }

      this.botUserData = JSON.stringify(bud);

      this.testToken(() => {
      //  this.consoleLog('Token: ' + this.token);
      });

      //this.consoleLog('Config: ');
      //this.consoleLog(Config);

      this.checkDeviceCapabilites();
      this.priorityInitialization();
      this.loadPrerequsites();
  	}

    // Check & flag what exists and if we need to monitor resources.
    checkDeviceCapabilites() {
      this.hasWebGL              = Modernizr.webgl;
      this.hasWebGLExtensions    = Modernizr.webglextensions;
      this.hasSpeechSynthesis    = Modernizr.speechsynthesis;
      this.hasSpeechRecognition  = Modernizr.speechrecognition;
      this.hasBatteryAPI         = Modernizr.batteryapi;
      this.hasLowBattery         = Modernizr.lowbattery;
      this.hasLowBandwidth       = Modernizr.lowbandwidth;
    }

    // Convert bool to yes/no
    boolToString(boolValue) {
      return (boolValue) ? "YES" : "NO";
    }

    // Just for debugging.
    showConfigState() {
      this.consoleLog("TTS Visible: "     + this.ttsVisible);
      this.consoleLog("TTS Enabled: "     + this.ttsEnabled);

      this.consoleLog("Reco Visible: "    + this.recoVisible);
      this.consoleLog("Reco Enabled: "    + this.recoEnabled);
      this.consoleLog("Reco Continuous: " + this.recoContinuous);
    }

    // This gets the process started based on the config values.
    runControl() {
      this.initializeChatWindow();
    }

    // Do some pre-run tests.
    //JEM honor the caps reported during startup, disable functionality or hide if not allowed.
    priorityInitialization() {
      // If the server isn't secure, don't bother enabling voice reco because it won't work.
      if (this.isSecure == false) {
        this.recoVisible = false;
        this.ttsVisible = false;
      }

      if (this.hasSpeechSynthesis == false) {
        this.ttsVisible = false;
      }

      if (this.hasSpeechRecognition == false) {
        this.recoVisible = false;
      }

      // Mobile devices require local TTS for now.
      if (this.isMobile == true) {
        this.useLocalTTS = true;
      }
    }

    // Reads data elements from a control, applies a format and tests.
    getControlData(field, defaultValue = false, dataType = "string") {
      var foundData = this.hadronButton.data(field);

      foundData = this.urldecode(foundData);

      if (this.isUndefined(foundData)) {
        foundData = defaultValue;
      }

      if (dataType == "bool") {
        foundData = this.checkBoolean(foundData);
      }

      return foundData;
    }

    // Clean up strings
    urldecode(str) {
      if (typeof str != "string") {
        return str;
      }

      return decodeURIComponent(str.replace(/\+/g, ' '));
    }

    // Test for undefined and return true/false
    isUndefined(value) {
      if (value == "undefined") {
        return true;
      }

      if (typeof(value) == "undefined") {
        return true;
      }

      return false;
    }

    // Map text, etc to true false response.
    checkBoolean(boolValue) {
      if(typeof(boolValue) === "boolean"){
        return boolValue;
      }

      if (boolValue) {
        var str = boolValue.toLowerCase().trim();
        if(str === "true" || str === "yes" || str === "1"){
          return true;
        }
      } return false;
    }

    // style everything
    appendCSS(file) {
      var link = $('<link>', {href: file, type: 'text/css', rel: "stylesheet", media:"screen,print"});
      $('head').append(link);
    }

    // include any JS that may be needed
    appendJS(file) {
      var script = $('<script>', {src: file, type: "text/javascript"});
      $('head').append(script);
    }

    // dynamically load a webfont.
    appendFont(font) {
      var link = $('<link>', {href: "https://fonts.googleapis.com/css?family=" + font, rel: "stylesheet"});
      $('head').append(link);
    }

    // load icon fonts for use by materialize
    appendIcon(icon) {
      var link = $('<link>', {href: "https://fonts.googleapis.com/icon?family=" + icon, rel: "stylesheet"});
      $('head').append(link);
    }

    // Just a wrapper to allow enhanced versions of decode uri.
    decodeURI(uri) {
      var cleanURI = decodeURI(uri);
      cleanURI = cleanURI.replace(/\\/g,"");

      return cleanURI;
    }

    // Strip http or https.  This caused problems so it just does decode URI to clean stuff up.
    removeProtocol(url) {
      url = this.decodeURI(url);

      //var urlNoProtocol = url.replace(/^https?\:/i, "");

      return url;
    }


    // Custom stylesheet from user.
    getStylesheet() {
      if (this.externalCSS != "") {
        if (this.externalCSS.indexOf('https://') === 0) {
          this.appendCSS(this.externalCSS);
        } else {
          this.consoleLog("Ignored user stylesheet, did not begin with https://");
        }
      }
    }

    // Load any CSS, etc that the control needs.
    loadPrerequsites() {
      if (this.prereqsLoaded == true) {
        return;
      }

      this.getStylesheet();

      this.appendIcon("Material+Icons");
      this.appendFont("Lato:400,700");
      this.appendFont("Indie+Flower");

      if (this.externalFont != "") {
        this.appendFont(this.externalFont);
      }

      this.prereqsLoaded = true;
    }

    // The core initializer for the chat
    initializeChatWindow() {
      if (this.hadronButton) {
        this.hadronButton.hide();

        var deviceHint = "quark-desktop";

        // Insert wrapper
        if (this.chromeless == false) {
          var sizeClass = deviceHint + " ";
          if (this.fullscreen == true) {
            sizeClass = "quark-full-screen";
          }

          this.chrome = $('<div>', {class: 'quark-content-overlay quark-toggle-open ' + sizeClass + ' quark_chat_' + this.sizeClass});
          var header = $('<div>', {class: 'quark-content-overlay-header'});

          var header_text = "";

          if (this.twoTitles == true) {
            var titleText    = $('<div>', {class: 'quark-content-overlay-header-text-2', text: this.botTitle});
            var subtitleText = $('<div>', {class: 'quark-content-overlay-header-subtext', text: this.botSubTitle});
            header_text = $('<div>', {class: 'quark-content-overlay-header-wrapper'}).append(titleText).append(subtitleText);
            //header_text = "<div>" + titleText.html() +  subtitleText.html() + "</div>";
          } else {
            header_text = $('<div>', {class: 'quark-content-overlay-header-text-1', text: this.botTitle});
          }

          var dashicons = $('<span>', {class: 'quark-dashicons quark-dashicons-no-alt'});

          if (this.showRefresh == true) {
            dashicons.append('<a id="hadron-refresh" title="" class="btn-floating hadron-refresh hadron-toggle-2 ' + this.refreshClass + ' hadron-toggle"><i class="material-icons">refresh</i></a>');
          }

          dashicons.append('<a id="hadron-toggle-2" title="Close" class="btn-floating hadron-toggle-2 ' + this.closeClass + ' hadron-toggle"><i class="material-icons">' + this.closeIcon + '</i></a>');

          var contentOverlay = $('<div>', {class: 'quark-content-overlay-container'});
          this.conversationArea = $('<div>', {id: 'quark-conversation-area'});

          contentOverlay.append(this.conversationArea);

          if (this.botIcon != "") {
            var botIcon = $('<img>', {src: this.botIcon, class: "quark-bot-icon"});
            var botSpan = $('<span>').css('float', 'left');
            botSpan.append(botIcon);
            header.append(botSpan);
          }

          header.append(dashicons);
          header.append(header_text);

          this.chrome.append(header);
          this.chrome.append(contentOverlay);

          this.container = $('<div>', {id: 'hadron-chat', class: 'quark-container'});
        } else {
          this.container = $('<div>', {id: 'hadron-chat', class: 'quark-container quark-container-chromeless ' + deviceHint});
        }

        if (this.chrome != false) {
          this.conversationArea.append(this.container);
          this.hadronButton.after(this.chrome);

          this.collapseButton = $("#hadron-toggle-2");
          this.collapseButton.click(() => {
            parent.postMessage("MinimizeIframe", "*");
          });

          if (this.showRefresh == true) {
            $("#hadron-refresh").click(() => {
              if (inControl.hijackRefresh == "") {
                inControl.refreshContol(true);
              } else {
                top.window.location.href = inControl.hijackRefresh;
              }
            });
          }
        } else {
          this.hadronButton.after(this.container);
        }

        // set up the stage
        this.quarkWrap = $('<div>', {class: 'quark-wrap'});
        this.container.append(this.quarkWrap);

        // init typing quark
        this.quarkTyping = $('<div>', {class: 'quark-typing imagine'});
        for (var dots = 0; dots < 3; dots++) {
          var dot = $('<div>', {class: "dot_" + dots + " dot"});
          this.quarkTyping.append(dot);
        }

        this.quarkWrap.append(this.quarkTyping);

        if (this.hideInput == false) {
          this.typeInput();
          this.textAreaEnabled(false);
        }

        if (this.chrome != false) {
          this.chrome.css({ opacity: 1.0 });
          this.chrome.fadeTo(0.25, 1.0);
        }

        this.fullyLoaded = true;

        // This may be a bad idea. This isn't firing, it isn't correct JEM
        //$(this.quarkWrap).on( "DOMMouseScroll", function( event ) {
          //event.preventDefault();
        //  event.stopPropagation();
        //  inControl.consoleLog('gulp DOMMouseScroll');
        //});

        // This changes nothing at all so far... Wasted effort
        //$(document).on( "mousewheel", function( event ) {
          //event.preventDefault();
        //  event.stopPropagation();
        //  inControl.consoleLog('gulp mousewheel');
        //});


        this.mediaView(this.mediaViewEnabled);

        this.refreshContol(false);

        // recall previous interactions
        if (this.recallInteractions != 0) {
          var messages = [];
          var buttons = [];
          var messageObject;
          for (var i = 0; i < this.interactionsHistory.length; i++) {
            messageObject = { message: this.interactionsHistory[i].say, unadorned: false};
            messages.push(messageObject);
          }
          // This isn't quite right.  It doesn't align properly and should be made a different color so you can tell it's older text.
          var conv = { ice: { says: messages, reply: buttons.reverse() } };
          this.talk(conv);
        }
      }
    }

    // Tests the token to ensure it is still valid.
    testToken(callback) {
      if (this.isUndefined(inControl)) {
        inControl = this;
      }

      if (inControl.tokenChecked == true) {
        callback();
        return;
      }

      inControl.tokenChecked = true;

      inControl.token = this.tokenRead();

      if (inControl.token == "") {
        callback();

        return;
      }

      var uri = inControl.MTOneBaseUrl + "auth/gndn/?token=" + inControl.token;

      $.ajax({url: uri,
          type: 'get',
          dataType: 'JSON',
          context: this,
          success: function(result){
            if (result.response.information.code  <= 202) {
              callback();
            } else {
              inControl.tokenSave("");
              callback();
            }
          }
      });
    }

    refreshContolInner(userRequested) {
      this.textAreaEnabled(false);

      if (this.botTalksFirst == true) {
        setTimeout(() => {
          var responseText;

          if (userRequested == true || this.botResetOnLoad == true) {
            if (this.botResetClearsToken) {
              inControl.clearToken();
            }

            responseText = this.callMTOne("solongfarewellaufwiedersehen", function(botSaid, cards) {
              setTimeout(() => {
                inControl.textAreaEnabled(true); //JEMHERE
              }, inControl.firstVolleyPause);
            });
         } else {
           responseText = this.callMTOne(this.botsFirstMessage, function(botSaid, cards) {
             setTimeout(() => {
               inControl.textAreaEnabled(true); //JEMHERE
             }, inControl.firstVolleyPause);
           });
         }
       }, 1);
      } else {
        setTimeout(() => {
          if (userRequested == true || this.botResetOnLoad == true) {
            if (this.botResetClearsToken) {
              inControl.clearToken();
            }

            var responseText = this.callMTOne("solongfarewellaufwiedersehen", function(botSaid, cards) {
              //inControl.talk(false);
              setTimeout(() => {
                inControl.textAreaEnabled(true); //JEMHERE
              }, inControl.firstVolleyPause);
            });
          } else {
            inControl.talk(false);
            setTimeout(() => {
              inControl.textAreaEnabled(true); //JEMHERE
            }, inControl.firstVolleyPause);
          }
        }, 100);
      }
    }

    // Reloads the control. Respects botTalksFirst flag
    refreshContol(userRequested) {
      this.mediaView(false);

      inControl.quarkWrap.html('');
      inControl.quarkWrap.append(this.quarkTyping);

      inControl.testToken(() => {
        var animationDelay = this.animationTime * this.typeSpeed;
        if (inControl.doNotTrack) {
          var convo = { ice: { says: [inControl.doNotTrackText], reply: [] } };
          inControl.talk(convo);

          setTimeout(() => {
            inControl.refreshContolInner(userRequested);
          }, animationDelay);
        } else {
          inControl.refreshContolInner(userRequested);
        }
      });
    }

    // Toggle logging to clean up output
    consoleLog(text) {
      if (this.showDebug == true) {
        console.log(text);
      }
    }

    // prepare next save point
    interactionsSave(say, reply) {
      if (this.storageAvailable == false) {
        return;
      }

      if (this.recallInteractions == 0) {
        return;
      }

      // do not memorize buttons; only user input gets memorized:
      if (say.includes("quark-button") && reply !== "reply reply-freeform" && reply !== "reply reply-pick") {
        return;
      }

      // Don't save a welcome message.
      if (say.includes(this.botWelcomeText)) {
        return;
      }

      // limit number of saves
      if (this.interactionsHistory.length >= this.recallInteractions) {
        this.interactionsHistory.shift(); // removes the oldest (first) save to make space
      }

      // save to memory
      this.interactionsHistory.push({ say: say, reply: reply });
      //this.botWelcomeText
      this.consoleLog("-----HISTORYSAVE-----");
      this.consoleLog(say);
      this.consoleLog(reply);
      this.consoleLog(this.interactionsHistory);
    }

    // commit save to localStorage
    interactionsSaveCommit() {
      if (this.storageAvailable == false) {
        return;
      }

      if (this.recallInteractions == 0) {
        return;
      }

      inControl.hadronStorage.setItem(this.interactionsLS, JSON.stringify(this.interactionsHistory));

      this.consoleLog("-----HISTORYSAVECOMMIT-----");
      this.consoleLog(this.interactionsHistory);
    }

    // read token from local storage
    tokenRead() {
      if (this.storageAvailable == false) {
        return "";
      } else {
        var token = inControl.hadronStorage.getItem(this.tokenLS) || "";

        console.log("tokenRead: " + token);

        if (token == "undefined") {
          token = "";
        }

        if (this.isUndefined(token)) {
          return "";
        } else {
          return token;
        }
      }
    }

    // save the token to local storage
    tokenSave(token) {
      console.log("tokenSave: " + token);

      inControl.token = token;

      if (this.storageAvailable == false) {
        return;
      } else {
        inControl.hadronStorage.setItem(this.tokenLS, token);
      }
    }


    // Empty out the token, need to make sure the empty value matches what we expect.  Empty quotes should be OK.
    clearToken() {
      console.log('clearToken:');
      console.log('original token:' + this.token);
      this.tokenChecked = false;
      this.tokenSave("");
    }


    // Sets the state of the text input.  This prevents user entry if Hadron is not ready.
    textAreaEnabled(state) {
      if (state == true) {
        setTimeout(() => {
          this.inputText.prop('disabled', false);
          this.inputText.removeClass('noinput');
          //this.inputText.val('');
          this.inputText.focus();
        }, 1);
      } else {
        this.inputText.prop('disabled', true);
        this.inputText.addClass('noinput');
        //this.inputText.val('');
      }
    }

    // Creates and handles user input.
    typeInput() {
      var recoIcon;
      var imageClass;

      var inputWrap = $('<div>', {class: 'input-wrap'});
      this.inputText = $('<textarea>', {placeholder: this.botAMAText});

      if (this.disableTray == false) {
        var recoContainer = $('<div>', {class: 'quark-reco-container'});

        if (this.recoVisible) {
          if (this.recoEnabled) {
            imageClass = 'quark-reco-button-on';

            inControl.showToast('I\'m listening.');

            // Start reco.
            this.startReco(true);
          } else {
            imageClass = 'quark-reco-button-off';
          }
        } else {
          imageClass = 'quark-reco-button-disabled quark-button-hidden';
        }

        recoIcon = $('<img>', {id: 'quark-reco-icon', class: imageClass, src: 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=='});
        recoIcon.click(function() {
          if (inControl.recoVisible) {
            if ($(this).hasClass('quark-reco-button-on')) {
              // A click absolutely disables reco.
              inControl.returnToReco = false;

              inControl.stopReco();
            } else {
              inControl.startReco(true);
            }
          }

          inControl.inputText.focus();
        });

        recoContainer.append(recoIcon);
        inputWrap.append(recoContainer);

        var ttsContainer = $('<div>', {class: 'quark-tts-container'});

        if (this.ttsVisible) {
          if (this.ttsEnabled) {
            imageClass = 'quark-tts-button-on';
          } else {
            imageClass = 'quark-tts-button-off';
          }
        } else {
          imageClass = 'quark-tts-button-disabled quark-button-hidden';
        }

        this.ttsIcon = $('<img>', {class: imageClass, src: 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=='});

        this.ttsIcon.click(() => {
          if (inControl.soundObject) {
            inControl.soundObject.muted = false;
          } else {
            inControl.playAudio(Config.all_your_bases_are_belong_to_us + '500-milliseconds-of-silence.mp3');
          }

          inControl.context.resume().then(() => {
            console.log('Playback resumed successfully');
          });

          if (inControl.ttsVisible) {
            inControl.changeTTSState(!this.ttsEnabled);
          }

          inControl.inputText.focus();
        });

        ttsContainer.append(this.ttsIcon);

        if (this.recoVisible == false) {
          recoContainer.css('display', 'none');
        }

        inputWrap.append(ttsContainer);
      }

      inputWrap.append(this.inputText);

      //JEM refactor
      this.inputText.keypress((e) => {
        // Discard the CR/done if the bubbles are running.
        if (this.orderQuarksRunning && e.keyCode == 13) {
          e.preventDefault();
          return;
        }

        if (e.keyCode == 13) {
          e.preventDefault();

          var userSaid = this.inputText.val();

          if (this.isStopListeningCommand(userSaid)) {
            return;
          }

          // allow user to interrupt the bot
          if (typeof(this.quarkQueue) !== false)  {
            clearTimeout(this.quarkQueue);
          }

          var lastQuark = $(".quark.say");
          lastQuark = lastQuark[lastQuark.length - 1];
          if ($(lastQuark).hasClass("reply") && !$(lastQuark).hasClass("reply-freeform")) {
            $(lastQuark).addClass("quark-hidden");
          }

          var styledUserInput = this.inputText.val();
          var sentimentPlaceholder = "";

          if (this.showSentiment) {
            sentimentPlaceholder = '<span class="quark-sentiment-placeholder">&nbsp;</span>';
          }

          if (inControl.hideButtonsWhenClicked) {
            $('.quark-button-wrap').hide();
          }

          this.addQuark(
            sentimentPlaceholder + '<span class="quark-user-input quark-pick right-align ' + this.botSaysClass + '">' + styledUserInput + "</span>",
            function() {},
            "reply reply-freeform"
          );

          if (this.isCommand(userSaid) == true) {
            this.inputText.val("");
            return;
          }

          this.avatarState('acknowledge');

          // call MTOne after a slight delay.  MTOne can answer so quickly that it breaks behavior.
          // var userSaid = this.inputText.val();
          setTimeout(() => {
            var responseText = this.callMTOne(userSaid, function(botSaid, cards) {

            });
          }, 50);

          this.inputText.val("");
        }
      });

      if (this.chrome != false) {
        this.conversationArea.after(inputWrap);
      } else {
        this.container.append(inputWrap);
      }

      this.inputText.focus();
  }

  avatarState(state) {
    if (window.inAvatar) {
      window.inAvatar.avatarState(state);
    }
  }


  changeTTSState(state) {
    inControl.inputText.focus();

    if (inControl.ttsVisible) {
      inControl.ttsEnabled = state;

      if (state == false) {
        inControl.ttsIcon.addClass('quark-tts-button-off');
        inControl.ttsIcon.removeClass('quark-tts-button-on');

        inControl.pauseAudio();
      } else {
        inControl.ttsIcon.addClass('quark-tts-button-on');
        inControl.ttsIcon.removeClass('quark-tts-button-off');
      }

      inControl.ttsIcon.hide().show(0);
    }
  }


  // Is the input a hadron command?
  isCommand(userSaid) {
    var param = '';
    var ci = -1;
    var length = this.debugCommands.length;
    while(length--) {
      if (userSaid.indexOf(this.debugCommands[length]) != -1) {
        ci = length;
        var foundCommand = this.debugCommands[length];
        param = userSaid.replace(foundCommand, '').trim();
        userSaid = foundCommand;
        break;
      }
    }

    var msg;
    var convo;

    if (ci == -1) {
      return false;
    } else {
      if (userSaid == '!!caps') {
        msg = [];
        msg.push('Device Capabilities');
        msg.push('WebGL: ' + this.boolToString(this.hasWebGL));
        msg.push('WebGL Extensions: ' + this.boolToString(this.hasWebGLExtensions));
        msg.push('Speech Synthesis: ' + this.boolToString(this.hasSpeechSynthesis));
        msg.push('Speech Recognition: ' + this.boolToString(this.hasSpeechRecognition));
        msg.push('Battery API: ' + this.boolToString(this.hasBatteryAPI));
        msg.push('Low Battery: ' + this.boolToString(this.hasLowBattery));
        msg.push('Low Bandwidth: ' + this.boolToString(this.hasLowBandwidth));

        convo = { ice: { says: msg, reply: [] } };

        setTimeout(() => {
          this.talk(convo);
        }, 1000);

        return true;
      } else if (userSaid == "!!state") {
        msg = [];
        msg.push('Hadron State');
        msg.push('TTS Visible: ' + this.boolToString(this.ttsVisible));
        msg.push('TTS Enabled: ' + this.boolToString(this.ttsEnabled));
        msg.push('Reco Visible: ' + this.boolToString(this.recoVisible));
        msg.push('Reco Enabled: ' + this.boolToString(this.recoEnabled));
        msg.push('Reco Continuous: ' + this.boolToString(this.recoContinuous));

        msg.push('Storage: ' + this.hadronStorage.provider);
        if (this.hadronStorage.provider == "HadronFauxStorage") {
          msg.push('Your browser is not allowing access to localStorage.  Please contact johnm@botanic.io with information like browser brand, version number, device (mobile, laptop, etc), OS (Windows, Linux)..');
        }

        msg.push('Is Secure: ' + this.boolToString(this.isSecure));
        if (this.isSecure == false) {
          msg.push('Since this site is not using HTTPS, functionality had to be disabled.');
        }

        convo = { ice: { says: msg, reply: [] } };

        setTimeout(() => {
          this.talk(convo);
        }, 1000);

        return true;
      } else if (userSaid == '!!config') {
        msg = [];
        msg.push('Hadron Config');
        msg.push('Also known as: ' + Config.also_known_as);
        msg.push('AYBABTU: '       + Config.all_your_bases_are_belong_to_us);
        msg.push('MTOne URI: '     + Config.mtone_base_uri);
        msg.push('Author Tool: '   + Config.author_tool_domain);
        msg.push('Key: '           + Config.api_key);

        convo = { ice: { says: msg, reply: [] } };

        setTimeout(() => {
          this.talk(convo);
        }, 1000);

        return true;
      } else if (userSaid == "!!3js") {
        msg = [];

        // Just hide the renderer, don't remove.  So we can return the renderer with a command after a setting changes.
        this.mediaView(false);

        if (window.inAvatar == false) {
          msg.push('Cannot inspect, renderer hasn\'t been started.');
        } else {
          msg = window.inAvatar.getRenderState();
        }

        convo = { ice: { says: msg, reply: [] } };

        setTimeout(() => {
          this.talk(convo);
        }, 1000);

        return true;
      } else if (userSaid == "!!actr") {
        if (this.use3DAvatar == false || this.hasWebGL == false) {
          msg = [];
          msg.push('Cannot run');
          msg.push('Is avatar var defined: ' + this.boolToString(this.use3DAvatar));
          msg.push('Has WebGL: ' + this.boolToString(this.hasWebGL));
          convo = { ice: { says: msg, reply: [] } };

          setTimeout(() => {
            this.talk(convo);
          }, 1000);

          return true;
        }

        if (window.inAvatar == false) {
          window.inAvatar = new HadronAvatar("inAvatar");
        }

        return window.inAvatar.checkACTRInput(param);

      } else if (userSaid == "!!stopactr") {
        window.inAvatar.stopAvatar();

        return true;
      }

      return false;
    }
  }


  // Start the recognizer
  startReco(showToast) {
    //JEM Need to ensure this isn't necessary.
    //if (inControl.recoEnabled == false) {
    //  return;
    //}

    if (this.recoObject == false) {
      this.recoObject = new Artyom();

      this.recoObject.when("ERROR",function(error){
        if(error.code == "network"){
          alert("An error ocurred, artyom cannot work without internet connection !");
        }

        if(error.code == "audio-capture"){
          alert("An error ocurred, artyom cannot work without a microphone");
        }

        if(error.code == "not-allowed"){
          alert("An error ocurred, it seems the access to your microphone is denied");
        }

        inControl.consoleLog(error.message);
      });

      if (this.recoObject.recognizingSupported == false) {
        inControl.recoEnabled = false;
        return;
      }
    }

    if (showToast) {
      inControl.showToast('I\'m listening.');
    }

    inControl.recoEnabled = true;

    if (inControl.recoContinuous == true) {
      inControl.returnToReco = true;
    } else {
      inControl.returnToReco = false;
    }

    if (this.recoEnabled == true) {
      $('#quark-reco-icon').removeClass('quark-reco-button-off');
      $('#quark-reco-icon').addClass('quark-reco-button-on');

      if (this.recoContinuous == true) {
        this.returnToReco = true;
      }

      this.recoObject.initialize({
        lang: "en-US",
        debug: false, // Show what recognizes in the Console
        listen: true, // Start listening after this
        speed: 0.9, // Talk a little bit slow
        mode: "normal", // This parameter is not required as it will be normal by default
        continuous: true//,
        //name: "Jarvis"
      });

      var settings = {
        continuous:true, // Don't stop never because i have https connection
        onResult:function(interimText, temporalText) {
          var isFinal = false;
          if (temporalText != "") {
            isFinal = true;
          }

          inControl.consoleLog("interimText: " + interimText);
          inControl.consoleLog("temporalText:" + temporalText);
          inControl.consoleLog("isFinal:" + isFinal);

          if (!isFinal) {
            inControl.inputText.val(interimText);
          } else {
            if (this.recoObject != false) {
              inControl.recoInput(temporalText);
            }

            inControl.stopReco();
          }
        },
        onStart:function(){
            //console.log("Dictation started by the user");
        },
        onEnd:function(){
            //alert("Dictation stopped by the user");
        }
      };

      this.userDictation = this.recoObject.newDictation(settings);
      this.userDictation.start();
    }
  }

  // Stop the recognizer.
  stopReco() {
    if (this.recoEnabled == true) {
      $('#quark-reco-icon').removeClass('quark-reco-button-on');
      $('#quark-reco-icon').addClass('quark-reco-button-off');

      inControl.recoEnabled = false;

      if (this.userDictation) {
        this.userDictation.stop();
        this.userDictation = false;
      }
    }
  }

  // Make the reco speak, mobile devices need this.
  localTTS(phrase, language = "en-US") {
    if (language == "") {
      language = "en-US";
    }

    if (inControl.recoObject == false) {
      inControl.recoObject = new Artyom();
      inControl.recoObject.initialize({
        lang: language,
        debug: true, // Show what recognizes in the Console
        listen: true, // Start listening after this
        speed: 0.9, // Talk a little bit slow
        mode: "normal", // This parameter is not required as it will be normal by default
        continuous: true,
        name: "Jarvis"
      });
    }

    inControl.recoObject.say(phrase, {
      onStart:function(){
      },
      onEnd:function(){
        if (inControl.returnToReco == true) {
          setTimeout(function(){
            inControl.startReco(false);
          }, 200);
        }
      }
    });
  }

  // Compare 2 strings
  caseInsensitiveCompare(p1, p2) {
    var strippedPhrase1 = p1;
    strippedPhrase1.replace(/[\n\r]+/g, '');

    var strippedPhrase2 = p2;
    strippedPhrase2.replace(/[\n\r]+/g, '');

    var areEqual = (strippedPhrase1.toUpperCase() === strippedPhrase2.toUpperCase());

    return areEqual;
  }

  // Is it a stop command?
  isStopListeningCommand(phrase) {
    var areEqual = this.caseInsensitiveCompare(phrase, this.stopCommand);

    if (areEqual) {
      inControl.showToast('I am no longer listening.');

      this.inputText.val('');
      this.stopReco();
      return true;
    }

    return false;
  }

  // Receives the spoken text, sends to chat input.
  recoInput(phrase) {
    this.consoleLog("recoInput: " + phrase);

    if (this.isStopListeningCommand(phrase)) {
      return;
    }

    this.inputText.val(phrase);

    // Press enter
    var e = $.Event("keypress");
    e.which = 13; //choose the one you want
    e.keyCode = 13;
    this.inputText.trigger(e);
  }

  // accept JSON & create quark
  talk(convo, here = "ice") {
    if (convo == false) {
      if (this.botWelcomeText == false || this.botWelcomeText == "") {
        return;
      }

      if (this.hideInput == true) {
        convo = { ice: { says: [this.botWelcomeText], reply: [{ question: "Hi!", answer: "hi", type: "echo"}] } };
      } else {
        convo = { ice: { says: [this.botWelcomeText], reply: [] } };
      }
    }

    // all further .talk() calls will append the conversation with additional blocks defined in convo parameter
    this._convo = Object.assign(this._convo, convo); // POLYFILL REQUIRED FOR OLDER BROWSERS

    this.reply(this._convo[here]);
    if (here) {
      this.standingAnswer = here;
    }
  }

  // This starts the reply process, adds the user input, does ... etc
  reply(turn) {
    this.iceBreaker = typeof(turn) === "undefined";
    turn = !this.iceBreaker ? turn : this._convo.ice;
    var questionsHTML = ''; // "<div class='quark-button-wrap'>";

    if (!turn) {
      return;
    }

    if (turn.reply !== undefined) {
      turn.reply.reverse();
      for (var i = 0; i < turn.reply.length; i++) {
        ((el, count) => {
          var clickEvent = 'window.inControl.answer("' + el.answer + '", "' + el.question + '", "' + el.type + '");';
          var questionHTML = $('<a>', {class: "quark-button quark-choices btn left-align " + this.buttonClass, style:"animation-delay: " + this.animationTime / 2 * count + "ms", text: el.question, onClick: clickEvent});
          questionsHTML = questionsHTML + questionHTML.prop('outerHTML');

          if (i != (turn.reply.length - 1)) {
            questionsHTML = questionsHTML + "<br />";
          }
        })(turn.reply[i], i);
      }
    }

    if (questionsHTML != "") {
      questionsHTML = "<div class='quark-button-wrap'>" + questionsHTML + '</div>';
    }

    this.orderQuarkState(true);

    this.orderQuarks(turn.says, () => {
      this.orderQuarkState(false);

      this.quarkTyping.removeClass("imagine");

      if (questionsHTML !== "") {
        this.addQuark(questionsHTML, function() {}, "says-buttons");
      } else {
        this.quarkTyping.addClass("imagine");
      }
    });
  }

  // Sets the state and can message to control behavior
  orderQuarkState(state) {
    this.orderQuarksRunning = state;

    if (state == true) {
      //this.textAreaEnabled(false);
    } else {
      //this.textAreaEnabled(true);
    }
  }

  // This receives the info from MTOne both text and card array
  processResponse(botSaid, cards) {
    if (this.isUndefined(botSaid) == true) {
      return;
    }

    this.consoleLog(botSaid);
    this.consoleLog(cards);

    var messageObject;
    var buttons = [];

    this.threedVisualizerID = false;

    var messages = [];
    for (var index = 0, len = botSaid.length; index < len; ++index) {
      if (botSaid[index].speech != "") {
        var botSaidAfter = this.parseBotResponse(botSaid[index].speech);

        var withMedia = this.convertMedia(botSaidAfter);

        if (withMedia == false) {
          messageObject = { message: botSaidAfter, unadorned: false};
        } else {
          messageObject = { message: withMedia, unadorned: true};
        }
        messages.push(messageObject);
      }
    }

    if (botSaid.length == 0) {
        messageObject = { message: "Odd. The bot was silent.", unadorned: false};
        messages.push(messageObject);
    }

    var media = "";
    var cardList = cards[0] || false;

    if (cardList != false &&  cardList.length > 0) {
      for (let c of cardList) {
        var res = this.processCard(c);

        if (this.isUndefined(res) == false) {
          var aMesg = res.msg;

          if (aMesg != "") {
            messages.push(aMesg);
          }

          for (let b of res.btn) {
            buttons.push(b);
          }
        }
      }
    }

    // Do not reset the tts var is actr is running, it needs it.
    if (this.mediaViewEnabled == true && this.isACTRRunning() == false) {
      this.ttsURIToCall = "";
    }

    // Do not speak if actr is running, it will do it.
    if (this.ttsURIToCall && this.isACTRRunning() == false) {
      this.handleTTS(this.ttsURIToCall);
    }

    //convo = { ice: { says: [botWelcomeText], reply: [] } }
    var conv = { ice: { says: messages, reply: buttons.reverse() } };
    this.talk(conv);

    $('#mediaplayer').on('ended', function() {
      //console.log('ended');
      if (inControl.returnToReco == true) {
        //console.log('recoResume');
        setTimeout(function(){
          inControl.startReco(false);
        }, 200);
      }
    });

    if (this.threedVisualizerID != false) {
    }
  }

  replaceAll(string, search, replacement) {
    return string.replace(new RegExp(search, 'g'), replacement);
  }

  // Look for a trigger phrase OR fix errors in certain types of data.....
  parseBotResponse(botSaid) {
    if (botSaid.includes("' blank'")) {
      botSaid = this.replaceAll(botSaid, "' blank'", "'_blank'");
    }

    if (botSaid.includes('" blank"')) {
      botSaid = this.replaceAll(botSaid, '" blank"', '"_blank"');
    }

    if (botSaid.includes("' top'")) {
      botSaid = this.replaceAll(botSaid, "' top'", "'_top'");
    }

    if (botSaid.includes('" top"')) {
      botSaid = this.replaceAll(botSaid, '" top"', '"_top"');
    }

    if (botSaid.includes("' self'")) {
      botSaid = this.replaceAll(botSaid, "' self'", "'_top'");
    }

    if (botSaid.includes('" self"')) {
      botSaid = this.replaceAll(botSaid, '" self"', '"_top"');
    }

    if (botSaid.includes('https://twitter.com/SEED token')) {
      botSaid = this.replaceAll(botSaid, 'https://twitter.com/SEED token', 'https://twitter.com/SEED_token');
    }

    if (botSaid.includes("HADRONSTARTVOICERECO")) {
      botSaid = botSaid.replace("HADRONSTARTVOICERECO", "");
      inControl.recoEnabled = true;
      inControl.returnToReco = true;
    }

    if (botSaid.includes("HADRONSTOPVOICERECO")) {
      botSaid = botSaid.replace("HADRONSTOPVOICERECO", "");
      inControl.stopReco();
    }

    if (botSaid.includes("HADRONBREAK1")) {
      botSaid = botSaid.replace("HADRONBREAK1", "");
    }

    if (botSaid.includes("HADRONBREAK2")) {
      botSaid = botSaid.replace("HADRONBREAK2", "");
    }

    return botSaid;
  }


  // Create an embed/media/etc based on some input.
  convertMedia(html) {
    var cls = 'class="responsive-video"';
    var frm = '<div class="responsive-container"><iframe '+cls+' src="//_URL_" frameborder="0" allowfullscreen id="mediaplayer"></iframe></div>';
    var converts = [
      {
        rx: /^(?:https?:)?\/\/(?:www\.)?vimeo\.com\/([^\?&"]+).*$/g,
        tmpl: frm.replace('_URL_',"player.vimeo.com/video/$1")
      },
      {
        rx: /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|user\/.+\/)?([^\?&"]+).*$/g,
        tmpl: frm.replace('_URL_',"www.youtube.com/embed/$1")
      },
      {
        rx: /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube-nocookie\.com)\/(?:watch\?v=|embed\/|v\/|user\/.+\/)?([^\?&"]+).*$/g,
        tmpl: frm.replace('_URL_',"www.youtube-nocookie.com/embed/$1")
      },
      {
        rx: /(^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?\.(?:jpe?g|gif|png|svg)\b.*$)/gi,
        tmpl: '<a '+cls+' href="$1" target="_blank"><img src="$1" /></a>'
      },
    ];
    for (var i in converts)
      if (converts[i].rx.test(html.trim())) {

        return html.trim().replace(converts[i].rx, converts[i].tmpl);
      }

    return false;
  }


  // This handles a specific card, it will be changed so we can dynamically insert a replacement renderer.
  // Also support adding some JS through another class that gives new renderer types rather than clutter the main class.
  processCard(card) {
    var buttons = [];
    var message = "";
    var media = "";
    var image = "";
    var video = "";
    var audio = "";
    var text = "";

    if (card != false) {
      var contentType = "";
      if (card.contentType == "application/vnd.microsoft.card.hero") {
        contentType = "hero";
      } else if (card.contentType == "application/vnd.microsoft.card.video") {
        contentType = "video";
      } else if (card.contentType == "application/vnd.microsoft.card.audio") {
        contentType = "audio";
      } else if (card.contentType == "application/vnd.microsoft.card.image") {
        contentType = "image";
      } else if (card.contentType == "application/vnd.botanic.card.3dvisualizer") {
        contentType = "3dvisualizer";
      }

      //JEM CLEAN Make card renderer objects, get this out of here.  Pass the card data into the object and let it do the rest.
      if (contentType == "video") {
        try {
          image = card.content.image.url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        try {
          video = card.content.media[0].url || "";
          video = this.removeProtocol(video);
        } catch(error) {
          video = "";
        }

        if (video != "") {
          message = this.videoHandler(image, video);

          if (video.endsWith('fullscreen')) {
            this.mediaView(true);
            this.mediaOverlayContent.html(message.message);

            return;
          }
        }
      }

      if (contentType == "audio") {
        try {
          image = card.content.image.url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        try {
          audio = card.content.media[0].url || "";
          audio = this.removeProtocol(audio);
        } catch(error) {
          audio = "";
        }

        // JEM need to toggle controls and detect mimetype properly.  Same with video.
        if (audio != "") {
          media  = '<audio controls class="responsive-audio">';
          media += '<source src="' + audio + '" type="audio/mpeg">';
          media += '</audio>';

          message = { message: media, unadorned: true};
        }
      }

      if (contentType == "image") {
        try {
          image = card.content.images[0].url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        // JEM need to toggle controls and detect mimetype properly.  Same with video.
        if (image != "") {
          message = this.imageHandler(image);
        }
      }

      if (contentType == "hero") {
        try {
          image = card.content.images[0].url || "";
          image = this.removeProtocol(image);
        } catch(error) {
          image = "";
        }

        text = card.content.text || "";

        if (image != "" && text != "") {
          media = `<div class="row responsive-card">
        <div class="col s12 m12">
          <div class="card">
            <div class="card-image">
              <img src="` + image + `">
              <span class="card-title"></span>
            </div>
            <div class="card-content">
              <p>` + text + `</p>
            </div>
          </div>
        </div>
      </div>`;

          message = { message: media, unadorned: true};
        }
      }

      // This code needs to be more flexible.  Know the difference between a SkypeCard, AdaptiveCard and HadronCard.
      // Should be pulled into a separate class and processed so this is cleaner.
      if (typeof card.content.buttons !== "undefined") {
        if (card.content.buttons.length > 0) {
          for (var index = 0, len = card.content.buttons.length; index < len; ++index) {
            var jsonButton = card.content.buttons[index];
            var button;

            if (jsonButton.type == 'openUrl') {
              button = { question: jsonButton.title, answer: jsonButton.value, type: jsonButton.type};
            } else {
              button = { question: jsonButton.title, answer: jsonButton.value, type: jsonButton.type};
            }
            buttons.push(button);
          }
        }
      }
    }

    var obj = {};
    obj.msg = message;
    obj.btn = buttons;

    return obj;
  }

  // wrap image
  imageHandler(image) {
    var media  = '<img src="' + image + '" class="responsive-img" />';
    var message = { message: media, unadorned: true};

    return message;
  }

  // Video handling
  videoHandler(image, video, autoplay) {
    var media = "";

    if (video.endsWith('fullscreen') || inControl.mediaViewEnabled) {
      media  = '<video id="mediaplayer" class="responsive-video" poster="' + image + '" autoplay>';
    } else {
      media  = '<video id="mediaplayer" class="responsive-video" poster="' + image + '" autoplay controls controlsList="nodownload">';
    }

    var mediaType = "video/mp4";

    if(video.indexOf("//www.youtube") !== -1) {
      // YouTube embedding.
      mediaType = "video/youtube";
      media = '<iframe class="responsive-video" src="' + video + '" frameborder="0" allowfullscreen></iframe>';

      //console.log('URL passed the test');
    } else if(video.indexOf("//vimeo") !== -1) {
      // Vimeo embed.
      mediaType = "video/vimeo";
      media = '<iframe src="' + video + '" class="responsive-video" frameborder="0"></iframe>';

      //console.log('URL passed the test');
    } else {
      // Native...
      media += '<source src="' + video + '" type="' + mediaType + '">';
      media += '</video>';
    }

    var message = { message: media, unadorned: true};

    return message;
  }

  // Make a call to MTOne to do the TTS.  Could also speak locally in some cases but this allows for a custom voice.
  handleTTS(uri, startCallback, endCallback) {
    if (uri == false) {
      if (startCallback) {
        startCallback();
      }

      return;
    }

    if (this.ttsEnabled == false) {
      if (startCallback) {
        startCallback();
      }

      return;
    }

    this.lastSpokenURI = uri;

    $.ajax({url: uri,
        type: 'get',
        dataType: 'JSON',
        context: this,
        success: function(result){
          var sound_uri = result.response.data[0].audio_uri || false;

          this.consoleLog(result.response.data);

          if (sound_uri != false) {
            this.stopReco();
            this.playAudio(sound_uri, startCallback, endCallback);
          }
        }
    });
  }


  // Only pause if necessary, Chrome complained sometimes.
  pauseAudio() {
    if (this.soundObject != false) {
      if (this.soundObject.duration > 0 && !this.soundObject.paused) {
        this.soundObject.pause();
      }

      this.soundObject.muted = false;
    }
  }


  // Plays an audio file and stops an existing audio file.  Used by TTS, make be used by receiving an audio card.
  playAudio(url, startCallback, endCallback) {
    this.showConfigState();
    this.pauseAudio();

    if (this.soundObject == false) {
      this.soundObject = new Audio();
      this.soundObject.muted = true;
    }

    // This forces the audio to wait until it is fully loaded to play, helps with bad networks.
    this.soundObject.preload = true;
    this.soundObject.addEventListener('canplaythrough', () => {
      if (startCallback) {
        startCallback();
      }
    }, false);
    this.soundObject.src = url;


    // If it was off, keep it off!
    // If there is a pause, no voice detected for a few seconds, turn off all reco.
    // If the user clicks the stop, it stops.
    // If the user says "stop listening" or something similar, it stops.
    this.soundObject.onended = () => {
      if (endCallback) {
        endCallback();
      }

      if (inControl.returnToReco == true) {
        setTimeout(function(){
          inControl.startReco(false);
        }, 200);
      }
    };

    var playPromise = this.soundObject.play();

    // In browsers that don’t yet support this functionality,
    // playPromise won’t be defined.
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Automatic playback started!
      }).catch((error) => {
        this.changeTTSState(false);
        this.showToastDebug(error);
        this.showToastDebug('Please press the speaker icon to let this bot speak');
      });
    }

    this.consoleLog(url);
  }


  // See if the avatar system is running.  This test may not be complete enough.
  isACTRRunning() {
    if (this.use3DAvatar == true && window.inAvatar != false) {
      return true;
    } else {
      return false;
    }
  }


  // Calls MTOne to get chat response based on user input.
  callMTOne(text, callback) {
    var uri = "";
    var that = this;

    // Reset this variable each time so TTS can work when it was appropriate.
    this.lastSpokenURI = false;

    this.token = this.tokenRead();

    // Try to standardize any token value that could have been saved or read.
    if (this.token == false || this.token == "" || this.isUndefined(this.token) == true) {
      this.tokenSave(this.token);
    }

    uri = this.MTOneBaseUrl + "social/chatbot/?service=chatbot_router&uid=" + this.botId + "&type=text&handler=" + this.botHandler + "&text=" + encodeURIComponent(text) + "&user_data_json=" + encodeURI(this.botUserData);
    if (this.token !== "") {
      uri += "&token=" + this.token;
    }

    if (this.rootFlowUUID !== "") {
      uri += "&user_data=" + this.rootFlowUUID;
    }

    $.ajax({url: uri,
        type: 'get',
        dataType: 'JSON',
        context: this,
        success: function(json_obj){
          if (inControl.isUndefined(json_obj.token) == false) {
            this.tokenSave(json_obj.token);
          }

          this.ttsURIToCall = json_obj.tts || false;

          if (this.ttsEnabled == true) {
            // If we are in mediaView we do NOT use TTS. Eventually should be only if the media is video but for now.
            if (this.useLocalTTS == false) {
              this.consoleLog(this.ttsURIToCall);
            } else {
              this.localTTS(json_obj.bot_said || "");
            }
          }

          if (this.isACTRRunning() == true) {
            window.inAvatar.processACTR(json_obj.actr || false);
            window.inAvatar.processMessages(json_obj.messages || false);
          }

          this.processSentiment(json_obj.sentimentValue);

          this.processResponse(json_obj.messages, json_obj.cards);

          callback(json_obj.messages, json_obj.cards);
    }});
  }

  // Displays sentiment if enabled.
  processSentiment(sentimentValue) {
    if (this.showSentiment == true) {
      var sentimentString = this.sentimentToIcoName[sentimentValue + 5];
      var sentimentals = $('.quark-sentiment-placeholder');

      if (sentimentals.length > 0) {
        var sentimentStringToInsert = '<i class="material-icons right-align">' + sentimentString + '</i>';
        $(sentimentals[0]).removeClass('quark-sentiment-placeholder');
        $(sentimentals[0]).addClass('quark-sentiment-shown');
        $(sentimentals[0]).append(sentimentStringToInsert);
      }
    }
  }


  // Enable/disable media view mode.  In media view mode an overlay holds the media object, is stationary and has a one line element to display the last user test.
  mediaView(state) {
    this.mediaViewEnabled = state;

    // Create the overlay components and assign them so other functions can interact with it.
    if (state == true) {
      if ($('.quark-media-content').length != 0) {
        return this.mediaOverlayContent;
      }

      // Disable TTS, it would be bad over a video preso.
      this.changeTTSState(false);

      this.mediaViewPreservedState = this.container;

      this.mediaOverlay = $('<div>', {class: "quark-media-overlay"});
      this.mediaOverlayContent = $('<div>', {class: "quark-media-content"});

      this.mediaOverlay.append(this.mediaOverlayContent);

      this.container.append(this.mediaOverlay);

      return this.mediaOverlayContent;
    } else {
      if ($('.quark-media-content').length != 0) {
        $('.quark-media-content').remove();
        $('.quark-media-overlay').remove();
      }

      // restore default view
      if (this.mediaViewPreservedState != false) {
        this.container = this.mediaViewPreservedState;
      }
    }

    return false;
  }

  // Show response when mediaView is true.
  mediaViewResponse(message) {
    this.mediaOverlayResponse.html(message);
  }

  // Insert the media container, e.g. a video player or 3D avatar.
  mediaViewContent(type) {
    // Avatars require a bit more overhead than embedded a video.
    if (type == "3D") {

    } else {

    }
  }

  // navigate "answers"
  answer(key, content, type) {
    if (inControl.hideButtonsWhenClicked) {
      var sentimentPlaceholder = "";

      if (this.showSentiment) {
        sentimentPlaceholder = '<span class="quark-sentiment-placeholder">&nbsp;</span>';
      }

      $('.says-buttons').hide();

      this.addQuark(
        sentimentPlaceholder + '<span class="quark-user-input quark-pick right-align ' + this.botSaysClass + '">' + key + "</span>",
        function() {},
        "reply reply-freeform"
      );
    }

    if (type != 'openUrl') {
      var responseText = this.callMTOne(key, function(botSaid, cards) {
      });
    } else {
      var win = window.open(key, '_blank');
      win.focus();
      return;
    }

    var func = function(key) {
      typeof(window[key]) === "function" ? window[key]() : false;
    };

    this._convo[key] !== undefined ? (this.reply(this._convo[key]), (this.standingAnswer = key)) : func(key);

    // add re-generated user picks to the history stack
    if (this._convo[key] !== undefined && content !== undefined) {
      this.interactionsSave(
        '<span class="quark-button reply-pick">' + content + "</span>",
        "reply reply-pick"
      );
    }
  }

  // api for typing quark
  think() {
    this.quarkTyping.removeClass("imagine");

    this.stop = function() {
      this.quarkTyping.addClass("imagine");
    };
  }

  // "type" each message within the group
  orderQuarks(q, callback) {
    var start = () => {
      setTimeout(() => {
        callback();
      }, this.animationTime);
    };

    var position = 0;
    for (var nextCallback = position + q.length - 1; nextCallback >= position; nextCallback--) {
      ((callback, index) => {
        start = function() {
          inControl.addQuark(q[index], callback);
        };
      })(start, nextCallback);
    }
    start();
  }

  // create a quark
  addQuark(say, posted, reply, live) {
    reply = typeof(reply) !== "undefined" ? reply : "";
    live = typeof(live) !== "undefined" ? live : true; // quark that are not "live" are not animated and displayed differently
    var animationTime = live ? this.animationTime : 0;
    var typeSpeed = live ? this.typeSpeed : 0;
    var unadorned = false;
    var replyClass = "";

    // create quark element

    if (this.isUndefined(say.unadorned) == false) {
      unadorned = say.unadorned;
      say = say.message;
    }

    if (unadorned == false) {
      if (reply == false) {
        replyClass = this.botReplyClass;
      } else {
        replyClass = "";
      }

      if (this.useFlowText == true) {
        replyClass += " flow-text ";
      }

      this.quark = $('<div>', {class: replyClass + " quark imagine " + (!live ? " history " : "") + reply});
      this.quarkContent = $('<span>', {class: "quark-content"});
      this.quarkContent.html(say);
      this.quark.append(this.quarkContent);
    } else {
      this.quark = $('<div>', {class: reply + " quark-unadorned imagine "});
      this.quarkContent = $('<span>', {class: ""});
      this.quarkContent.html(say);
      this.quark.append(this.quarkContent);
    }

    var target = document.getElementsByClassName("quark-wrap");
    target[0].insertBefore(this.quark[0], this.quarkTyping[0]);

    // answer picker styles
    if (reply !== "") {
      var quarkButtons = this.quarkContent.find(".quark-button");

      this.quark.click((el) => {
        $(el.srcElement).addClass("quark-picked");

        for (var i = 0; i < quarkButtons.length; i++) {
          ;(function(el) {
            if (inControl.hideButtonsWhenClicked) {
              $(el).addClass("quark-hide-clicked-button");
              $('.quark-button-wrap').hide();
              //el.style.width = 0 + "px";
              //el.classList.contains("quark-pick") ? (el.style.width = "") : false;
            }
            el.removeAttribute("onclick");
          })(quarkButtons[i]);
        }
      });
    }

    if (reply == "says-buttons") {
      $('.says-buttons').off("click");
    }

    // time, size & animate
    var wait = live ? animationTime * 2 : 0;
    var minTypingWait = live ? animationTime * 6 : 0;
    if (say.length * typeSpeed > animationTime && reply == "") {
      wait += typeSpeed * say.length;
      if (wait < minTypingWait) {
          wait = minTypingWait;
      }

      setTimeout(() => {
        this.quarkTyping.removeClass("imagine");
      }, animationTime);
    }

    if (live) {
       setTimeout(() => { this.quarkTyping.addClass("imagine"); }, wait - animationTime * 2);
     }


     this.quarkQueue = setTimeout(() => {
       this.quark.removeClass("imagine");

       var quarkWidthCalc = parseInt(this.quarkContent[0].offsetWidth * 1, 10) + this.widerBy;

       if (quarkWidthCalc <= this.widerBy) {
         quarkWidthCalc = 360 * 0.4;
       }

       var maxQuarkWidth = parseInt(this.quarkWrap.width(), 10) - 35;
       if (maxQuarkWidth <= this.widerBy) {
         maxQuarkWidth = 360 * 0.4;
       }

       quarkWidthCalc = Math.min(quarkWidthCalc, maxQuarkWidth);

       quarkWidthCalc = quarkWidthCalc + "px";

       var isResponsive = false;
       var isResponsiveImage = this.quark.find('.responsive-img');
       var isResponsiveVideo = this.quark.find('.responsive-video');
       var isResponsiveAudio = this.quark.find('.responsive-audio');
       var isResponsiveCard  = this.quark.find('.responsive-card');

       if (isResponsiveImage.length > 0 || isResponsiveVideo.length > 0 || isResponsiveAudio.length > 0 || isResponsiveCard.length > 0) {
         isResponsive = true;
       }

       if (isResponsiveVideo) {

       }

       if (isResponsive == false) {
         this.quark.css("width", reply == "" ? quarkWidthCalc : "");
       }

       this.quark.addClass("say");
       this.quark.fadeTo(0.5, 0).fadeTo(2, 1);
       posted();

       // save the interaction
       if (!this.iceBreaker) {
         this.interactionsSave(say, reply);
         this.interactionsSaveCommit();
       }

       // animate scrolling
       var containerHeight = this.container[0].offsetHeight;
       var scrollDifference = this.quarkWrap[0].scrollHeight - this.quarkWrap[0].scrollTop;
       var scrollHop = (scrollDifference) / 200;

       if (scrollHop > 3) {
         scrollHop = scrollHop * 3;
       }

       var scrollQuarks = () => {
         for (var i = 1; i <= scrollDifference / scrollHop; i++) {
           ;(function() {
             setTimeout(() => {
               if ((inControl.quarkWrap[0].scrollHeight - inControl.quarkWrap[0].scrollTop) > containerHeight) {
                 var sTop = inControl.quarkWrap[0].scrollTop + scrollHop;
                 inControl.quarkWrap[0].scrollTop = sTop;
               }
             }, i * 5);
           })();
         }
       };
       setTimeout(scrollQuarks, animationTime / 2);
     }, wait + animationTime * 2);
  }

  // Try to correct scroll position.
  resetScrollPos(selector) {
    var divs = document.querySelectorAll(selector);
    for (var p = 0; p < divs.length; p++) {
      if (Boolean(divs[p].style.transform)) { //for IE(10) and firefox
        divs[p].style.transform = 'translate3d(0px, 0px, 0px)';
      } else { //for chrome and safari
        divs[p].style['-webkit-transform'] = 'translate3d(0px, 0px, 0px)';
      }
    }
  }

  showToast(text, heading, icon) {
    text = text || false;
    heading = heading || false;
    icon = icon || false;

    if (text == false) {
      return;
    }

    if (heading == false && icon == false) {
      $.toast({text: text, position: 'bottom-right'});
    } else {
      $.toast({heading: heading, text: text, icon: icon, position: 'bottom-right'});
    }
  }


  showToastDebug(text, heading, icon) {
    if (this.showDebug == false) {
      console.log('showToastDebug: ' + text);

      return;
    }

    text = text || false;
    heading = heading || false;
    icon = icon || false;

    if (text == false) {
      return;
    }

    if (heading == false && icon == false) {
      $.toast({text: text, position: 'bottom-right'});
    } else {
      $.toast({heading: heading, text: text, icon: icon, position: 'bottom-right'});
    }
  }
}


// jQuery toast plugin created by Kamran Ahmed copyright MIT license 2015
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {
    "use strict";

    var Toast = {

        _positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
        _defaultIcons : ['success', 'error', 'info', 'warning'],

        init: function (options, elem) {
            this.prepareOptions(options, $.toast.options);
            this.process();
        },

        prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },

        process: function () {
            this.setup();
            this.addToDom();
            this.position();
            this.bindToast();
            this.animate();
        },

        setup: function () {

            var _toastContent = '';

            this._toastEl = this._toastEl || $('<div></div>', {
                class : 'jq-toast-single'
            });

            // For the loader on top
            _toastContent += '<span class="jq-toast-loader"></span>';

            if ( this.options.allowToastClose ) {
                _toastContent += '<span class="close-jq-toast-single">&times;</span>';
            }

            if ( this.options.text instanceof Array ) {

                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                }

                _toastContent += '<ul class="jq-toast-ul">';
                for (var i = 0; i < this.options.text.length; i++) {
                    _toastContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
                }
                _toastContent += '</ul>';

            } else {
                if ( this.options.heading ) {
                    _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
                }
                _toastContent += this.options.text;
            }

            this._toastEl.html( _toastContent );

            if ( this.options.bgColor !== false ) {
                this._toastEl.css("background-color", this.options.bgColor);
            }

            if ( this.options.textColor !== false ) {
                this._toastEl.css("color", this.options.textColor);
            }

            if ( this.options.textAlign ) {
                this._toastEl.css('text-align', this.options.textAlign);
            }

            if ( this.options.icon !== false ) {
                this._toastEl.addClass('jq-has-icon');

                if ( $.inArray(this.options.icon, this._defaultIcons) !== -1 ) {
                    this._toastEl.addClass('jq-icon-' + this.options.icon);
                };
            };

            if ( this.options.class !== false ){
                this._toastEl.addClass(this.options.class)
            }
        },

        position: function () {
            if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {

                if ( this.options.position === 'bottom-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        bottom: 20
                    });
                } else if ( this.options.position === 'top-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: 20
                    });
                } else if ( this.options.position === 'mid-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: ( $(window).outerHeight() / 2 ) - this._container.outerHeight()/2
                    });
                } else {
                    this._container.addClass( this.options.position );
                }

            } else if ( typeof this.options.position === 'object' ) {
                this._container.css({
                    top : this.options.position.top ? this.options.position.top : 'auto',
                    bottom : this.options.position.bottom ? this.options.position.bottom : 'auto',
                    left : this.options.position.left ? this.options.position.left : 'auto',
                    right : this.options.position.right ? this.options.position.right : 'auto'
                });
            } else {
                this._container.addClass( 'bottom-left' );
            }
        },

        bindToast: function () {

            var that = this;

            this._toastEl.on('afterShown', function () {
                that.processLoader();
            });

            this._toastEl.find('.close-jq-toast-single').on('click', function ( e ) {
                e.preventDefault();

                if( that.options.showHideTransition === 'fade') {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.fadeOut(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition === 'slide' ) {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.slideUp(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.hide(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                }
            });

            if ( typeof this.options.beforeShow == 'function' ) {
                this._toastEl.on('beforeShow', function () {
                    that.options.beforeShow(that._toastEl);
                });
            }

            if ( typeof this.options.afterShown == 'function' ) {
                this._toastEl.on('afterShown', function () {
                    that.options.afterShown(that._toastEl);
                });
            }

            if ( typeof this.options.beforeHide == 'function' ) {
                this._toastEl.on('beforeHide', function () {
                    that.options.beforeHide(that._toastEl);
                });
            }

            if ( typeof this.options.afterHidden == 'function' ) {
                this._toastEl.on('afterHidden', function () {
                    that.options.afterHidden(that._toastEl);
                });
            }

            if ( typeof this.options.onClick == 'function' ) {
                this._toastEl.on('click', function () {
                    that.options.onClick(that._toastEl);
                });
            }
        },

        addToDom: function () {

             var _container = $('.jq-toast-wrap');

             if ( _container.length === 0 ) {

                _container = $('<div></div>',{
                    class: "jq-toast-wrap",
                    role: "alert",
                    "aria-live": "polite"
                });

                $('body').append( _container );

             } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
                _container.empty();
             }

             _container.find('.jq-toast-single:hidden').remove();

             _container.append( this._toastEl );

            if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {

                var _prevToastCount = _container.find('.jq-toast-single').length,
                    _extToastCount = _prevToastCount - this.options.stack;

                if ( _extToastCount > 0 ) {
                    $('.jq-toast-wrap').find('.jq-toast-single').slice(0, _extToastCount).remove();
                }

            }

            this._container = _container;
        },

        canAutoHide: function () {
            return ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) );
        },

        processLoader: function () {
            // Show the loader only, if auto-hide is on and loader is demanded
            if (!this.canAutoHide() || this.options.loader === false) {
                return false;
            }

            var loader = this._toastEl.find('.jq-toast-loader');

            // 400 is the default time that jquery uses for fade/slide
            // Divide by 1000 for milliseconds to seconds conversion
            var transitionTime = (this.options.hideAfter - 400) / 1000 + 's';
            var loaderBg = this.options.loaderBg;

            var style = loader.attr('style') || '';
            style = style.substring(0, style.indexOf('-webkit-transition')); // Remove the last transition definition

            style += '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + loaderBg + ';';


            loader.attr('style', style).addClass('jq-toast-loaded');
        },

        animate: function () {

            var that = this;

            this._toastEl.hide();

            this._toastEl.trigger('beforeShow');

            if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
                this._toastEl.fadeIn(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
                this._toastEl.slideDown(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else {
                this._toastEl.show(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            }

            if (this.canAutoHide()) {
                var that = this;

                window.setTimeout(function(){

                    if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.fadeOut(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.slideUp(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    } else {
                        that._toastEl.trigger('beforeHide');
                        that._toastEl.hide(function () {
                            that._toastEl.trigger('afterHidden');
                        });
                    }

                }, this.options.hideAfter);
            }
        },

        reset: function ( resetWhat ) {

            if ( resetWhat === 'all' ) {
                $('.jq-toast-wrap').remove();
            } else {
                this._toastEl.remove();
            }

        },

        update: function(options) {
            this.prepareOptions(options, this.options);
            this.setup();
            this.bindToast();
        },

        close: function() {
            this._toastEl.find('.close-jq-toast-single').click();
        }
    };

    $.toast = function(options) {
        var toast = Object.create(Toast);
        toast.init(options, this);

        return {

            reset: function ( what ) {
                toast.reset( what );
            },

            update: function( options ) {
                toast.update( options );
            },

            close: function( ) {
            	toast.close( );
            }
        };
    };

    $.toast.options = {
        text: '',
        heading: '',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        loader: true,
        loaderBg: '#9EC600',
        stack: 5,
        position: 'bottom-left',
        bgColor: false,
        textColor: false,
        textAlign: 'left',
        icon: false,
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {},
        onClick: function () {}
    };

})( jQuery, window, document );


var inControl;
window.inControl = inControl = new Hadron("inControl", ".hadron-button");
inControl.runControl();

window.onload = function() {
  if (window.AudioContext) {
    inControl.context = new window.AudioContext();
  } else if (window.webkitAudioContext) {
    inControl.context = new window.webkitAudioContext();
  }

  function receiveMessage(e) {
    if (e.data == "refreshHadron") {
      inControl.refreshContol();
    }
  }

  window.addEventListener('message', receiveMessage);
};
