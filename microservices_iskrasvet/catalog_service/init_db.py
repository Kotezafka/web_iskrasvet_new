import requests
import base64
from sqlalchemy.orm import Session
from database import get_db, engine
import models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    
    db.query(models.Product).delete()
    db.commit()
    logger.info("Cleared existing products")

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
        },
        {
            "name": "Лампа настольная светодиодная REXANT, 4Вт, LED, 4000",
            "description": "Настольный светодиодный светильник - это универсальный источник света, который подойдет как для освещения рабочего места, так и для создания комфортного прикроватного освещения.",
            "price": 900,
            "stock_quantity": 30,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/3689399/2a00000194eeb98b01b883fcecdac09f83c2/optimize"
        },
        {
            "name": "Настольный светильник Brillight 'Листья'",
            "description": "Настольный светильник изготовлен из натурального, экологически чистого дерева — березовой фанеры. При изготовлении используется покрытие высокого качества, что обеспечивает долгий срок службы.",
            "price": 3100,
            "stock_quantity": 16,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/7981713/2a00000191d734236fd816e437c5a1a4a5fc/optimize"
        },
        {
            "name": "Лампа настольная SELEROLIFE, светодиодная, 10 Вт, площадь освещения 20 м²",
            "description": "Настольная светодиодная лампа - это стильный и функциональный аксессуар для освещения рабочего пространства. Лампа обеспечивает площадь освещения до 20 квадратных метров.",
            "price": 1200,
            "stock_quantity": 9,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/4497593/2a0000019016745cfee29da2dc63fc7407b5/optimize"
        },
        {
            "name": "Лампа-трансформер AstoCrysta 'Stevie', LED, E14, 7 Вт, складная, деревянная",
            "description": "Светильник-трансформер 'Stevie' обладает мощностью 7 Вт и может использоваться как для освещения рабочего места, так и в качестве элемента декора.",
            "price": 1000,
            "stock_quantity": 23,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/4881627/2a00000191d70f59e15a3695cf4682414b65/optimize"
        },
        {
            "name": "Настольная лампа светодиодная Home-like_Cozy, 5W, E27 холодный белый свет",
            "description": "Современная настольная лампа с холодным белым светом, идеально подходит для рабочего места.",
            "price": 1600,
            "stock_quantity": 28,
            "image_url": "https://ir.ozone.ru/s3/multimedia-1-b/wc1000/7188351131.jpg"
        },
        {
            "name": "Настольная лампа Xiaomi Mi LED Desk Lamp 1S",
            "description": "Умная настольная лампа с регулировкой яркости и цветовой температуры. Поддерживает управление через приложение Mi Home.",
            "price": 3500,
            "stock_quantity": 15,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/14353726/2a0000019643225696f1890813d2f338ea01/optimize"
        },
        {
            "name": "Настольная лампа ARTE LAMP A5810LT-1CC",
            "description": "Стильная настольная лампа в современном дизайне. Металлический абажур с матовым стеклом создает мягкое освещение.",
            "price": 4200,
            "stock_quantity": 8,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/11213128/2a000001906d8c2404cb3f5c6e8cb34d9af9/optimize"
        },
        {
            "name": "Настольная лампа ЭРА NLED-426-7W-840-E27",
            "description": "Энергосберегающая светодиодная лампа с возможностью регулировки угла наклона. Идеальна для рабочего стола.",
            "price": 1200,
            "stock_quantity": 25,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/11318716/2a00000193fdc295d9873b036b3d46355185/optimize"
        },
        {
            "name": "Настольная лампа ODEON LIGHT BRUSO 2354/1T",
            "description": "Классическая настольная лампа с тканевым абажуром. Создает уютную атмосферу в интерьере.",
            "price": 2800,
            "stock_quantity": 12,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/3590777/2a0000018ea2acd1d19c67cef78c681ab758/optimize"
        },
        {
            "name": "Настольная лампа ЭРА NLED-461-9W-840-E27",
            "description": "Мощная светодиодная лампа с широким углом освещения. Подходит для больших рабочих поверхностей.",
            "price": 1500,
            "stock_quantity": 20,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/5031100/2a0000018ea2a3971146e13177ec2ff2dd09/optimize"
        },
        {
            "name": "Настольная лампа ODEON LIGHT FAVORI 2353/1T",
            "description": "Элегантная настольная лампа с металлическим основанием и тканевым абажуром. Создает мягкое, рассеянное освещение.",
            "price": 3200,
            "stock_quantity": 14,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/3689399/2a00000194eeb98b01b883fcecdac09f83c2/optimize"
        },
        {
            "name": "Настольная лампа ЭРА NLED-426-5W-840-E27",
            "description": "Компактная светодиодная лампа с регулируемым углом наклона. Идеальна для небольших рабочих поверхностей.",
            "price": 950,
            "stock_quantity": 30,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/7981713/2a00000191d734236fd816e437c5a1a4a5fc/optimize"
        },
        {
            "name": "Настольная лампа ODEON LIGHT FAVORI 2352/1T",
            "description": "Современная настольная лампа с металлическим основанием и тканевым абажуром. Создает уютную атмосферу.",
            "price": 2900,
            "stock_quantity": 18,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/4497593/2a0000019016745cfee29da2dc63fc7407b5/optimize"
        },
        {
            "name": "Настольная лампа ЭРА NLED-461-7W-840-E27",
            "description": "Энергосберегающая светодиодная лампа с широким углом освещения. Подходит для различных задач.",
            "price": 1300,
            "stock_quantity": 22,
            "image_url": "https://avatars.mds.yandex.net/get-mpic/4881627/2a00000191d70f59e15a3695cf4682414b65/optimize"
        },
        {
            "name": "Лампа настольная, бежевая, E27, регулировка яркости, USB-зарядка",
            "description": 'Настольная лампа с регулировкой яркости и двумя USB-разъемами - прекрасное и функциональное дополнение для Вашего интерьера. Она, в том числе, может использоваться как ночник. Три режима работы позволяют Вам выбрать подходящую яркость света в зависимости от ваших потребностей и настроения. Данная функция особенно полезна тогда, когда лампа используется в качестве прикроватного светильника или ночника в спальне',
            "price": 2100,
            "stock_quantity": 7,
            "image_url": 'https://avatars.mds.yandex.net/get-mpic/5086514/2a000001907a4e8bddb87dd5e408c7366d9e/optimize'
        }
    ]

    for product_data in products:
        try:
            image_base64 = download_image(product_data["image_url"])
            binary_images = [base64.b64decode(image_base64)] if image_base64 else []

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