from PIL import Image
import os

input_path = r"C:\Users\pc\.gemini\antigravity-ide\brain\9afacaaf-9bf1-43d6-9041-10e5c05b9c8b\media__1783410986903.png"
output_dir = r"c:\Users\pc\Desktop\diar collection\diar-selection\public\categories"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

img = Image.open(input_path).convert("RGBA")
w, h = img.size

# The mockup has 6 cards in a row. 
# We can divide the width by 6.
card_w = w // 6

names = ['grinders', 'scales', 'kettles', 'brewers', 'filters', 'accessories']

for i in range(6):
    left = i * card_w
    right = (i + 1) * card_w
    # Crop the card
    card = img.crop((left, 0, right, h))
    
    # We want to remove the beige background to make it transparent for glassmorphism
    # Or just keep it as is if it's too complex. 
    # Let's try simple color distance background removal
    newData = []
    for item in card.getdata():
        # The background in the mockup is likely #F5EFE6 or similar.
        # Let's check if it's very light and yellowish/greyish
        r, g, b, a = item
        # If the pixel is close to the background color (e.g. R>230, G>220, B>210), make it transparent
        if r > 220 and g > 215 and b > 200:
            # We can feather it by making very light pixels partially transparent
            # But simple threshold is safer for now
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    card.putdata(newData)
    
    # Also crop the top and bottom margins if needed, but let's just save
    card.save(os.path.join(output_dir, f"{names[i]}.png"), "PNG")
    print(f"Saved {names[i]}.png")
