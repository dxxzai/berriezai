from pathlib import Path
import re

folder = Path("src/content/chapters")

for chapter_num in range(4, 124):
    file = folder / f"chapter-{chapter_num:03}.mdx"

    if not file.exists():
        print(f"Missing: {file}")
        continue

    text = file.read_text(encoding="utf-8")

    # Skip if date already exists
    if re.search(r"^date:", text, re.MULTILINE):
        print(f"Already has date: {file.name}")
        continue

    # Add date after chapter line
    text = re.sub(
        r"(chapter:\s*\d+\n)",
        r"\1date: 2026-07-31\n",
        text,
        count=1
    )

    file.write_text(text, encoding="utf-8")
    print(f"Updated: {file.name}")

print("Done!")