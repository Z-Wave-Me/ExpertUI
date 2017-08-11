zwave-expertui
==============

This User Interfaces allows to operate a Smart Home Network based on Z-Wave devices. It utilizes the software architecture "Z-Way", certified as Z-Wave Plus Controller.
## v1.3.1
#### New features
- No new features.

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
