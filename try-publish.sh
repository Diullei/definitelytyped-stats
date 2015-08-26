git stash
git checkout stats
rm definition-index.json
git add -u
git stash apply
git add .

NOW=$(date +"%m-%d-%Y %H:%M")

git commit -m "update $NOW"
git checkout master

git stash drop

git push
