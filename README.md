# Watchdog
Application monitor

### Installation
Install pacakages by ``` npm install ``` for both root directory and ```frontend``` directory.

### Build
Run ``` npm run pkg``` to create standalone executables in ```dist``` directory.

### Configuration
Create ```.env``` file and put configuration like:
```
PORT=3000 # Application port
DATABASE=data.json # Database file
SLACK_API=https://hooks.slack.com/services/xxxxxx # Slack hook URL for notification

```
### Database structure
```
{
  "groups": Array<{
    "name": string,
    "watchers": Array<{
      "name": string,
      "enable": boolean,
      "url": string, // URL for fetching status
      "basicAuth": string, // Optional, use when server require a Basic Authentication
      "interval": number,
      "healthKey": string, // Expression to get value for health check e.g. "package.status.value"
      "healthValue": string, // Value of healthty
      "versionKey": string // Expression to get version number e.g. "package.version.value"
    }>
  }>
}
```
