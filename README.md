# Guide to procedure alpha

A simple static site that pulls data from [Contentful](https://www.contentful.com/) built with [Metalsmith](www.metalsmith.io/).

## Requirements
The [Guide to procedure alpha](https://github.com/ochiroma/pds-gtp-alpha) requires [Node.js](https://nodejs.org/)

## Getting started

1. Clone the repository:
    ```
    git clone https://github.com/ochiroma/pds-gtp-alpha.git
    ```
2. Change directory to the project directory:
    ```
    cd pds-gtp-alpha
    ```
3. Create a environment variable file (.env) and add in the following environment variables:
    ```
    CONTENT_API_URL:cdn.contentful.com
	CONTENT_SPACE_ID:<content space ID>
	CONTENT_API_KEY:<content access token>
    ```
    **Remember never commit environment variables to your repository!**

4. Install project dependencies and generate the static site:
    ```
    npm install
    ```
