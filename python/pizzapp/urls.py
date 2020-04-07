"""pizzapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import (
    path,
    include
)
from django.conf.urls import (
    url,
    include
)
from django.contrib.auth.models import User
from rest_framework import (
    routers,
    serializers,
    viewsets,
    permissions
)
from rest_framework_jwt.views import (
    RefreshJSONWebToken,
    VerifyJSONWebToken,
    ObtainJSONWebToken
)
from pizzaserver.views import (
    register,
    current_user,
    TasksViewSet,
    UserViewSet
)
from pizzaserver.serializers import (
    UserLoginSerializer
)
router = routers.DefaultRouter()
router.register(r'user_list', UserViewSet)
router.register(r'task_list', TasksViewSet)

urlpatterns = [
    #path('admin/', admin.site.urls),
    url(r'^api/v1/users/register/',register),
    path(r'api/v1/current_users/',current_user),
    url(r'^api/v1/auth-jwt/', ObtainJSONWebToken.as_view(serializer_class=UserLoginSerializer)),
    url(r'^api/v1/auth-jwt-refresh/', RefreshJSONWebToken.as_view()),
    url(r'^api/v1/auth-jwt-verify/', VerifyJSONWebToken.as_view()),
    url(r'^api/v1/', include(router.urls)),
]