#!/bin/bash

# Deploy Edge Function
supabase functions deploy analyze-medicine --project-ref your-project-ref

# Set environment variables
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

echo "Deployment complete!" 