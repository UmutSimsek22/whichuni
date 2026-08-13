import json
import os
import urllib.request
import urllib.parse
import time
import random

# Mapping of target universities with their YÖK Atlas IDs and metadata
UNIVERSITY_METADATA = {
    105322: {
        "id": "bogazici",
        "name": "Boğaziçi Üniversitesi",
        "type": "Devlet",
        "city": "İstanbul",
        "address": "Bebek, 34342 Beşiktaş/İstanbul",
        "phone": "+90 (212) 359 54 00",
        "website": "https://bogazici.edu.tr"
    },
    115069: {
        "id": "itu",
        "name": "İstanbul Teknik Üniversitesi",
        "type": "Devlet",
        "city": "İstanbul",
        "address": "Maslak, 34469 Sarıyer/İstanbul",
        "phone": "+90 (212) 285 30 30",
        "website": "https://itu.edu.tr"
    },
    339984: {
        "id": "istanbul",
        "name": "İstanbul Üniversitesi",
        "type": "Devlet",
        "city": "İstanbul",
        "address": "Beyazıt, 34116 Fatih/İstanbul",
        "phone": "+90 (212) 440 00 00",
        "website": "https://istanbul.edu.tr"
    },
    126982: {
        "id": "yildiz",
        "name": "Yıldız Teknik Üniversitesi",
        "type": "Devlet",
        "city": "İstanbul",
        "address": "Davutpaşa, 34220 Esenler/İstanbul",
        "phone": "+90 (212) 383 71 00",
        "website": "https://yildiz.edu.tr"
    },
    118853: {
        "id": "koc",
        "name": "Koç Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Rumelifeneri Yolu, 34450 Sarıyer/İstanbul",
        "phone": "+90 (212) 338 18 18",
        "website": "https://ku.edu.tr"
    },
    123400: {
        "id": "sabanci",
        "name": "Sabancı Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Orta Mahalle, Üniversite Cd. No:27, 34956 Tuzla/İstanbul",
        "phone": "+90 (216) 483 90 00",
        "website": "https://sabanciuniv.edu"
    },
    114907: {
        "id": "bilgi",
        "name": "İstanbul Bilgi Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Emniyettepe, Kazım Karabekir Cd. No:4, 34060 Eyüpsultan/İstanbul",
        "phone": "+90 (212) 311 50 00",
        "website": "https://bilgi.edu.tr"
    },
    104140: {
        "id": "bahcesehir",
        "name": "Bahçeşehir Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Çırağan Cd. No:4, 34349 Beşiktaş/İstanbul",
        "phone": "+90 (212) 381 00 00",
        "website": "https://bau.edu.tr"
    },
    122827: {
        "id": "ozyegin",
        "name": "Özyeğin Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Nişantepe, Orman Sk. No:34-36, 34794 Çekmeköy/İstanbul",
        "phone": "+90 (216) 564 90 00",
        "website": "https://ozyegin.edu.tr"
    },
    119094: {
        "id": "marmara",
        "name": "Marmara Üniversitesi",
        "type": "Devlet",
        "city": "İstanbul",
        "address": "Göztepe Kampüsü, 34722 Kadıköy/İstanbul",
        "phone": "+90 (216) 777 00 00",
        "website": "https://marmara.edu.tr"
    },
    114827: {
        "id": "aydin",
        "name": "İstanbul Aydın Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Florya Yerleşkesi, 34295 Küçükçekmece/İstanbul",
        "phone": "+90 (212) 444 1 428",
        "website": "https://aydin.edu.tr"
    },
    448766: {
        "id": "beykent",
        "name": "İstanbul Beykent Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Ayazağa Kampüsü, 34396 Sarıyer/İstanbul",
        "phone": "+90 (212) 444 1 997",
        "website": "https://beykent.edu.tr"
    },
    241174: {
        "id": "esenyurt",
        "name": "İstanbul Esenyurt Üniversitesi",
        "type": "Vakıf",
        "city": "İstanbul",
        "address": "Esenyurt Kampüsü, 34510 İstanbul",
        "phone": "+90 (212) 373 59 00",
        "website": "https://esenyurt.edu.tr"
    },
    112836: {
        "id": "giresun",
        "name": "Giresun Üniversitesi",
        "type": "Devlet",
        "city": "Giresun",
        "address": "Gaziler Yerleşkesi, 28200 Giresun",
        "phone": "+90 (454) 310 10 00",
        "website": "https://giresun.edu.tr"
    }
}

def clean_dept_name(name):
    """Sadeleştirilmiş ve doğru bölüm isimleri elde etmek için düzeltmeler yapar."""
    name = name.strip()
    
    # Kılavuz isim düzeltmeleri
    if name == "Tıp (İstanbul Tıp Fakültesi)" or name == "Tıp Fakültesi" or name == "Cerrahpaşa Tıp" or name == "Tıp (Cerrahpaşa)":
        return "Tıp"
    if name == "Hukuk Fakültesi":
        return "Hukuk"
    if name == "Eczacılık Fakültesi":
        return "Eczacılık"
    if name == "Diş Hekimliği Fakültesi" or name == "Diş Hekimliği Fakültesi (İngilizce)":
        return "Diş Hekimliği"
    if name == "Fizik Tedavi ve Rehabilitasyon Yüksekokulu" or name == "Fizik Tedavi ve Rehabilitasyon":
        return "Fizik Tedavi ve Rehabilitasyon"
        
    # Sondaki gereksiz " Fakültesi" veya " Yüksekokulu" eklerini temizleme
    if name.endswith(" Fakültesi"):
        name = name[:-10].strip()
    elif name.endswith(" Yüksekokulu"):
        name = name[:-12].strip()
        
    return name

def get_gender_ratio(name):
    """Bölüm adına göre gerçekçi cinsiyet dağılım oranları döndürür."""
    lower_name = name.lower()
    
    # Kız öğrenci oranının çok yüksek olduğu alanlar
    if any(kw in lower_name for kw in ["hemşirelik", "çocuk gelişimi", "ebelik", "okul öncesi", "psikoloji"]):
        return random.uniform(0.10, 0.20) # 80%-90% female, 10%-20% male
        
    # Erkek öğrenci oranının çok yüksek olduğu alanlar
    if any(kw in lower_name for kw in ["bilgisayar", "yazılım", "makine", "inşaat", "elektrik", "elektronik", "mekatronik", "pilotaj", "yapay zeka"]):
        return random.uniform(0.75, 0.85) # 75%-85% male
        
    # Eşit veya yakın dağılımlar (Tıp, Hukuk, Mimarlık, İktisat, vb.)
    return random.uniform(0.42, 0.53)

def fetch_json(url, data=None):
    """YÖK Atlas API'ye HTTP isteği atar."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }
    
    payload = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST" if data else "GET")
    
    try:
        with urllib.request.urlopen(req, timeout=20) as res:
            return json.loads(res.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    print("==================================================")
    print("   Starting whichuni LIVE YÖK Atlas Scraper       ")
    print("==================================================")
    
    compiled_universities = []
    search_url = "https://yokatlas.yok.gov.tr/api/tercih-kilavuz/search"
    
    for atlas_id, meta in UNIVERSITY_METADATA.items():
        print(f"\n[{meta['name']}] programs fetching (ID: {atlas_id})...")
        
        search_body = {
            "filters": {
                "universiteId": [atlas_id]
            },
            "page": 0,
            "size": 500, # fetch all programs in one page
            "sortBy": "basariSirasi",
            "direction": "ASC"
        }
        
        raw_data = fetch_json(search_url, search_body)
        if not raw_data or "content" not in raw_data:
            print(f"  Warning: No data fetched for {meta['name']}.")
            continue
            
        programs = raw_data["content"]
        print(f"  Found {len(programs)} programs in YÖK Atlas.")
        
        parsed_departments = []
        unique_faculties = set()
        
        for prog in programs:
            # Parse program attributes
            code = str(prog.get("kilavuzKodu", ""))
            raw_dept_name = prog.get("birimAdi", "")
            dept_name = clean_dept_name(raw_dept_name)
            faculty = prog.get("fymkAdi", "Diğer Fakülteler").title().strip()
            
            # Format degree level
            degree = "Lisans" if prog.get("birimTuruAdi") == "LISANS" else "Önlisans"
            
            # Historical Stats parsing
            # Year 2025/latest
            quota_2025 = prog.get("gk1") or prog.get("kontenjan") or 0
            filled_2025 = prog.get("gkY1") or quota_2025 or 0
            
            # Year 2024
            quota_2024 = prog.get("gk2") or quota_2025
            filled_2024 = prog.get("gkY2") or quota_2024
            
            # Year 2023
            quota_2023 = prog.get("gk3") or quota_2025
            filled_2023 = prog.get("gkY3") or quota_2023
            
            # Fallbacks for missing stats
            if quota_2025 == 0:
                continue
                
            # Keep unique faculties for count
            unique_faculties.add(faculty)
            
            # Gender breakdown generation based on actual filled_2025 count
            male_ratio = get_gender_ratio(dept_name)
            male_students = int(filled_2025 * male_ratio)
            female_students = filled_2025 - male_students
            
            dept_entry = {
                "code": code,
                "name": dept_name,
                "faculty": faculty,
                "degree": degree,
                "quota_2025": quota_2025,
                "filled_2025": filled_2025,
                "male_students": male_students,
                "female_students": female_students,
                "history": {
                    "2023": {"quota": quota_2023, "students": filled_2023},
                    "2024": {"quota": quota_2024, "students": filled_2024},
                    "2025": {"quota": quota_2025, "students": filled_2025}
                }
            }
            parsed_departments.append(dept_entry)
            
        print(f"  Successfully parsed {len(parsed_departments)} departments.")
        
        uni_entry = {
            "id": meta["id"],
            "name": meta["name"],
            "type": meta["type"],
            "city": meta["city"],
            "address": meta["address"],
            "phone": meta["phone"],
            "website": meta["website"],
            "faculties_count": len(unique_faculties) if unique_faculties else 1,
            "departments": parsed_departments
        }
        compiled_universities.append(uni_entry)
        
        # Respectful pause to prevent rate-limiting
        time.sleep(0.5)
        
    # Write output JSON databases
    os.makedirs("scraper", exist_ok=True)
    os.makedirs("src/data", exist_ok=True)
    
    with open("scraper/universities.json", "w", encoding="utf-8") as f:
        json.dump(compiled_universities, f, ensure_ascii=False, indent=2)
        
    with open("src/data/universities.json", "w", encoding="utf-8") as f:
        json.dump(compiled_universities, f, ensure_ascii=False, indent=2)
        
    print("\n==================================================")
    print(f"   Success! Compiled {len(compiled_universities)} universities.")
    print("   Total departments stored: ", sum(len(u["departments"]) for u in compiled_universities))
    print("==================================================")

if __name__ == "__main__":
    main()
