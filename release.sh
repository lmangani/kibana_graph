#!/bin/bash
# App Plugin packager for Kibana 5.x and higher
#
# Usage:
#        VERSION="6.2.2" ./release.sh
#

APPDIR=$(pwd)
APP=$(sed -n 's/.*"name": "\(.*\)",/\1/p' package.json)
if [ -z $VERSION ]; then
  OVERRIDE="false"
  VERSION=$(sed -n 's/.*"version": "\(.*\)",/\1/p' package.json)
fi

echo "$APP plugin packager for Kibana $VERSION";
# Temp Directory
cd $(mktemp -d)
TEMPDIR=$(pwd)
mkdir -p $TEMPDIR/kibana/$APP

# Build Plugin
cp -r $APPDIR/* $TEMPDIR/kibana/$APP/
cd $TEMPDIR/kibana/$APP
if [ -z $OVERRIDE ]; then
  echo "Patching with version $VERSION ... "
  sed -Ei "s/(\"version\":).*$/\1 \"$VERSION\",/" package.json
fi
npm install
cd $TEMPDIR

# Create Archive
zip -r $APP-$VERSION.zip ./kibana
mv $APP-$VERSION.zip $APPDIR/
cd $APPDIR

# Clean up!
rm -rf $TEMPDIR
ls -alF $APP-$VERSION.zip
echo "Done! Archive $APP-$VERSION.zip ready."

