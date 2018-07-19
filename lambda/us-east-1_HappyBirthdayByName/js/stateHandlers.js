'use strict';

var Alexa = require('alexa-sdk');
var constants = require('./constants');
var https = require("https");

const defaultHappyBirthdaySongName = "Happybirthday";
const welcomeOutput = "Welcome to One Happy Birthday. You can play a One Happy Birthday song with a name. " +
    "For example you can say, play a birthday song for Maria";

const welcomeReprompt = 'You can play a One Happy Birthday song with a name. For example you can say, play a birthday song for Maria';
const cardTitle = '1HappyBirthday';
const oneHappyBirthdayMsg = " Here is a One Happy Birthday Song for you.";
const letsSingHappyBirthday = "Let's sing the one happy birthday song.";
const happyBirthdayName = "Happy Birthday NAME. ";
var songIntro = [
    "Hello Everyone, It's NAME's birthday. " + letsSingHappyBirthday,
    "Attention Everyone, It's NAME's birthday. " + letsSingHappyBirthday,
    happyBirthdayName + oneHappyBirthdayMsg,
    happyBirthdayName + "Celebrate your birthday today. Celebrate being Happy every day." + oneHappyBirthdayMsg,
    happyBirthdayName + "May your birthday and every day be filled with the warmth of sunshine, the happiness of smiles, the sounds of laughter, the feeling of love and the sharing of good cheer." + oneHappyBirthdayMsg,
    happyBirthdayName + "I hope you have a wonderful day and that the year ahead is filled with much love, many wonderful surprises and gives you lasting memories that you will cherish in all the days ahead." + oneHappyBirthdayMsg,
    happyBirthdayName + "May your birthday be filled with many happy hours and your life with many happy birthdays." + oneHappyBirthdayMsg,
    happyBirthdayName + "I hope this is the begining of your greatest, most wonderful year ever!" + oneHappyBirthdayMsg,
    happyBirthdayName + "Wishing you a day that is as special in every way as you are." + oneHappyBirthdayMsg,
    happyBirthdayName + "Wishing you all the great things in life, hope this day will bring you an extra share of all that makes you happiest." + oneHappyBirthdayMsg,
    happyBirthdayName + "Have a wonderful happy, healthy birthday and many more to come." + oneHappyBirthdayMsg,
    happyBirthdayName + "Wishing you health, love, wealth, happiness and just everything your heart desires." + oneHappyBirthdayMsg,
    happyBirthdayName + "I wish you a wonderful Birthday!! I hope you have an amazing day and lots of fun! Enjoy this day, you deserve it!" + oneHappyBirthdayMsg,
    happyBirthdayName + "May you create a memory today that becomes your happy place in all the many years yet to come." + oneHappyBirthdayMsg

];

var birthdaySongLyrics = "Happy Birthday, NAME \n" +
    "Happy Happy Birthday \n" +
    "Happy Birthday, NAME \n" +
    "Happy Birthday \n" +
    "Happy B-day, NAME \n" +
    "Happy Happy B-day \n" +
    "Happy B-day, NAME \n" +
    "Oh yeah. \n" +
    "Feliz cumpleaños, NAME \n" +
    "My dog says woof woof to you NAME \n" +
    "My dog says arooooou! \n" +
    "NAME, Birthday, Birthday NAME \n" +
    "Happy B-Day, Happy B-Day, NAME \n" +
    "Feliz cumpleaños, NAME";


var stateHandlers = {
    startModeIntentHandlers: Alexa.CreateStateHandler(constants.states.START_MODE, {
        /*
         *  All Intent Handlers for state : START_MODE
         */
        'LaunchRequest': function () {
            //  Change state to START_MODE
            console.log('START_MODE Launch');
            this.handler.state = constants.states.START_MODE;
            this.attributes['index'] = 0;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['loop'] = true;
            this.attributes['shuffle'] = false;
            this.attributes['playbackIndexChanged'] = true;
            /*this.response.speak(welcomeOutput).listen(welcomeReprompt);
            this.emit(':responseReady');*/
            this.attributes['Name'] = defaultHappyBirthdaySongName;
            this.attributes['Url'] = "http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/012005.mp3";
            this.attributes['SongTitle'] = '';
                //  Change state to START_MODE
                //thisRef.handler.state = constants.states.START_MODE;
                console.log('Playing one happy birthday without name');
                controller.play.call(this);
        },
        'PlayAudio': function () {
            playAudioIntentHandler(this);
        },
        'Settings': function () {
            settingsIntentHandler(this);
        },
        'AMAZON.HelpIntent': function () {
            var message = 'You can play a One Happy Birthday song with a name.' +
                ' For example you can say, play a birthday song for Maria.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent': function () {
            var message = 'Good bye.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        'AMAZON.CancelIntent': function () {
            var message = 'Good bye.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        'SessionEndedRequest': function () {
            // No session ended logic
        },
        'Unhandled': function () {
            var message = "Sorry, I didn't understand. Please try again";
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        }
    }),
    playModeIntentHandlers: Alexa.CreateStateHandler(constants.states.PLAY_MODE, {
        /*
         *  All Intent Handlers for state : PLAY_MODE
         */
        'LaunchRequest': function () {
            /*
             *  Session resumed in PLAY_MODE STATE.
             *  If playback had finished during last session :
             *      Give welcome message.
             *      Change state to START_STATE to restrict user inputs.
             *  Else :
             *      Ask user if he/she wants to resume from last position.
             *      Change state to RESUME_DECISION_MODE
             */
            this.response.speak(welcomeOutput).listen(welcomeReprompt);
            this.emit(':responseReady');
        },
        'PlayAudio': function () { playAudioIntentHandler(this); },
        'AMAZON.PauseIntent': function () { controller.stop.call(this) },
        'AMAZON.StopIntent': function () { controller.stop.call(this) },
        'AMAZON.CancelIntent': function () { controller.stop.call(this) },
        'AMAZON.ResumeIntent': function () { controller.play.call(this) },
        'AMAZON.StartOverIntent': function () { controller.startOver.call(this) },
        'AMAZON.LoopOnIntent': function () { controller.loopOn.call(this) },
        'AMAZON.LoopOffIntent': function () { controller.loopOff.call(this) },
        'AMAZON.StartOverIntent': function () { controller.startOver.call(this) },
        'AMAZON.HelpIntent': function () {
            // This will called while audio is playing and a user says "ask <invocation_name> for help"
            var message = 'You are listening to the ' + this.attributes['SongTitle'] +
                ' At any time, you can say Pause to pause the song and Resume to resume.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        'Settings': function () {
            settingsIntentHandler(this);
        },
        'SessionEndedRequest': function () {
            // No session ended logic
        },
        'Unhandled': function () {
            var message = "Sorry, I didn't understand. At any time, you can say Pause to pause the audio and Resume to resume.";
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        }
    })
};

module.exports = stateHandlers;

var controller = function () {
    return {
        play: function () {
            /*
             *  Using the function to begin playing audio when:
             *      Play Audio intent invoked.
             *      Resuming audio when stopped/paused.
             *      Next/Previous commands issued.
             */
            this.handler.state = constants.states.PLAY_MODE;
            if (this.attributes['playbackFinished']) {
                // Reset to top of the playlist when reached end.
                this.attributes['index'] = 0;
                this.attributes['offsetInMilliseconds'] = 0;
                this.attributes['playbackIndexChanged'] = true;
                this.attributes['playbackFinished'] = false;
            }
            var token = "PlayOrder1";
            var playBehavior = 'REPLACE_ALL';
            var name = this.attributes['Name'];
            var url = this.attributes['Url'];
            var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

            this.response.audioPlayerPlay(playBehavior, url, token, null, offsetInMilliseconds);
            this.emit(':responseReady');
        },
        stop: function () {
            /*
             *  Issuing AudioPlayer.Stop directive to stop the audio.
             *  Attributes already stored when AudioPlayer.Stopped request received.
             */
            this.attributes['index'] = 0;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['playbackFinished'] = true;
            this.response.audioPlayerStop();
            this.emit(':responseReady');
        },
        playNext: function () {
            /*
             *  Called when AMAZON.NextIntent or PlaybackController.NextCommandIssued is invoked.
             *  Index is computed using token stored when AudioPlayer.PlaybackStopped command is received.
             *  If reached at the end of the playlist, choose behavior based on "loop" flag.
             */
            var message = 'Sorry, this command is not supported';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        playPrevious: function () {
            /*
             *  Called when AMAZON.PreviousIntent or PlaybackController.PreviousCommandIssued is invoked.
             *  Index is computed using token stored when AudioPlayer.PlaybackStopped command is received.
             *  If reached at the end of the playlist, choose behavior based on "loop" flag.
             */
            var message = 'Sorry, this command is not supported';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        loopOn: function () {
            // Turn on loop play.
            this.attributes['loop'] = true;
            var message = 'Loop turned on.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        loopOff: function () {
            // Turn off looping
            this.attributes['loop'] = false;
            var message = 'Loop turned off.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        shuffleOn: function () {
            // Turn on shuffle play.
            var message = 'Sorry, this command is not supported';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        shuffleOff: function () {
            // Turn off shuffle play. 
            var message = 'Sorry, this command is not supported';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        startOver: function () {
            // Start over the current audio file.
            this.attributes['offsetInMilliseconds'] = 0;
            controller.play.call(this);
        },
        reset: function () {
            // Reset to top of the playlist.
            this.attributes['index'] = 0;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['playbackIndexChanged'] = true;
            controller.play.call(this);
        }
    }
}();

//Settings handler
function settingsIntentHandler(thisRef) {
    var confirmDialogSettings = thisRef.attributes['confirmDialog'];
    var option = getOptionFromIntent(thisRef.event.request.intent);
    var message;
    console.log(confirmDialogSettings);
    if (option == null || option == "Not Valid") {

        if (confirmDialogSettings != null && confirmDialogSettings === false)
            message = "Your setting, to confirm the name before playing the song, is off. You can change it by saying, turn on the confirmation dialog.";
        else
            message = 'Your setting, to confirm the name before playing the song, is on. You can change it by saying, turn off the confirmation dialog.';

        thisRef.response.speak(message).listen(message);
        thisRef.emit(':responseReady');
    }
    else {
        message = "Your setting has been changed successfully. Good bye.";
        thisRef.attributes['confirmDialog'] = option == "Yes" ? true : false;
        thisRef.response.speak(message);
        thisRef.emit(':responseReady');
    }
}
//Play Audio Intent Handler
function playAudioIntentHandler(thisRef) {
    var confirmDialogSettings = thisRef.attributes['confirmDialog'];
    if (confirmDialogSettings == null)
        confirmDialogSettings = true;
    thisRef.attributes['index'] = 0;
    thisRef.attributes['offsetInMilliseconds'] = 0;
    thisRef.attributes['loop'] = true;
    thisRef.attributes['shuffle'] = false;
    thisRef.attributes['playbackIndexChanged'] = true;
    var intentObj = thisRef.event.request.intent;
    var name = getNameFromIntent(thisRef.event.request.intent);
    var spelloutName = getSpellOutNameFromIntent(thisRef.event.request.intent);
    if (spelloutName)
        name = spelloutName;

    console.log('PlayAudio ' + name);
    if (name == null) {
        var message = "Whose birthday is it?";
        thisRef.response.cardRenderer('1HappyBirthday', message, null);
        //thisRef.emit(':elicitSlotWithCard', 'Name', message, message, cardTitle, speechOutput);
        thisRef.emit(':elicitSlot', 'Name', message, message);
        return;
    }
    if (name.toUpperCase() == "MY" || name.toUpperCase() == "ME") {
        var message = "oh, Today is your birthday. What's your name?";
        thisRef.response.cardRenderer('1HappyBirthday', message, null);
        //thisRef.emit(':elicitSlotWithCard', 'Name', message, message, cardTitle, speechOutput);
        thisRef.emit(':elicitSlot', 'Name', message, message);
        return;
    }
    name = name.capitalize();
    if (confirmDialogSettings === true && intentObj.slots.Name.confirmationStatus !== 'CONFIRMED') {
        if (intentObj.slots.Name.confirmationStatus !== 'DENIED') {
            // Slot value is not confirmed
            var slotToConfirm = 'Name';
            //var speechOutput = 'You want to play Happy Birthday Song for ' + name + ', is that correct?';
            var speechOutput = name + ' is spelled out as <say-as interpret-as="spell-out">' + name + '</say-as>, is that correct?';
            var repromptSpeech = speechOutput;
            //thisRef.emit(':confirmSlotWithCard', slotToConfirm, speechOutput, repromptSpeech, cardTitle, speechOutput);
            thisRef.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
        } else {
            // Users denies the confirmation of slot value
            var slotToElicit = 'Name';
            var speechOutput = 'Okay, Whose birthday is it? Please spell out the name.';
            //thisRef.emit(':elicitSlotWithCard', slotToElicit, speechOutput, speechOutput, cardTitle, speechOutput);
            thisRef.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
        }
    }
    else {
        playBirthdaySong(thisRef, name);
    }
}

//End
//Helper Functions
function getOptionFromIntent(intent) {
    var yesOptions = ["yes", "on", "enable", "show", "ask"];
    var noOptions = ["no", "off", "disable", "don't show", "don't ask"];
    var optionSlot = intent.slots.Option;

    if (!optionSlot || !optionSlot.value) {
        return null;
    } else {
        var option = optionSlot.value.toLowerCase();
        if (yesOptions.includes(option))
            return "Yes";
        else if (noOptions.includes(option))
            return "No";
        else
            return "Not Valid";

    }
}

function getNameFromIntent(intent) {

    var nameSlot = intent.slots.Name;

    if (!nameSlot || !nameSlot.value) {
        return null;
    } else {
        return nameSlot.value.trim().replace(/\s/g, '');;
    }
}
function getSpellOutNameFromIntent(intent) {

    var spellOutName = "";
    var letter1 = intent.slots.FirstLetter;
    var letter2 = intent.slots.SecondLetter;
    var letter3 = intent.slots.ThirdLetter;
    var letter4 = intent.slots.FourthLetter;
    var letter5 = intent.slots.FifthLetter;
    var letter6 = intent.slots.SixthLetter;
    var letter7 = intent.slots.SeventhLetter;
    var letter8 = intent.slots.EighthLetter;
    var letter9 = intent.slots.NinthLetter;
    var letter10 = intent.slots.TenthLetter;
    var letter11 = intent.slots.EleventhLetter;
    var letter12 = intent.slots.TwelfthLetter;
    var letter13 = intent.slots.ThirteenthLetter;
    var letter14 = intent.slots.FourteenthLetter;
    var letter15 = intent.slots.FifteenthLetter;
    var letter16 = intent.slots.SixteenthLetter;
    var letter17 = intent.slots.SeventeenthLetter;
    var letter18 = intent.slots.EighteenthLetter;
    var letter19 = intent.slots.NineteenthLetter;
    var letter20 = intent.slots.TwentiethLetter;

    if (letter1 && letter1.value) 
    spellOutName += letter1.value;

    if (letter2 && letter2.value) 
    spellOutName += letter2.value;

    if (letter3 && letter3.value) 
    spellOutName += letter3.value;

    if (letter4 && letter4.value) 
    spellOutName += letter4.value;

    if (letter5 && letter5.value) 
    spellOutName += letter5.value;

    if (letter6 && letter6.value) 
    spellOutName += letter6.value;

    if (letter7 && letter7.value) 
    spellOutName += letter7.value;

    if (letter8 && letter8.value) 
    spellOutName += letter8.value;

    if (letter9 && letter9.value) 
    spellOutName += letter9.value;

    if (letter10 && letter10.value) 
    spellOutName += letter10.value;

    if (letter11 && letter11.value) 
    spellOutName += letter11.value;

    if (letter12 && letter12.value)  
    spellOutName += letter12.value;

    if (letter13 && letter13.value) 
    spellOutName += letter13.value;

    if (letter14 && letter14.value) 
    spellOutName += letter14.value;

    if (letter15 && letter15.value) 
    spellOutName += letter15.value;

    if (letter16 && letter16.value) 
    spellOutName += letter16.value;

    if (letter17 && letter17.value) 
    spellOutName += letter17.value;

    if (letter18 && letter18.value) 
    spellOutName += letter18.value;

    if (letter19 && letter19.value) 
    spellOutName += letter19.value;

    if (letter20 && letter20.value) 
    spellOutName += letter20.value;

    if (spellOutName == "")
    return null;
    else
    return spellOutName.trim().replace(/\s/g, '').replace(/\./g, '');
}
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function playBirthdaySong(thisRef, name) {
    if (name) {
        //name = name.capitalize();
        var options = {
            host: 's3-us-west-2.amazonaws.com',
            path: '/1hbcf/' + name + ".mp3",
            method: 'HEAD'
        };
        console.log(options);
        var req = https.request(options, function (res) {
            if (res.statusCode == 404) {
                console.log('Not Found - ' + name);
                var message = "Sorry, We don't have a One Happy Birthday song for your name. " +
                    "Please visit our website 1HappyBirthday.com to request a song for your name. But for now, you can celebrate with this song.";
                thisRef.response.speak(message);
                //thisRef.response.cardRenderer('1HappyBirthday', message, null);
                //thisRef.emit(':responseReady');
                if (canThrowCard.call(this)) {
                    message = "\n Alexa got your name as " + name + ". If you think that Alexa didn't get your name right then you can turn ON the confirmation dialog by going to the settings.";
                    message += "\n Just say, Open One Happy Birthday and Go to Settings."
                    var cardContent = message + "\n 1HappyBirthday Song Lyrics \n";
                    cardContent += birthdaySongLyrics.replace(/NAME/g, "");
                    thisRef.response.cardRenderer(cardTitle, cardContent, null);
                }
                thisRef.attributes['Name'] = defaultHappyBirthdaySongName;
                thisRef.attributes['Url'] = "https://s3-us-west-2.amazonaws.com/1hbcf/" + defaultHappyBirthdaySongName + ".mp3";
                thisRef.attributes['SongTitle'] = 'One Happy Birthday Song';
                //  Change state to START_MODE
                //thisRef.handler.state = constants.states.START_MODE;
                console.log('Playing one happy birthday without name');
                controller.play.call(thisRef);
            }
            else {
                var speechOutput = randomPhrase(songIntro);
                speechOutput = speechOutput.replace(/NAME/g, name);
                console.log(speechOutput);
                thisRef.response.speak(speechOutput);
                if (canThrowCard.call(this)) {
                    var cardContent = "1HappyBirthday Song Lyrics - Personalized with your name \n";
                    cardContent = birthdaySongLyrics.replace(/NAME/g, name);
                    thisRef.response.cardRenderer(cardTitle, cardContent, null);
                }
                thisRef.attributes['Name'] = name;
                thisRef.attributes['Url'] = "https://s3-us-west-2.amazonaws.com/1hbcf/" + name + ".mp3";
                thisRef.attributes['SongTitle'] = 'One Happy Birthday Song for ' + name;
                //  Change state to START_MODE
                //thisRef.handler.state = constants.states.START_MODE;
                console.log('Playing one happy birthday song for ' + name);
                controller.play.call(thisRef);
            }
        }
        );
        req.end();

    }
}

function canThrowCard() {
    return true;
}
//This function gets the randon intro phrase from predefined
function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return (array[i]);
}

function delegateSlotCollection() {
    console.log("in delegateSlotCollection");
    console.log("current dialogState: " + this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        var updatedIntent = this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
    } else {
        console.log("in completed");
        console.log("returning: " + JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
    }
}
  //End
