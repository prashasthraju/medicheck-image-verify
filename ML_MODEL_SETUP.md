# Medicine Verification ML Model Setup

This guide will help you set up the pre-trained ML model for medicine verification in your Supabase project.

## Prerequisites

1. Python 3.8 or higher
2. Supabase project with storage enabled
3. Supabase service role key

## Setup Steps

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Update the Supabase credentials in `upload_model.py`:
   - Replace `YOUR_SUPABASE_URL` with your Supabase project URL
   - Replace `YOUR_SUPABASE_SERVICE_ROLE_KEY` with your service role key

3. Train and export the model:
```bash
python train_model.py
```

4. Upload the model to Supabase storage:
```bash
python upload_model.py
```

## Model Details

The model is based on ResNet50 architecture and has been pre-trained to detect:
- Authentic medicine packaging
- Counterfeit medicine packaging

The model analyzes various features including:
- Packaging quality
- Security features
- Text consistency
- Manufacturing patterns

## Integration with Edge Function

The Edge Function (`analyze-medicine/index.ts`) is already configured to use this model. It will:
1. Load the model from Supabase storage
2. Process uploaded medicine images
3. Return analysis results with confidence scores

## Model Performance

The model provides:
- Binary classification (authentic/fake)
- Confidence scores for predictions
- Detailed analysis of packaging features

## Troubleshooting

If you encounter any issues:
1. Ensure the model files are properly uploaded to Supabase storage
2. Check that the storage bucket is public
3. Verify the model path in the Edge Function matches your storage structure
4. Check the Supabase logs for any errors

## Security Note

The model is designed to run in Supabase Edge Functions, which provides a secure environment for ML inference. The model files are stored in a public bucket but are only accessible through the Edge Function. 