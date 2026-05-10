#!/bin/bash
set -e

cd android

./gradlew assembleRelease

cd ..

firebase appdistribution:distribute \
  android/app/build/outputs/apk/release/app-release.apk \
  --app 1:395641334963:android:9add2e5b5377fcf04754c6 \
  --groups internal-testers