import Cookies from 'js-cookie';
import axios from 'axios';

const token_g = Cookies.get('access_token_g');
const token_ms = Cookies.get('access_token_ms');

export const convertBase64ToString = (base64Data: string)=>{
  if (base64Data) {
    try {
      // Fix for URL-safe Base64 (replace `-` with `+` and `_` with `/`)
      base64Data = base64Data.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if necessary
      while (base64Data.length % 4 !== 0) {
        base64Data += '=';
      }

      // Decode the Base64 string using `atob`
      const decoded = atob(base64Data);
      return decoded;
    } catch (error) {
      console.error("Error decoding Base64 data:", error);
    }
  }
}

const fetchOutlookMails = async (fromDateFilter?: string, toDateFilter?: string, fromFilter?: string, containsFilter?: string, maxmails?: number,fetchAll?: boolean) => {
  const accessToken = token_ms;
  var filterString: string = ``;
  if (fromFilter) {
    filterString += `sender/emailAddress/address eq '${fromFilter}' or `;
  }
  
  if (fromDateFilter) {
    filterString += `receivedDateTime ge ${fromDateFilter} and `;
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
      if(maxmails){
        o_url += `&maxmails=${maxmails}`;
      }
    } else if(maxmails){
      o_url += `?maxmails=${maxmails}`;
    }
    
    if(maxmails || fetchAll){
      o_url += `&fetchAll=${fetchAll?"true":"false"}`
    } else if(fetchAll){
      o_url += `?fetchAll=${fetchAll?"true":"false"}`
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


const fetchGmailEmails = async (fromDateFilter?: string, toDateFilter?: string, fromFilter?: string,
   containsFilter?: string, maxmails?: number,fetchAll?: boolean) => {
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
    g_url += `?filter=${query}`;
    if(maxmails){
      g_url += `&maxmails=${maxmails}`;
    }
  } else if(maxmails){
    g_url += `?maxmails=${maxmails}`;
  }
  
  if(maxmails || fetchAll){
    g_url += `&fetchAll=${fetchAll?"true":"false"}`
  } else if(fetchAll){
    g_url += `?fetchAll=${fetchAll?"true":"false"}`
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
  maxmails,
  fetchAll
}: {
  fromDateFilter?: string;
  toDateFilter?: string;
  fromFilter?: string;
  containsFilter?: string;
  maxmails?: number;
  fetchAll?: boolean
}) => {
  const token = Cookies.get('access_token_g');
  const token_ms = Cookies.get('access_token_ms');

  let gmailEmails = {};
  let outlookEmails = {};

  try {
    if (token) {
      gmailEmails =await fetchGmailEmails(fromDateFilter, toDateFilter, fromFilter, containsFilter,maxmails,fetchAll);
    }
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
  }

  try {
    if (token_ms) {
      outlookEmails =await fetchOutlookMails(fromDateFilter, toDateFilter, fromFilter, containsFilter,maxmails,fetchAll);
    }
  } catch (error) {
    console.error('Error fetching Outlook emails:', error);
  }

  // Combine both Gmail and Outlook emails grouped by author/sender
  return { ...gmailEmails, ...outlookEmails };
};