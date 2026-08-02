from PIL import Image
import sys

def remove_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # Get the background color from the top-left pixel
    bg_color = datas[0]
    
    newData = []
    for item in datas:
        # Check if the pixel is close to the background color
        if (abs(item[0] - bg_color[0]) <= tolerance and 
            abs(item[1] - bg_color[1]) <= tolerance and 
            abs(item[2] - bg_color[2]) <= tolerance):
            # Change to transparent
            newData.append((255, 255, 255, 0))
        else:
            # Change everything else to pure white
            # If the logo is not perfectly white, it might be better to just leave it as is or make it pure white
            if item[0] > 100 and item[1] > 100 and item[2] > 100:
                newData.append((255, 255, 255, 255))
            else:
                newData.append(item)
                
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

if __name__ == "__main__":
    remove_background("public/nav-logo.png", "public/nav-logo.png")
