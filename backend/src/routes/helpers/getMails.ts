import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

export const fetchOutlookMails = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header
  const filter = req.query.filter;
  const fetchAll = req.query.fetchAll === 'true'; // Expect a 'true' or 'false' string
  const maxMails = parseInt(req.query.maxMails as string) || 100; // Default to 100 if not provided
  console.log(req.query);
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  let endpoint = 'https://graph.microsoft.com/v1.0/me/messages';
  if (filter) {
    endpoint += `?${filter}`;
  }

  let allEmails: any[] = [];
  let nextLink: string | null = endpoint;

  try {
    while (nextLink && (fetchAll || (!fetchAll && allEmails.length < maxMails))) {
      const response: any = await axios.get(nextLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const messages = response.data.value;
      allEmails.push(...messages);

      nextLink = response.data['@odata.nextLink'] || null; // Check if there's a next page

      // If fetchAll is false and we have reached maxMails, stop fetching
      if (allEmails.length >= maxMails) {
        allEmails = allEmails.slice(0, maxMails); // Limit to maxMails
        break;
      }
      
    
    }


    const outlookEmailsGroupedBySender = allEmails.reduce(
      (acc: Record<string, any[]>, email: any) => {
        const sender = email.sender?.emailAddress?.name || 'Unknown Sender';
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
      },
      {}
    );

    return res.json(outlookEmailsGroupedBySender);
  } catch (error) {
    console.error('Error fetching Outlook emails:', error);
    return res.status(500).json({ error: 'Error fetching Outlook emails' });
  }
};





export const fetchGmailEmails = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  const filter = req.query.filter || '';
  const maxmails = parseInt(req.query.maxmails?.toString() ?? "", 10) || 20; // maxmails default to 3000 if not provided
  const fetchAllinFiltered = req.query.fetchAll === 'true';
  let fetchedEmailsCount = 0;
  let nextPageToken: string | null = null; // Initialize as null
  const allMessages: any[] = [];

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  console.log(req.query);

  try {
    // Function to fetch messages in batches
    const fetchMessages = async (maxResults: number) => {
      const params: Record<string, any> = { q: filter, maxResults };
      if (nextPageToken) params.pageToken = nextPageToken;

      const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });

      nextPageToken = response.data.nextPageToken || null; // Set to null if there's no next page
      return response.data.messages || [];
    };

    // Calculate how many emails should be fetched per request (<=20 but not more than remaining)
    const getFetchSize = () => Math.min(100, maxmails - fetchedEmailsCount);

    // Fetch email details with limited concurrency (to avoid hitting rate limits)
    const fetchEmailDetailsWithLimit = async (messages: { id: string }[], limit: number) => {
      const results: any[] = [];
      let index = 0;

      while (index < messages.length) {
        // Create a batch of limited concurrent requests
        const batch = messages.slice(index, index + limit).map(message =>
          axios
            .get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then(emailDetailResponse => emailDetailResponse.data)
        );

        // Wait for this batch to complete
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);

        // Move to the next batch
        index += limit;

        // Introduce a small delay to prevent rate-limiting
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      return results;
    };

    // Continue fetching emails until all are fetched or maxmails is reached
    while (fetchAllinFiltered && fetchedEmailsCount < maxmails) {
      const fetchSize = getFetchSize();
      console.log(`Fetching ${fetchSize} emails...`);

      const messages = await fetchMessages(fetchSize);
      allMessages.push(...messages);
      fetchedEmailsCount += messages.length;

      // Break if there are no more emails to fetch or maxmails is reached
      if (!nextPageToken || messages.length === 0) break;

      // Wait for 100 milliseconds before making the next API call (to avoid API rate limits)
      //await new Promise(resolve => setTimeout(resolve, 100));
    }

    // If not fetching all, just fetch one batch (up to maxmails)
    if (!fetchAllinFiltered) {
      const fetchSize = getFetchSize();
      const messages = await fetchMessages(fetchSize);
      allMessages.push(...messages);
    }

    if (allMessages.length > 0) {
      // Fetch detailed information for each message with limited concurrency
      const emailDetails = await fetchEmailDetailsWithLimit(allMessages, 20);

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
          headers:email.payload.headers,
          parts:email.payload.parts
        });

        return acc;
      }, {});

      return res.json(gmailEmailsGroupedByAuthor);
    } else if (allMessages.length > 0) { res.json(allMessages) } else {
      return res.status(404).json({ error: 'No emails found' });
    }
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
    return res.status(500).json({ error: 'Error fetching Gmail emails' });
  }
};




