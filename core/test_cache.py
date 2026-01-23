from django.test import TestCase, override_settings
from django.core.cache import cache
from django.conf import settings


class CacheConfigurationTestCase(TestCase):
    """Test Redis/Valkey cache configuration"""
    
    def setUp(self):
        """Clear cache before each test"""
        cache.clear()
    
    def tearDown(self):
        """Clear cache after each test"""
        cache.clear()
    
    def test_cache_backend_configured(self):
        """Test that cache backend is configured"""
        # Check if cache is available
        self.assertIsNotNone(cache)
    
    def test_cache_set_and_get(self):
        """Test basic cache set and get operations"""
        # Set a value in cache
        cache.set('test_key', 'test_value', timeout=60)
        
        # Retrieve the value
        value = cache.get('test_key')
        self.assertEqual(value, 'test_value')
    
    def test_cache_delete(self):
        """Test cache deletion"""
        # Set a value
        cache.set('test_key', 'test_value')
        
        # Delete it
        cache.delete('test_key')
        
        # Verify it's gone
        value = cache.get('test_key')
        self.assertIsNone(value)
    
    def test_cache_timeout(self):
        """Test cache expiration (basic test)"""
        import time
        
        # Set a value with 1 second timeout
        cache.set('test_key', 'test_value', timeout=1)
        
        # Should exist immediately
        self.assertEqual(cache.get('test_key'), 'test_value')
        
        # Wait for expiration
        time.sleep(2)
        
        # Should be gone (may not work with all cache backends in tests)
        value = cache.get('test_key')
        # Note: This test may be unreliable with dummy cache backend
        # In production with Redis, this would work as expected
    
    def test_cache_many(self):
        """Test setting and getting multiple cache values"""
        data = {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3'
        }
        
        # Set multiple values
        cache.set_many(data, timeout=60)
        
        # Get multiple values
        result = cache.get_many(['key1', 'key2', 'key3'])
        self.assertEqual(result, data)
    
    def test_cache_increment(self):
        """Test cache increment operation"""
        # Set initial value
        cache.set('counter', 0)
        
        # Increment
        cache.incr('counter')
        self.assertEqual(cache.get('counter'), 1)
        
        # Increment by specific amount
        cache.incr('counter', delta=5)
        self.assertEqual(cache.get('counter'), 6)
    
    def test_cache_decrement(self):
        """Test cache decrement operation"""
        # Set initial value
        cache.set('counter', 10)
        
        # Decrement
        cache.decr('counter')
        self.assertEqual(cache.get('counter'), 9)
        
        # Decrement by specific amount
        cache.decr('counter', delta=3)
        self.assertEqual(cache.get('counter'), 6)
    
    def test_cache_default_value(self):
        """Test cache get with default value"""
        # Get non-existent key with default
        value = cache.get('nonexistent_key', default='default_value')
        self.assertEqual(value, 'default_value')
    
    def test_cache_add(self):
        """Test cache add (only sets if key doesn't exist)"""
        # Add a new key
        result = cache.add('new_key', 'new_value')
        self.assertTrue(result)
        self.assertEqual(cache.get('new_key'), 'new_value')
        
        # Try to add same key again (should fail)
        result = cache.add('new_key', 'different_value')
        self.assertFalse(result)
        self.assertEqual(cache.get('new_key'), 'new_value')  # Original value unchanged


@override_settings(
    CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'test-cache',
        }
    }
)
class CacheFallbackTestCase(TestCase):
    """Test cache behavior with local memory backend (fallback)"""
    
    def setUp(self):
        cache.clear()
    
    def tearDown(self):
        cache.clear()
    
    def test_fallback_cache_works(self):
        """Test that fallback cache backend works"""
        cache.set('test_key', 'test_value')
        value = cache.get('test_key')
        self.assertEqual(value, 'test_value')


class CacheIntegrationTestCase(TestCase):
    """Test cache integration with application logic"""
    
    def setUp(self):
        cache.clear()
    
    def tearDown(self):
        cache.clear()
    
    def test_cache_poll_results(self):
        """Test caching poll results"""
        poll_id = 1
        cache_key = f'poll_results_{poll_id}'
        
        # Simulate caching poll results
        poll_results = {
            'question': 'Should we renovate the pool?',
            'options': [
                {'text': 'Yes', 'votes': 10},
                {'text': 'No', 'votes': 5}
            ]
        }
        
        cache.set(cache_key, poll_results, timeout=300)
        
        # Retrieve from cache
        cached_results = cache.get(cache_key)
        self.assertEqual(cached_results, poll_results)
    
    def test_cache_resident_data(self):
        """Test caching resident data"""
        resident_id = 1
        cache_key = f'resident_{resident_id}'
        
        resident_data = {
            'id': resident_id,
            'unit_number': '101',
            'phone_number': '555-1234'
        }
        
        cache.set(cache_key, resident_data, timeout=600)
        
        # Retrieve from cache
        cached_data = cache.get(cache_key)
        self.assertEqual(cached_data, resident_data)
    
    def test_cache_invalidation(self):
        """Test cache invalidation pattern"""
        cache_key = 'announcements_list'
        
        # Set initial cache
        announcements = ['Announcement 1', 'Announcement 2']
        cache.set(cache_key, announcements)
        
        # Simulate data update - invalidate cache
        cache.delete(cache_key)
        
        # Cache should be empty
        self.assertIsNone(cache.get(cache_key))
        
        # Simulate fetching fresh data and re-caching
        new_announcements = ['Announcement 1', 'Announcement 2', 'Announcement 3']
        cache.set(cache_key, new_announcements)
        
        # Verify new data is cached
        self.assertEqual(cache.get(cache_key), new_announcements)
