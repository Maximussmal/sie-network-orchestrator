import { Mail, MessageSquare, Users, Lightbulb, Send } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

export const FeedbackHub = () => {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 dark:from-yellow-950 dark:via-orange-950 dark:to-yellow-900">
      {/* Header with Sun/Lightbulb Theme */}
      <div className="relative bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-200 dark:from-yellow-800 dark:via-orange-800 dark:to-yellow-800 border-b border-yellow-300/50 dark:border-yellow-700/50 px-6 py-12 overflow-hidden">
        {/* Sun rays background */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)"
        }} />
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-4">
            <Lightbulb className="w-10 h-10 text-orange-600 dark:text-yellow-400" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-orange-800 dark:text-yellow-100 mb-2">Connect With Us</h1>
          <p className="text-orange-700 dark:text-yellow-200">We'd love to hear from you</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Share Feedback</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">Help us improve your experience</p>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Contact Support</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">Get help when you need it</p>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Collaborate</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">Partner with our team</p>
            </div>
          </Card>
        </div>

        {/* Feedback Form */}
        <Card className="p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur border-yellow-200 dark:border-yellow-800">
          <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-6">Send us a message</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">Name</label>
                <Input 
                  placeholder="Your name" 
                  className="bg-white dark:bg-slate-900 border-yellow-300 dark:border-yellow-700 focus:border-orange-500 dark:focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">Email</label>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-white dark:bg-slate-900 border-yellow-300 dark:border-yellow-700 focus:border-orange-500 dark:focus:border-orange-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">Subject</label>
              <Input 
                placeholder="What's this about?" 
                className="bg-white dark:bg-slate-900 border-yellow-300 dark:border-yellow-700 focus:border-orange-500 dark:focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">Message</label>
              <Textarea 
                placeholder="Tell us more..." 
                rows={6}
                className="bg-white dark:bg-slate-900 border-yellow-300 dark:border-yellow-700 focus:border-orange-500 dark:focus:border-orange-400 resize-none"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </Card>

        {/* Footer - Socials, Impressum, Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-yellow-300/50 dark:border-yellow-700/50">
          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Blog */}
          <div>
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Video Tutorials
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Impressum */}
          <div>
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Impressum
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors flex items-center gap-2">
                  <span>→</span> Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};