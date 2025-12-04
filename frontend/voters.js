// voters.js

async function submitVoterForm(input) {
  let payload = {};

  if (input instanceof HTMLFormElement) {
    payload = Object.fromEntries(new FormData(input).entries());
  } else if (typeof input === 'object') {
    payload = input;
  } else {
    throw new Error('Invalid input for submitVoterForm');
  }

  console.log('Payload being sent to backend:', payload);

  try {
    return await apiFetch('/voters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('submitVoterForm error', err);
    throw err;
  }
}

async function findVoterById(voterId) {
  return await apiFetch(`/voters/${encodeURIComponent(voterId)}`, { headers: getAuthHeaders() });
}

function attachVoterFormHandler(formId, onSuccess) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await submitVoterForm(form);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      alert('Failed to submit voter.');
    }
  });
}
