from django.shortcuts import render
import asyncio
from rest_framework import (
    viewsets,
    status
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    action
)
from rest_framework.mixins import CreateModelMixin
#from rest_framework.views import APIView
from django.contrib.auth.models import User

from .models import Tasks
from .serializers import TasksSerializer, UserSerializer, CreateUserSerializer
from .utils import start_task_prediction_worker

loop = asyncio.get_event_loop()

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAuthenticated
    ]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TasksViewSet(viewsets.ModelViewSet):
    queryset = Tasks.objects.order_by('-created').all()
    serializer_class = TasksSerializer
    permission_classes = (
        IsAuthenticated,
    )

    @action(detail=True, methods=['post'])
    def start_task(self, request, pk=None):
        """
            Runs worker function on background returns updated
            task object as a result.
        """
        task = Tasks.objects.filter(pk=pk).first()
        if not task:
            return Response({"error": "No task found by given id"},
                            status=status.HTTP_404_NOT_FOUND)
        # start task in background
        loop.run_in_executor(None, start_task_prediction_worker, task)
        # update the task status
        task.status = 'continue'
        task.save()
        # return the updated data
        serializer = self.get_serializer(task)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


@api_view(['GET'])
def current_user(request):
    """
        Determine the current user by their token, and return their data
    """
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
def register(request):
    
    serialized = CreateUserSerializer(data=request.data)
    if serialized.is_valid():
        user = User.objects.create(
            username=serialized.data['username'],
        )
        if 'email' in serialized.data and serialized.data['email']:
            user.email =serialized.data['email']
        user.set_password(serialized.data['password'])
        user.save()
        return Response(status=status.HTTP_201_CREATED)
    else:
        return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)