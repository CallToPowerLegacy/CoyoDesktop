#define appName "COYO Desktop"
#define appVersion "5.0.4"
#define appVersionAddition " build 1"
#define appPublisher "Denis Meyer"
#define appURL "https://www.coyoapp.com"
#define appExeName "COYODesktop.exe"
#define appPublisherContact "support@coyoapp.com"
#define appCopyright "2017 Denis Meyer"
#define srcPath "C:\Users\CallToPower\Documents\Programming\coyo.desktop"
#define desktopPath "C:\Users\CallToPower\Desktop"
#define installFolderName "COYODesktop"
#define appPath "release\COYODesktop-win32-x64"
#define setupName "COYODesktop-win64"

[Setup]
AppId={{BBEDC3C2-9C6C-41D1-AFC6-170143628608}}
AppName={#appName}
AppVersion={#appVersion}
AppPublisher={#appPublisher}
AppPublisherURL={#appURL}
AppSupportURL={#appURL}
AppUpdatesURL={#appURL}
DefaultDirName={pf}\{#installFolderName}
DefaultGroupName={#appName}
OutputDir={#desktopPath}
OutputBaseFilename={#setupName}
SetupIconFile={#srcPath}\support\windows\logo.ico
Compression=lzma
SolidCompression=yes
RestartIfNeededByRun=False
UsePreviousAppDir=False
AppContact={#appPublisherContact}
PrivilegesRequired=admin
CloseApplicationsFilter=*.exe,*.dll,*.chm, *.bat
UninstallLogMode=overwrite
UninstallDisplayName={#appName}
UninstallDisplayIcon={uninstallexe}
AppCopyright={#appCopyright}
RestartApplications=False
VersionInfoVersion={#appVersion}
VersionInfoCompany={#appPublisher}
VersionInfoCopyright={#appCopyright}
VersionInfoProductName={#appName}
VersionInfoProductVersion={#appVersion}
WizardImageFile={#srcPath}\support\windows\installer\installer_logo_big.bmp
WizardSmallImageFile={#srcPath}\support\windows\installer\installer_logo_small.bmp
DisableDirPage=yes
CreateUninstallRegKey=yes
AlwaysRestart=False

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl";
Name: "german"; MessagesFile: "compiler:Languages\German.isl";

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked;

[Files]
Source: "{#srcPath}\{#appPath}\*"; DestDir: "{app}\app"; Flags: ignoreversion recursesubdirs;
Source: "{#srcPath}\support\windows\logo.ico"; DestDir: "{app}\app"; Flags: ignoreversion;
Source: "{#srcPath}\support\windows\logo.png"; DestDir: "{app}"; Flags: ignoreversion;
Source: "{#srcPath}\support\windows\COYO.xml"; DestDir: "{app}"; Flags: ignoreversion;

[Icons]
Name: "{group}\{#appName}"; Filename: "{app}\app\{#appExeName}"; IconFilename: "{app}\app\logo.ico"; AppUserModelID: "com.coyoapp.desktop.coyo";
Name: "{group}\{cm:ProgramOnTheWeb,{#appName}}"; Filename: "{#appURL}";
Name: "{group}\{cm:UninstallProgram,{#appName}}"; Filename: "{uninstallexe}"; IconFilename: "{app}\app\logo.ico";
Name: "{commondesktop}\{#appName}"; Filename: "{app}\App\{#appExeName}"; IconFilename: "{app}\app\logo.ico"; Tasks: desktopicon;

[Run]
Filename: schtasks.exe; Parameters:"/CREATE /TN ""{#appName}"" /F /XML ""{app}\COYO.xml""";
Filename: icacls.exe; Parameters: """{app}"" /grant {username}:(OI)(CI)F /T /C /Q";
   
[UninstallDelete]
Type: filesandordirs; Name: "{localappdata}/Coyo";
  
[UninstallRun]
Filename: schtasks.exe; Parameters:"/DELETE /TN ""{#appName}""";
