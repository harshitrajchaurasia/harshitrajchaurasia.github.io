#!/usr/bin/env python3
"""Fetch public GitHub activity for the site's live stats panel.

Writes github-stats.json at the repo root. Uses the GraphQL API with the
token in GH_TOKEN. When that token is the GH_STATS_TOKEN PAT (read:user),
the contribution calendar for your own user includes PRIVATE contributions;
the built-in Actions GITHUB_TOKEN sees PUBLIC contributions only.
"""
import datetime
import json
import os
import sys
import urllib.request

LOGIN = os.environ.get("LOGIN", "harshitrajchaurasia")
TOKEN = os.environ.get("GH_TOKEN")
if not TOKEN:
    sys.exit("GH_TOKEN is not set")

QUERY = """
query($login:String!){
  user(login:$login){
    createdAt
    followers { totalCount }
    repositories(privacy:PUBLIC, ownerAffiliations:OWNER) { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}
"""


def fetch():
    body = json.dumps({"query": QUERY, "variables": {"login": LOGIN}}).encode()
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=body,
        headers={
            "Authorization": "bearer " + TOKEN,
            "Content-Type": "application/json",
            "User-Agent": LOGIN + "-stats",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def current_streak(days):
    """Consecutive days up to today with at least one contribution.
    Today counting as zero does not break the streak (the day isn't over)."""
    today = datetime.date.today().isoformat()
    streak = 0
    for day in reversed(days):
        if day["contributionCount"] > 0:
            streak += 1
        elif day["date"] == today and streak == 0:
            continue
        else:
            break
    return streak


def main():
    data = fetch()
    if "errors" in data:
        sys.exit("GraphQL errors: " + json.dumps(data["errors"]))
    user = data["data"]["user"]
    cal = user["contributionsCollection"]["contributionCalendar"]
    days = sorted(
        (d for w in cal["weeks"] for d in w["contributionDays"]),
        key=lambda d: d["date"],
    )
    out = {
        "contributions": cal["totalContributions"],
        "streak": current_streak(days),
        "repos": user["repositories"]["totalCount"],
        "followers": user["followers"]["totalCount"],
        "since": user["createdAt"][:4],
        "updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    with open("github-stats.json", "w", encoding="utf-8") as fh:
        json.dump(out, fh, indent=2)
        fh.write("\n")
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
