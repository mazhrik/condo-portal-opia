from core.models import Amenity

def seed_amenities():
    if not Amenity.objects.exists():
        Amenity.objects.create(name="Gym", capacity=10, description="Main building gym")
        Amenity.objects.create(name="Pool", capacity=25, description="Outdoor pool")
        Amenity.objects.create(name="Conference Room", capacity=8, description="Meeting room A")
        print("✅ Default amenities created.")
    else:
        print("ℹ️ Amenities already exist. Skipping seed.")

if __name__ == '__main__':
    seed_amenities()
