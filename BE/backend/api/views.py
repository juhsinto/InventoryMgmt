from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
from datetime import datetime

def RootIndex(request):
    now = datetime.now()
    html = '<html lang="en"><body>This is the default view. The UTC time is %s.</body></html>' % now
    return HttpResponse(html)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
