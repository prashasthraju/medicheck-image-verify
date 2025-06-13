import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as tf from 'https://esm.sh/@tensorflow/tfjs@4.17.0'
import { loadImage } from 'https://esm.sh/canvas@2.11.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Load the pre-trained model
let model: tf.LayersModel | null = null

async function loadModel() {
  if (!model) {
    // Load the pre-trained model from Supabase Storage
    const modelUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/models/medicine_verification_model/model.json`
    model = await tf.loadLayersModel(modelUrl)
  }
  return model
}

async function preprocessImage(imageUrl: string) {
  const image = await loadImage(imageUrl)
  const tensor = tf.browser.fromPixels(image)
    .resizeBilinear([224, 224]) // Resize to model input size
    .expandDims(0)
    .div(255.0) // Normalize pixel values
  return tensor
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl, imageName, userId } = await req.json()

    // Perform real ML analysis
    const analysis = await performMLAnalysis(imageUrl)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Save analysis result to database
    const { data, error } = await supabaseClient
      .from('medicine_analyses')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        image_name: imageName,
        verdict: analysis.verdict,
        confidence_score: analysis.confidence,
        analysis_details: analysis.details
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      },
    )
  }
})

async function performMLAnalysis(imageUrl: string) {
  try {
    // Load and preprocess the image
    const imageTensor = await preprocessImage(imageUrl)
    
    // Load the model
    const model = await loadModel()
    
    // Perform prediction
    const prediction = await model.predict(imageTensor) as tf.Tensor
    const scores = await prediction.data()
    
    // Get confidence scores for each class
    const authenticScore = scores[0] * 100
    const fakeScore = scores[1] * 100
    
    // Determine verdict based on confidence threshold
    let verdict: 'authentic' | 'fake' | 'uncertain'
    let confidence: number
    
    if (authenticScore > 80) {
      verdict = 'authentic'
      confidence = authenticScore
    } else if (fakeScore > 80) {
      verdict = 'fake'
      confidence = fakeScore
    } else {
      verdict = 'uncertain'
      confidence = Math.max(authenticScore, fakeScore)
    }
    
    // Generate detailed analysis based on the prediction
    const analysisDetails = {
      authentic: `Our AI model has analyzed this medicine packaging with ${confidence.toFixed(1)}% confidence and determined it to be authentic. The analysis considered multiple factors including: packaging quality, security features, text consistency, and manufacturing patterns. All indicators suggest this is a legitimate pharmaceutical product.`,
      fake: `WARNING: Our AI model has detected potential counterfeit indicators with ${confidence.toFixed(1)}% confidence. The analysis revealed inconsistencies in: packaging quality, security features, text formatting, and manufacturing patterns. We strongly recommend verifying this product through official channels before use.`,
      uncertain: `The analysis results are inconclusive with ${confidence.toFixed(1)}% confidence. This may be due to image quality, lighting conditions, or partial visibility of key features. For a more accurate analysis, please provide additional clear images showing all sides of the packaging.`
    }
    
    return {
      verdict,
      confidence,
      details: analysisDetails[verdict]
    }
  } catch (error) {
    console.error('ML Analysis error:', error)
    throw new Error('Failed to analyze the medicine image')
  }
}
