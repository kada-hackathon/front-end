import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';

// User colors for collaboration cursors
const CURSOR_COLORS = [
  '#958DF1', // Purple
  '#F98181', // Red
  '#FBBC88', // Orange
  '#FAF594', // Yellow
  '#70CFF8', // Blue
  '#94FADB', // Teal
  '#B9F18D', // Green
];

// Generate a random color for the user
export const getRandomColor = () => {
  return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
};

// Create and configure the Hocuspocus provider
export const createCollaborationProvider = ({
  documentId,
  user,
  websocketUrl = 'wss://test-dev-lw9pz.ondigitalocean.app',
  token = null,
}) => {
  // Create a new Y.js document
  const ydoc = new Y.Doc();

  // Create the Hocuspocus provider
  const provider = new HocuspocusProvider({
    url: websocketUrl,
    name: documentId,
    document: ydoc,
    token: token || localStorage.getItem('token'), // Use provided token or get from localStorage
    
    // Configure awareness for cursor tracking
    onAwarenessUpdate: ({ states }) => {
      // You can add custom logic here to handle awareness updates
      console.log('Awareness updated:', states);
    },
    
    // Connection lifecycle hooks
    onConnect: () => {
      console.log('Connected to collaboration server');
    },
    
    onDisconnect: () => {
      console.log('Disconnected from collaboration server');
    },
    
    onStatus: ({ status }) => {
      console.log('Connection status:', status);
    },
    
    onSynced: () => {
      console.log('Document synced');
    },
  });

  // Set user information in awareness
  if (user) {
    provider.setAwarenessField('user', {
      name: user.name || user.username || 'Anonymous',
      color: user.color || getRandomColor(),
    });
  }

  return { provider, ydoc };
};

// Cleanup provider
export const destroyCollaborationProvider = (provider) => {
  if (provider) {
    provider.destroy();
  }
};

// Get active collaborators
export const getActiveCollaborators = (provider) => {
  if (!provider || !provider.awareness) {
    return [];
  }

  const states = provider.awareness.getStates();
  const collaborators = [];

  states.forEach((state, clientId) => {
    if (state.user && clientId !== provider.awareness.clientID) {
      collaborators.push({
        clientId,
        ...state.user,
      });
    }
  });

  return collaborators;
};
