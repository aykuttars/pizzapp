import json
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User


class UsersApiTest(APITestCase):
    base_url = "/api/v1"

    def test_returns_none_if_no_such_token(self):
        token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNTg2MzUzMTI4LCJlbWFpbCI6InRlc3RAcGl6emEuY29tIiwib3JpZ19pYXQiOjE1ODYzNTIxMjh9.myNUYsYpsbYU5IXURGGp3wWh7spQfhAWFVzwrU0gvZY"
        response = self.client.post(f"{self.base_url}/auth-jwt-verify/", {"token": token} )
        desired_response = {'non_field_errors': ['Error decoding signature.']}
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), desired_response)

    def test_create_account(self):
        params = {
            "username": "createduser",
            "password": "createdasswd",
        }
        response = self.client.post(f"{self.base_url}/users/register/", params)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "createduser")


    def test_login_account(self):
        payload = dict(username='logintest', password='loginpasswd')
        user = User.objects.create(username='logintest')
        user.set_password('loginpasswd')
        user.save()
        response = self.client.post(f"{self.base_url}/auth-jwt/", payload)
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(payload["username"], data["username"])




