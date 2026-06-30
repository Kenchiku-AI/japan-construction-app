#!/bin/bash
# scripts/precompile-metal.sh
set -e

XCFRAMEWORK="node_modules/whisper.rn/ios/rnwhisper.xcframework"
SLICES=("ios-arm64" "ios-arm64_x86_64-simulator")

for SLICE in "${SLICES[@]}"; do
  FRAMEWORK_DIR="${XCFRAMEWORK}/${SLICE}/rnwhisper.framework"
  METAL_SRC="${FRAMEWORK_DIR}/ggml-metal.metal"

  if [ -f "$METAL_SRC" ]; then
    SDK="iphoneos"
    if [[ "$SLICE" == *simulator* ]]; then
      SDK="iphonesimulator"
    fi

    echo "Precompiling metallib for $SLICE..."
    xcrun -sdk "$SDK" metal -O -c "$METAL_SRC" -o "/tmp/ggml-metal-${SLICE}.air"
    xcrun -sdk "$SDK" metallib "/tmp/ggml-metal-${SLICE}.air" -o "${FRAMEWORK_DIR}/default.metallib"
    echo "Wrote ${FRAMEWORK_DIR}/default.metallib"
  fi
done