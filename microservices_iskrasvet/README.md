# Микросервисы товаров и заказов

Проект включает два микросервиса:
- Catalog Service (port 3000)
- Order Service (port 3001)

## Установка и запуск

1. Клонировать репозиторий
2. Перейти в директорию проекта
3. Запустить сервисы:
```bash
docker-compose up -d
```
4. Остановить сервисы:
```bash
docker-compose down
```

## Сервисы

### Catalog Service
- Port: 3000
- API Documentation: http://localhost:3000/docs
- Endpoints:
  - GET /products - Get all products
  - GET /products/{id} - Get product by ID
  - POST /products - Create new product
  - PATCH /products/{id} - Update product
  - DELETE /products/{id} - Delete product

### Order Service
- Port: 3001
- API Documentation: http://localhost:3001/docs
- Endpoints:
  - GET /orders - Get all orders
  - GET /orders/{id} - Get order by ID
  - POST /orders - Create new order
  - PATCH /orders/{id} - Update order status
  - DELETE /orders/{id} - Delete order

### Database
- PostgreSQL
- Port: 5437
- Учетные данные:
  - Пользователь: postgres_user
  - Пароль: postgres_password
  - База данных: postgres
