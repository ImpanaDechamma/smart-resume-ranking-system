import pymongo
import urllib.request

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["smart_resume_ranking"]

jobs = list(db.jobs.find({}, {"company_name": 1, "banner": 1}))

print(f"Total jobs: {len(jobs)}\n")
broken = []
for job in jobs:
    name = job.get("company_name", "Unknown")
    banner = job.get("banner", "")
    if not banner or banner.startswith("/"):
        print(f"[NO URL ] {name}: '{banner}'")
        broken.append(job)
    else:
        try:
            req = urllib.request.Request(banner, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=5)
            code = resp.status
            status = "OK " if code == 200 else f"FAIL({code})"
        except Exception as e:
            code = str(e)[:40]
            status = f"ERR"
        print(f"[{status}] {name}: {banner[:80]}")
        if status != "OK ":
            broken.append(job)

print(f"\nBroken/missing banners: {len(broken)}")
