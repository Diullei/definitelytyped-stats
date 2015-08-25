sudo npm install

grunt

rm -rf tmp-process
mkdir tmp-process

p1=bb4ef6755851f && p2=9e97e89932c5a && p3=8f46a3d85e0a8c && echo {\"token\":\"$p1$p2$p3\"} > .tsdrc

for file in ./node_modules/DefinitelyTyped/*; do
    echo ${file};
    node dist/dt-repo-data.js ${file};
done

node dist/gen-definition-index.js

git stash
git checkout stats
rm definition-index.json
git add -u
git stash apply
git add .

NOW=$(date +"%m-%d-%Y %H:%M")

git commit -m "update $NOW"
git checkout master

git push
