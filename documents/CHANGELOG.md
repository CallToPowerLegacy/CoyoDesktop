# COYO Desktop * Changelog

COYO for the desktop.

http://bit.ly/coyo4desktop

Crafted in Hamburg ⚓.
© 2017 Denis Meyer. All rights reserved.


## Downloads

* macOS: http://bit.ly/coyo4desktop_mac64
* Windows: http://bit.ly/coyo4desktop_win64


## 28.11.2017: Version 5.0.4 beta

* Client update
* Framework update

* Removed the version check due to not functioning correctly

### Improvements

* The COYO application client has been updated to version 5.0.4-BETA
* The Electron framework has been updated from version 1.6.11 to version 1.7.9


## 30.08.2017: Version 0.0.86 beta

* Client update

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.86


## 16.08.2017: Version 0.0.83 beta

* Client update

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.83


## 14.07.2017: Version 0.0.75 beta

* Client update
* Summarized notifications
* Added a gobal shortcut for showing and hiding COYO Desktop: "Alt + C"

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.75
* Introducing summarized notifications: View information about notifications, posts and messages in one native notification
* The COYO tab notifications have been deactivated
* "Alt + C" can now be pressed (gobal shortcut) for showing and hiding the application
* Fixed bootstrapping error
* Fixed socket subscriptions


## 29.06.2017: Version 0.0.71 beta

* Client update
* Framework update

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.71
* The Electron framework has been updated from version 1.6.1 to version 1.6.11


## 23.04.2017: Version 0.0.11 beta

* Client update

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.57


## 10.04.2017: Version 0.0.10 beta

* Client update

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.54


## 02.04.2017: Version 0.0.9 beta

* Client update
* Library update

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.50
* Electron Settings has been updated to version 3.0.10


## 22.03.2017: Version 0.0.8 beta

* Client update
* Misc improvements
* Bug fixes

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.48
* COYO application version retrieval has been improved
* Opening the in-app notification settings has been fixed


## 09.03.2017: Version 0.0.7 beta

* Client update
* Framework upgrade

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.41
* The Electron framework has been updated from version 1.4.13 to version 1.6.1
* COYO template paths have been fixed
* Windows: Not asking for restart after installation


## 19.02.2017: Version 0.0.6 beta

* Emoji picker for comments and chats
* Slightly bigger window
* Overhauled tray right-click menu
* Currently connected server and user information added to the menu

### Improvements

* The emoji picker has been activated for comments and chats
* The window dimensions have a changed slightly (width + 50px and height + 50px)
* The tray right-click window has been cleaned up
* Currently connected server and user information have been added to separate tray sub-menus
* Hide restart tour from the menu


## 15.02.2017: Version 0.0.5 beta

* Client update
* Branding update
* Display the currently connected COYO server and its version in the tray menu
* Bugfixes

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.38
* The currently connected COYO server is now shown in the tray menu, including its version
* The COYO client information in the "About" window is now generated from the COYO application client config
* "Play sounds" setting has been relabeled to "Acoustic notifications"
* The tray icon did not change on forced logouts
* Application-triggered window reloads opened a new browser window
* "Retry" opened a new browser window


## 09.02.2017: Version 0.0.4 beta

* Overhauled context menu
* Overhauled notifications
* Bugfixes and stability improvements

### Improvements

* The context menu has been overhauled and is now more stable
* The notifications have been overhauled and are now displayed natively via the browser
* The notification icons have been updated to display notifications, posts and messages
* Suppress COYO browser notifications
* Only displays notifications if the window is not opened, yet
* Ask the user on logout whether he wants to log out
* Does not display an error page on app start any longer
* Improved window positioning (especially on multiple screens)
* Improved "About" window


## 07.02.2017: Version 0.0.3 beta

* Client update
* Reload functionality
* Right-click context menu
* Authentication status
* Minor feature updates

### Improvements

* The COYO application client has been updated to version 1.0.0-BETA.36
* Added a reload COYO functionality that fully reloads the content of the browser window
* A right-click context menu is displayed when right-clicking inside the application window
* The context menu has different actions such as copy, paste and select
* The tray icon is greyed out when the user is not logged in
* The tour has been deactivated
* The main window is hidden when the window loses the focus
* The "Open in browser" option is available even if the user is not logged in
* The settings options can be toggled even if the user is not logged in


## 30.01.2017: Version 0.0.2 beta

* Bugfixes and stability improvements

### Improvements

* After opening an external link, the tray window closes

### Bugfixes

* Open external links in default external browser
* Click on the "New Post" notification redirects to the front main page, not to the profile of the user, any more


## 29.01.2017: Version 0.0.1 beta

* Initial stable beta release

### Features

* macOS and Windows support
* Graphical installation wizard
* Auto-start application when the user logs in
* Internationalization (i18n), automatic detection of the user language, currently supported languages: English (US) and german (DE)
* Tray icon with a right-click menu with various options
* Fully functional COYO application client - COYO "In-App"
* Native notifications on new notifications, new posts and new messages
* On notification click, the content will be displayed "In-App"
* [Technical] Background polling of posts and messages due to unreliable websockets
