from PIL import Image
import sys

def get_bg_color(input_path):
    try:
        img = Image.open(input_path).convert("RGB")
        w, h = img.size
        # Sample several edge points to see if there is a vignette
        points = [(0, 0), (w//2, 0), (0, h//2), (w-1, h//2), (w//2, h-1)]
        for p in points:
            r, g, b = img.getpixel(p)
            hex_color = f"#{r:02x}{g:02x}{b:02x}"
            print(f"Point {p}: {hex_color}")
    except Exception as e:
        print(f"Error: {e}")

get_bg_color('public/hero-coffee-dark.png')
