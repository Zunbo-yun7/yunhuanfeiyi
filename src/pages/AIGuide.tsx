import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDeepseek } from '../hooks/useDeepseek';
import { Send, Bot, RefreshCw, MessageCircle, Sparkles, GripVertical, Maximize2, Minimize2, X, ChevronDown, Info } from 'lucide-react';
// 引入 React Bits 视觉增强组件
import { Strands, ShinyText } from '@/components/reactbits';

export function AIGuide() {
  const { messages, isLoading, error, sendMessage, clearMessages, models, selectedModel, setSelectedModel, loadingModels, getCurrentModelInfo } = useDeepseek();
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFloating, setIsFloating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });

  const COMFORT_ZONE_TOP = 180;
  const COMFORT_ZONE_BOTTOM = 250;
  const SNAP_THRESHOLD = 60;
  const DETACH_THRESHOLD = 200;

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dialogRef.current) return;
    
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    
    const maxX = window.innerWidth - dialogRef.current.offsetWidth - 20;
    const maxY = window.innerHeight - dialogRef.current.offsetHeight - 20;
    
    setPosition({
      x: Math.max(10, Math.min(newX, maxX)),
      y: Math.max(10, Math.min(newY, maxY)),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const distance = Math.sqrt(
      Math.pow(position.x - startPosition.current.x, 2) +
      Math.pow(position.y - startPosition.current.y, 2)
    );

    if (distance > DETACH_THRESHOLD) {
      setIsFloating(true);
    } else if (!isFloating) {
      if (position.y >= COMFORT_ZONE_TOP && position.y <= COMFORT_ZONE_BOTTOM) {
        setPosition(prev => ({ ...prev, y: (COMFORT_ZONE_TOP + COMFORT_ZONE_BOTTOM) / 2 }));
      } else if (Math.abs(position.y - COMFORT_ZONE_TOP) < SNAP_THRESHOLD) {
        setPosition(prev => ({ ...prev, y: COMFORT_ZONE_TOP }));
      } else if (Math.abs(position.y - COMFORT_ZONE_BOTTOM) < SNAP_THRESHOLD) {
        setPosition(prev => ({ ...prev, y: COMFORT_ZONE_BOTTOM }));
      }
    }
  }, [isDragging, position, isFloating]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea, form')) return;
    
    setIsDragging(true);
    startPosition.current = { ...position };
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleResetPosition = () => {
    setIsFloating(false);
    setPosition({ x: 0, y: (COMFORT_ZONE_TOP + COMFORT_ZONE_BOTTOM) / 2 });
  };

  const sampleQuestions = [
    '英歌舞的起源是什么？',
    '普宁英歌有哪些特色？',
    '英歌舞有哪些经典动作？',
    '英歌脸谱有什么含义？',
  ];

  const dialogHeight = isExpanded ? 'h-[80vh]' : 'h-[65vh] md:h-[70vh]';
  const dialogWidth = isExpanded ? 'w-[95vw] md:w-[90vw] max-w-5xl' : 'w-full max-w-4xl';

  return (
    <div className="min-h-screen bg-yingge-gray">
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20Chinese%20traditional%20culture%20Yingge%20dance%20guide%20modern%20technology&image_size=landscape_16_9"
          alt="AI导游"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        {/* Strands 流动光带背景动画 - 仅限于顶部 hero 区域，不影响下方聊天内容 */}
        <Strands
          colors={['#B22222', '#C8A060', '#2C2C2C']}
          count={4}
          speed={0.4}
          amplitude={0.8}
          opacity={0.5}
        />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="w-16 h-16 bg-yingge-gold rounded-full flex items-center justify-center mb-4">
            <Bot size={32} className="text-yingge-red" />
          </div>
          <ShinyText
            text="AI导游"
            speed={4}
            className="font-serif text-3xl md:text-5xl mb-2"
          />
          <p className="text-yingge-gold">智能问答，探索英歌奥秘</p>
        </div>
      </section>

      <section className="py-8 px-4 relative">
        <div className="container mx-auto">
          <div
            ref={dialogRef}
            onMouseDown={handleMouseDown}
            className={`${dialogWidth} ${dialogHeight} bg-white rounded-2xl card-shadow overflow-hidden flex flex-col transition-all duration-300 ease-out cursor-grab active:cursor-grabbing ${
              isDragging ? 'shadow-2xl z-50 scale-[1.01]' : ''
            } ${
              isFloating ? 'fixed top-0 left-0 ml-0 mr-0' : 'mx-auto'
            }`}
            style={isFloating ? {
              left: position.x,
              top: position.y,
              transform: 'none',
            } : {}}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-yingge select-none">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yingge-gold rounded-full flex items-center justify-center mr-3">
                  <Sparkles size={20} className="text-yingge-red" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white">英歌文化导游</h3>
                  <p className="text-xs text-yingge-gold">在线解答您的疑问</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm text-white"
                  >
                    {loadingModels ? (
                      <span>加载中...</span>
                    ) : (
                      <>
                        <span>{getCurrentModelInfo()?.name || '选择模型'}</span>
                        <ChevronDown size={14} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {showModelDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-yingge-gold" />
                          <span className="text-sm font-medium text-gray-700">选择AI模型</span>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {models.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model.id);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-yingge-red/5 transition-colors ${
                              selectedModel === model.id ? 'bg-yingge-red/10' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  model.provider === '豆包' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {model.provider}
                                </span>
                                <span className="font-medium text-gray-800">{model.name}</span>
                                {model.recommended && (
                                  <span className="px-2 py-0.5 bg-yingge-gold/20 text-yingge-gold text-xs rounded">推荐</span>
                                )}
                              </div>
                              {selectedModel === model.id && (
                                <span className="w-5 h-5 bg-yingge-red rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{model.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {model.advantages.map((adv, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                  {adv}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowModelInfo(!showModelInfo)}
                    className="p-2 rounded-lg hover:bg-yingge-red/30 transition-colors"
                    title="模型信息"
                  >
                    <Info size={18} className="text-white" />
                  </button>
                  {showModelInfo && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-yingge-gold" />
                        <span className="font-medium text-gray-800">当前模型</span>
                      </div>
                      {getCurrentModelInfo() ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              getCurrentModelInfo()!.provider === '豆包' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {getCurrentModelInfo()!.provider}
                            </span>
                            <span className="font-bold text-gray-800">{getCurrentModelInfo()!.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{getCurrentModelInfo()!.description}</p>
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500">优势特点：</span>
                            {getCurrentModelInfo()!.advantages.map((adv, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 bg-yingge-gold rounded-full" />
                                {adv}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">加载中...</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleResetPosition}
                  disabled={!isFloating}
                  className="p-2 rounded-lg hover:bg-yingge-red/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title="重置位置"
                >
                  <X size={18} className="text-white" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-lg hover:bg-yingge-red/30 transition-colors"
                  title={isExpanded ? '缩小' : '全屏'}
                >
                  {isExpanded ? (
                    <Minimize2 size={18} className="text-white" />
                  ) : (
                    <Maximize2 size={18} className="text-white" />
                  )}
                </button>
                <button
                  onClick={clearMessages}
                  className="p-2 rounded-lg hover:bg-yingge-red/30 transition-colors"
                  title="重新开始"
                >
                  <RefreshCw size={18} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-6 py-2 bg-yingge-gray/30 text-xs text-yingge-dark/60">
              <GripVertical size={14} className="text-yingge-gold" />
              <span>{isFloating ? '自由浮动模式 - 可拖动到任意位置' : '拖动调整位置 - 松开自动吸附到舒服区域'}</span>
              {!isFloating && (
                <span className="ml-auto text-yingge-gold">大幅度滑动可脱离固定槽</span>
              )}
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 ai-chat-scroll">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-yingge-gold rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Bot size={20} className="text-yingge-red" />
                    </div>
                  )}
                  <div className={`message-bubble ${message.role}`}>
                    {message.role === 'assistant' ? (
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-yingge-red rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-10 h-10 bg-yingge-gold rounded-full flex items-center justify-center mr-3">
                    <Bot size={20} className="text-yingge-red" />
                  </div>
                  <div className="message-bubble ai">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-yingge-dark/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-yingge-dark/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-yingge-dark/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </div>

            <div className="p-4 border-t border-yingge-light">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isLoading ? 'AI 正在回复中，请稍候...' : '输入您的问题...'}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-yingge-gray rounded-full text-yingge-dark placeholder-yingge-dark/40 focus:outline-none focus:ring-2 focus:ring-yingge-red disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-12 h-12 bg-yingge-red rounded-full flex items-center justify-center hover:bg-yingge-red/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </form>

              <div className={`flex flex-wrap gap-2 mt-4 transition-opacity duration-300 ${isLoading ? 'opacity-40 pointer-events-none' : ''}`}>
                <span className="text-xs text-yingge-dark/50">试试问：</span>
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    disabled={isLoading}
                    onClick={() => {
                      if (isLoading) return;
                      setInputValue(question);
                      sendMessage(question);
                    }}
                    className="px-3 py-1 bg-yingge-gray text-yingge-dark text-xs rounded-full hover:bg-yingge-gold hover:text-yingge-red transition-colors disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif font-bold text-2xl text-yingge-dark mb-4">
              AI导游功能介绍
            </h2>
            <div className="w-16 h-1 bg-yingge-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '智能问答',
                description: '基于DeepSeek API，能够回答关于英歌文化的各种问题，包括历史、动作、脸谱、装备等方面。',
              },
              {
                title: '知识讲解',
                description: '详细介绍英歌舞的文化内涵和艺术特色，让您深入了解这项国家级非物质文化遗产。',
              },
              {
                title: '互动体验',
                description: '支持连续对话，可以围绕一个主题进行深入探讨，获得更全面的信息。',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-yingge-gray rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-yingge-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-yingge-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-yingge-dark/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
