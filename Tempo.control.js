// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (2);

host.defineController ("Moss", "Tempo", "1.0", "DFBAE7B0-DA94-11E3-9C1A-0800200C9A66", "Jürgen Moßgraber");
host.defineMidiPorts (0, 0);

var TEMPO_RESOLUTION = 647;
const MAX_TRACKS     = 100;
var NUM_SCENES       = 100;

var transport = null;
var sceneBank = null;
var trackBank = null;
var launcherSlotBank = null;
var data = [];

function makeIndexedFunction (index, f)
{
    return function (value)
    {
        f (index,value);
    }
}

function init()
{
	transport = host.createTransport ();
    sceneBank = host.createSceneBank (NUM_SCENES);

    var i = 0;
    for (i = 0; i < NUM_SCENES; i++)
    {
        var scene = sceneBank.getScene (i);
        scene.name ().addValueObserver (makeIndexedFunction (i, function (index, name)
        {
            var result = name.toLowerCase ().match (/\D*(\d+)(\s)*bpm.*/);
            data[index] = result == null ? -1 : result[1];
        }));
    }
    
    trackBank = host.createTrackBank (MAX_TRACKS, 0, NUM_SCENES, true);
    for (i = 0; i < MAX_TRACKS; i++)
    {
        var track = trackBank.getChannel (i);
        launcherSlotBank = track.clipLauncherSlotBank ();
        launcherSlotBank.addIsPlayingObserver (function (index, isPlaying)
        {
            if (!isPlaying)
                return;
            
            if (index < 0 || data[index] == -1)
                return;
            
            // Rescale to Bitwig
            var scaled = data[index] - 20;
            transport.getTempo ().set (Math.min (Math.max (0, scaled), TEMPO_RESOLUTION), TEMPO_RESOLUTION);
        });
    };
    
	println ("Initialized.");
}

function exit()
{
	println ("Exited.");
}

function flush ()
{
}
