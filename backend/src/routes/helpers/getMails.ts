import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

export const fetchOutlookMails = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header
  const filter = req.query.filter;
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  let endpoint = 'https://graph.microsoft.com/v1.0/me/messages';
  if (filter) {
    console.log(filter)
    endpoint += `?$filter=${filter}`;
  }
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const messages = response.data.value;

    const outlookEmailsGroupedBySender = messages.reduce((acc: Record<string, any[]>, email: any) => {
      const sender = email.sender.emailAddress.name || 'Unknown Sender';
      if (!acc[sender]) {
        acc[sender] = [];
      }
      acc[sender].push({
        id: email.id,
        subject: email.subject || 'No Subject',
        snippet: email.bodyPreview || 'No Preview',
        date: new Date(email.receivedDateTime).getTime(),
        source: 'Outlook',
      });
      return acc;
    }, {});

    return res.json(outlookEmailsGroupedBySender);
  } catch (error) {
    console.error('Error fetching Outlook emails:', error);
    return res.status(500).json({ error: 'Error fetching Outlook emails' });
  }
};




export const fetchGmailEmails = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  const filter = req.query.filter;
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }
  console.log("filter",filter);
  try {
    // First request to get a list of messages
    const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { maxResults: 20,q:filter!=''?filter:'' },
    });

    const messages = response.data.messages;

    if (messages && messages.length > 0) {
      // Fetch detailed information for each message
      const emailDetails = await Promise.all(
        messages.map((message: { id: string }) =>
          axios
            .get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((emailDetailResponse) => emailDetailResponse.data)
        )
      );

      // Group emails by author
      const gmailEmailsGroupedByAuthor = emailDetails.reduce((acc: Record<string, any[]>, email) => {
        const fromHeader = email.payload.headers.find(
          (header: { name: string }) => header.name === 'From'
        );
        const author = fromHeader ? fromHeader.value : 'Unknown Author';

        if (!acc[author]) {
          acc[author] = [];
        }

        acc[author].push({
          id: email.id,
          subject: email.payload.headers.find((header: { name: string }) => header.name === 'Subject')?.value || 'No Subject',
          snippet: email.snippet || 'No Preview',
          date: Number(email.internalDate),
          labelIds: email.labelIds, // Read/unread status
          source: 'Gmail',
        });

        return acc;
      }, {});

      return res.json(gmailEmailsGroupedByAuthor);
    } else {
      return res.status(404).json({ error: 'No emails found' });
    }
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
    return res.status(500).json({ error: 'Error fetching Gmail emails' });
  }
};

