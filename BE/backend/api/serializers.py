from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'is_active', 'date_added', 'added_by', 'password')
        read_only_fields = ('date_added',)
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['added_by'] = request.user
        else:
            # when user is unauthenticated
            validated_data['added_by'] = None
        
        return User.objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user

    def validate_role(self, value):
        request = self.context.get('request')
        # Unauthenticated users or regular users can only create 'user' role
        if not request or not request.user.is_authenticated or request.user.role == 'user':
            if value != 'user':
                raise serializers.ValidationError("You don't have permission to create this role.")
        # Managers can't create admin users
        elif request.user.role == 'manager' and value == 'admin':
            raise serializers.ValidationError("Managers can't create admin users.")
        
        return value