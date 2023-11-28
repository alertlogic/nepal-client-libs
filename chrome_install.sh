#!/bin/bash

# Add the Google Chrome repository
echo "[google-chrome]" | sudo tee -a /etc/yum.repos.d/google-chrome.repo
echo "name=google-chrome" | sudo tee -a /etc/yum.repos.d/google-chrome.repo
echo "baseurl=http://dl.google.com/linux/chrome/rpm/stable/\$basearch" | sudo tee -a /etc/yum.repos.d/google-chrome.repo
echo "enabled=1" | sudo tee -a /etc/yum.repos.d/google-chrome.repo
echo "gpgcheck=1" | sudo tee -a /etc/yum.repos.d/google-chrome.repo
echo "gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub" | sudo tee -a /etc/yum.repos.d/google-chrome.repo

# Install Google Chrome
sudo yum install google-chrome-stable

# Check if the installation was successful
if [ $? -eq 0 ]; then
    echo "Google Chrome has been successfully installed."
else
    echo "Failed to install Google Chrome. Please check for errors."
fi
