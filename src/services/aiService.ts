const API_BASE_URL = 'http://127.0.0.1:8000';

export interface ChatbotRequest {
  message: string;
  mode: 'hybrid' | 'simple' | 'advanced';
}

export interface ChatbotResponse {
  response: string;
  mode: string;
  timestamp?: string;
}

export interface Context {
  id: string;
  name: string;
  description: string;
  initial_ai_message: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  contexts: Context[];
}

export interface Variant {
  id: string;
  name: string;
  flag_icon: string;
  system_instruction_add_on: string;
}

export interface CreateSessionRequest {
  user_id: number;
  variant_id: string;
  scenario_id: string;
  context_id: string;
}

export interface CreateSessionResponse {
  status: string;
  session_id: string;
}

export interface MessageRequest {
  session_id: string;
  message: string;
}

export interface MessageAnalysis {
  has_error: boolean;
  topic: string | null;
  corrected: string | null;
  explanation: string | null;
}

export interface MessageResponse {
  response: string;
  analysis: MessageAnalysis;
  alternatives: string[];
  translation: string;
}

export interface ScoreWritingRequest {
  title: string;
  description: string;
  content: string;
}

export interface ScoreWritingResponse {
  grammarScore: number;
  grammarFeedback: string;
  vocabularyScore: number;
  vocabularyFeedback: string;
  coherenceScore: number;
  coherenceFeedback: string;
  contentScore: number;
  contentFeedback: string;
  overallScore: number;
  improvements: string[];
}

export interface TranslateWordRequest {
  word: string;
}

export interface TranslateWordResponse {
  translated_word: string;
}

export const chatbotService = {
  async sendMessage(
    message: string,
    mode: 'hybrid' | 'simple' | 'advanced' = 'hybrid'
  ): Promise<ChatbotResponse> {
    try {

        console.log(message, mode);
      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },

  async getVariants(): Promise<Variant[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/variants`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Variant[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting variants:', error);
      throw error;
    }
  },
  
  async getVariantScenarios(): Promise<Scenario[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/variants/scenarios`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Scenario[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting variant scenarios:', error);
      throw error;
    }
  },

  async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/session/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateSessionResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  async sendConversationMessage(request: MessageRequest): Promise<MessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/message`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MessageResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending conversation message:', error);
      throw error;
    }
  },

  async scoreWriting(request: ScoreWritingRequest): Promise<ScoreWritingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/score-writing`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ScoreWritingResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error scoring writing:', error);
      throw error;
    }
  },

  async translateWord(request: TranslateWordRequest): Promise<TranslateWordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/translate-word`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TranslateWordResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error translating word:', error);
      throw error;
    }
  }
};

export default chatbotService;
