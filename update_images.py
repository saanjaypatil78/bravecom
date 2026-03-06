import re
import time
from duckduckgo_search import DDGS

import sys
sys.stdout.reconfigure(encoding='utf-8')

FILE_PATH = r'c:\Users\Asus\Downloads\BRAVEECOMUISTITCH\stitch_brave_ecom_pvt_ltd\sunray_system\app\api\mall\products\route.ts'

with open(FILE_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern aiming for: ... id: "MALL-PRD...", name: "Apple AirPods...", ... image: getImg('earbuds', 1)
pattern = re.compile(r'("?id"?:\s*"(MALL-PRD-\d+)"[\s\S]*?"?name"?:\s*"([^"]+)"[\s\S]*?"?image"?:\s*)"([^"]+)"')

matches = pattern.finditer(content)
matches_list = list(matches)

if not matches_list:
    print("No matches found!")
    sys.exit(1)

print(f"Found {len(matches_list)} products. Starting image fetch...")

new_content = content
ddgs = DDGS()

for i, match in enumerate(matches_list):
    prefix = match.group(1)
    prod_id = match.group(2)
    name = match.group(3)
    old_img_call = match.group(4)
    
    query = f"{name} high quality product photo isolated white background"
    print(f"[{i+1}/{len(matches_list)}] Searching for: {query}")
    
    try:
        results = ddgs.images(query, max_results=1)
        if results and len(results) > 0:
            image_url = results[0]['image']
            image_url = image_url.replace('"', "%22")
            
            # Since content is changing, replace precisely the exact string for this specific product ID match
            # To be safe, we'll replace the full matched substring
            full_match_str = match.group(0)
            replacement_str = prefix + f'"{image_url}"'
            new_content = new_content.replace(full_match_str, replacement_str)
            print(" -> Found: " + image_url)
        else:
            print(" -> No results found!")
    except Exception as e:
        print(f" -> Error: {e}")
    
    time.sleep(1.5) # avoid rate limits

with open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Finished updating images!")
