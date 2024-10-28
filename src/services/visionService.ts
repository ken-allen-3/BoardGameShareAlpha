import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient({
  keyFilename: import.meta.env.VITE_GOOGLE_CLOUD_KEY_FILE,
});

export async function analyzeImage(base64Image: string) {
  try {
    // Remove data URL prefix if present
    const imageBuffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    // Perform text detection
    const [result] = await client.textDetection({
      image: { content: imageBuffer }
    });

    const textAnnotations = result.textAnnotations || [];
    const detectedText = textAnnotations[0]?.description || '';

    // Extract potential game titles using some heuristics
    const potentialTitles = extractGameTitles(detectedText);

    return potentialTitles;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
}

function extractGameTitles(text: string): string[] {
  // Split text into lines
  const lines = text.split('\n');
  
  // Basic filtering for potential game titles
  const potentialTitles = lines.filter(line => {
    // Remove very short lines
    if (line.length < 4) return false;
    
    // Remove lines that are likely not game titles
    if (/^[0-9\W]+$/.test(line)) return false;
    if (/price|copyright|©|\$|£|€/i.test(line)) return false;
    
    return true;
  });

  return potentialTitles;
}