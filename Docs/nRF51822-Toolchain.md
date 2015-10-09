# Setting up nRF51822 toolchain

## 1. Follow instructions for OS X (even if on Linux)

### URL
* https://devzone.nordicsemi.com/blogs/22/getting-started-with-nrf51-development-on-mac-os-x/

### Things to note
* We're using nRF51-SDK v9.0.0
* You don't need to download S110-SD-v7
	* this is included in v9 of the SDK in `components/softdevice/s110/hex`
	* when compiling app `loadbin s110_nrf51822_7.0.0_softdevice.bin 0` should actually point to hex file in above directory
* GCC ARM version doesn't really matter. On ubuntu can be installed through apt-get
* `Makefile.posix` is in `components/toolchain/gcc/Makefile.posix`

## 2. Configure on Eclipse

### URL
* https://devzone.nordicsemi.com/tutorials/7/development-with-gcc-and-eclipse/

### Things to note
* Configure Eclipse as descibed in the link above but use the steps below for updating the `Makefile` 
	1. Install `srecord` so that we can use the `srec_cat` command
	1. Add new targets
		* Can use [nRF51822-Eclipse-Makefile.patch](nRF51822-Eclipse-Makefile.patch) from this directory to create a working configuration
			*This is based on the `Makefile` in `examples/ble_peripheral/ble_app_hrs/pca10028/s110/armgcc`
		* Then use the targets to build the hex files
			* This could be chained further in future
