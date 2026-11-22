#!/usr/bin/env python3
"""Upload a rendered Short to YouTube with OAuth.

First run (opens your browser):
    python scripts/upload_youtube.py --auth

Then:
    python scripts/upload_youtube.py --upload out/shorts.mp4 \
      --title "Judul video" --privacy public

Credentials stay local:
    client_secret.json  <- downloaded from Google Cloud
    token.json          <- created after you approve the browser consent

Never commit either file.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="OAuth uploader for YouTube Shorts.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("--auth", action="store_true", help="Run OAuth consent flow and save token.json")
    parser.add_argument("--upload", type=Path, help="Path to the MP4 to upload")
    parser.add_argument("--client-secret", type=Path, default=Path("client_secret.json"))
    parser.add_argument("--token", type=Path, default=Path("token.json"))
    parser.add_argument("--title", default="")
    parser.add_argument("--description", default="")
    parser.add_argument("--tags", default="", help="Comma-separated tags")
    parser.add_argument("--category", default="27", help="YouTube category ID; 27 = Education")
    parser.add_argument(
        "--privacy",
        choices=["private", "unlisted", "public"],
        default="private",
        help="Upload privacy status",
    )
    parser.add_argument(
        "--made-for-kids",
        action="store_true",
        help="Set selfDeclaredMadeForKids=true",
    )
    return parser.parse_args()


def run_auth(args: argparse.Namespace) -> None:
    if not args.client_secret.exists():
        raise SystemExit(
            f"Client secret not found: {args.client_secret}\n"
            "Download the OAuth Desktop client JSON from Google Cloud first."
        )
    flow = InstalledAppFlow.from_client_secrets_file(str(args.client_secret), SCOPES)
    creds = flow.run_local_server(port=0, open_browser=True)
    args.token.write_text(creds.to_json(), encoding="utf-8")
    print(f"Token saved to {args.token}")
    print("Do not commit this file.")


def load_credentials(args: argparse.Namespace) -> Credentials:
    if not args.token.exists():
        raise SystemExit(
            f"Token not found: {args.token}\n"
            "Run: python scripts/upload_youtube.py --auth"
        )
    creds = Credentials.from_authorized_user_file(str(args.token), SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        args.token.write_text(creds.to_json(), encoding="utf-8")
    if not creds.valid:
        raise SystemExit("OAuth token is invalid. Run --auth again.")
    return creds


def upload(args: argparse.Namespace) -> None:
    if args.upload is None:
        raise SystemExit("Use --upload <file.mp4> or --auth.")
    if not args.upload.exists():
        raise SystemExit(f"Video not found: {args.upload}")

    creds = load_credentials(args)
    youtube = build("youtube", "v3", credentials=creds)

    title = args.title.strip() or args.upload.stem
    if len(title) > 100:
        raise SystemExit("Title must be 100 characters or fewer.")
    tags = [tag.strip() for tag in args.tags.split(",") if tag.strip()]

    body = {
        "snippet": {
            "title": title,
            "description": args.description,
            "tags": tags,
            "categoryId": args.category,
        },
        "status": {
            "privacyStatus": args.privacy,
            "selfDeclaredMadeForKids": args.made_for_kids,
        },
    }

    media = MediaFileUpload(
        str(args.upload),
        mimetype="video/mp4",
        chunksize=8 * 1024 * 1024,
        resumable=True,
    )
    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media,
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Upload progress: {int(status.progress() * 100)}%")

    video_id = response["id"]
    print(f"Uploaded: https://youtu.be/{video_id}")
    print(f"Privacy: {args.privacy}")


def main() -> int:
    args = parse_args()
    if args.auth:
        run_auth(args)
        return 0
    try:
        upload(args)
    except HttpError as exc:
        print(f"YouTube API error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
