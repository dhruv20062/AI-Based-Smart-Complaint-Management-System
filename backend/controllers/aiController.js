const Complaint = require('../models/Complaint');

// AI Analysis using OpenRouter API (or rule-based fallback)
const analyzeWithAI = async (complaint) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const prompt = `You are an AI assistant for a Smart Complaint Management System. Analyze the following complaint and respond in JSON format only with no extra text.

Complaint Details:
- Title: ${complaint.title}
- Description: ${complaint.description}
- Category: ${complaint.category}
- Location: ${complaint.location}

Respond ONLY with this exact JSON structure:
{
  "priority": "Low|Medium|High|Critical",
  "department": "Department name responsible",
  "summary": "Brief 1-2 sentence summary",
  "response": "Professional auto-response message to the complainant"
}`;

  if (apiKey && apiKey !== 'your_openrouter_api_key_here') {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Smart Complaint Management',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      console.log('OpenRouter response status:', response.status);

      if (!response.ok) {
        console.warn('OpenRouter API error:', JSON.stringify(data));
        return ruleBasedAnalysis(complaint);
      }

      const content = data.choices?.[0]?.message?.content;
      if (content) {
        // Strip markdown code fences if present (```json ... ```)
        const cleaned = content.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        console.log('AI analysis successful via OpenRouter');
        return parsed;
      }
    } catch (err) {
      console.warn('OpenRouter API failed, using rule-based fallback:', err.message);
    }
  }

  // Rule-based fallback AI
  return ruleBasedAnalysis(complaint);
};

// Rule-based AI analysis (no API key needed)
const ruleBasedAnalysis = (complaint) => {
  const text = `${complaint.title} ${complaint.description}`.toLowerCase();

  // Priority detection
  let priority = 'Medium';
  if (
    text.includes('urgent') ||
    text.includes('emergency') ||
    text.includes('fire') ||
    text.includes('flood') ||
    text.includes('accident') ||
    text.includes('critical')
  ) {
    priority = 'Critical';
  } else if (
    text.includes('leak') ||
    text.includes('broken') ||
    text.includes('dangerous') ||
    text.includes('no water') ||
    text.includes('no electricity')
  ) {
    priority = 'High';
  } else if (
    text.includes('delay') ||
    text.includes('slow') ||
    text.includes('request') ||
    text.includes('improve')
  ) {
    priority = 'Low';
  }

  // Department recommendation
  const departmentMap = {
    'Water Supply': 'Water Supply & Sanitation Department',
    Electricity: 'Electricity Board',
    Roads: 'Public Works Department (PWD)',
    Garbage: 'Municipal Solid Waste Management',
    Sanitation: 'Water Supply & Sanitation Department',
    'Public Safety': 'Police & Emergency Services',
    Other: 'General Administration Department',
  };

  const department = departmentMap[complaint.category] || 'General Administration Department';

  // Summary
  const summary = `A ${priority.toLowerCase()}-priority complaint regarding ${complaint.category.toLowerCase()} issue has been received from ${complaint.location}. Immediate attention is recommended.`;

  // Auto-response
  const response = `Dear ${complaint.name},\n\nThank you for submitting your complaint titled "${complaint.title}". We have received your complaint and it has been assigned a priority level of "${priority}". Your case has been forwarded to the ${department} for resolution. We will keep you updated on the progress.\n\nComplaint Reference: Will be provided via email.\n\nBest regards,\nSmart Complaint Management System`;

  return { priority, department, summary, response };
};

// @desc    Analyze complaint using AI
// @route   POST /api/ai/analyze
// @access  Public
const analyzeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ success: false, message: 'complaintId is required' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const aiResult = await analyzeWithAI(complaint);

    // Save AI results back to the complaint
    complaint.aiPriority = aiResult.priority;
    complaint.aiDepartment = aiResult.department;
    complaint.aiSummary = aiResult.summary;
    complaint.aiResponse = aiResult.response;
    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'AI analysis completed',
      data: {
        complaintId: complaint._id,
        priority: aiResult.priority,
        department: aiResult.department,
        summary: aiResult.summary,
        response: aiResult.response,
      },
    });
  } catch (error) {
    console.error('AI analyze error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Bulk analyze all unanalyzed complaints
// @route   POST /api/ai/analyze-all
// @access  Private (Admin)
const analyzeAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ aiPriority: null });
    const results = [];

    for (const complaint of complaints) {
      const aiResult = await analyzeWithAI(complaint);
      complaint.aiPriority = aiResult.priority;
      complaint.aiDepartment = aiResult.department;
      complaint.aiSummary = aiResult.summary;
      complaint.aiResponse = aiResult.response;
      await complaint.save();
      results.push({ id: complaint._id, priority: aiResult.priority });
    }

    res.status(200).json({
      success: true,
      message: `Analyzed ${results.length} complaints`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { analyzeComplaint, analyzeAllComplaints };
