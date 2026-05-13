#!/bin/bash

# ==========================================
# Author:         Duong Nhat Khoa
# Email:          nhatkhoa.working@gmail.com
# Phone:          +84 828 505 090
# -----------------------------------
# Created:        2026-05-13
# LastEditTime:   2026-05-13
# Version:        1.0
# Status:         Updated
# ==========================================

export project_name="technoheart-frontend"
export image_name="registry.gitlab.com/meu-solutions/technoheart-frontend"
export environment_name="production"

export port_mapping_app="7035"

export mount_data_folder="/mnt/data"
export env_file="/home/gitlab-runner/technoheart-fe/.env"

export PROJECT_NAME="$project_name"
export ENVIRONMENT_NAME="$environment_name"

export PORT_APP="$port_mapping_app"

export MOUNT_DATA_FOLDER="$mount_data_folder"
export ENV_FILE="$env_file"