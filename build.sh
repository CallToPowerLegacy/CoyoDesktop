#!/bin/bash

# Dependencies:
#   - electron-packager (https://github.com/electron-userland/electron-packager)
#   - packagesbuild (http://s.sudre.free.fr/Software/Packages/about.html)
#   - create-dmg (https://github.com/andreyvit/create-dmg)

Name="COYODesktop"
CompanyName="Denis Meyer"
AppCopyright="Denis Meyer"
Version="5.0.4b"
Build="1"

ElectronVersion="1.7.9"
SourceFolder=app
ReleasePath=release
SupportFolder=support
macIconsFile=${SupportFolder}/mac/logo.ico
infoPlist=${SupportFolder}/mac/Package/com.mindsmash.coyo.agent.plist
packageProject=mac/coyo-desktop-package-mac64.pkgproj
packageName=mac/coyo-desktop-mac64.pkg

function print_logo()
{
	echo ""
	echo "####################################"
	echo "#                                  #"
	echo "#    COYO Desktop build script     #"
	echo "#                                  #"
	echo "####################################"
	echo ""
}

function check_operatingSystem()
{
	case ${SYSTEM_NAME} in
	  Darwin)
		echo "1"
	    ;;
	  *)
		echo "0"
	    ;;
	esac
}

function exit_error()
{
	exit 2
}

print_logo

echo "Checking the operating system..."
SYSTEM_NAME=$(uname -s)
OPERATING_SYSTEM_OK=0
OPERATING_SYSTEM_OK=$(check_operatingSystem)
if [[ ${OPERATING_SYSTEM_OK} == 1 ]];
then
	echo "Operating system supported."
else
	echo "Error: Unsupported platform: ${SYSTEM_NAME}" >&2
	exit_error
fi

echo "Preparing directories..."
rm -rf ${ReleasePath}

echo "Building COYO Desktop..."
electron-packager app "${Name}" \
	--platform="darwin" \
	--arch="x64" \
	--electron-version=${ElectronVersion} \
	--version-string.CompanyName="${CompanyName}" \
	--version-string.ProductName="${Name}" \
	--version-string.ProductVersion="${Version}" \
	--app-version="${Version}" \
	--build-version="${Build}" \
	--app-copyright="${AppCopyright}" \
	--icon=${macIconsFile} \
	--extend-info=${infoPlist} \
	--out=${ReleasePath} \
	--overwrite

ElectronBuildFolder=COYODesktop-darwin-x64

echo "Packaging for Mac OS X x64..."
packagesbuild -v ${SupportFolder}/${packageProject}
mv ${SupportFolder}/${packageName} ${ReleasePath}/

echo "Cleaning up..."

echo "Done"
