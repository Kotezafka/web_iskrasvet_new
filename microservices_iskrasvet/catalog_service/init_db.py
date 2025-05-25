import requests
import base64
from sqlalchemy.orm import Session
from database import get_db, engine
import models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Создаем таблицы
models.Base.metadata.create_all(bind=engine)

def download_image(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return base64.b64encode(response.content).decode('utf-8')
        return None
    except Exception as e:
        logger.error(f"Error downloading image from {url}: {str(e)}")
        return None

def init_db():
    db = next(get_db())
    
    # Проверяем, есть ли уже товары в базе
    if db.query(models.Product).first():
        logger.info("Database already initialized")
        return

    # Данные товаров из фронтенда
    products = [
        {
            "name": "Настольная лампа металлическая Elektrostandard ML-104 черный/хром",
            "description": "Лаконичная металлическая настольная лампа в стиле лофт. Регулируемый плафон позволяет направить свет для чтения или работы",
            "price": 3700,
            "stock_quantity": 0,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/11213128/2a000001906d8c2404cb3f5c6e8cb34d9af9/optimize"
        },
        {
            "name": "Бестеневая лампа настольная FRIENDME, светодиодная, 12W, дневной белый, сверхтеплый, теплый белый, холодный белый",
            "description": "Светильник настольный с использованием светодиодной технологии обеспечивает мягкое, приятное освещение без создания ослепляющих бликов. Благодаря этому лампа подходит для продолжительного использования. Светильник поможет создать атмосферу комфорта и спокойствия в учебном пространстве.",
            "price": 4500,
            "stock_quantity": 7,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/11318716/2a00000193fdc295d9873b036b3d46355185/optimize"
        },
        {
            "name": "Бестеневая настольная лампа, двойной источник света, FRIENDME 24W",
            "description": "Это чудесная длинная светодиодная лампа, которая словно факел, освещает путь к твоим самым заветным мечтам. Этот светильник станет верным спутником как для школьника, так и для офисного работника.",
            "price": 4700,
            "stock_quantity": 5,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/3590777/2a0000018ea2acd1d19c67cef78c681ab758/optimize"
        },
        {
            "name": "Настольная лампа Xiaomi Mijia Desk Light Lite 2, LED, мощность 7.5 Вт",
            "description": "В настольной лампе Mijia 2 Lite используется специальная оптическая линза с коэффициентом пропускания света 53%, которая сохраняет светоотдачу и уменьшает раздражение глаз при прямом взгляде на нее.",
            "price": 1800,
            "stock_quantity": 10,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/14353726/2a0000019643225696f1890813d2f338ea01/optimize"
        },
        {
            "name": "Настольная лампа FRIENDME, LED, 90Ra, 5000K, Черная",
            "description": "Светильники вращаются на 270 градусов. Настольная лампа с поворотным рычагом оснащена двойным источником света мощностью 12 Вт для равномерного освещения всего рабочего места.",
            "price": 3000,
            "stock_quantity": 27,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/5031100/2a0000018ea2a3971146e13177ec2ff2dd09/optimize"
        }
    ]

    for product_data in products:
        try:
            # Загружаем изображение
            image_base64 = download_image(product_data["image_url"])
            binary_images = [base64.b64decode(image_base64)] if image_base64 else []

            # Создаем товар
            db_product = models.Product(
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                stock_quantity=product_data["stock_quantity"],
                images=binary_images
            )
            
            db.add(db_product)
            logger.info(f"Added product: {product_data['name']}")
        except Exception as e:
            logger.error(f"Error adding product {product_data['name']}: {str(e)}")
            continue

    db.commit()
    logger.info("Database initialization completed")

if __name__ == "__main__":
    init_db() 