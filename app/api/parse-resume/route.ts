import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { resume, fileName, fileType } = await request.json();

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Fallback: return empty data if OpenAI key is not configured
      // This allows the app to work without OpenAI initially
      return NextResponse.json({
        gpa: null,
        workExperience: [],
        message: 'OpenAI API key not configured. Please configure OPENAI_API_KEY in your environment variables to enable resume parsing.',
      });
    }

    // Use OpenAI's vision API (gpt-4o or gpt-4o-mini) to parse the resume
    // The model can read PDFs and images directly
    const isPDF = fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
    const isImage = fileType?.startsWith('image/');
    
    // For PDF and images, use vision API; for text, use regular chat
    const useVision = isPDF || isImage;
    const model = useVision ? 'gpt-4o-mini' : 'gpt-4o-mini';
    
    const messages: any[] = [
      {
        role: 'system',
        content: `You are a resume parser. Extract the following information from the resume and return ONLY a valid JSON object with this structure:
{
  "gpa": "3.85" or null if not found (look for GPA, Grade Point Average, or similar),
  "workExperience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State" or null,
      "startDate": "Month Year" or null,
      "endDate": "Month Year" or "Present" or null,
      "description": "Job description" or null
    }
  ]
}
Return only the JSON, no additional text. If information is not found, use null or empty arrays.`
      },
    ];

    if (useVision && isPDF) {
      // For PDF files, we need to use text extraction or vision API
      // Note: OpenAI vision API can handle PDFs as images (first page only)
      // For full PDF parsing, consider using a PDF parsing library first
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Parse this resume PDF (file: ${fileName}) and extract GPA and work experience. Extract all work experience entries you can find.`
          },
          {
            type: 'image_url',
            image_url: {
              url: resume
            }
          }
        ]
      });
    } else if (useVision && isImage) {
      // For image files
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Parse this resume image (file: ${fileName}) and extract GPA and work experience. Extract all work experience entries.`
          },
          {
            type: 'image_url',
            image_url: {
              url: resume
            }
          }
        ]
      });
    } else {
      // For text-based files, try to extract text from base64
      // Note: This is a fallback - ideally we'd parse DOCX/DOC properly
      messages.push({
        role: 'user',
        content: `Parse this resume text and extract GPA and work experience. The resume file name is: ${fileName}. If you cannot extract readable text from the provided data, return {"gpa": null, "workExperience": []}.`
      });
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to parse resume with AI';
      let isQuotaError = false;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
        
        // Check for quota/billing errors
        if (errorMessage.includes('quota') || 
            errorMessage.includes('billing') || 
            errorMessage.includes('exceeded') ||
            errorMessage.includes('insufficient')) {
          isQuotaError = true;
          errorMessage = 'OpenAI API quota exceeded. Please check your OpenAI account billing or skip this step.';
        }
      } catch (e) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        if (errorText.includes('quota') || errorText.includes('billing')) {
          isQuotaError = true;
          errorMessage = 'OpenAI API quota exceeded. Please check your OpenAI account billing.';
        }
      }
      
      // Return error response instead of throwing
      return NextResponse.json(
        {
          error: isQuotaError ? 'Quota exceeded' : 'Failed to parse resume',
          message: errorMessage,
          gpa: null,
          workExperience: [],
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Check if we have valid response data
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If parsing fails, try to extract JSON from the content
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from AI response');
      }
    }

    return NextResponse.json({
      gpa: parsedContent.gpa || null,
      workExperience: parsedContent.workExperience || [],
    });

  } catch (error: any) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { 
        error: 'Failed to parse resume',
        message: error.message,
        // Return empty data so user can continue
        gpa: null,
        workExperience: [],
      },
      { status: 500 }
    );
  }
}
