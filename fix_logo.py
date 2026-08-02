from PIL import Image
import sys
import os

def create_transparent_white_logo(input_path, output_path):
    print(f"Processing {input_path} -> {output_path}")
    if not os.path.exists(input_path):
        print("Input file not found!")
        return
        
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        
        # If the pixel is already fully transparent, keep it transparent
        if a == 0:
            new_data.append((255, 255, 255, 0))
            continue
            
        # Calculate brightness (0 = black, 255 = white)
        brightness = (r + g + b) / 3.0
        
        # We want the black text to become WHITE text
        # And the white background to become TRANSPARENT
        # So: if it's dark (brightness < 128), we make it white and opaque
        # If it's light (brightness >= 128), we make it transparent
        
        if brightness < 128:
            # It's dark (part of the logo)
            # Make it white
            new_data.append((255, 255, 255, a))
        else:
            # It's light (part of the background)
            # Make it transparent
            new_data.append((255, 255, 255, 0))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

create_transparent_white_logo('public/brand-logo.png', 'public/nav-logo-transparent.png')
