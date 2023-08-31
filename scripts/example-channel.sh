# List channels bellow
channels=(C1ABCDEFG)
for channel in ${channels[@]}
do
    deno task run channel $channel
done 

touch results/list.csv
find results/* -type f | grep -v list.csv | xargs realpath > results/list.csv