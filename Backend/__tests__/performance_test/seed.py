import csv
import pymongo
import bcrypt 

from datetime import datetime 
import random 
import os

MONGO_URI = os.environ.get('MONGO_URI')
MONGO_DB_NAME = "BadmintonManager" 
MONGO_COLLECTION_NAME = "users" 

BCRYPT_SALT_ROUNDS = 10


TEST_USERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_users.csv")

def hash_password(password):
    salt = bcrypt.gensalt(rounds=BCRYPT_SALT_ROUNDS)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8') 

def seed_users(mongo_uri, db_name, collection_name, csv_file):
    client = None 
    try:
        client = pymongo.MongoClient(mongo_uri)
        db = client[db_name]
        collection = db[collection_name]
        client.admin.command('ping')
        print("Kết nối MongoDB thành công!")

        users_to_insert = []
        try:
            with open(csv_file, mode='r', encoding='utf-8') as infile:
                reader = csv.DictReader(infile)
                print(f"Đang đọc file CSV: {csv_file}")
                for row in reader:
                    username = row.get("username")
                    password = row.get("password")

                    if not username or not password:
                        print(f"Cảnh báo: Bỏ qua dòng thiếu username hoặc password: {row}")
                        continue

                    hashed_password = hash_password(password)

                    user_document = {
                        "username": username,
                        "password_hash": hashed_password,
                        "name": f"Test User {username}", 
                        "email": f"{username}@test.com", 
                        "phone_number": f"09{random.randint(10000000, 99999999)}", 
                        "registration_date": datetime.utcnow(), 
                        "avatar_image_path": "/uploads/default-avatar.jpg", 
                        "level": "Đồng", 
                        "points": 0, 
                        "favouriteCenter": [], 
                        "stats": { 
                            "totalBookings": 0,
                            "completedBookings": 0,
                            "cancelledBookings": 0,
                            "averagePlayTime": "0 phút"
                        },
                        "updatedAt": datetime.utcnow(), 
                        "__v": 0 
                    }
                    users_to_insert.append(user_document)

        except FileNotFoundError:
            print(f"Lỗi: Không tìm thấy file CSV tại đường dẫn: {csv_file}")
            return
        except Exception as e:
            print(f"Lỗi khi đọc file CSV: {e}")
            return

        if not users_to_insert:
            print("Không có người dùng nào được đọc từ file CSV để chèn.")
            return

        print(f"Đang chèn {len(users_to_insert)} người dùng vào collection '{collection_name}'...")
        try:
            insert_result = collection.insert_many(users_to_insert)
            print(f"Đã chèn thành công {len(insert_result.inserted_ids)} bản ghi.")
        except pymongo.errors.BulkWriteError as bwe:
            print(f"Lỗi khi chèn nhiều bản ghi: {bwe.details}")
            for error in bwe.details['writeErrors']:
                print(f" - Index: {error['index']}, Code: {error['code']}, Message: {error['errmsg']}")
        except Exception as e:
            print(f"Lỗi khi chèn dữ liệu vào MongoDB: {e}")

    except pymongo.errors.ConnectionFailure as e:
        print(f"Lỗi kết nối MongoDB: {e}")
    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")
    finally:
        if client:
            client.close()
            print("Đã đóng kết nối MongoDB.")

if __name__ == "__main__":
    seed_users(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION_NAME, TEST_USERS_FILE)

