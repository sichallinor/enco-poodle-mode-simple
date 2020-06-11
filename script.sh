#!/bin/bash


#
# 	
#
#   example :
#   sudo bash script.sh -c link
#   sudo bash script.sh -c install

while getopts c: option
do
case "${option}"
in
c) COMMAND=${OPTARG};;
esac
done



# ------------------------------------------
# LINK TO LOCAL MODULE DIRECTORIES 
if [ $COMMAND = "link" ]
then
	echo "LINKING TO LOCAL MODULE DIRECTORIES ... "
	echo "NONE"
fi

# ------------------------------------------
# INSTALL LATEST VERSION FROM NPM AND UPDATE package.json
if [ $COMMAND = "install" ]
then
	echo "INSTALLING LATEST VERSION OF NPM PACKAGES AND UPDATE package.json ... "
	echo "NONE"
fi


# ------------------------------------------
# PATCH THE VERSION NUMBER (update by 1) and PUBLISH
if [ $COMMAND = "patch-publish" ]
then
	git add .
	git commit -a -m "AUTO PATCH"
	
	# update the version (with a patch)
	npm version patch

	# obtain the new version number
	versionvar=$(cat package.json \
	  | grep version \
	  | head -1 \
	  | awk -F: '{ print $2 }' \
	  | sed 's/[",]//g' \
	  | tr -d '[[:space:]]')

	# print 
	echo "v"$versionvar

	# tag the repo push and to github
	#git tag "v"$versionvar
	git push origin master --tags
	# publish to npm
	npm publish

fi
