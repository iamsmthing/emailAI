import Cookies from 'js-cookie';
import axios from 'axios';

const token_g = Cookies.get('access_token_g');
const token_ms = Cookies.get('access_token_ms');


const fetchOutlookMails = async (fromDateFilter?: string, toDateFilter?: string, fromFilter?: string, containsFilter?: string, maxmails?: number) => {
  const accessToken = token_ms;
  var filterString: string = ``;
  if (fromFilter) {
    filterString += `sender/emailAddress/address eq '${fromFilter}' or `;
  }
  
  if (fromDateFilter) {
    filterString += `receivedDateTime ge ${fromDateFilter} or `;
  }
  if (toDateFilter) {
    filterString += `receivedDateTime le ${toDateFilter} or `;
  }
  filterString = `$filter=${filterString.replace(/ or $/, '')}`; // remove trailing ' or '
  if (containsFilter) {
    filterString = `$search="${containsFilter}"`;
  }
  try {
    let o_url = 'http://localhost:4000/auth/fetchOutlookMails';
    if (filterString != '') {
      o_url += `?filter=${filterString}`;
    }
    if(maxmails){
      o_url += `&maxmails=${maxmails}`
    }
    //console.log('filter string Outlook',o_url)
    const response = await axios.post((o_url), {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Outlook emails grouped by sender:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Outlook emails:', error);
  }
};


const fetchGmailEmails = async (fromDateFilter?: string, toDateFilter?: string, fromFilter?: string, containsFilter?: string, maxmails?: number) => {
  const accessToken = token_g; // Replace with your actual access token
  let query = '';

  if (fromFilter) {
    query += `from:${fromFilter} `;
  }

  if (containsFilter) {
    // query += `subject:${containsFilter} `;
    query += `${containsFilter} `;
  }

  if (fromDateFilter) {
    query += `after:${fromDateFilter} `;
  }
  if (fromDateFilter && fromDateFilter === toDateFilter) {
    const date = new Date(toDateFilter ?? "");
    date.setDate(date.getDate() + 1);
    query += `before:${date.toLocaleDateString().split('T')[0].split('-').join('/')} `
  } else if (toDateFilter) {
    query += `before:${toDateFilter} `;
  }

  // Trim any extra whitespace from the query
  query = query.trim();
  let g_url = 'http://localhost:4000/auth/fetchGmailEmails';
  if (query != '') {
    g_url += `?filter=${query}`
  }
  if(maxmails){
    g_url += `&maxmails=${maxmails}`
  }
  try {
    const response = await axios.post((g_url), {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Send accessToken in the header
        'Content-Type': 'application/json',
      },
    });

    console.log('Gmail emails grouped by author:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
  }
};




export const fetchEmails = async ({
  fromDateFilter,
  toDateFilter,
  fromFilter,
  containsFilter,
  maxmails
}: {
  fromDateFilter?: string;
  toDateFilter?: string;
  fromFilter?: string;
  containsFilter?: string;
  maxmails?: number
}) => {
  const token = Cookies.get('access_token_g');
  const token_ms = Cookies.get('access_token_ms');

  let gmailEmails = {};
  let outlookEmails = {};

  try {
    if (token) {
      gmailEmails = await fetchGmailEmails(fromDateFilter, toDateFilter, fromFilter, containsFilter,maxmails);
    }
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
  }

  try {
    if (token_ms) {
      outlookEmails = await fetchOutlookMails(fromDateFilter, toDateFilter, fromFilter, containsFilter,maxmails);
    }
  } catch (error) {
    console.error('Error fetching Outlook emails:', error);
  }

  // Combine both Gmail and Outlook emails grouped by author/sender
  return { ...gmailEmails, ...outlookEmails };
};