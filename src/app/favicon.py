from PIL import Image, ImageDraw, ImageFont

# Definição dos tamanhos dos ícones
sizes = [(64, 64), (128, 128), (256, 256), (512, 512), (1250, 1250)]  # Tamanhos variados

# Criar imagem com fundo transparente
img_size = 1250
img = Image.new("RGBA", (img_size, img_size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Cor do fundo do círculo
circle_color = (240, 240, 255, 255)  # Azul claro
text_color = "#05116c"  # Azul escuro

# Desenhar círculo centralizado
draw.ellipse((0, 0, img_size, img_size), fill=circle_color)

# Configurar fonte
font_size = 690  # Ajustado para caber no círculo
try:
    font = ImageFont.truetype("arialbd.ttf", font_size)  # Fonte em negrito
except IOError:
    font = ImageFont.load_default()

# Texto "GX"
text = "GX"

# Obter bounding box do texto para centralizar
text_bbox = draw.textbbox((0, 0), text, font=font)
text_width = text_bbox[2] - text_bbox[0]
text_height = text_bbox[3] - text_bbox[1]

# Calcular posição central para o texto
text_x = (img_size - text_width) // 2
text_y = (img_size - text_height) // 2

# Ajuste para subir o texto
text_y -= 80  # Subir o texto mais ainda (aumente ou diminua conforme necessário)

# Desenhar texto sobre o círculo
draw.text((text_x, text_y), text, font=font, fill=text_color)

# Salvar como .ico
ico_path = "favicon.ico"
img.save(ico_path, format="ICO", sizes=sizes)

print(f"Ícone salvo como {ico_path}")

