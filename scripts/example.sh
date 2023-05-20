ugs=(dev-team-alpha dev-team-bravo marketing)
for ug in ${ugs[@]}
do
    deno task run $ug | xargs -n 1 curl -O --create-dirs --output-dir results/$ug
done 