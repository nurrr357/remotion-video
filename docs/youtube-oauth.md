# YouTube OAuth Upload

This flow uploads from your own computer. Your Google password and 2FA stay in
your browser; this project only receives an OAuth token after you approve it.

## 1. Create the Google Cloud project

1. Open <https://console.cloud.google.com/>.
2. Create a project, for example `youtube-shorts-upload`.
3. Go to **APIs & Services → Library**.
4. Search for **YouTube Data API v3** and enable it.

## 2. Configure Google Auth Platform

1. Open **Google Auth Platform** (or **OAuth consent screen**).
2. Choose **Personal mode** if it is offered. This is for your own channel and
   does not require OAuth verification.
3. Fill in the app name and support email.
4. Add the scope:

```text
https://www.googleapis.com/auth/youtube.upload
```

If Personal mode is not available, use External/Testing and add your own Google
account as a test user. A Testing refresh token normally expires after 7 days,
so it is not suitable for unattended long-term automation.

## 3. Create an OAuth client

1. Go to **Credentials → Create credentials → OAuth client ID**.
2. Application type: **Desktop app**.
3. Create it and download the JSON.
4. Rename the downloaded file to:

```text
client_secret.json
```

Put it in the project root (next to `package.json`).

## 4. Install the uploader dependencies

Windows PowerShell:

```powershell
cd D:\huda\project\random\remotion
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-upload.txt
```

## 5. Authorize once

```powershell
python scripts/upload_youtube.py --auth
```

A browser window opens. Sign in with the Google account that owns the YouTube
channel, approve the YouTube upload scope, and return to the terminal.

This creates:

```text
token.json
```

Do not commit `client_secret.json` or `token.json`. Both are already ignored.

## 6. Upload

```powershell
python scripts/upload_youtube.py --upload out/shorts.mp4 `
  --title "Judul Shorts" `
  --description "Deskripsi dan #Shorts" `
  --privacy public
```

For a safer first test, use `--privacy private`; review the result in YouTube
Studio, then publish there.

## 7. If you later want to upload from the VPS

Copy `token.json` securely, never through chat:

```bash
scp token.json vps43:/srv/hermes/work/media/youtube-token.json
ssh vps43 chmod 600 /srv/hermes/work/media/youtube-token.json
```

Then run the same script on the VPS. Treat `token.json` like a password: anyone
who has it can upload to the channel until you revoke access.

## Common errors

- `access_denied`: your Google account was not added as a test user, or the
  consent screen is not configured for the scope.
- `invalid_grant`: token expired or was revoked. Run `--auth` again.
- `quotaExceeded`: YouTube API project quota is exhausted; wait for the Pacific
  Time reset or request a quota extension.
- `uploadLimitExceeded`: channel-level daily upload limit reached; wait 24 hours.
