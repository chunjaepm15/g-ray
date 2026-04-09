import os
import shutil
import glob

def organize_author_dir(author_path):
    if not os.path.exists(author_path):
        return
        
    for i in range(1, 9):
        lesson_str = f"Lesson{i:02d}"
        lesson_folder = os.path.join(author_path, lesson_str)
        os.makedirs(lesson_folder, exist_ok=True)
        
        # find all files starting with LessonXX that are NOT directories
        # match files exactly like Lesson01.txt or Lesson01_*.csv
        files = glob.glob(os.path.join(author_path, f"{lesson_str}*.*"))
        for f in files:
            if os.path.isfile(f):
                # Only move if it is directly tied to the single lesson, e.g. Lesson01_...
                # Leave things like Lesson01-08 where they are, or just move everything that matches?
                # Actually, skipping files containing '-' in the lesson part
                basename = os.path.basename(f)
                if '-' in basename.split('_')[0]:  
                    # e.g., Lesson01-08_organized.csv -> skip
                    continue
                
                shutil.move(f, os.path.join(lesson_folder, basename))
                print(f"Moved {basename} to {lesson_str}/")

def main():
    base_dir = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data"
    
    # Jung Sayeol
    jung_path = os.path.join(base_dir, "정사열")
    print("Organizing Jung Sayeol...")
    organize_author_dir(jung_path)
    
    # Lee Jaeyoung
    lee_path = os.path.join(base_dir, "이재영", "data")
    print("Organizing Lee Jaeyoung...")
    organize_author_dir(lee_path)

if __name__ == "__main__":
    main()
