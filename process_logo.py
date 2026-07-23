from PIL import Image
import sys

def convert_to_white_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        if a > 0:
            # Calculate darkness (0 = white, 255 = black)
            darkness = 255 - int((r + g + b) / 3.0)
            # New alpha is proportional to original alpha and darkness
            new_alpha = int(a * (darkness / 255.0))
            new_data.append((255, 255, 255, new_alpha))
        else:
            new_data.append((255, 255, 255, 0))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

try:
    convert_to_white_logo('public/nav-logo-new.png', 'public/favicon.png')
    convert_to_white_logo('public/nav-logo-new.png', 'public/logo-white.png')
except Exception as e:
    print(f"Error: {e}")
