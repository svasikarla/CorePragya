import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';
import { processURL } from './urlProcessor'; // Your existing URL processing function

// Initialize OAuth2 client
const setupOAuth2Client = (): OAuth2Client => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return oAuth2Client;
};

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Interface for extracted email data
interface EmailData {
  messageId: string;
  from: string;
  userEmail: string;
  subject: string;
  url: string;
  timestamp: Date;
}

// Interface for processed URL data
interface ProcessedURLData {
  url: string;
  summary: string;
  category: string;
  userEmail: string;
  processedAt: Date;
}

// Extract URL from email body
const extractURLFromBody = (body: string): string | null => {
  // Simple URL extraction - you might need a more robust method depending on email format
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = body.match(urlRegex);
  return matches ? matches[0] : null;
};

// Process a single email message
const processEmailMessage = async (message: any): Promise<EmailData | null> => {
  const gmail = google.gmail({ version: 'v1', auth: setupOAuth2Client() });
  
  try {
    // Get full message details
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });
    
    const headers = res.data.payload?.headers;
    if (!headers) return null;
    
    // Extract header information
    const from = headers.find(h => h.name === 'From')?.value || '';
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';
    
    // Extract user email from the "From" field
    const userEmailMatch = from.match(/<([^>]+)>/) || from.match(/([^\s]+@[^\s]+)/);
    const userEmail = userEmailMatch ? userEmailMatch[1] : '';
    
    // Get message body
    let body = '';
    if (res.data.payload?.parts) {
      // Multi-part message
      for (const part of res.data.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString();
          break;
        }
      }
    } else if (res.data.payload?.body?.data) {
      // Simple message
      body = Buffer.from(res.data.payload.body.data, 'base64').toString();
    }
    
    // Extract URL from body
    const url = extractURLFromBody(body);
    if (!url) return null;
    
    return {
      messageId: message.id,
      from,
      userEmail,
      subject,
      url,
      timestamp: new Date(date),
    };
  } catch (error) {
    console.error('Error processing email:', error);
    return null;
  }
};

// Fetch recent unread emails and process any URLs found
export const fetchAndProcessEmails = async (): Promise<{ success: boolean; processed: number; errors: number; }> => {
  const gmail = google.gmail({ version: 'v1', auth: setupOAuth2Client() });
  let processed = 0;
  let errors = 0;
  
  try {
    // Get recent unread emails
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 50,
    });
    
    const messages = res.data.messages || [];
    
    for (const message of messages) {
      // Process each email
      const emailData = await processEmailMessage(message);
      
      if (emailData) {
        try {
          // Check if user is registered
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', emailData.userEmail)
            .single();
          
          if (userError || !userData) {
            console.error('User not registered:', emailData.userEmail);
            continue;
          }
          
          // Process the URL
          const processedData = await processURL(emailData.url);
          
          // Store in knowledge base
          const { error: insertError } = await supabase
            .from('knowledgebase')
            .insert({
              url: emailData.url,
              summary: processedData.summary,
              category: processedData.category,
              user_id: userData.id,
              processed_at: new Date().toISOString(),
            });
          
          if (insertError) {
            console.error('Error inserting into knowledgebase:', insertError);
            errors++;
          } else {
            processed++;
            
            // Mark the email as read
            await gmail.users.messages.modify({
              userId: 'me',
              id: emailData.messageId,
              requestBody: {
                removeLabelIds: ['UNREAD'],
              },
            });
          }
        } catch (error) {
          console.error('Error processing URL or storing data:', error);
          errors++;
        }
      }
    }
    
    return { success: true, processed, errors };
  } catch (error) {
    console.error('Error fetching emails:', error);
    return { success: false, processed, errors: errors + 1 };
  }
};