#!/bin/bash
#Copyright © 2022-2025, @Acktarius, All Rights Reserved
gnome-terminal --geometry=100x15 --title=Update_Conceal_Core --wait -- bash -c '$1/daemonUpdate.sh; sleep 8' sh "$1"