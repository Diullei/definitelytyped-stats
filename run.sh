sudo npm install

grunt

rm -rf tmp-process
mkdir tmp-process

p1=ed39d546e8c8f && p2=7b7ef6ffd76d && p3=23409d3eaa7dbab && echo {\"token\":\"$p1$p2$p3\"} > .tsdrc

for file in ./node_modules/DefinitelyTyped/*; do
    echo ${file};
    node dist/dt-repo-data.js ${file};
done

node dist/gen-definition-index.js

sh try-publish.sh
