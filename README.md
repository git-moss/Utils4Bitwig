# Utils4Bitwig

Several utility scripts for Bitwig. **These scripts require Bitwig Studio 2.0 Beta.**

## 16 Midi Inputs

Splits the selected midi input into its 16 specific midi channels. This means that you can select a specific midi channel to control a track in Bitwig Studio.

## Auto Color

This script provides auto coloring of tracks. In the settings of the script you can set a search string for each color. E.g. if you write "Bass" after the color red all tracks, which contain the word "Bass" in their name will automatically be colored in red.
For multiple search strings use a comma, e.g. I put "Drum,BD,Snare,HiHat,Crash" after blue.

## Tempo control

This script scans the names of scenes for tempo information. If you start such a scene the tempo is automatically set. E.g. if you set the name of a scene to "My Song 127BPM", the tempo will be set to 127 bpm when you start the scene. "BPM" can be written in upper or lower case. You can leave spaces between the numbers and "bpm".