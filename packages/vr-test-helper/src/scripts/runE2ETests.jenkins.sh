ENVIRONMENT=$1
SUITE=$2
BROWSER_INSTANCES=$3
EMAIL=$4 
PASSWORD=$5
HEADLESS=$6
echo "ENVIRONMENT = $ENVIRONMENT"
echo "BROWSER_INSTANCES = $BROWSER_INSTANCES"
echo "SUITE       = $SUITE"
echo "EMAIL       = $EMAIL"
echo "HEADLESS    = $HEADLESS"
# Transpile the tests to javascript so that jasmine can execute them
$(node_modules/typescript/bin/tsc --project ./e2e/tsconfig.e2e.json)
# Get the base url of the selected enviroment
BASE_URL=$(cat ./package.json | jq ".buildData.e2e.environments.$ENVIRONMENT" | tr -d \")
# We obtain the integration url, useful for visual regression tests
INTEGRATION_URL=$(cat ./package.json | jq ".buildData.e2e.environments.integration" | tr -d \")

# Get all the spec files and save them in an array
array=()
for pathFile in $(cat ./package.json | jq -r ".buildData.e2e.suites.$SUITE[]"); do
    array+=($pathFile)
done

# If the total of spec files is greater than the number of browser instances, 
# we divide the total of specs by the number of browser instances and we obtain ...
# the number of spec files that we are going to execute per browser instance.
if [ "${#array[@]}" -gt "${BROWSER_INSTANCES}" ]; 
then
    specsPerScript=$((${#array[@]}/$BROWSER_INSTANCES))
else
    # If the total of spec files is less than or equal to the number of browser instances, we execute a spec file per browser
    specsPerScript=1
    BROWSER_INSTANCES=${#array[@]}
fi
 
for((i=0; i < $BROWSER_INSTANCES && ${#array[@]} > 0 ; i=$i+1)); do
  current=$((i + 1))
  if [ "$current" -eq  "$BROWSER_INSTANCES" ]
  then
    part=${array[@]}
  else
    part=("${array[@]:0:$specsPerScript}")
  fi
  # Run the tests
  BASE_URL=$BASE_URL SUITE=$SUITE INTEGRATION_URL=$INTEGRATION_URL EMAIL=$EMAIL PASSWORD=$PASSWORD HEADLESS=$HEADLESS ./node_modules/@al/vr-test-helper/dist/scripts/rabbit ${part[*]} &
  array=("${array[@]:$specsPerScript}")
done

# Wait for all the processes in the background to finish
wait

# Generates the following reports:
#  - Visual regression report. (It is generated only when the Visual regression test are executed)
#  - Console report. (It is generated when the visual regression test or the e2e are executed)
#  - Screenshot report. (It is generated only when the e2e are executed)
#./node_modules/@al/vr-test-helper/dist/scripts/generate-reports
SUITE=$SUITE ./node_modules/@al/vr-test-helper/dist/scripts/generate-reports

exit 0