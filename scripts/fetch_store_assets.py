import json
import os
import re
import sys
import urllib.request


def sanitize_filename(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


def fetch_itunes_metadata(app_ids):
    results = []
    for app_id in app_ids:
        try:
            with urllib.request.urlopen(f"https://itunes.apple.com/lookup?id={app_id}") as r:
                data = json.load(r)
        except Exception as e:
            print(f"Lookup failed for {app_id}: {e}", file=sys.stderr)
            continue
        if not data.get("results"):
            continue
        results.append(data["results"][0])
    return results


def compact_first_line(text: str, limit: int = 110) -> str:
    if not text:
        return ""
    first = text.strip().split("\n")[0]
    return (first[: limit - 3] + "...") if len(first) > limit else first


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def download_image(url: str, out_path: str) -> bool:
    try:
        urllib.request.urlretrieve(url, out_path)
        return True
    except Exception as e:
        print(f"Image download failed for {url}: {e}", file=sys.stderr)
        return False


def main():
    # Popular sample apps: Clash of Clans, Genshin Impact, Subway Surfers
    app_ids = [529479190, 1517783697, 512939461]
    creative_dir = os.path.join("creative")
    assets_dir = os.path.join(creative_dir, "assets")
    manifest_path = os.path.join(creative_dir, "manifest.json")

    ensure_dir(assets_dir)

    meta = fetch_itunes_metadata(app_ids)
    if not meta:
        print("No metadata fetched; aborting without changes", file=sys.stderr)
        sys.exit(1)

    cards = []
    for item in meta:
        title = item.get("trackName", "")
        desc = item.get("description", "") or ""
        subcopy = compact_first_line(desc, 110)
        image_url = item.get("artworkUrl512") or item.get("artworkUrl100")
        link = item.get("trackViewUrl", "https://apps.apple.com")
        safe = sanitize_filename(title)
        img_name = f"{safe}.jpg"
        out_path = os.path.join(assets_dir, img_name)
        downloaded = download_image(image_url, out_path) if image_url else False
        cards.append(
            {
                "id": f"app-{item.get('trackId')}",
                "headline": title,
                "subcopy": subcopy,
                # Fallback to remote artwork URL if download failed
                "image": f"assets/{img_name}" if downloaded else (image_url or "assets/card1.jpg"),
                "ctaText": "Install",
                "clickthroughUrl": link,
            }
        )

    with open(manifest_path, "r") as f:
        manifest = json.load(f)
    manifest["cards"] = cards
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"Updated manifest with {len(cards)} cards")


if __name__ == "__main__":
    main()


