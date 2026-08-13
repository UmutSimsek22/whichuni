import json
import os
import sys

def validate_data():
    file_path = os.path.join("scraper", "universities.json")
    if not os.path.exists(file_path):
        print(f"Error: {file_path} does not exist.")
        sys.exit(1)
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)
        
    if not isinstance(data, list):
        print("Error: Root data must be a JSON array.")
        sys.exit(1)
        
    errors = 0
    warnings = 0
    
    required_uni_keys = {"id", "name", "type", "city", "address", "phone", "website", "faculties_count", "departments"}
    required_dept_keys = {"code", "name", "faculty", "degree", "quota_2025", "filled_2025", "male_students", "female_students", "history"}
    required_history_keys = {"2023", "2024", "2025"}
    
    for idx, uni in enumerate(data):
        missing_uni_keys = required_uni_keys - set(uni.keys())
        if missing_uni_keys:
            print(f"Error: University at index {idx} is missing keys: {missing_uni_keys}")
            errors += 1
            continue
            
        if not isinstance(uni["faculties_count"], int) or uni["faculties_count"] <= 0:
            print(f"Error: {uni['name']} must have a positive integer for faculties_count.")
            errors += 1
            
        if uni["type"] not in {"Devlet", "Vakıf"}:
            print(f"Error: {uni['name']} type must be 'Devlet' or 'Vakıf'. Found: {uni['type']}")
            errors += 1
            
        if uni["city"] not in {"İstanbul", "Giresun"}:
            print(f"Error: {uni['name']} city must be 'İstanbul' or 'Giresun'. Found: {uni['city']}")
            errors += 1
            
        depts = uni.get("departments", [])
        if not isinstance(depts, list) or len(depts) == 0:
            print(f"Error: {uni['name']} must have a non-empty departments list.")
            errors += 1
            continue
            
        for dept in depts:
            missing_dept_keys = required_dept_keys - set(dept.keys())
            if missing_dept_keys:
                print(f"Error: Department in {uni['name']} ({dept.get('name', 'Unknown')}) is missing keys: {missing_dept_keys}")
                errors += 1
                continue
                
            if not isinstance(dept["quota_2025"], int) or dept["quota_2025"] <= 0:
                print(f"Error: {uni['name']} - {dept['name']} must have a positive integer for quota_2025.")
                errors += 1
                
            if not isinstance(dept["filled_2025"], int) or dept["filled_2025"] < 0:
                print(f"Error: {uni['name']} - {dept['name']} must have a non-negative integer for filled_2025.")
                errors += 1
                
            if not isinstance(dept["male_students"], int) or dept["male_students"] < 0:
                print(f"Error: {uni['name']} - {dept['name']} must have a non-negative integer for male_students.")
                errors += 1
                
            if not isinstance(dept["female_students"], int) or dept["female_students"] < 0:
                print(f"Error: {uni['name']} - {dept['name']} must have a non-negative integer for female_students.")
                errors += 1
                
            if dept["degree"] not in {"Lisans", "Önlisans"}:
                print(f"Error: {uni['name']} - {dept['name']} degree must be 'Lisans' or 'Önlisans'. Found: {dept['degree']}")
                errors += 1
                
            if not isinstance(dept["faculty"], str) or len(dept["faculty"].strip()) == 0:
                print(f"Error: {uni['name']} - {dept['name']} must have a non-empty string for faculty.")
                errors += 1
                
            history = dept.get("history", {})
            missing_hist_keys = required_history_keys - set(history.keys())
            if missing_hist_keys:
                print(f"Error: History of {uni['name']} - {dept['name']} is missing years: {missing_hist_keys}")
                errors += 1
                continue
                
            for year, stats in history.items():
                if "quota" not in stats or "students" not in stats:
                    print(f"Error: History of {uni['name']} - {dept['name']} at year {year} is missing 'quota' or 'students' keys.")
                    errors += 1
                elif not isinstance(stats["quota"], int) or not isinstance(stats["students"], int):
                    print(f"Error: History values for year {year} in {uni['name']} - {dept['name']} must be integers.")
                    errors += 1

    print(f"\nValidation Summary:")
    print(f"Errors: {errors}")
    print(f"Warnings: {warnings}")
    
    if errors > 0:
        print("Validation FAILED.")
        sys.exit(1)
    else:
        print("Validation PASSED. Dataset is clean and valid.")

if __name__ == "__main__":
    validate_data()
