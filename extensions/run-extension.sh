#!/bin/bash

TOPLEVEL=$(git rev-parse --show-toplevel)
CLI_EXE="${TOPLEVEL}/target/release/phylum"
EXTENSION="${TOPLEVEL}/extensions/$1"

if [ "$1" == "" ]; then
  echo "Usage: $0 <extension>"
  exit 1
fi

if [ ! -d $EXTENSION ]; then
  echo "${EXTENSION}: not a directory"
  exit 1
fi

TMP_DIR=$(mktemp -d)

if [ ! -x $CLI_EXE ]; then
  pushd "${TOPLEVEL}/cli"
    cargo build --release --features extensions 
  popd
fi

XDG_DATA_HOME=$TMP_DIR \
  $CLI_EXE extension add $EXTENSION

XDG_DATA_HOME=$TMP_DIR \
  $CLI_EXE $1

rm -fr $TMP_DIR
