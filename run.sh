rm -rf tmp-process
mkdir tmp-process

#p1=bb4ef6755851f && p2=9e97e89932c5a && p3=8f46a3d85e0a8c && echo {\"token\":\"$p1$p2$p3\"} > .tsdrc

#for file in ./node_modules/DefinitelyTyped/*; do
#    echo ${file};
#    node dist/dt-repo-data.js ${file};
#done

#node dist/gen-definition-index.js

# ref http://stackoverflow.com/questions/7933044/commit-a-file-to-a-different-branch-without-checkout
destBranch=stats
thisBranch=master
FileToPutToOtherBranch="definition-index.json"
message="patched files $FileToPutToOtherBranch"
                                                                                  #assumption: we are on master to which modifications to file.txt should not belong
git stash &&\                                                                     #at this point we have clean repository to $thisBranch
git checkout -b $destBranch &&\
git checkout stash@{0} -- $FileToPutToOtherBranch &&                              #if there are many files, repeat this step
                                                                                  #create branch if does not exist (param -b)
git add $FileToPutToOtherBranch &&\                                               # at this point this is equal to git add . --update
git commit -m "$message" &&\
git checkout $thisBranch &&\
git stash apply &&\                                                               # or pop if want to loose backup
git checkout $thisBranch -- $FileToPutToOtherBranch                               # get unpatched files from previous branch
