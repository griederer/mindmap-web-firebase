#!/usr/bin/env python3
"""
Script para agregar timeline al proyecto de IA Responsable
"""

import json
import os

# Ruta al archivo
mindmap_path = '../public/examples/ia-responsable.json'

# Cargar el archivo actual
with open(mindmap_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Habilitar vista de timeline
if 'views' not in data['metadata']:
    data['metadata']['views'] = {}

data['metadata']['views']['timeline'] = {
    "enabled": True,
    "default": False
}

# Asegurar que mindmap también esté habilitado
data['metadata']['views']['mindmap'] = {
    "enabled": True,
    "default": True
}

# Agregar configuración de timeline
data['timeline'] = {
    "config": {
        "startDate": "2012-01-01",
        "endDate": "2026-12-31",
        "tracks": [
            {
                "id": "regulation-track",
                "name": "Regulación & Legislación",
                "color": "#EF4444"  # Rojo
            },
            {
                "id": "frameworks-track",
                "name": "Marcos & Estándares",
                "color": "#3B82F6"  # Azul
            },
            {
                "id": "incidents-track",
                "name": "Incidentes & Casos Notables",
                "color": "#F59E0B"  # Ámbar
            }
        ]
    },
    "events": [
        # 2012-2015: Inicios
        {
            "id": "evt-1",
            "title": "AlexNet - Boom Deep Learning",
            "description": "AlexNet gana ImageNet, inicia la revolución del deep learning moderno",
            "date": "2012-09-30",
            "track": "frameworks-track"
        },
        {
            "id": "evt-2",
            "title": "Google - Sesgo Racial en Fotos",
            "description": "Google Photos etiqueta personas afroamericanas como 'gorilas', primer caso masivo de sesgo algorítmico",
            "date": "2015-07-01",
            "track": "incidents-track"
        },

        # 2016
        {
            "id": "evt-3",
            "title": "EU GDPR - Aprobación",
            "description": "Unión Europea aprueba GDPR con derecho a explicación de decisiones automatizadas",
            "date": "2016-04-27",
            "track": "regulation-track"
        },
        {
            "id": "evt-4",
            "title": "ProPublica - COMPAS Bias",
            "description": "Investigación revela sesgo racial en algoritmo COMPAS usado en sistema judicial de EE.UU.",
            "date": "2016-05-23",
            "track": "incidents-track"
        },

        # 2017
        {
            "id": "evt-5",
            "title": "Asilomar AI Principles",
            "description": "Conferencia establece 23 principios para IA beneficiosa, firmados por líderes de la industria",
            "date": "2017-01-05",
            "track": "frameworks-track"
        },
        {
            "id": "evt-6",
            "title": "IEEE - Ethically Aligned Design",
            "description": "IEEE publica primer borrador de estándares para diseño ético de sistemas autónomos",
            "date": "2017-03-13",
            "track": "frameworks-track"
        },

        # 2018
        {
            "id": "evt-7",
            "title": "GDPR - Entrada en Vigor",
            "description": "GDPR se vuelve efectivo, establece multas de hasta €20M o 4% de facturación global",
            "date": "2018-05-25",
            "track": "regulation-track"
        },
        {
            "id": "evt-8",
            "title": "Amazon - Sesgo en Reclutamiento",
            "description": "Amazon descarta herramienta de IA para reclutamiento por discriminar contra mujeres",
            "date": "2018-10-10",
            "track": "incidents-track"
        },

        # 2019
        {
            "id": "evt-9",
            "title": "OECD AI Principles",
            "description": "OCDE adopta 5 principios para IA responsable, adoptados por 42 países",
            "date": "2019-05-22",
            "track": "frameworks-track"
        },

        # 2020
        {
            "id": "evt-10",
            "title": "EU White Paper on AI",
            "description": "Comisión Europea publica libro blanco proponiendo marco regulatorio para IA",
            "date": "2020-02-19",
            "track": "regulation-track"
        },

        # 2021
        {
            "id": "evt-11",
            "title": "NIST AI Risk Management Framework",
            "description": "NIST lanza borrador de marco de gestión de riesgos de IA con 4 funciones principales",
            "date": "2021-03-17",
            "track": "frameworks-track"
        },
        {
            "id": "evt-12",
            "title": "EU AI Act - Primera Propuesta",
            "description": "Comisión Europea propone primera Ley de IA del mundo con clasificación basada en riesgo",
            "date": "2021-04-21",
            "track": "regulation-track"
        },
        {
            "id": "evt-13",
            "title": "Facebook Papers - Algorithmic Harm",
            "description": "Filtración revela que Facebook sabía que sus algoritmos causan daño social pero priorizó engagement",
            "date": "2021-10-25",
            "track": "incidents-track"
        },

        # 2022
        {
            "id": "evt-14",
            "title": "Blueprint for AI Bill of Rights",
            "description": "Casa Blanca publica blueprint con 5 principios para IA responsable en EE.UU.",
            "date": "2022-10-04",
            "track": "regulation-track"
        },

        # 2023
        {
            "id": "evt-15",
            "title": "ChatGPT - Regulación Urgente",
            "description": "Explosión de ChatGPT acelera debate regulatorio global sobre IA generativa",
            "date": "2023-01-15",
            "track": "incidents-track"
        },
        {
            "id": "evt-16",
            "title": "EU AI Act - Aprobación Parlamento",
            "description": "Parlamento Europeo aprueba AI Act con 499 votos a favor, entrará en vigor en 2026",
            "date": "2023-06-14",
            "track": "regulation-track"
        },
        {
            "id": "evt-17",
            "title": "Biden - Executive Order on AI",
            "description": "Orden ejecutiva establece nuevos estándares para seguridad y privacidad en IA",
            "date": "2023-10-30",
            "track": "regulation-track"
        },

        # 2024
        {
            "id": "evt-18",
            "title": "NIST AI RMF 1.0 - Versión Final",
            "description": "NIST publica versión final del AI Risk Management Framework adoptado globalmente",
            "date": "2024-01-26",
            "track": "frameworks-track"
        },
        {
            "id": "evt-19",
            "title": "ISO/IEC 42001 - AI Management",
            "description": "Primera norma ISO internacional para sistemas de gestión de IA",
            "date": "2024-12-18",
            "track": "frameworks-track"
        },

        # 2025 (Proyecciones)
        {
            "id": "evt-20",
            "title": "China - AI Governance Law",
            "description": "China implementa ley integral de gobernanza de IA con enfoque en control estatal",
            "date": "2025-03-01",
            "track": "regulation-track"
        },

        # 2026 (Proyecciones)
        {
            "id": "evt-21",
            "title": "EU AI Act - Entrada en Vigor",
            "description": "AI Act de la UE se vuelve totalmente efectivo, multas hasta €35M o 7% de facturación",
            "date": "2026-06-01",
            "track": "regulation-track"
        },
        {
            "id": "evt-22",
            "title": "Global AI Treaty - Negociaciones",
            "description": "ONU inicia negociaciones para primer tratado internacional vinculante sobre IA",
            "date": "2026-09-15",
            "track": "regulation-track"
        }
    ]
}

# Guardar archivo actualizado
with open(mindmap_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Timeline agregado exitosamente!")
print(f"📁 Archivo actualizado: {mindmap_path}")
print(f"\n📊 Estadísticas:")
print(f"  - Tracks: {len(data['timeline']['config']['tracks'])}")
print(f"  - Eventos: {len(data['timeline']['events'])}")
print(f"  - Período: {data['timeline']['config']['startDate']} → {data['timeline']['config']['endDate']}")
