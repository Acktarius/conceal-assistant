#!/bin/bash
#Copyright © 2022-2024, @Acktarius, All Rights Reserved
if [ ! -d conceal-core ]; then
echo "folder doesn't exist"; exit 1;
else
echo "removing directory..."
rm -r conceal-core || { echo 'command failed' ; exit 1; }
if [[ $? = 0 ]]; then
echo "conceal-core has been removed" 
fi
echo "downloading new version..."
git clone https://github.com/ConcealNetwork/conceal-core.git || { echo 'command failed' ; exit 1; }
if [[ $? = 0 ]]; then
echo "conceal-core has been downloaded" 
fi
echo "changing directory"
cd conceal-core || { echo 'command failed' ; exit 1; }
echo "creating build directory"
mkdir build || { echo 'command failed' ; exit 1; }
echo "changing to build"
cd build || { echo 'command failed' ; exit 1; }
echo "running cmake"
cmake .. || { echo 'command failed' ; exit 1; }
echo "running make"
make || { echo 'command failed' ; exit 1; }
fi
exit
