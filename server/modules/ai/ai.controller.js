import * as aiService from './ai.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function askAssistant(req, res, next) {
  try {
    const { message, prompt, locale } = req.body;
    const queryText = prompt || message;

    if (!queryText || !queryText.trim()) {
      return errorResponse(res, 'Prompt or message is required', 'VALIDATION_ERROR', 400);
    }

    const result = await aiService.processAiDiscovery({
      prompt: queryText,
      locale: locale || 'ar',
      userId: req.user?.id || null
    });

    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}
