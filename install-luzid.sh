#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

## TODO: update to 0.0.4
LUZID_RELEASE=v0.0.3
LUZID_DOWNLOAD_ROOT="https://github.com/luzid-app/luzid-sdk/releases/download"

# Copyright 2016 The Rust Project Developers. See the COPYRIGHT
# file at the top-level directory of this distribution and at
# http://rust-lang.org/COPYRIGHT.
#
# Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
# http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
# <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
# option. This file may not be copied, modified, or distributed
# except according to those terms.

{ # this ensures the entire script is downloaded #

main() {
  downloader --check

  need_cmd uname
  need_cmd mktemp
  need_cmd mkdir
  need_cmd rm

  for arg in "$@"; do
    case "$arg" in
      -h|--help)
        usage
        exit 0
        ;;
      *)
        ;;
    esac
  done

  _ostype="$(uname -s)"
  _cputype="$(uname -m)"
  _isosx_arm=false
  _isosx_intel=false
  _isosx=false
  _islinux=false

  case "$_ostype" in
  Linux)
    _ostype=unknown-linux-gnu
    _islinux=true
    ;;
  Darwin)
    _isosx=true
    if [[ $_cputype = arm64 ]]; then
      _cputype=aarch64
      _isosx_arm=true
    fi
    _ostype=apple-darwin
    _isosx_intel=true
    ;;
  *)
    err "machine architecture is currently unsupported"
    ;;
  esac

  echo "Detected platform: $_ostype $_cputype"

  if $_isosx; then
    mac_install $_isosx_arm
  else
    if $_islinux; then
      linux_install
    fi
  fi
}

mac_install() {
  need_cmd xattr

  # Figure out what backend we should download
  _isosx_arm=$1
  if $_isosx_arm; then
    echo "Installing Luzid for OSX Apple Silicon"
    _luzid_backend=luzid_aarch64-apple-darwin.tar.gz
  else
    echo "Installing Luzid for OSX Intel"
    _luzid_backend=luzid_x86_64-apple-darwin.tar.gz
  fi
  _luzid_ui=LuzidUI.app.tar.gz

  # Build the full URLs
  _luzid_backend_url="${LUZID_DOWNLOAD_ROOT}/macos-${LUZID_RELEASE}/${_luzid_backend}"
  _luzid_ui_url="${LUZID_DOWNLOAD_ROOT}/macos-${LUZID_RELEASE}/${_luzid_ui}"

  printf "Downloading Luzid %s:\n- ${_luzid_backend_url}\n- ${_luzid_ui_url}\n" "${LUZID_RELEASE}"

  # Create a temporary directory and change into it
  temp_dir="$(mktemp -d 2>/dev/null || ensure mktemp -d -t solana-install-init)"
  ensure mkdir -p "$temp_dir"

  pushd . > /dev/null

  cd ${temp_dir}

  # Download the Luzid binaries
  ensure downloader "${_luzid_backend_url}" "${_luzid_backend}"
  ensure downloader "${_luzid_ui_url}" "${_luzid_ui}"

  _luzid_bin=/usr/local/bin/luzid

  # Extract the luzid backend
  tar -xzf ${_luzid_backend} && rm ${_luzid_backend}
  if ! mv luzid ${_luzid_bin}; then
    echo "Failed to move luzid to /usr/local/bin/, trying again with sudo"
    sudo mv luzid ${_luzid_bin}
  fi

  printf "\nAdded luzid to /usr/local/bin/\n"


  # Make it easier to install the Luzid UI and extract it
  xattr -dr com.apple.quarantine ${_luzid_ui}
  tar -xzf ${_luzid_ui} && rm ${_luzid_ui}

  # Move the Luzid UI to Applications
  printf "\nPlease add LuzidUI.app to Applications\n"
  osascript -e "
tell application \"Finder\"
  activate
  open (\"/Applications/\" as POSIX file)
  set bounds of Finder window 1 to {0, 0, 500, 200}
  open (\"${temp_dir}\" as POSIX file)
  set bounds of Finder window 1 to {500, 0, 700, 200}
end tell
" > /dev/null

  popd > /dev/null

  echo "Added luzid to ${_luzid_bin}"
  echo "Launch it via the 'luzid' command from the terminal"
  echo "Open the 'LuzidUI.app' to connect the UI to it"
}

linux_install() {
  echo "Installing Luzid for Linux"
  _luzid_bundle=luzid.tar.gz
  # Build the full URLs
  _luzid_bundle_url="${LUZID_DOWNLOAD_ROOT}/linux-${LUZID_RELEASE}/${_luzid_bundle}"

  printf "Downloading Luzid %s:\n- ${_luzid_bundle_url}\n" "${LUZID_RELEASE}"

  # Create a temporary directory and change into it
  temp_dir="$(mktemp -d 2>/dev/null || ensure mktemp -d -t solana-install-init)"
  ensure mkdir -p "$temp_dir"

  pushd . > /dev/null

  cd ${temp_dir}

  ensure downloader "${_luzid_bundle_url}" "${_luzid_bundle}"
  # cp "$DIR/install-artifacts/${_luzid_bundle}" "${_luzid_bundle}"

  # Extract the luzid bundle
  tar -xzf ${_luzid_bundle} && rm ${_luzid_bundle}

  _luzid_bin=/usr/local/bin/luzid
  _usr_local_lib=/usr/local/lib/
  _luzidui_lib_dir=/usr/local/lib/luzidui
  _luzidui_lib_bin=${_luzidui_lib_dir}/luzidui
  _luzidui_bin=/usr/local/bin/luzidui

  if ! mv luzid ${_luzid_bin}; then
    echo "Failed to move luzid to ${_luzid_bin}, trying again with sudo"
    sudo mv luzid ${_luzid_bin}
  fi

  if ! rm -rf ${_luzidui_lib_dir}; then
    echo "Failed to remove previous luzidui at ${_luzidui_lib_dir}, trying again with sudo"
    sudo rm -rf ${_luzidui_lib_dir}
  fi

  if ! mv luzidui ${_usr_local_lib}; then
    echo "Failed to move luzidui to ${_luzidui_lib_dir}, trying again with sudo"
    sudo mv luzidui ${_usr_local_lib}
  fi

  if ! ln -sf ${_luzidui_lib_bin} ${_luzidui_bin}; then
    echo "Failed to link luzidui to ${_luzidui_bin}, trying again with sudo"
    sudo ln -sf ${_luzidui_lib_bin} ${_luzidui_bin}
  fi

  popd > /dev/null

  rm -rf $temp_dir

  echo "Added luzid to ${_luzid_bin}"
  echo "Added luzidui to ${_luzidui_bin}"

  echo "Launch it via 'luzid' command from the terminal"
  echo "Connect the UI to it via the 'luzidui' command from the termial"
}

need_cmd() {
  if ! check_cmd "$1"; then
      err "need '$1' (command not found)"
  fi
}

check_cmd() {
  command -v "$1" > /dev/null 2>&1
}

# Run a command that should never fail. If the command fails execution
# will immediately terminate with an error showing the failing
# command.
ensure() {
  if ! "$@"; then
    err "command failed: $*"
  fi
}

# This is just for indicating that commands' results are being
# intentionally ignored. Usually, because it's being executed
# as part of error handling.
ignore() {
    "$@"
}

# This wraps curl or wget. Try curl first, if not installed,
# use wget instead.
downloader() {
  if check_cmd curl; then
      program=curl
  elif check_cmd wget; then
      program=wget
  else
      program='curl or wget' # to be used in error message of need_cmd
  fi

  if [ "$1" = --check ]; then
      need_cmd "$program"
  elif [ "$program" = curl ]; then
      curl -SfL "$1" -o "$2"
  elif [ "$program" = wget ]; then
      wget "$1" -O "$2"
  else
      err "Unknown downloader"   # should not reach here
  fi
}

main "$@"

} # this ensures the entire script is downloaded #
