from django.test import TestCase
from django.conf import settings
import os


class Phase1ConfigTest(TestCase):
    """Test Phase 1 infrastructure and configuration setup"""
    
    def test_environment_variables_loaded(self):
        """Verify settings use environment variables"""
        self.assertTrue(hasattr(settings, 'SECRET_KEY'))
        self.assertIsNotNone(settings.SECRET_KEY)
        self.assertIsNotNone(settings.DATABASES['default'])
        
    def test_static_root_configured(self):
        """Verify STATIC_ROOT is set for production"""
        self.assertTrue(hasattr(settings, 'STATIC_ROOT'))
        self.assertIn('staticfiles', settings.STATIC_ROOT)
        
    def test_database_config_uses_dj_database_url(self):
        """Verify database is configured via dj_database_url"""
        # Check that DATABASES is properly configured
        self.assertIn('default', settings.DATABASES)
        db_config = settings.DATABASES['default']
        self.assertIn('ENGINE', db_config)
        
    def test_cors_configuration(self):
        """Verify CORS is configured from environment"""
        self.assertTrue(hasattr(settings, 'CORS_ALLOWED_ORIGINS'))
        # Should be a list/tuple
        self.assertTrue(isinstance(settings.CORS_ALLOWED_ORIGINS, (list, tuple)))
        
    def test_allowed_hosts_configured(self):
        """Verify ALLOWED_HOSTS uses environment variable"""
        self.assertTrue(hasattr(settings, 'ALLOWED_HOSTS'))
        self.assertTrue(isinstance(settings.ALLOWED_HOSTS, list))
        
    def test_redis_cache_conditional(self):
        """Verify Redis cache is configured when REDIS_URL is set"""
        if os.environ.get('REDIS_URL'):
            self.assertTrue(hasattr(settings, 'CACHES'))
            self.assertIn('default', settings.CACHES)
            self.assertEqual(
                settings.CACHES['default']['BACKEND'],
                'django.core.cache.backends.redis.RedisCache'
            )
        else:
            # Redis not configured, which is fine for local dev
            pass
            
    def test_jwt_configuration(self):
        """Verify JWT authentication is configured"""
        self.assertTrue(hasattr(settings, 'SIMPLE_JWT'))
        self.assertIn('ACCESS_TOKEN_LIFETIME', settings.SIMPLE_JWT)
        self.assertIn('REFRESH_TOKEN_LIFETIME', settings.SIMPLE_JWT)
        
    def test_rest_framework_authentication(self):
        """Verify REST framework uses JWT authentication"""
        self.assertTrue(hasattr(settings, 'REST_FRAMEWORK'))
        auth_classes = settings.REST_FRAMEWORK.get('DEFAULT_AUTHENTICATION_CLASSES', ())
        self.assertIn(
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            auth_classes
        )
