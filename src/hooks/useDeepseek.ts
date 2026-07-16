import { useState, useCallback, useEffect } from 'react';
import { aiClient, Message, AIModel } from '../utils/deepseek';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function useDeepseek() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是您的英歌文化导游。请问您想了解关于英歌舞的哪些内容呢？比如历史起源、动作技巧、脸谱装备或者传承故事。',
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('doubao-seed-2-1-pro-260628');
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const chatModels = await aiClient.getModels('chat');
        setModels(chatModels);
        const recommendedModel = chatModels.find(m => m.recommended);
        if (recommendedModel) {
          setSelectedModel(recommendedModel.id);
        }
      } catch (err) {
        console.error('加载模型列表失败:', err);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const history: Message[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      history.push({ role: 'user', content: content.trim() });

      let response = await aiClient.chat(history, selectedModel);

      if (response === '豆包模型未激活，请切换到其他模型') {
        const fallbackModel = 'deepseek-chat';
        response = await aiClient.chat(history, fallbackModel);
        setSelectedModel(fallbackModel);
        response = `已自动切换到 DeepSeek 模型：\n\n${response}`;
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('抱歉，网络连接出现问题，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedModel]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '您好！我是您的英歌文化导游。请问您想了解关于英歌舞的哪些内容呢？',
        timestamp: Date.now(),
      },
    ]);
    setError(null);
  }, []);

  const getCurrentModelInfo = () => {
    return models.find(m => m.id === selectedModel);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    models,
    selectedModel,
    setSelectedModel,
    loadingModels,
    getCurrentModelInfo,
  };
}
