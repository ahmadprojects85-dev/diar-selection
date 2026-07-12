from PIL import Image
import sys

def remove_background(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # If the pixel is very light (background), make it transparent
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path} successfully!")
    except Exception as e:
        print(f"Error: {e}")

remove_background(r'C:\Users\pc\.gemini\antigravity-ide\brain\9afacaaf-9bf1-43d6-9041-10e5c05b9c8b\media__1783352662443.png', 'public/brand-logo.png')
