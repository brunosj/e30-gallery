# Define the domain for the load-balanced service 
DOMAIN="https://e30gallery.com" 

#both app folders start with 'app'
LIVE_DIR_PATH=/home/lando/frontend/app

#add the suffixes to the app folders
BLUE_DIR=$LIVE_DIR_PATH-blue
GREEN_DIR=$LIVE_DIR_PATH-green

# set up variables to store the current live and deploying to directories
CURRENT_LIVE_NAME=false
CURRENT_LIVE_DIR=false

DEPLOYING_TO_NAME=false
DEPLOYING_TO_DIR=false

# Check if the apps are responding
check_app_status() { 
	local domain=$1 
	if curl -s --head --fail "$domain" > /dev/null; then 
		echo "$domain is responding" 
		return 0 
	else 
		echo "$domain is not responding" 
		return 1 
	fi 
} 

# Check if a pm2 process exists
check_pm2_process() { 
	local process_name=$1 
	if pm2 pid $process_name > /dev/null; then 
		echo "$process_name process exists" 
		return 0 
	else 
		echo "$process_name process does not exist" 
		return 1 
	fi 
}

# Restart both apps if the domain is not responding 
if ! check_app_status $DOMAIN; then 
	echo "Domain is not responding, restarting both apps"

	# Check and delete blue process if it exists 
	if check_pm2_process blue; then 
		pm2 delete blue || echo 'Failed to delete blue process'
	else 
		echo 'Blue process does not exist, skipping deletion' 
	fi 
	
	# Check and delete green process if it exists 
	if check_pm2_process green; then 
		pm2 delete green || echo 'Failed to delete green process'
	else 
		echo 'Green process does not exist, skipping deletion'
	fi
	
	# Navigate to the blue app directory and restart 
	cd $BLUE_DIR || { echo 'Could not access blue app directory.' ; exit 1; }
	pm2 start "pnpm run start" --name "blue" || { echo 'Failed to start blue app' ; exit 1; } 
	
	# Navigate to the green app directory and restart 
	cd $GREEN_DIR || { echo 'Could not access green app directory.' ; exit 1; }
	pm2 start "pnpm run start-green" --name "green" || { echo 'Failed to start green app' ; exit 1; } 
	else 
	echo "Domain is responding, no need to restart apps" 
	fi

# this checks if the green and blue apps are running
GREEN_ONLINE=$(pm2 jlist | jq -r '.[] | select(.name == "green") | .name, .pm2_env.status' | tr -d '\n\r')
BLUE_ONLINE=$(pm2 jlist | jq -r '.[] | select(.name == "blue") | .name, .pm2_env.status' | tr -d '\n\r')

# if green is running, set the current live to green and 'deploying to' is blue
if [ "$GREEN_ONLINE" == "greenonline" ]; then
    echo "Green is running"
    CURRENT_LIVE_NAME="green"
    CURRENT_LIVE_DIR=$GREEN_DIR
    
    DEPLOYING_TO_NAME="blue"
    DEPLOYING_TO_DIR=$BLUE_DIR
fi

# if blue is running, set the current live to blue and 'deploying to' is green
if [ "$BLUE_ONLINE" == "blueonline" ]; then
    echo "Blue is running"
    CURRENT_LIVE_NAME="blue"
    CURRENT_LIVE_DIR=$BLUE_DIR
    
    DEPLOYING_TO_NAME="green"
    DEPLOYING_TO_DIR=$GREEN_DIR
fi

# if both green and blue are running, set 'deploying to' to blue
if [ "$GREEN_ONLINE" == "greenonline" ] && [ "$BLUE_ONLINE" == "blueonline" ]; then
    echo "Both blue and green are running"
    DEPLOYING_TO_NAME="blue"
    DEPLOYING_TO_DIR=$BLUE_DIR
fi

# display the current live and deploying to directories
echo "Current live: $CURRENT_LIVE_NAME"
echo "Deploying to: $DEPLOYING_TO_NAME"

echo "Current live dir: $CURRENT_LIVE_DIR"
echo "Deploying to dir: $DEPLOYING_TO_DIR"

# Validate that we have a deployment target
if [ "$DEPLOYING_TO_NAME" == "false" ] || [ "$DEPLOYING_TO_DIR" == "false" ]; then
    echo "Error: Could not determine deployment target. Both apps may be down."
    exit 1
fi

# Navigate to the deploying to directory
cd $DEPLOYING_TO_DIR || { echo 'Could not access deployment directory.' ; exit 1; }

# use the correct node version
# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

nvm use 20.12.2 || { echo 'Could not switch to node version 20.12.2' ; exit 1; }

# load the .env file
source .env || { echo 'The ENV file does not exist' ; exit 1; }

# Pull the latest changes
# clear any changes to avoid conflicts (usually permission based)
git reset --hard || { echo 'Git reset command failed' ; exit 1; }
git pull -f origin main || { echo 'Git pull command failed' ; exit 1; }

# Delete the .next folder to clear cache
rm -rf .next ||  { echo 'Clearing .next cache failed' ; exit 1; }
echo "Next cache cleared"

# install the dependencies using pnpm (as specified in package.json)
pnpm install || { echo 'pnpm install failed' ; exit 1; }

# Build the project
pnpm run build || { echo 'Build failed' ; exit 1; }

# Restart the pm2 process
pm2 restart $DEPLOYING_TO_NAME || { echo 'pm2 restart failed' ; exit 1; }

# add a delay to allow the server to start
echo "Waiting for server to start..."
sleep 5

# check if the server is running
echo "Checking deployment status for: $DEPLOYING_TO_NAME"
DEPLOYMENT_ONLINE=$(pm2 jlist | jq -r ".[] | select(.name == \"$DEPLOYING_TO_NAME\") | .name, .pm2_env.status" | tr -d '\n\r')
echo "Deployment status result: '$DEPLOYMENT_ONLINE'"
echo "Expected result: '${DEPLOYING_TO_NAME}online'"

if [ "$DEPLOYMENT_ONLINE" == "${DEPLOYING_TO_NAME}online" ]; then
    echo "Deployment successful"
else
    echo "Deployment failed - process may not be running correctly"
    echo "PM2 process list:"
    pm2 list
    exit 1
fi

# stop the live one which is out of date (only if we have a current live app)
if [ "$CURRENT_LIVE_NAME" != "false" ]; then
    echo "Stopping previous live app: $CURRENT_LIVE_NAME"
    pm2 stop $CURRENT_LIVE_NAME || echo "Warning: Failed to stop $CURRENT_LIVE_NAME"
else
    echo "No previous live app to stop"
fi

# Final check to ensure the domain is up after deployment
if ! check_app_status $DOMAIN; then
    echo "Final check: Domain is not responding. Deployment may have failed."
    exit 1
else
    echo "Final check: Domain is responding. Deployment successful."
fi
