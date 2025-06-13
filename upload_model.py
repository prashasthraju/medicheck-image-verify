import os
from supabase import create_client
import json

# Initialize Supabase client
supabase_url = "YOUR_SUPABASE_URL"
supabase_key = "YOUR_SUPABASE_SERVICE_ROLE_KEY"
supabase = create_client(supabase_url, supabase_key)

def upload_model():
    # Create models bucket if it doesn't exist
    try:
        supabase.storage.create_bucket('models', {'public': True})
    except Exception as e:
        print(f"Bucket might already exist: {e}")

    # Upload model files
    model_dir = 'model'
    for filename in os.listdir(model_dir):
        file_path = os.path.join(model_dir, filename)
        with open(file_path, 'rb') as f:
            supabase.storage.from_('models').upload(
                f'medicine_verification_model/{filename}',
                f.read()
            )
        print(f"Uploaded {filename}")

    # Create and upload metadata
    metadata = {
        "name": "Medicine Verification Model",
        "version": "1.0.0",
        "description": "A pre-trained model for detecting counterfeit medicines",
        "input_shape": [224, 224, 3],
        "classes": ["authentic", "fake"]
    }
    
    with open('model/metadata.json', 'w') as f:
        json.dump(metadata, f)
    
    with open('model/metadata.json', 'rb') as f:
        supabase.storage.from_('models').upload(
            'medicine_verification_model/metadata.json',
            f.read()
        )
    print("Uploaded metadata.json")

if __name__ == "__main__":
    upload_model() 