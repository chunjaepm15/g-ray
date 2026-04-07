import csv
import os
import re

directory = r'd:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\정사열'
csv_files = [f for f in os.listdir(directory) if f.endswith('.csv')]

def fix_csv_v3(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    if not lines:
        return

    header_line = lines[0].strip()
    header = header_line.split(',')
    num_cols = len(header)
    
    output_rows = []
    output_rows.append(header)
    
    for i, line in enumerate(lines[1:], start=2):
        line = line.strip()
        if not line:
            continue
            
        # Try splitting with raw comma split to see total pieces
        # but be careful with quotes
        reader = csv.reader([line])
        try:
            parts = next(reader)
        except:
            parts = line.split(',')
            
        # Check if line contains double G0xxx pattern or is just broken
        # Let's find the correct grammar_id index. In our schema, it's index 4.
        # However, due to brokenness, it might be anywhere.
        
        # We know:
        # 0: id (always Lxx-xx or Lxx-P-xx)
        # 1: category (Listening, Main, Reading, Focus In, Grammar)
        # 2: english (Text)
        # 3: korean (Text)
        # 4: grammar_id (G0xxx)
        # ...
        
        # Strategy:
        # Find the FIRST occurrence of G0\d{3} after index 2.
        g_idx = -1
        for idx in range(3, len(parts)):
            if re.match(r'^G0\d{3}$', parts[idx].strip()):
                g_idx = idx
                break
        
        if g_idx != -1:
            # We found the real grammar_id.
            # Korean is everything from index 3 up to g_idx
            korean = ",".join(parts[3:g_idx]).strip()
            # And then we need parts[g_idx : g_idx+5] for grammar_id to page
            extracted = parts[g_idx : g_idx+5]
            if len(extracted) < 5:
                # Pad if needed, but it shouldn't happen if line is overflowed
                extracted += [""] * (5 - len(extracted))
            
            fixed_line = [parts[0], parts[1], parts[2], korean] + extracted[:5]
            output_rows.append(fixed_line)
        else:
            # If no G0xxx found, maybe it's too broken, just append as is for now
            # but usually it should be there.
            if len(parts) > num_cols:
                # fallback merge
                fixed_line = [parts[0], parts[1], parts[2], ",".join(parts[3:-5]).strip()] + parts[-5:]
                output_rows.append(fixed_line)
            else:
                output_rows.append(parts)

    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        writer.writerows(output_rows)
    print(f"Fixed {file_path}")

for csv_file in csv_files:
    fix_csv_v3(os.path.join(directory, csv_file))
