import axios from 'axios';

const API_URL = '/api/ai/chat';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  advantages: string[];
  recommended: boolean;
}

interface ChatRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices?: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    code: string;
    message: string;
    param: string;
    type: string;
  };
}

const SYSTEM_PROMPT = `你是一个英歌舞文化的专业导游，精通广东普宁英歌的历史、文化、动作、脸谱、装备等知识。

请用生动、专业的语言回答用户关于英歌舞的问题。
当用户询问特定内容时，请详细介绍相关背景和文化内涵。
回答要通俗易懂，适合普通游客理解。
可以适当介绍一些有趣的故事和传说。

英歌舞相关知识：
1. 英歌舞是广东潮汕地区流传甚广的一种民间舞蹈，属汉族广场情绪舞蹈，是由男子表演的集体舞，舞者双手各持一根短木棒，上下左右互相对击，动作健壮有力，节奏强烈。
2. 英歌舞起源于明代，已有400多年的历史，被誉为"中国汉族男子汉的舞蹈"。
3. 普宁英歌是英歌舞的杰出代表，2006年被列入第一批国家级非物质文化遗产名录。
4. 英歌舞的脸谱造型独特，色彩鲜艳，每个角色都有固定的脸谱样式，代表不同的历史人物和性格特征。
5. 英歌舞的动作包括洗马、抛槌、交叉槌、对打、飞天、盘龙等，每个动作都有独特的含义。
6. 英歌舞的伴奏乐器包括大鼓、铜锣、螺号等，鼓声雄浑有力，是表演的灵魂。
7. 新坛英歌队是普宁英歌的代表性队伍之一，成立于1953年，多次参加国内外重大文化活动。`;

export const aiClient = {
  async chat(messages: Message[], model: string = 'doubao-pro-4k'): Promise<string> {
    try {
      const requestBody: ChatRequest = {
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
      };

      const response = await axios.post<ChatResponse>(
        API_URL,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      if (response.data.error) {
        const errorCode = response.data.error.code;
        if (errorCode === 'ModelNotOpen' || errorCode === 'InvalidEndpointOrModel.NotFound') {
          return '豆包模型未激活，请切换到其他模型';
        }
        console.error('AI API error:', response.data.error.message);
        return '抱歉，AI服务暂时不可用，请稍后再试。';
      }

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }

      return '抱歉，我暂时无法回答这个问题。';
    } catch (error) {
      console.error('AI API error:', error);
      return '抱歉，网络连接出现问题，请稍后再试。';
    }
  },

  async getModels(type: 'chat' | 'image'): Promise<AIModel[]> {
    try {
      const response = await axios.get(`/api/ai/models?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return [];
    }
  },
};
