import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-yingge-dark text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 shadow-md">
                <span className="text-yingge-red font-serif font-bold text-xl">焕</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">云焕非遗</h3>
                <p className="text-xs text-yingge-gold">英歌文化数字展示平台</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70 max-w-md">
              华南师范大学云焕非遗队致力于通过数字化技术传承和弘扬中华优秀传统文化，让更多人了解和喜爱英歌艺术。
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-white mb-4 pb-2 border-b border-white/10">
              快速链接
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-white/70 hover:text-yingge-gold transition-colors">
                  认识英歌
                </a>
              </li>
              <li>
                <a href="/xintan" className="text-sm text-white/70 hover:text-yingge-gold transition-colors">
                  新坛英歌
                </a>
              </li>
              <li>
                <a href="/actions" className="text-sm text-white/70 hover:text-yingge-gold transition-colors">
                  动作图谱
                </a>
              </li>
              <li>
                <a href="/equipment" className="text-sm text-white/70 hover:text-yingge-gold transition-colors">
                  脸谱装备
                </a>
              </li>
              <li>
                <a href="/stories" className="text-sm text-white/70 hover:text-yingge-gold transition-colors">
                  人物故事
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-white mb-4 pb-2 border-b border-white/10">
              联系我们
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-white/70">
                <MapPin size={16} className="mr-2 mt-0.5 text-yingge-gold flex-shrink-0" />
                <span>广东省广州市天河区中山大道西55号</span>
              </li>
              <li className="flex items-center text-sm text-white/70">
                <Phone size={16} className="mr-2 text-yingge-gold flex-shrink-0" />
                <span>020-8521XXXX</span>
              </li>
              <li className="flex items-center text-sm text-white/70">
                <Mail size={16} className="mr-2 text-yingge-gold flex-shrink-0" />
                <span>yunhuan@scnu.edu.cn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-white/50 space-y-2 md:space-y-0">
            <p>
              Copyright © 2024 云焕非遗队 华南师范大学计算机学院 版权所有
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-yingge-gold transition-colors">网站地图</a>
              <span>|</span>
              <a href="#" className="hover:text-yingge-gold transition-colors">隐私声明</a>
              <span>|</span>
              <a href="#" className="hover:text-yingge-gold transition-colors">联系我们</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
