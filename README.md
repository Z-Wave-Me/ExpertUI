zwave-expertui
==============

This User Interfaces allows to operate a Smart Home Network based on Z-Wave devices. It utilizes the software architecture "Z-Way", certified as Z-Wave Plus Controller.

## v1.5.9
#### New features:
- Button to select all security keys
- Save PIN code from previous inclusions to suggest on re-inclusion
- Secure/unsecure inclusion toggle now have option for S2/unsecure (to exclude S0)
- US Long Range requency
- Packet statistics reset button
#### Fixes:
- Rework of inclusion messages
- Routemap fixes
- Packets statistics page
- Disable Learn mode if SIS and has devices
- Fix empty configuration page if xml file does not exist

## v1.5.8
#### New features:
- Added new Packets Statistics page
- Added new Signal strength page
- Add reset button on route map page
- Move route map to analytics
#### Fixes:
- UserCode v2, Indicator v4, Alarm v1/v2+, SwitchColor, DefaultReset, SwitchBinary Expert Commands UI fixed
- Fixed web icon for LR

## v1.5.7
#### Fixes:
- Added automatical update of statistics, clear fixed
- Added background RSSI page
- In the Association tab, if a node is added, allow adding another channel to the same group

## v1.5.6
#### New features:
- Added support of RaZberry 7 and RaZberry 7 Pro
- Added support for Long Range

## v1.5.5
#### New features:
- Added bootloader and firmware versions on the firmware upgrade page
#### Fixes:
- Fix settings title overflow
- Adaptive menu on mobil devices

## v1.5.4
#### Fixes:
- added button get parm value from device
- Fixed missing battery icon
- translate fixes
- image on the interview tab

## v1.5.3
#### New features
- Added Promiscuous mode to Zniffer page
- Added list of available firmwares from Z-Wave.Me Firmware Storage
- Added *.gbl to OTA file list for 7th gen firmwares
- Added Noise Level dashed line delimiting good from bad
- Make clickable problematic nodes on home page
- Rescaled Background RSSI measurement
- Added description to Include device button in case of license limit
#### Fixes:
- Don't show useless fields for controller itself in Interview tab (isFailed, Interview status, Request NIF, ...)
- Don't crash Interview tab on missing ZDDX file - just continue
- Updated to Font Awesome 5
- UZB/RaZ firmware upgrade better translation

## v1.5.2
#### New features:
- Improved Route Map - priority route
- Reorg refactored
- Added Instance Id to the list of locks nad notifications
- InspectQueue pause button
#### Fixes:
- Fixed missing notification about exclusion of foreign device
- Fixed broken Interiew tab on missing ZDDX entries resourceLinks and others
- Fixed A/MCA problem in Association tab
- Fixed CSA inclusion
- Notifications channels fixed
- Route Map fixes

## v1.5.1
#### Fixes:
- Fixed missing PUK in the UI

## v1.5.0
#### Features:
- Adding PNG and GIF to Route Map image type
- Allow chip selection for Over-The-Air update of the device
- Added .otz to the f/w possible extension
- Route Map improved
- Added button NO PIN to Verify device PIN dialog in unauthenticated mode
- Added UI for secondary in Security S2 CSA mode
- Demo license button added
- Frequencies groups all visible in debug mode
- S2 Require CSA switch added
- SUC/SIS management disabling/enabling buttons
- Enter/Leave different Networks description
- Added Clock configuration
- Notify user to wait for S2 interview

#### Fixes:
- Fixed error in Associations tab
- Fix to show/hide Include/Exclude buttons in secondary/primary role
- Fixed convertion of S2 pin code to 5 digits
- Increasing timers grantKeys and verifyDSK up to 240
- Uncommented Association dots in routing table. Legend added
- Allow select Z-Wave dongle if currenly selected is absent
- Fixed routing table orientation (transponded)
- Fixed bugs in data.updateTime
- Fixed update problem
- Fixed Set of Associations on channels
- Fixed #N.0 on plain association to #N
- Fixed Association view when EP contains Association CC
- EUI-173: After changing givenName is used function .devices.SaveData() #265
- EUI-171: Fixing assoc bug. $scope.assocGroupsDevices are now defined as object
- EUI-170: Adjust controls for multiple thermostat instances, minor fixes in meter.js

## v1.3.1
#### New features
- Route map with possibility to upload own floor plan from PC.

#### Changes
- All pending requests are oborted after leaving the page.
- Added major/minor version to the licence scratch request.

#### Fixes
- Don't poll InspectQueue and ZWaveAPI/Data/xxx if current request is still pending #262.
- Restore backup with network topology not possible anymore #261.

## v1.3.0
#### New features
- Progress bar in the  firmware update tab.
- Thermostat SetPoint has step of 0.5 deg
- Analytics: Zniffer, Background noise, Noise Meter, Zniffer History.
- Settings: Time and date format, Firmware Update, Bug report.
- Network: Statistics visualization, Link status.

#### Changes
- Firmware update: Target ID as select.
- Neighbors: Completely refactored.

#### Fixes
- Switches are duplicated.
- Door lock open status is not shown.
- Not available selection for two dongles.
- The wakeup is shown, but device is mains powered.
- Expert commands with multiple parameters are wrong.
- Water Meters are not shown in the list of Meters question.
- Can't configure second parameter.
- In expert commands SwitchBinary 0 is sent instead of 255.
- In routing table timestamps are not updated.
- When I press Update on motion and tamper th clock is not becoming red.
- F/w update UI is shown, but device don't have FirmwareUpgrade CC.
- Thermostat widget sends wrong command.

## v1.2.0
#### New features
- Notifications page.
- UZB: Button for uploading bootloader/firmware.
- Interview progress bar.
- Icons in the menu.
- Enhanced display on mobile devices and tablets.
- Spinner indicators.

#### Changes
- Disabling Include into network if SIS.
- Configuration/Firmware refactored.
- Languages moved to settings.
- New page "Settings" added.
- Network/Control divided into views.
- Homepage divided into views.
- Notes saved into data holder.
- Function runCmd() replaced with the new fn runZwaveCmd().
- Completely refactored CSS for simpler customizations.
- Configuration controllers divided in separate files.
- Folder app/core removed.

#### Fixes
- Fixing not configured devices on the homepage.
- Can't configure second parameter #174
- In routing table timestamps are not updated #161
- LICENSE file missing #213
- Device counter on the homepage.
- Disappeared temperature slider #146.

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
