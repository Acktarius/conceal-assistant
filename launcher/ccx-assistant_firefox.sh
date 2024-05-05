#!/bin/bash
#Launch conceal-assistant and open page in firefox
# this file is subject to Licence
#Copyright (c) 2023-2024, Acktarius
##################################################################


wdir="/opt/conceal-assistant"

#functions
function assistant_to () {
cd $wdir
gnome-terminal --geometry=100x15 --title=Conceal_Assistant -- bash -c "sudo nodemon server.js" &
sleep 8
firefox "http://localhost:3500"
}
electron() {
npm exec electron ${wdir}/electron/main.js
}

if [[ ! -f /etc/systemd/system/ccx-assistant.service ]]; then
	if zenity --question --title "no service installed" --width 400 --height 80 --text "launch from terminal instead?"
        then
		if [[ ! -d $wdir ]]; then
    			if zenity --question --title "Conceal Assistant couldn't be find" --width 400 --height 80 --text "Would you like to visit Conceal-assistant Github page? or locate a specific folder" --ok-label="Yes" --cancel-label="Locate"
    			then
    			firefox "https://github.com/acktarius"
    			sleep 1
    			exit
    			else
    			wdir=$(zenity --file-selection --title="Locate Conceal-assistant Directory" --width 400 --height 250 --directory)
			case $? in
        			0)
				if [[ ! -f $wdir/server.js ]]; then
				zenity --info --title "error" --width 400 --height 80 --text "server.js not here !"
				exit
				else
				assistant_to
				exit
    				fi
				;;
				*)
				exit
				;;
			esac
			fi
		else
        	assistant_to
	      	exit
        	fi
	fi
else

    #in case service actif
    actif=$(systemctl status ccx-assistant | head -n 5 | grep -c "Active: a")
    case $actif in
	0)
	answer=$(zenity --title "Service not active, choose option" --width 400 --height 220 --list --radiolist --column Selection --column answer FALSE start_and_go FALSE terminal)
		case $answer in
		start_and_go)
    	systemctl restart ccx-assistant.service
	sleep 1
    	firefox "http://localhost:3500"
	exit
		;;
		terminal)
	sleep 2
	assistant_to
		exit
		;;
		*)
		exit
		;;
		esac
	;;
	1)
	answer=$(zenity --title "Service is Active, choose option" --width 400 --height 220 --list --radiolist --column Selection --column answer TRUE Default FALSE Compact FALSE Terminal FALSE Stop_Service)
		case $answer in
		Default)
    	firefox "http://localhost:3500"
    	exit
		;;
		Compact)
	electron
		;;
		Terminal)
	systemctl stop ccx-assistant.service
	sleep 2
	assistant_to
		exit
		;;
		Stop_Service)
	systemctl stop ccx-assistant.service
		;;
		*)
		exit
		;;
		esac
	;;
	*)
	exit
	;;
  esac
fi


