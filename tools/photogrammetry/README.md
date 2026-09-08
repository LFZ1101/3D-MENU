# Photogrammetry tool

Ferramenta auxiliar para produção local de modelos 3D no Mac.

## Interface prevista

```bash
menuar-photogrammetry \
  --input ./captures/prato-01 \
  --output ./exports/prato-01.usdz \
  --detail medium
```

## Requisitos

- macOS com suporte a RealityKit Object Capture
- Pasta de captura com 40–80 fotos bem distribuídas
- Medidas do prato em centímetros

## Observação

O ambiente Linux/Cloud Agent não compila Object Capture. O stub e a documentação existem para execução posterior no MacBook Air M4.
