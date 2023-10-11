<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
    A robust File Management Microservice built with <a href="http://nestjs.com/" target="_blank">Nest.js</a>, a progressive Node.js framework.
</p>

## Description

This repository houses a File Management Microservice designed to handle file operations including uploading, downloading, and deletion. Built with Nest.js, this server is structured to function as a microservice within larger applications. It generates a unique ID for each uploaded file, and computes a hash to prevent duplicate files from being stored. For better organization and retrieval, it supports folder-based file management, allowing other microservices to specify folders when uploading files.

## Features

- **File Upload:** Accepts file uploads and generates a unique ID for each file.
- **File Download:** Allows file downloads using the generated unique ID.
- **File Deletion:** Provides file deletion capabilities using the unique ID.
- **Duplicate Detection:** Computes a hash of each file to detect and prevent duplicate file storage.
- **Folder Management:** Allows other microservices to specify folders for better file organization.

## Installation

This microservice is containerized using Docker, and orchestrated using Kubernetes. A Helm chart is provided for easy deployment.

To install the microservice using Helm:

```bash
helm upgrade --install file-management https://github.com/jayvhaile/file-management-microservice/releases/download/latest-release/file-management-0.1.0.tgz
