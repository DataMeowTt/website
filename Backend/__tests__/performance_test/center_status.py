from locust import HttpUser, task, between, SequentialTaskSet
import random
from datetime import date, timedelta
import json

BACKEND_HOST = "http://localhost:3000"

ADMIN_USERNAME = "admin01"
ADMIN_PASSWORD = "123456"

FALLBACK_CENTER_IDS = [
    "67ca6e3cfc964efa218ab7d8",
    "67ca6e3cfc964efa218ab7d9",
    "67ca6e3cfc964efa218ab7d7",
    "67ca6e3cfc964efa218ab7da",
]

class AdminUser(HttpUser):
    wait_time = between(5, 10)

    host = BACKEND_HOST

    def on_start(self):
        print(f"Locust user {self.environment.runner.user_count} starting, attempting login...")

        login_endpoint = "/api/admin/login"
        login_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        headers = {'Content-Type': 'application/json'}

        try:
            response = self.client.post(login_endpoint, data=json.dumps(login_data), headers=headers)

            if response.status_code == 200:
                print(f"User {self.environment.runner.user_count}: Login successful!")
                self.is_authenticated = True
            else:
                print(f"User {self.environment.runner.user_count}: Login failed with status code: {response.status_code}. Response body: {response.text}")
                self.is_authenticated = False
                return

        except Exception as e:
             print(f"User {self.environment.runner.user_count}: Error during login: {e}")
             self.is_authenticated = False
             return

        self.available_center_ids = []
        if self.is_authenticated:
            try:
                response = self.client.get("/api/admin/center-status/get-all-centers", name="/api/admin/center-status/get-all-centers [on_start]")
                if response.status_code == 200:
                    data = response.json().get("data", [])
                    self.available_center_ids = [center.get("_id") for center in data if center and center.get("_id")]
                    if not self.available_center_ids:
                        print(f"User {self.environment.runner.user_count}: Warning: No valid center IDs fetched from /get-all-centers on start.")
                else:
                    print(f"User {self.environment.runner.user_count}: Failed to fetch centers on start: Status {response.status_code}")
            except Exception as e:
                print(f"User {self.environment.runner.user_count}: Error fetching centers on start: {e}")

        if not self.available_center_ids:
             self.available_center_ids = FALLBACK_CENTER_IDS

    @task(1)
    def get_all_centers_task(self):
        if not self.is_authenticated:
             return

        self.client.get("/api/admin/center-status/get-all-centers", name="/api/admin/center-status/get-all-centers")

    @task(2)
    def get_courts_and_initial_mapping_task(self):
        if not self.is_authenticated:
            return

        if not self.available_center_ids:
            return

        selected_center_id = random.choice(self.available_center_ids)

        self.client.get("/api/admin/center-status/get-courts", params={"centerId": selected_center_id}, name="/api/admin/center-status/get-courts")

        today_str = date.today().strftime("%Y-%m-%d")

        self.client.get(
            "/api/admin/center-status/full-mapping",
            params={"centerId": selected_center_id, "date": today_str},
            name="/api/admin/center-status/full-mapping [single date]"
        )

    @task(10)
    def view_multiple_dates_mapping_task(self):
        if not self.is_authenticated:
            return

        if not self.available_center_ids:
            return

        selected_center_id = random.choice(self.available_center_ids)

        self.client.get("/api/admin/center-status/get-courts", params={"centerId": selected_center_id}, name="/api/admin/center-status/get-courts")

        num_dates_to_select = random.randint(1, 7)
        selected_dates = set()

        today = date.today()
        while len(selected_dates) < num_dates_to_select:
            random_days = random.randint(0, 29)
            target_date = today + timedelta(days=random_days)
            selected_dates.add(target_date)

        sorted_date_strings = sorted([d.strftime("%Y-%m-%d") for d in selected_dates])

        for date_str in sorted_date_strings:
            self.client.get(
                "/api/admin/center-status/full-mapping",
                params={"centerId": selected_center_id, "date": date_str},
                name="/api/admin/center-status/full-mapping [multiple dates]"
            )