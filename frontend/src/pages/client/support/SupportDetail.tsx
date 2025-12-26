import { useState } from 'react';
import {
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Send,
  PlusCircle,
  Paperclip,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'pdf';
    name: string;
  };
}

const mockMessages: Message[] = [
  {
    id: 'sys1',
    sender: 'system',
    content: 'Complaint #CLM-2023-892 created on Oct 24, 2023',
    timestamp: '',
  },
  {
    id: '1',
    sender: 'user',
    content:
      'Hi, I noticed the discrepancy in the contract regarding the unit size. It says 85 sqm but we agreed on 92 sqm. Can you please check?',
    timestamp: '10:23 AM',
  },
  {
    id: '2',
    sender: 'agent',
    content:
      "Hello! I'm Sarah, and I'll be handling your case. I apologize for the confusion. Let me pull up the original sales documents and compare them with the draft contract sent to you.",
    timestamp: '10:45 AM',
  },
  {
    id: '3',
    sender: 'agent',
    content:
      'Could you please upload the screenshot of the brochure page you are referring to? It would help expedite the verification process.',
    timestamp: '10:46 AM',
  },
  {
    id: '4',
    sender: 'user',
    content: "Sure, I've just uploaded it. As you can see on page 4, unit 1204 is listed as 92 sqm.",
    timestamp: '11:02 AM',
    attachment: {
      type: 'image',
      name: 'brochure_page_4.jpg',
    },
  },
];

interface ComplaintDetailProps {
  onBack: () => void;
}

export const SupportDetail = ({ onBack }: ComplaintDetailProps) => {
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>(mockMessages);

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <main className="flex-1 px-4 md:px-10 py-6 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-wrap gap-2 pb-4">
        <button
          className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal hover:text-[#137fec] hover:underline"
          onClick={onBack}
        >
          Home
        </button>
        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
        <button
          className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal hover:text-[#137fec] hover:underline"
          onClick={onBack}
        >
          Complaints
        </button>
        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
        <span className="text-sm font-medium leading-normal">Complaint #CLM-2023-892</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Complaint #CLM-2023-892
          </h1>
          <div className="flex items-center gap-3">
            <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
              Processing
            </Badge>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">
              Last updated: 2 hours ago
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 shadow-sm">
            Escalate Issue
          </Button>
          <Button className="bg-[#137fec] hover:bg-blue-600 h-10 shadow-sm">
            Mark as Resolved
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
          <Card className="border border-gray-200 dark:border-[#2a3b4d]">
            <CardContent className="p-4 flex flex-col gap-4">
              <div
                className="w-full h-40 bg-center bg-no-repeat bg-cover rounded-lg"
                style={{
                  backgroundImage:
                    'url("https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=600")',
                }}
              ></div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold leading-tight">Sunshine City Apartment</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-normal">
                  Block B, Unit 1204 - 2 Bedrooms
                </p>
                <a className="text-[#137fec] text-sm font-bold mt-2 hover:underline" href="#">
                  View Property Listing
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-[#2a3b4d]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Complaint Details</h3>
              <div className="grid grid-cols-[35%_1fr] gap-y-4 text-sm">
                <div className="text-gray-600 dark:text-gray-400">Issue Type</div>
                <div className="font-medium">Contract Discrepancy</div>
                <div className="text-gray-600 dark:text-gray-400">Submitted</div>
                <div className="font-medium">Oct 24, 2023</div>
                <div className="text-gray-600 dark:text-gray-400">Priority</div>
                <div className="text-red-600 font-bold">High</div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#2a3b4d]">
                <h4 className="font-bold mb-2 text-sm">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  The square footage listed in the final contract (85 sqm) does not match the
                  initial brochure and the verbal agreement (92 sqm). I have attached the original
                  brochure and the contract draft for reference. I request a clarification or
                  adjustment to the pricing.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#2a3b4d]">
                <h4 className="font-bold mb-3 text-sm">Attachments (3)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="group relative aspect-square bg-gray-100 dark:bg-[#2a3642] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3a4a58] transition-colors">
                    <FileText className="h-8 w-8 text-gray-500" />
                    <div className="absolute bottom-1 left-1 right-1 text-[10px] truncate text-center text-gray-600">
                      contract_v1.pdf
                    </div>
                  </div>
                  <div
                    className="group relative aspect-square rounded-lg bg-cover bg-center cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundImage:
                        'url("https://images.pexels.com/photos/7641828/pexels-photo-7641828.jpeg?w=200")',
                    }}
                  ></div>
                  <div className="group relative aspect-square bg-gray-100 dark:bg-[#2a3642] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3a4a58] transition-colors">
                    <ImageIcon className="h-8 w-8 text-gray-500" />
                    <div className="absolute bottom-1 left-1 right-1 text-[10px] truncate text-center text-gray-600">
                      email_proof.png
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a3b4d] flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#2a3b4d]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="size-10 rounded-full bg-cover bg-center border border-gray-200"
                  style={{
                    backgroundImage:
                      'url("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=200&h=200&fit=crop")',
                  }}
                ></div>
                <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-[#1a2632] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm">Sarah Jenkins</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs">Support Agent • Online</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-white">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#f8f9fa] dark:bg-[#152028]">
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="bg-gray-200 dark:bg-[#2a3642] text-gray-600 dark:text-gray-400 text-xs py-1 px-3 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex flex-col items-end gap-1 self-end max-w-[80%]">
                    {msg.attachment && (
                      <div className="bg-[#137fec] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm mb-1">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-medium truncate">{msg.attachment.name}</span>
                            <span className="text-xs opacity-80">2.4 MB</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#137fec] text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed">
                      <p>{msg.content}</p>
                    </div>
                    <span className="text-gray-600 text-[10px]">{msg.timestamp}</span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col items-start gap-1 self-start max-w-[80%]">
                  <div className="flex items-end gap-2">
                    {msg.id === '2' ? (
                      <div
                        className="size-8 rounded-full bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage:
                            'url("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=200&h=200&fit=crop")',
                        }}
                      ></div>
                    ) : (
                      <div className="size-8 opacity-0 flex-shrink-0"></div>
                    )}
                    <div className="bg-white dark:bg-[#2a3642] p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 dark:border-[#3a4a58] text-sm leading-relaxed">
                      <p>{msg.content}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-[10px] pl-10">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-white dark:bg-[#1a2632] border-t border-gray-200 dark:border-[#2a3b4d]">
            <div className="flex items-end gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a3642] rounded-full transition-colors">
                <PlusCircle className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a3642] rounded-full transition-colors hidden sm:block">
                <Paperclip className="h-6 w-6" />
              </button>
              <div className="flex-1 bg-gray-100 dark:bg-[#152028] rounded-xl flex items-center min-h-[48px] px-4 py-2 border border-transparent focus-within:border-[#137fec]/50 focus-within:bg-white dark:focus-within:bg-[#0f161b] transition-all">
                <Textarea
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm placeholder-gray-500 resize-none"
                  placeholder="Type a message to support..."
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
              <button
                className="h-12 w-12 flex items-center justify-center bg-[#137fec] text-white rounded-xl shadow-md hover:bg-blue-600 transition-colors"
                onClick={handleSend}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-500">Typically replies within 1 hour</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
