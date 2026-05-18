import os
from parser import extract_text

files = ["uploads/6a09e2529d62d042ca425d88_Ananya_Gupta_Resume.pdf", "uploads/6a09d8e1ee06cb8918358ee9_Rohan_Malhotra_Resume.pdf"]
for f in files:
    try:
        text = extract_text(f)
        print(f"--- {f} ---")
        print("Text length:", len(text))
        print("Text preview:", repr(text[:200]))
    except Exception as e:
        print(f"Failed to read {f}: {e}")
