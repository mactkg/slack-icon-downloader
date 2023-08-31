# List user groups bellow
ugs=(dev-team-alpha dev-team-bravo marketing)
for ug in ${ugs[@]}
do
    deno task run group $ug
done 

touch results/list.csv
find results/* -type f | grep -v list.csv | xargs realpath > results/list.csv