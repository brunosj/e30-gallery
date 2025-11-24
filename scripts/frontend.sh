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
	echo "Checking for PM2 process: $process_name"
	if pm2 list | grep -q "│ $process_name "; then 
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
echo "Checking current PM2 processes..."
GREEN_ONLINE=$(pm2 jlist | jq -r '.[] | select(.name == "green") | .name, .pm2_env.status' | tr -d '\n\r')
BLUE_ONLINE=$(pm2 jlist | jq -r '.[] | select(.name == "blue") | .name, .pm2_env.status' | tr -d '\n\r')

echo "Green status: '$GREEN_ONLINE'"
echo "Blue status: '$BLUE_ONLINE'"

# Determine deployment strategy based on what's currently running
if [ "$GREEN_ONLINE" == "greenonline" ] && [ "$BLUE_ONLINE" == "blueonline" ]; then
    echo "Both blue and green are running - deploying to blue"
    CURRENT_LIVE_NAME="green"
    CURRENT_LIVE_DIR=$GREEN_DIR
    DEPLOYING_TO_NAME="blue"
    DEPLOYING_TO_DIR=$BLUE_DIR
elif [ "$GREEN_ONLINE" == "greenonline" ]; then
    echo "Green is running - deploying to blue"
    CURRENT_LIVE_NAME="green"
    CURRENT_LIVE_DIR=$GREEN_DIR
    DEPLOYING_TO_NAME="blue"
    DEPLOYING_TO_DIR=$BLUE_DIR
elif [ "$BLUE_ONLINE" == "blueonline" ]; then
    echo "Blue is running - deploying to green"
    CURRENT_LIVE_NAME="blue"
    CURRENT_LIVE_DIR=$BLUE_DIR
    DEPLOYING_TO_NAME="green"
    DEPLOYING_TO_DIR=$GREEN_DIR
else
    echo "Neither blue nor green are running - deploying to blue"
    CURRENT_LIVE_NAME="false"
    CURRENT_LIVE_DIR="false"
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

nvm use 22.21.1 || { echo 'Could not switch to node version 22.21.1' ; exit 1; }

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

# Verify the build was successful
if [ ! -d ".next" ]; then
    echo "ERROR: .next directory not found after build"
    exit 1
fi

if [ ! -f ".next/prerender-manifest.json" ]; then
    echo "ERROR: .next/prerender-manifest.json not found - build may be incomplete"
    exit 1
fi

echo "Build verification successful - .next directory exists"

# Start or restart the pm2 process
echo "Checking if PM2 process '$DEPLOYING_TO_NAME' exists..."
echo "Current PM2 processes:"
pm2 list

if check_pm2_process $DEPLOYING_TO_NAME; then
    echo "Restarting existing PM2 process: $DEPLOYING_TO_NAME"
    echo "Current directory: $(pwd)"
    echo "Checking .next directory exists: $(ls -la .next 2>/dev/null || echo 'NOT FOUND')"
    pm2 restart $DEPLOYING_TO_NAME || { echo 'pm2 restart failed' ; exit 1; }
else
    echo "Starting new PM2 process: $DEPLOYING_TO_NAME"
    
    # Check if the target port is already in use
    TARGET_PORT=""
    if [ "$DEPLOYING_TO_NAME" == "blue" ]; then
        TARGET_PORT="5173"
    elif [ "$DEPLOYING_TO_NAME" == "green" ]; then
        TARGET_PORT="5174"
    fi
    
    echo "Checking if port $TARGET_PORT is available..."
    if netstat -tlnp | grep -q ":$TARGET_PORT "; then
        echo "WARNING: Port $TARGET_PORT is already in use:"
        netstat -tlnp | grep ":$TARGET_PORT "
        echo "This might cause the new process to fail to start"
    fi
    
    echo "Starting PM2 process from directory: $(pwd)"
    echo "Verifying .next directory: $(ls -la .next 2>/dev/null || echo 'NOT FOUND')"
    
    if [ "$DEPLOYING_TO_NAME" == "blue" ]; then
        pm2 start "pnpm run start" --name "blue" --cwd "$(pwd)" || { echo 'Failed to start blue app' ; exit 1; }
    elif [ "$DEPLOYING_TO_NAME" == "green" ]; then
        pm2 start "pnpm run start-green" --name "green" --cwd "$(pwd)" || { echo 'Failed to start green app' ; exit 1; }
    else
        echo "Unknown deployment target: $DEPLOYING_TO_NAME"
        exit 1
    fi
fi

# add a delay to allow the server to start
echo "Waiting for server to start..."
sleep 5

# check if the server is running
echo "Checking deployment status for: $DEPLOYING_TO_NAME"
DEPLOYMENT_ONLINE=$(pm2 jlist | jq -r ".[] | select(.name == \"$DEPLOYING_TO_NAME\") | .name, .pm2_env.status" | tr -d '\n\r')
echo "Deployment status result: '$DEPLOYMENT_ONLINE'"
echo "Expected result: '${DEPLOYING_TO_NAME}online'"

if [ "$DEPLOYMENT_ONLINE" == "${DEPLOYING_TO_NAME}online" ]; then
    echo "Deployment successful - new process is running"
    
    # Additional check: verify the domain is responding with the new process
    echo "Waiting additional 3 seconds for app to fully initialize..."
    sleep 3
    
    # Check both the domain and the specific port
    DEPLOYMENT_PORT=""
    if [ "$DEPLOYING_TO_NAME" == "blue" ]; then
        DEPLOYMENT_PORT="5173"
    elif [ "$DEPLOYING_TO_NAME" == "green" ]; then
        DEPLOYMENT_PORT="5174"
    fi
    
    echo "Testing direct port access: http://localhost:$DEPLOYMENT_PORT"
    if curl -s --head --fail "http://localhost:$DEPLOYMENT_PORT" > /dev/null; then
        echo "Port $DEPLOYMENT_PORT is responding locally"
    else
        echo "WARNING: Port $DEPLOYMENT_PORT is not responding locally"
        echo "Checking PM2 logs for $DEPLOYING_TO_NAME:"
        pm2 logs $DEPLOYING_TO_NAME --lines 10 --nostream
        echo "Checking if port is in use:"
        netstat -tlnp | grep :$DEPLOYMENT_PORT || echo "Port $DEPLOYMENT_PORT not in use"
    fi
    
    if check_app_status $DOMAIN; then
        echo "Domain is responding with new deployment"
        
        # Give Caddy a moment to detect the new healthy server
        echo "Waiting for Caddy to detect new healthy server..."
        sleep 5
        
        # Now it's safe to stop the old process
        if [ "$CURRENT_LIVE_NAME" != "false" ]; then
            if check_pm2_process $CURRENT_LIVE_NAME; then
                echo "Stopping previous live app: $CURRENT_LIVE_NAME"
                pm2 stop $CURRENT_LIVE_NAME || echo "Warning: Failed to stop $CURRENT_LIVE_NAME"
                
                # Wait a moment after stopping to let Caddy detect the change
                echo "Waiting for Caddy to detect server change..."
                sleep 3
                
                # Final verification that domain is still responding
                if check_app_status $DOMAIN; then
                    echo "✅ Deployment completed successfully - domain is responding"
                else
                    echo "❌ WARNING: Domain stopped responding after stopping old server"
                    echo "This might be a temporary Caddy health check delay"
                    echo "Caddy should automatically failover within 10-30 seconds"
                fi
            else
                echo "Previous live app $CURRENT_LIVE_NAME is not running, nothing to stop"
            fi
        else
            echo "No previous live app to stop"
        fi
    else
        echo "ERROR: New deployment is not responding on domain. Debugging..."
        echo "Checking Caddy status:"
        systemctl is-active caddy || echo "Caddy is not active"
        echo "Testing both ports directly:"
        curl -I http://localhost:5173 2>/dev/null || echo "Port 5173 not responding"
        curl -I http://localhost:5174 2>/dev/null || echo "Port 5174 not responding"
        echo "Checking Caddy logs (last 5 lines):"
        journalctl -u caddy -n 5 --no-pager
        echo "Rolling back..."
        pm2 stop $DEPLOYING_TO_NAME || echo "Failed to stop failed deployment"
        if [ "$CURRENT_LIVE_NAME" != "false" ]; then
            pm2 start $CURRENT_LIVE_NAME || echo "Failed to restart previous version"
        fi
        exit 1
    fi
else
    echo "Deployment failed - process may not be running correctly"
    echo "PM2 process list:"
    pm2 list
    exit 1
fi

# Final check to ensure the domain is up after deployment
if ! check_app_status $DOMAIN; then
    echo "Final check: Domain is not responding. Deployment may have failed."
    exit 1
else
    echo "Final check: Domain is responding. Deployment successful."
fi
