# Ostogai AI — кастомная конфигурация

Кастомные файлы поверх LibreChat для платформы [ostogai.ru](https://ostogai.ru).

## Стек
- LibreChat (Node.js, порт 3080)
- nginx (реверс-прокси, HTTPS через Let's Encrypt)
- MongoDB, Meilisearch, RAG API + pgvector
- Docker Compose

## Структура
ostogai-config/
├── librechat.yaml              # Конфиг LibreChat: эндпоинты, пресеты, интерфейс
├── docker-compose.override.yml # Docker оверрайд: патчи, админ-панель
├── EndpointController.js       # Патч: скрывает Claude/GPT эндпоинты от юзеров
├── OpenAIImageTools.js         # Патч: генерация изображений через кастомный прокси
├── nginx.conf                  # nginx конфиг для ostogai.ru
└── public/                     # JS инъекции через nginx sub_filter
├── delete-agent.js         # Кнопка удаления агентов в сайдбаре
├── notice.js               # Плашка "ИИ от Gotso в стадии разработки"
└── scroll-bottom.js        # Автоскролл вниз при открытии чата
## Пресеты для пользователей
| Пресет | Модель | Эндпоинт |
|--------|--------|----------|
| ostoG Base | GPT | GPT endpoint |
| ostoG Pro | Claude Sonnet | Claude endpoint |
| ostoG Ultra | Claude Opus | Claude endpoint |

## Деплой патчей
Файлы монтируются в контейнер через `docker-compose.override.yml`:
- `EndpointController.js` → `/app/api/server/controllers/EndpointController.js`
- `OpenAIImageTools.js` → `/app/api/app/clients/tools/structured/OpenAIImageTools.js`

JS инъекции лежат в `/var/www/html/` и раздаются nginx.
