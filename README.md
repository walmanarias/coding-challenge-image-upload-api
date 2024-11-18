# Image Upload API

A RESTful API service for uploading and retrieving images using Node.js, TypeScript and AWS S3.

## Features

- Upload images to AWS S3
- Retrieve list of uploaded images with signed URLs
- File type validation
- Unit tests with Jest

## Prerequisites

- Node.js 14+
- AWS Account with S3 bucket
- AWS Access Key and Secret Key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-upload-api

## Usage
1. Install dependencies:
```bash
npm install

## Configuration
1. Create a .env file in the root directory and add the following environment variables:
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

## Running the Application
1. Start the application:
```bash
npm run dev

2. Production Build:
```bash
npm run build
npm start

## Testing
1. Run unit tests:
```bash
npm test
