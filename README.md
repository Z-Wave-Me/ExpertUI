zwave-expertui
==============

This User Interfaces allows to operate a Smart Home Network based on Z-Wave devices. It utilizes the software architecture "Z-Way", certified as Z-Wave Plus Controller.

## v1.2.0
#### New features
- Enhanced display on mobile devices and tablets.
- Spinner indicators.

#### Changes
- Function runCmd() replaced with the new fn runZwaveCmd().
- Completely refactored CSS for simpler customizations.
- Folder app/core removed.

#### Fixes
- ???.

## v1.1.0
#### New features
- Network map. 
- Zniffer. 
- Configuration: Generic configuration if no zddXml file. 
- Configuration: New section postfix. 
- Configuration: New section link health.

#### Changes
- Device/Status: Added new column wakeup interval, removed column DDR, interview icon replaced, check conectivity button replaced with icon.
- IMA: Controller info removed from the menu and is displayed on the Network > Control page. Removed Capabillities, Functions, Buttons.
- Menu Configuration moved to Device > Configuration.
- Network/Timing: Type replaced with icon.
- Network/Routing: New type icons.
- IMA: Network/Control - Frequency is hidden in the IMA version.

#### Fixes
- Error when setting Wake up time for StellaZ thermostatic device #206.
- Error on license tab #211.

## v1.0.6
#### New features
- Configuration: Select Device Description No configuration file #103. 
- Configuration: button Set All to Default #136.
- Bitrange support and add description in the Configuration #50.
- Descriptions about colors of Routing Table #154.

#### Fixes
- Can't configure second parameter #174.
- Thermostat widget sends wrong command #146.
- Associations tab does not work for devices with multiple instances/endpoints #167.
- Expert commands use input field from instance 0, regardless of the actual instance #168.
- In Association tab Association to 118:0 write 118.0 and not just 118. #173.
- Battery Icon Update Problem #179.
- Wrong handling of Expert Commands prototypes #184.
- New device name not showed in Configuration for field #183.
- After Include Redirection Error #178.
- In Configuration don't show self #169.
- In Interview results dialog run interview on the corresponding channel #181.
- Use real scale instead of explicit °C #193

## v1.0.0
- Released.
