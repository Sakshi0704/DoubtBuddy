import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Dialog, Slide, Paper, Typography, TextField, CircularProgress, Fab, Avatar, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InterChat = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, isTyping, open]);

  const simulateTyping = (text) => {
    return new Promise((resolve) => {
      setIsTyping(true);
      const delay = Math.min(text.length * 30, 2000);
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, delay);
    });
  };

  const callAPI = async (messages) => {
    const response = await fetch('https://interchat-app-be.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(msg => ({ role: msg.role, content: msg.content }))
      })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.reply;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now(),
      content: input.trim(),
      role: "human",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const typing = simulateTyping(userMessage.content);
      const reply = callAPI(newMessages);
      const [, aiResponse] = await Promise.all([typing, reply]);
      setMessages([...newMessages, {
        id: Date.now() + 1,
        content: aiResponse,
        role: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages([...newMessages, {
        id: Date.now() + 1,
        content: "Sorry, something went wrong. Please try again.",
        role: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300, boxShadow: theme.shadows[6] }}
      >
        <ChatIcon fontSize="large" />
      </Fab>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 4, minHeight: 520, background: theme.palette.background.paper, color: theme.palette.text.primary, boxShadow: theme.shadows[8] }
        }}
      >
        <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.primary.main, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <Typography variant="h6" fontWeight={700} color="white" sx={{ letterSpacing: 1 }}>
              <SmartToyIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> DoubtBuddy AI
            </Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </IconButton>
          </Box>
          <Box sx={{ px: 2, py: 2, height: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: theme.palette.background.default }}>
            {messages.map(msg => (
              <Box key={msg.id} sx={{ display: 'flex', flexDirection: msg.role === 'human' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1 }}>
                <Avatar sx={{ bgcolor: msg.role === 'human' ? theme.palette.primary.main : theme.palette.secondary.main, width: 36, height: 36, boxShadow: theme.shadows[2] }}>
                  {msg.role === 'human' ? <PersonIcon /> : <SmartToyIcon />}
                </Avatar>
                <Box sx={{
                  bgcolor: msg.role === 'human' ? theme.palette.primary.main : theme.palette.background.paper,
                  color: msg.role === 'human' ? 'white' : theme.palette.text.primary,
                  px: 2, py: 1.5, borderRadius: 3, boxShadow: theme.shadows[1], maxWidth: '70%',
                  borderTopRightRadius: msg.role === 'human' ? 0 : 12,
                  borderTopLeftRadius: msg.role === 'human' ? 12 : 0,
                  border: msg.role === 'human' ? `1.5px solid ${theme.palette.primary.light}` : `1.5px solid ${theme.palette.divider}`,
                  transition: 'background 0.3s, color 0.3s',
                }}>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word', fontWeight: 500 }}>{msg.content}</Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.grey[500], display: 'block', textAlign: msg.role === 'human' ? 'right' : 'left', mt: 0.5 }}>{msg.timestamp}</Typography>
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 36, height: 36 }}><SmartToyIcon /></Avatar>
                <Box sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, px: 2, py: 1.5, borderRadius: 3, boxShadow: theme.shadows[1], maxWidth: '70%' }}>
                  <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                  <Typography variant="body2" component="span">Typing...</Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ px: 2, py: 2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper, display: 'flex', alignItems: 'flex-end', gap: 1, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
            <TextField
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              multiline
              minRows={1}
              maxRows={4}
              fullWidth
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: { bgcolor: theme.palette.background.default, borderRadius: 2, color: theme.palette.text.primary, fontWeight: 500 }
              }}
              disabled={isLoading}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              sx={{ bgcolor: theme.palette.primary.main, color: 'white', ml: 1, '&:hover': { bgcolor: theme.palette.primary.dark } }}
              size="large"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Dialog>
    </>
  );
};

export default InterChat;
