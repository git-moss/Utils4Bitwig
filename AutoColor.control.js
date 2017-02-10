// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (2);

host.defineController ("Moss", "Auto Color", "1.0", "6AE1A164-EA17-11E6-B006-92361F002671", "Jürgen Moßgraber");
host.defineMidiPorts (0, 0);

const MAX_TRACKS = 100;
const RGB_COLORS =
[
    [ 0.3294117748737335 , 0.3294117748737335 , 0.3294117748737335 , "Dark Gray"],
    [ 0.47843137383461   , 0.47843137383461   , 0.47843137383461   , "Gray"],
    [ 0.7882353067398071 , 0.7882353067398071 , 0.7882353067398071 , "Light Gray"],
    [ 0.5254902243614197 , 0.5372549295425415 , 0.6745098233222961 , "Silver"],
    [ 0.6392157077789307 , 0.4745098054409027 , 0.26274511218070984, "Dark Brown"],
    [ 0.7764706015586853 , 0.6235294342041016 , 0.43921568989753723, "Brown"],
    [ 0.34117648005485535, 0.3803921639919281 , 0.7764706015586853 , "Dark Blue"],
    [ 0.5176470875740051 , 0.5411764979362488 , 0.8784313797950745 , "Purplish Blue"],
    [ 0.5843137502670288 , 0.2862745225429535 , 0.7960784435272217 , "Purple"],
    [ 0.8509804010391235 , 0.21960784494876862, 0.4431372582912445 , "Pink"],
    [ 0.8509804010391235 , 0.18039216101169586, 0.1411764770746231 , "Red"],
    [ 1                  , 0.34117648005485535, 0.0235294122248888 , "Orange"],
    [ 0.8509804010391235 , 0.615686297416687  , 0.062745101749897  , "Light Orange"],
    [ 0.45098039507865906, 0.5960784554481506 , 0.0784313753247261 , "Green"],
    [ 0                  , 0.615686297416687  , 0.27843138575553894, "Cold Green"],
    [ 0                  , 0.6509804129600525 , 0.5803921818733215 , "Bluish Green"],
    [ 0                  , 0.6000000238418579 , 0.8509804010391235 , "Blue"],
    [ 0.7372549176216125 , 0.4627451002597809 , 0.9411764740943909 , "Light Purple"],
    [ 0.8823529481887817 , 0.4000000059604645 , 0.5686274766921997 , "Light Pink"],
    [ 0.9254902005195618 , 0.3803921639919281 , 0.34117648005485535, "Skin"],
    [ 1                  , 0.5137255191802979 , 0.24313725531101227, "Redish Brown"],
    [ 0.8941176533699036 , 0.7176470756530762 , 0.30588236451148987, "Light Brown"],
    [ 0.6274510025978088 , 0.7529411911964417 , 0.2980392277240753 , "Light Green"],
    [ 0.24313725531101227, 0.7333333492279053 , 0.3843137323856354 , "Grass Green"],
    [ 0.26274511218070984, 0.8235294222831726 , 0.7254902124404907 , "Light Blue"],
    [ 0.2666666805744171 , 0.7843137383460999 , 1                  , "Greenish Blue"],
];

var preferences = null;
var colorStrings = [];
var trackBank = null;


function makeIndexedFunction (index, f)
{
    return function (value)
    {
        f (index,value);
    }
}

function setColorOnMatch (channelIndex, colorIndex, regex)
{
    var channel = trackBank.getChannel (channelIndex);
    if (regex.test (channel.name ().get ()))
        channel.color ().set (RGB_COLORS[colorIndex][0], RGB_COLORS[colorIndex][1], RGB_COLORS[colorIndex][2]);
}

function init()
{
    var i = 0;
    
    preferences = host.getPreferences ();
    for (i = 0; i < RGB_COLORS.length; i++)
    {
        colorStrings[i] = "";
        var setting = preferences.getStringSetting (RGB_COLORS[i][3], "Auto Color", 256, "");
        setting.addValueObserver (makeIndexedFunction (i, function (index, name)
        {
            colorStrings[index] = name;
            if (colorStrings[index].length == 0)
                return;
            var parts = colorStrings[index].split (",");
            for (var p = 0; p < parts.length; p++)
            {
                var regex = new RegExp (".*" + parts[p] + ".*");
                for (i = 0; i < MAX_TRACKS; i++)
                    setColorOnMatch (i, index, regex);
            }
        }));
    }
    
    trackBank = host.createTrackBank (MAX_TRACKS, 0, 0, true);
    for (i = 0; i < MAX_TRACKS; i++)
    {
        trackBank.getChannel (i).name ().addValueObserver (makeIndexedFunction (i, function (index, name)
        {
            if (name.length == 0)
                return;
            // Match the new track name against all settings
            for (var s = 0; s < colorStrings.length; s++)
            {
                if (colorStrings[s] == null || colorStrings[s].length == 0)
                    continue;
                var parts = colorStrings[s].split (",");
                for (var p = 0; p < parts.length; p++)
                    setColorOnMatch (index, s, new RegExp (".*" + parts[p] + ".*"));
            }
        }));
    }

	println ("Initialized.");
}

function exit()
{
	println ("Exit.");
}

function flush ()
{
}
