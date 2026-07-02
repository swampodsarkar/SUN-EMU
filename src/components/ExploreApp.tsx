import React from 'react';
import { useStore } from '../lib/store';
import { Menu, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function ExploreApp() {
  const store = useStore();
  const sortedNews = [...store.news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="h-full w-full bg-[#0a0a0a] text-white p-12 overflow-y-auto">
      <div className="flex items-center gap-4 mb-2">
        <Menu className="w-12 h-12 text-violet-400" />
        <h1 className="text-5xl font-bold">Explore</h1>
      </div>
      <p className="text-xl text-white/50 mb-12">Latest News & Updates</p>
      
      <div className="space-y-6 max-w-4xl mx-auto">
        {sortedNews.length === 0 ? (
          <div className="text-center text-white/30 py-20">
            <p className="text-2xl">No news available at the moment.</p>
          </div>
        ) : (
          sortedNews.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
            >
              <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-6 whitespace-pre-wrap">{item.content}</p>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
