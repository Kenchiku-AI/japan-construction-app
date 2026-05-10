#!/bin/bash
set -e

rm -rf ios/build

cd ios

xcodebuild \
  -workspace JapanConstruction.xcworkspace \
  -scheme "Kenchiku AI" \
  -configuration Release \
  -sdk iphoneos \
  -archivePath build/KenchikuAI.xcarchive \
  archive

xcodebuild \
  -exportArchive \
  -archivePath build/KenchikuAI.xcarchive \
  -exportPath build/export \
  -exportOptionsPlist ExportOptions.plist

cd ..

firebase appdistribution:distribute \
  "build/export/Kenchiku AI.ipa" \
  --app 1:395641334963:ios:74abd1f55da6558e4754c6 \
  --groups internal-testers