from PIL import Image
import sys
import os

def create_transparent_white_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        
        # If pixel is almost white (background), make it transparent
        if r > 240 and g > 240 and b > 240:
            new_data.append((255, 255, 255, 0))
        # If pixel is dark (logo shape), make it white and opaque
        elif r < 100 and g < 100 and b < 100:
            # The darker the original, the more opaque the new white pixel
            opacity = 255 - int((r+g+b)/3.0)
            new_data.append((255, 255, 255, opacity))
        else:
            # For anti-aliased edges (gray), turn them into semi-transparent white
            brightness = int((r+g+b)/3.0)
            opacity = 255 - brightness
            new_data.append((255, 255, 255, opacity))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

create_transparent_white_logo("public/nav-logo-new.png", "public/nav-logo-transparent.png")
create_transparent_white_logo("public/brand-logo.png", "public/favicon-white.png")
