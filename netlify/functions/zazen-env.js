exports.handler = async function(event, context) {
  const raw = process.env.ZAZEN_EDIT ||
              process.env['zazen-edit'] ||
              process.env.zazen_edit ||
              process.env.NEXT_PUBLIC_ZAZEN_EDIT ||
              process.env.VITE_ZAZEN_EDIT || '';

  const isEdit = ['true', '1', 'yes', 'on', 'enabled'].includes(String(raw).trim().toLowerCase());

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      edit: isEdit,
      isEdit: isEdit,
      timestamp: Date.now()
    })
  };
};
