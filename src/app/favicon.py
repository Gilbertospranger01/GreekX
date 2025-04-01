from PIL import Image, ImageDraw, ImageFont

# Definição dos tamanhos dos ícones
sizes = [(64, 64), (128, 128), (256, 256), (512, 512), (1000, 1000)]  # Aumentar os tamanhos para maior visibilidade

# Criar imagem transparente de 512x512 pixels
img_size = 1000
img = Image.new("RGBA", (img_size, img_size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Configurar fonte
font_size = 690  # Aumentar o tamanho da fonte
try:
    font = ImageFont.truetype("arialbd.ttf", font_size)  # Fonte em negrito
except IOError:
    font = ImageFont.load_default()

# Texto e cor
text = "GX"
dark_blue = "#05116c"

# Obter bounding box do texto para centralização
text_bbox = draw.textbbox((0, 0), text, font=font)
text_width = text_bbox[2] - text_bbox[0]
text_height = text_bbox[3] - text_bbox[1]

# Ajuste manual para compensar a linha de base
baseline_offset = text_bbox[1]  # Pega o topo do bounding box (que pode ser negativo)
text_y_correction = (baseline_offset // 2)  # Compensa a linha de base

# Calcular posição central e subir um pouco mais
text_x = (img_size - text_width) // 2
text_y = (img_size - text_height) // 2 - text_y_correction - 14  # Subindo um pouco mais

# Desenhar texto na imagem
draw.text((text_x, text_y), text, font=font, fill=dark_blue)

# Salvar como .ico
ico_path = "favicon.ico"
img.save(ico_path, format="ICO", sizes=sizes)

print(f"Ícone salvo como {ico_path}")