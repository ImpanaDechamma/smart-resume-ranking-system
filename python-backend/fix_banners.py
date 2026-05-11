import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["smart_resume_ranking"]

# Verified working replacements for broken banners
fixes = {
    "Amazon":  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000",
    "Netflix": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=1000",
    "Tesla":   "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&q=80&w=1000",
    "Uber":    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
    "Oracle":  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
}

for company, new_banner in fixes.items():
    result = db.jobs.update_many(
        {"company_name": company},
        {"$set": {"banner": new_banner}}
    )
    print(f"Fixed {company}: {result.modified_count} job(s) updated")

# Also fix the companies collection banners
for company, new_banner in fixes.items():
    result = db.companies.update_many(
        {"name": company},
        {"$set": {"banner": new_banner}}
    )
    if result.modified_count:
        print(f"  -> Also updated companies collection for {company}")

print("\nAll broken banners fixed!")
