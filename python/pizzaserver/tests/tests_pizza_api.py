import json
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from pizza.models import Tasks


class PizzaAPITest(APITestCase):
    base_url = "/api/v1"
    tasks_url = "/api/v1/task_list"

    """
        method, ndpoints:
        POST, predict -> creates
        GET, predict -> list
        UPDATE/PATCH, predict -> updates
        DELETE, predict, -> deletes
    """

    def create_user(self):
        # Create user and retrieve the token
        payload = dict(username='predictuser', password='predictpasswd')
        user = User.objects.create(username='predictuser')
        user.set_password('predictpasswd')
        user.save()
        response = self.client.post(f"{self.base_url}/auth-jwt/", payload)
        user_data = response.json()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + user_data["token"])

    def test_get_returns_json_200(self):
        task = Tasks.objects.create(step=3, name='instance_task')
        response = self.client.get(f"{self.tasks_url}/{task.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['content-type'], 'application/json')

    def test_post_creates_a_task(self):
        excel_data = SimpleUploadedFile("instance.xlsx", b"file_content", content_type="xlsx")
        params = {
            "name": "creating_from_test",
            "step": 12,
            "data_filepath": excel_data
        }
        response = self.client.post(f"{self.tasks_url}/", params)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response['content-type'], 'application/json')

    def test_post_start_task(self):
        excel_file = SimpleUploadedFile("test_data.xlsx", b"file_content", content_type="xlsx")
        task = Tasks.objects.create(step=3, name='instance_task', data_filepath=excel_file)
        response = self.client.post(f"{self.tasks_url}/{task.id}/start_task/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['content-type'], 'application/json')

    def test_delete_a_task(self):
        task = Tasks.objects.create(step=3, name='instance_task')
        response = self.client.delete(f"{self.tasks_url}/{task.id}/")
        self.assertEqual(response.status_code, 204)


