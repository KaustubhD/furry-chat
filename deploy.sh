#!/bin/sh

STATUS="$(git status)"

if [[ $STATUS == *"nothing to commit, working tree clean"* ]]
then
    sed -i "" 'dist/d' ./.gitignore
    git add .gitignore
    git commit -m "Edit .gitignore to publish"
    git push origin `git subtree split --prefix dist master`:gh-pages --force
    git reset HEAD~
    git add .
    git commit -m "I don't know commit"
else
    echo "Need clean working directory to publish"
fi
