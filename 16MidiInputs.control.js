// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (1);

host.defineController ("Moss", "16 Midi Inputs", "1.0", "078E84B0-6057-11E5-A837-0800200C9A66");
host.defineMidiPorts (1, 0);


function init()
{
    var port = host.getMidiInPort (0);
    for (var channel = 0; channel < 16; channel++)
        createNoteInput (port, channel, "Channel " + (channel + 1));
   
	println ("Initialized.");
}

function exit()
{
}

function flush ()
{
}

// channel: 1-15
function createNoteInput (port, channel, inputName)
{
    var c = channel.toString (16);
    var noteInput = port.createNoteInput (inputName, '9' + c + '????', '8' + c + '????', 'A' + c + '????', 'B' + c + '????', 'C' + c + '????');
    noteInput.setShouldConsumeEvents (false);
}