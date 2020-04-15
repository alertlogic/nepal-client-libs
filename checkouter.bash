set -ex
for repo in credentials-client nepal-ingest-client nepal-applications-client environments-client aether-client nepal-herald-client nepal-endpoints cargo-client azure-explorer-client assets-query-client dashboards-client subscriptions-client kalm-client deployments-client nepal-ae-correlations tacoma-client
do
        echo $repo
        git subtree add -P packages/$repo https://github.com/alertlogic/$repo.git  master
        cd packages/$repo
        rm -rf scripts .editorconfig .gitignore ps_spec.yml 
        git commit -m 'added $repo'
        cd ..
        cd ..
done
