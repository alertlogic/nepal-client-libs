#!/bin/bash

# Iterate up the directory structure until we find the root of the repo that we are being executed within
while [[ $PWD != '/' && ! ( -f "$PWD/package.json" ) ]]; do 
    cd ..
done

if [ $PWD = '/' ] 
then
    echo "The root of the current repository could not be found: \033[1;31mABORTING\033[0m (make sure you run the npm postinstall task)"
    echo "Evaluated from this path: $WHERE_AM_I"
    exit 1
fi

if [ ! -f package.json ] 
then
    echo "The root of your repository does not actually appear to be a valid repository: \033[1;31mABORTING\033[0m"
    echo "Using root $PWD derived from origin path $WHERE_AM_I"
    exit 1
fi

echo "=================================================================="
echo "Installing git hooks to repository at \033[1;36m$PWD\033[0m..."
echo "=================================================================="

cp scripts/pre-push.git .git/hooks/pre-push
chmod a+x .git/hooks/pre-push
